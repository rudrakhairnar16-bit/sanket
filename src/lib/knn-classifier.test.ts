import { describe, it, expect, beforeEach } from "vitest";
import { KNNClassifier, type Landmark } from "./knn-classifier";

function makeHand(x: number, y: number): Landmark[] {
  const wrist = { x: x + 0.5, y: y + 0.5 };
  const tips = [4, 8, 12, 16, 20].map((i) => ({
    x: x + 0.1 * i,
    y: y + 0.05 * i,
  }));
  const base = Array.from({ length: 21 }, (_, i) => {
    if (i === 0) return wrist;
    const tip = tips.find((_, j) => [4, 8, 12, 16, 20][j] === i);
    return tip || {
      x: x + 0.02 * i,
      y: y + 0.02 * i,
    };
  });
  return base;
}

function makeOpenPalm(): Landmark[] {
  return Array.from({ length: 21 }, (_, i) => ({
    x: 0.3 + (i % 5) * 0.12,
    y: 0.1 + Math.floor(i / 5) * 0.12,
  }));
}

function makeClosedFist(): Landmark[] {
  const wrist = { x: 0.5, y: 0.5 };
  return Array.from({ length: 21 }, (_, i) => {
    if (i === 0) return wrist;
    const curl = 0.08 * Math.max(0, 5 - i);
    return { x: wrist.x + curl * 0.2, y: wrist.y + curl };
  });
}

describe("KNNClassifier", () => {
  let classifier: KNNClassifier;

  beforeEach(() => {
    classifier = new KNNClassifier();
  });

  it("starts empty", () => {
    expect(classifier.getSignCount()).toBe(0);
    expect(classifier.getSampleCount()).toBe(0);
  });

  it("classifies unknown when no samples", () => {
    const result = classifier.classify(makeHand(0, 0));
    expect(result.signId).toBeNull();
    expect(result.confidence).toBe(0);
  });

  it("stores samples and reports count", () => {
    classifier.addSample("namaste", makeHand(0, 0));
    expect(classifier.getSignCount()).toBe(1);
    expect(classifier.getSampleCount()).toBeGreaterThanOrEqual(1);
  });

  it("adds augmentation samples", () => {
    classifier.addSample("namaste", makeHand(0, 0), true);
    const count = classifier.getSamplesPerSign()["namaste"];
    expect(count).toBeGreaterThanOrEqual(4);
  });

  it("does not classify with insufficient samples (below minSamplesPerSign)", () => {
    classifier.addSample("water", makeHand(0, 0), false);
    const result = classifier.classify(makeHand(0, 0));
    expect(result.signId).toBeNull();
  });

  it("classifies with single augmented sample (meets minSamplesPerSign via augmentation)", () => {
    classifier.addSample("water", makeHand(0, 0), true);
    const result = classifier.classify(makeHand(0, 0));
    expect(result.signId).toBe("water");
  });

  it("recognises a trained sign", () => {
    for (let i = 0; i < 3; i++) {
      classifier.addSample("water", makeHand(i * 0.01, i * 0.01), false);
    }
    const result = classifier.classify(makeHand(0, 0));
    expect(result.signId).toBe("water");
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("distinguishes two different signs", () => {
    for (let i = 0; i < 5; i++) {
      classifier.addSample("open", makeOpenPalm(), false);
    }
    for (let i = 0; i < 10; i++) classifier.classify(makeOpenPalm());
    const openResult = classifier.classify(makeOpenPalm());
    expect(openResult.signId).toBe("open");

    classifier = new KNNClassifier();
    for (let i = 0; i < 5; i++) {
      classifier.addSample("fist", makeClosedFist(), false);
    }
    for (let i = 0; i < 10; i++) classifier.classify(makeClosedFist());
    const fistResult = classifier.classify(makeClosedFist());
    expect(fistResult.signId).toBe("fist");
  });

  it("does not match a sign it has never seen", () => {
    for (let i = 0; i < 3; i++) {
      classifier.addSample("namaste", makeHand(i * 0.01, i * 0.01), false);
    }
    const result = classifier.classify(makeOpenPalm());
    expect(result.signId).toBeNull();
  });

  it("serializes and deserializes", () => {
    for (let i = 0; i < 3; i++) {
      classifier.addSample("bill", makeHand(i * 0.01, i * 0.01), false);
    }
    const json = classifier.serialize();
    const c2 = new KNNClassifier();
    c2.deserialize(json);
    expect(c2.getSignCount()).toBe(1);
    expect(c2.getSamplesPerSign()["bill"]).toBe(3);
  });

  it("deserialize handles invalid JSON gracefully", () => {
    const c2 = new KNNClassifier();
    c2.deserialize("invalid json");
    expect(c2.getSignCount()).toBe(0);
  });

  it("getSampleCount reports correct total across signs", () => {
    for (let i = 0; i < 3; i++) {
      classifier.addSample("yes", makeHand(i * 0.01, i * 0.01), false);
      classifier.addSample("no", makeHand(i * 0.02, i * 0.02), false);
    }
    expect(classifier.getSignCount()).toBe(2);
    expect(classifier.getSampleCount()).toBe(6);
  });

  it("resets correctly", () => {
    classifier.addSample("yes", makeHand(0, 0), false);
    classifier.reset();
    expect(classifier.getSignCount()).toBe(0);
    expect(classifier.getSampleCount()).toBe(0);
  });

  it("getMinSamplesPerSign returns current threshold", () => {
    expect(classifier.getMinSamplesPerSign()).toBe(2);
  });

  it("getHistorySize grows up to historySize", () => {
    for (let i = 0; i < 3; i++) {
      classifier.addSample("yes", makeHand(i * 0.01, i * 0.01), false);
    }
    for (let i = 0; i < 20; i++) {
      classifier.classify(makeHand(0, 0));
    }
    expect(classifier.getHistorySize()).toBeLessThanOrEqual(15);
  });
});
