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

  it("does not classify with insufficient samples", () => {
    for (let i = 0; i < 3; i++) {
      classifier.addSample("water", makeHand(i * 0.1, i * 0.1), false);
    }
    const result = classifier.classify(makeHand(0, 0));
    expect(result.signId).toBeNull();
  });

  it("recognises a trained sign", () => {
    for (let i = 0; i < 6; i++) {
      classifier.addSample("water", makeHand(i * 0.01, i * 0.01), false);
    }
    const result = classifier.classify(makeHand(0, 0));
    expect(result.signId).toBe("water");
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("serializes and deserializes", () => {
    for (let i = 0; i < 6; i++) {
      classifier.addSample("bill", makeHand(i * 0.01, i * 0.01), false);
    }
    const json = classifier.serialize();
    const c2 = new KNNClassifier();
    c2.deserialize(json);
    expect(c2.getSignCount()).toBe(1);
    expect(c2.getSamplesPerSign()["bill"]).toBe(6);
  });

  it("resets correctly", () => {
    classifier.addSample("yes", makeHand(0, 0), false);
    classifier.reset();
    expect(classifier.getSignCount()).toBe(0);
    expect(classifier.getSampleCount()).toBe(0);
  });
});
