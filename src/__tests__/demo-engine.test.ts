import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DemoRecognitionEngine } from '@/lib/recognition/demo-engine';

beforeEach(() => {
  if (typeof globalThis.ImageData === 'undefined') {
    (globalThis as any).ImageData = class ImageData {
      width: number;
      height: number;
      data: Uint8ClampedArray;
      constructor(widthOrData: any, heightOrSw?: number) {
        if (widthOrData instanceof Uint8ClampedArray) {
          this.data = widthOrData;
          this.width = heightOrSw!;
          this.height = arguments[2] as number;
        } else {
          this.width = widthOrData as number;
          this.height = heightOrSw!;
          this.data = new Uint8ClampedArray(this.width * this.height * 4);
        }
      }
    };
  }
});

describe('DemoRecognitionEngine', () => {
  it('initializes successfully', async () => {
    const engine = new DemoRecognitionEngine();
    await expect(engine.initialize()).resolves.toBeUndefined();
  });

  it('returns a recognition result with correct shape', async () => {
    const engine = new DemoRecognitionEngine();
    await engine.initialize();
    const frame = new ImageData(1, 1);
    const result = await engine.recognize(frame);
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('state');
    expect(result).toHaveProperty('modelVersion');
    expect(result).toHaveProperty('timestamp');
    expect(result.modelVersion).toBe('sanket-demo-v1');
    expect(typeof result.confidence).toBe('number');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('returns valid confidence state', async () => {
    const engine = new DemoRecognitionEngine();
    await engine.initialize();
    const frame = new ImageData(1, 1);
    const result = await engine.recognize(frame);
    expect(['low', 'medium', 'high', 'unknown']).toContain(result.state);
  });

  it('returns supported signs with length > 0', async () => {
    const engine = new DemoRecognitionEngine();
    await engine.initialize();
    const signs = engine.getSupportedSigns();
    expect(signs.length).toBeGreaterThan(0);
    expect(signs[0]).toHaveProperty('id');
    expect(signs[0]).toHaveProperty('label');
    expect(signs[0]).toHaveProperty('category');
  });

  it('returns model info', async () => {
    const engine = new DemoRecognitionEngine();
    await engine.initialize();
    const info = engine.getModelInfo();
    expect(info.version).toBe('sanket-demo-v1');
    expect(info.type).toBe('knn');
    expect(info.signCount).toBeGreaterThan(0);
  });

  it('cleans up on destroy', async () => {
    const engine = new DemoRecognitionEngine();
    await engine.initialize();
    expect(() => engine.destroy()).not.toThrow();
  });

  it('returns higher confidence with training samples', async () => {
    const engine = new DemoRecognitionEngine();
    await engine.initialize();
    engine.addTrainingSample('help', new Array(21 * 3).fill(0));
    engine.addTrainingSample('hello', new Array(21 * 3).fill(0));
    const frame = new ImageData(1, 1);
    const result = await engine.recognize(frame);
    expect(result.confidence).toBeGreaterThanOrEqual(0.65);
  });
});
