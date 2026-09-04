export type { RecognitionEngine, RecognitionResult, SignDefinition, ModelInfo } from './types';
export { getConfidenceState, requiresInterpreter, getStateIcon, getStateLabel } from './confidence';
export { DemoRecognitionEngine } from './demo-engine';
import type { RecognitionEngine } from './types';

let engineInstance: RecognitionEngine | null = null;

export async function getRecognitionEngine(): Promise<RecognitionEngine> {
  if (!engineInstance) {
    try {
      const mod = await import('./mediapipe-knn');
      engineInstance = new mod.MediaPipeKnnEngine();
      await engineInstance.initialize();
      console.log(`[Sanket] Engine loaded: ${engineInstance.getModelInfo().name} | ${engineInstance.getSupportedSigns().length} signs`);
    } catch (err) {
      console.warn('[Sanket] MediaPipe engine failed, falling back to demo:', err);
      const mod = await import('./demo-engine');
      engineInstance = new mod.DemoRecognitionEngine();
      await engineInstance.initialize();
      console.log('[Sanket] Using DemoRecognitionEngine (explicit fallback)');
    }
  }
  return engineInstance;
}

/** Release the shared engine so a later route gets a fresh initialized instance. */
export function destroyRecognitionEngine(): void {
  if (!engineInstance) return;
  try {
    engineInstance.destroy();
  } finally {
    engineInstance = null;
  }
}
export { evaluateDataset } from './evaluation';
export { loadRealSamples, loadUnknownSamples, realSampleCounts, clearRealSamples, clearUnknownSamples, loadCalibration, saveCalibration } from './dataset';
export { importExternalLandmarkBundle, validateExternalBundle } from './external-dataset';
