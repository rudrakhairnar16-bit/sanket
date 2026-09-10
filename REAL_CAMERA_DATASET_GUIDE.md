# Sanket Real Camera Recognition Dataset

## Goal

Build a real-camera landmark dataset for the supported Sanket signs instead of relying only on synthetic landmark samples.

### Per sign

- Minimum: 20 clean captures
- Recommended: 30 clean captures
- Maximum in the browser lab: 50 captures

Use `/recognition-lab` while running the app locally.

## Capture protocol

1. Select one sign.
2. Start the camera + local Hand Landmarker.
3. Keep the full hand inside the square guide.
4. Capture across small changes in distance, position, rotation and lighting.
5. Do not intentionally introduce incorrect poses into the positive class.
6. For dynamic signs, this static-frame dataset is only a baseline; temporal sequences are required later.

## Train / validation / test

The Recognition Lab now performs a deterministic class-balanced split:

- 70% train
- 15% validation
- 15% test

For very small classes, at least one validation and one test sample are reserved. Do not use the test matrix to tune thresholds.

## Threshold calibration

Distance and margin thresholds are selected from the validation set. The test set is then evaluated using those thresholds. The UI reports validation precision/coverage and test accuracy separately.

## Confusion matrix

The matrix is test-set-only. Repeated off-diagonal cells identify difficult sign pairs. Collect additional real samples for those pairs before changing thresholds aggressively.

## Important limitation

The current 34-sign repository dataset is synthetic and small. Real camera samples collected in the browser are stored locally and loaded by the recognition engine on that browser. They are not automatically uploaded to a server.
