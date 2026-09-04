# SANKET 2.0 — System Design & SRS

## 1. System Goal

Provide a clerk-facing accessibility workflow for government service counters.

## 2. Primary Actor

Government clerk.

## 3. Secondary Actor

Citizen using ISL.

## 4. Supporting Actor

Human interpreter / accessibility support.

## 5. Functional Requirements

### FR-01 Camera
System shall provide a square responsive camera view.

### FR-02 Hand Detection
System shall detect supported hand input using the selected computer-vision pipeline.

### FR-03 Recognition
System shall classify only within the supported vocabulary.

### FR-04 Rejection
System shall reject low-quality, low-confidence and unsupported observations.

### FR-05 Temporal Stability
System shall avoid committing unstable single-frame predictions.

### FR-06 Clerk Communication
Recognized citizen messages shall appear in the clerk-facing interface.

### FR-07 Audio Direction
Citizen→clerk audio shall not be confused with clerk→citizen communication.

### FR-08 Clerk Response
Clerk responses shall support simple visual communication aids.

### FR-09 Emoji
Emoji may be used as visual aids but shall not be represented as official ISL.

### FR-10 Interpreter Escalation
Low-confidence/unknown communication shall allow an interpreter pathway.

### FR-11 Learning
SANKET shall support clerk learning through ISL Quest.

### FR-12 Institutional Measurement
SANKET shall expose institutional readiness through Sugamya Score.

### FR-13 Dataset Lab
Authorized users shall capture/import, evaluate and calibrate recognition data.

### FR-14 Provenance
External data and sign assets shall retain provenance/licensing metadata.

## 6. Non-Functional Requirements

- responsive UI;
- low-latency local recognition;
- no mandatory paid API;
- explicit errors;
- accessible contrast and labels;
- clean resource lifecycle;
- reproducible evaluation.

## 7. Security Requirements

- protected clerk routes;
- secure production cookies;
- server-side authentication verification;
- restricted developer tools.

## 8. Privacy

- minimize stored camera data;
- do not collect unnecessary personal information;
- document retention policy;
- obtain appropriate consent for dataset collection.

## 9. Reliability

If recognition is uncertain, the system should fail toward:
- retry;
- confirmation;
- human escalation.

It should not silently invent a confident answer.

## 10. Traceability

Each research claim must map to:
- authoritative source;
- scholarly source;
- project measurement;
- or explicit design inference.
