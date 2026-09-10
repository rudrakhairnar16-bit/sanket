# SANKET Recognition Validation Protocol

## Phase 0 — Freeze

Record:
- code commit;
- model version;
- dataset manifest;
- sign vocabulary;
- calibration version.

## Phase 1 — Capture

For each supported sign:
- target 20–50 real samples;
- capture multiple sessions;
- vary signer/environment where possible.

## Phase 2 — Quality Control

Remove:
- invalid landmark arrays;
- missing-hand frames;
- duplicate/corrupt samples;
- mislabeled samples identified during review.

Record exclusions.

## Phase 3 — Split

Create deterministic:
- train;
- validation;
- test.

Prefer signer/session-aware split.

## Phase 4 — Train

Build recognition index from training data only.

## Phase 5 — Calibrate

Use validation data only.

Tune:
- distance threshold;
- margin;
- vote ratio;
- temporal parameters.

## Phase 6 — Freeze Calibration

Persist calibration.

Do not tune using test results.

## Phase 7 — Test

Generate:
- accuracy;
- precision;
- recall;
- F1;
- macro-F1;
- confusion matrix;
- difficult pairs.

## Phase 8 — Open Set

Evaluate negative samples separately.

## Phase 9 — Error Review

Inspect worst-performing signs and pairs.

## Phase 10 — Report

Publish the exact dataset size, split, metrics and limitations.

## Reproducibility

A future evaluator should be able to reproduce the report from:
- source commit;
- dataset manifest;
- calibration file;
- evaluation script.
