# SANKET 2.0 — Detailed Research Report

## Executive Summary

SANKET is designed as an accessibility operating layer for government service counters. The project focuses on the practical moment when an ISL-using citizen needs to complete a service with a clerk.

### Core hypothesis

A constrained recognition model can be useful when it is:
1. limited to supported signs;
2. trained/evaluated on representative real camera data;
3. explicit about uncertainty;
4. prevented from forcing unknown poses into known classes;
5. backed by human escalation;
6. embedded in a clerk workflow.

## 1. Problem Definition

The problem is not simply “translate ISL to English.”

The operational problem is:

> How can a government clerk receive understandable communication from an ISL-using citizen, respond visually, and complete the service without making the citizen responsible for finding a separate accessibility system?

## 2. Existing Research Landscape

### 2.1 Government language resources

ISLRTC describes its dictionary as containing 10,000 terms and notes legal/administrative, medical, academic, technical and agricultural terminology. It also documents synonyms, context-dependent signs and regional variation.

Research implication: labels must be contextual and provenance-aware.

### 2.2 Isolated sign recognition

Image-based CNN research demonstrates that static classification can work well under controlled datasets. However, high benchmark scores do not automatically transfer to uncontrolled counter environments.

Research implication: SANKET needs real-camera validation.

### 2.3 Temporal/continuous recognition

CNN/LSTM and continuous translation work shows why sequences matter for dynamic signs and sentence-level translation.

Research implication: a static 42-D frame recognizer should be treated as a constrained baseline, not a complete ISL translator.

### 2.4 Large datasets

ISLTranslate reports about 30k/31k continuous ISL-English sentence/phrase pairs. INCLUDE reports 4,292 videos across 263 word signs. These resources are useful for research but their formats, licenses and tasks differ from SANKET's constrained counter-sign classifier.

## 3. Research Gap

The gap SANKET targets is the integration layer:

- recognition;
- uncertainty;
- clerk interaction;
- service packs;
- interpreter escalation;
- learning;
- institutional score.

This is a system-level research direction.

## 4. Technical Hypothesis

For a constrained vocabulary, normalized hand landmarks can provide a computationally lightweight recognition baseline suitable for browser inference.

The hypothesis must be tested using real camera data.

## 5. Data Strategy

### Minimum
20 samples/sign.

### Recommended
30–50 samples/sign.

### Diversity
Capture across:
- multiple signers;
- lighting conditions;
- backgrounds;
- distances;
- hand orientation;
- camera devices.

### Dynamic signs
Capture sequences, not just single frames.

## 6. Evaluation Design

The evaluation must separate:
- training;
- validation;
- test.

Calibration must use validation data only.

Test results are then reported once.

## 7. Error Analysis

A confusion matrix is more informative than a single accuracy number.

For each difficult pair, investigate:
- similar hand shape;
- similar orientation;
- missing hand;
- occlusion;
- lighting;
- signer variation;
- label ambiguity;
- insufficient samples.

## 8. Open-Set Recognition

A real counter contains poses outside the supported vocabulary.

Therefore:

known sign ≠ nearest class by force.

The system should reject when:
- distance exceeds threshold;
- class margin is too small;
- vote ratio is weak;
- hand quality is poor.

Negative samples provide an empirical way to evaluate this behavior.

## 9. Product Research

### MOMENT
Sanket Sahayak addresses the immediate communication moment.

### HABIT
ISL Quest addresses repeated clerk learning.

### SCORE
Sugamya Score turns accessibility readiness into a measurable institutional concept.

### HUMAN SAFETY NET
Interpreter escalation handles uncertainty.

## 10. Research-to-Product Traceability

| Research finding | Product decision |
|---|---|
| ISL has variation/context | Context-aware sign mapping |
| Static recognition has dataset dependence | Real-camera validation |
| Continuous signs are temporal | Do not claim static classifier solves dynamic ISL |
| Unknown inputs exist | Rejection thresholds |
| Benchmark accuracy can mislead | Confusion matrix + per-class metrics |
| High-risk ambiguity exists | Human escalation |
| Clerk readiness matters | ISL Quest |
| Institutional readiness matters | Sugamya Score |

## 11. Success Criteria

A successful prototype should demonstrate:
- stable camera capture;
- measurable recognition diagnostics;
- meaningful rejection;
- clear communication routing;
- reproducible evaluation;
- honest provenance;
- understandable failure behavior.

## 12. Non-Goals

- universal ISL translation;
- replacing human interpreters;
- claiming official ISLRTC endorsement;
- claiming government deployment;
- claiming field accuracy without field trials.

## 13. Future Research

1. signer-aware benchmark;
2. temporal sequence model;
3. face/body features where linguistically appropriate;
4. domain-specific service vocabulary;
5. expert ISL annotation;
6. field pilot with accessibility stakeholders;
7. privacy-preserving data collection;
8. calibration across devices and lighting;
9. multilingual clerk response;
10. longitudinal accessibility outcomes.
