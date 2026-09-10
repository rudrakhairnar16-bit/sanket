# Dataset & Evaluation Research Report

## Objective

Create evidence that answers:

> “How well does SANKET recognize the supported signs under defined test conditions, and when does it refuse to guess?”

## Dataset protocol

Target 20–50 camera samples per sign.

Recommended capture diversity:
- 30+ samples;
- at least multiple sessions;
- multiple signers where available;
- varied lighting/background;
- varied distance;
- realistic camera placement.

## Split

Default:
- 70% train;
- 15% validation;
- 15% test.

If signer IDs are available, prefer signer-aware separation.

## Leakage Controls

Avoid placing near-identical consecutive frames from the same capture into both training and test.

If sequence data are collected, split by capture session or signer rather than randomly by individual frame.

## Metrics

### Accuracy
Correct predictions / all test predictions.

### Precision
Of predictions for a class, how many were correct?

### Recall
Of true samples for a class, how many were detected?

### F1
Harmonic mean of precision and recall.

### Macro-F1
Average F1 across classes, preventing large classes from dominating.

### Confusion Matrix
Shows which signs are confused with which.

### Open-set false acceptance
How often an unknown/negative sample is incorrectly accepted as a supported sign.

## Calibration

Use validation data to select operational thresholds.

Candidate conditions:
- distance ≤ threshold;
- margin ≥ threshold;
- vote ratio ≥ threshold.

Select thresholds according to an explicit objective such as high validation precision with acceptable rejection.

Do not use the final test set for tuning.

## Difficult Pairs

Rank class pairs by confusion counts or normalized confusion rate.

Then inspect:
- visual similarity;
- data quantity;
- signer-specific patterns;
- lighting;
- label quality.

## Negative Samples

Collect:
- no hand;
- unsupported poses;
- random hand configurations;
- out-of-vocabulary signs.

Report rejection rate and false acceptance.

## Reporting Template

Every evaluation should record:

- date;
- app/model version;
- dataset version;
- class count;
- total sample count;
- train/validation/test counts;
- signer count;
- split method;
- thresholds;
- accuracy;
- macro-F1;
- confusion matrix;
- difficult pairs;
- negative sample count;
- open-set false acceptance;
- known limitations.

## Interpretation Rule

A high test score on a small or homogeneous dataset is evidence about that dataset—not proof of field accuracy.
