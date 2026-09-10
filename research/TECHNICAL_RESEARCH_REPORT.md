# Technical Research Report — SANKET Recognition Engine

## 1. Baseline

The prototype uses MediaPipe Hand Landmarker to obtain 21 hand landmarks.

A normalized representation is generated from hand geometry and converted into a 42-dimensional feature vector.

## 2. Why Normalize?

Raw pixel coordinates depend on:
- camera position;
- distance;
- image resolution;
- hand location.

Wrist-relative and scale normalization reduce these nuisance variables.

## 3. Why kNN?

A lightweight nearest-neighbour model is useful for:
- rapid prototyping;
- browser execution;
- small datasets;
- transparent similarity behavior;
- easy incremental data collection.

It is not assumed to be the final production model.

## 4. Why Rejection?

Nearest-neighbour classification always has a nearest class, even when the input is unrelated.

Therefore the system uses:
- maximum distance;
- first/second class margin;
- vote ratio;
- hand-quality gate;
- temporal consistency.

## 5. Temporal Stability

A single video frame can be noisy.

The system therefore requires repeated consistent observations before committing a sign.

## 6. Calibration

Raw distance is not a probability.

Calibration maps validation behavior to operational thresholds.

Thresholds must be:
- versioned;
- reproducible;
- tuned on validation data;
- evaluated on untouched test data.

## 7. Dynamic Signs

A 42-D static feature describes one frame.

Dynamic signs require a sequence representation, for example:

time t-4 → t-3 → t-2 → t-1 → t

Future versions can evaluate:
- temporal CNN;
- GRU/LSTM;
- transformer-based sequence encoder;
- lightweight sequence classifier.

## 8. Browser Constraints

The national prototype prioritizes:
- local inference;
- no mandatory paid AI API;
- responsive camera;
- low latency;
- resource cleanup.

## 9. Failure Modes

| Failure | Mitigation |
|---|---|
| No hand | quality gate |
| Wrong framing | camera guidance |
| Unsupported pose | rejection |
| Similar signs | margin + confusion matrix |
| Lighting change | diverse real samples |
| Signer variation | multi-signer data |
| Dynamic sign | future sequence model |
| Ambiguous recognition | human escalation |

## 10. Research Recommendation

Do not replace the baseline merely to obtain a larger model. First establish a trustworthy dataset and evaluation pipeline. A larger model trained on poor or leaked data can produce a less credible result than a smaller model with rigorous evaluation.
