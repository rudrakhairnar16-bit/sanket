# SANKET: An AI-Assisted Accessibility Infrastructure for Government Service Counters

## Abstract

Communication barriers at public-service counters can become operational barriers when a clerk does not understand Indian Sign Language (ISL) and an immediate interpreter is unavailable. Existing ISL research demonstrates progress in isolated-sign recognition and continuous sign-language translation, while government resources such as the Indian Sign Language Dictionary provide extensive linguistic reference material. However, a government counter requires more than a classifier: it requires a workflow for uncertainty, clerk response, escalation, learning and institutional accountability.

This paper presents SANKET, a prototype accessibility infrastructure designed around that workflow. SANKET combines a clerk-facing real-time assistance layer (Sanket Sahayak), a clerk learning layer (ISL Quest), and an institutional readiness layer (Sugamya Score), with human interpreter escalation when automated recognition is uncertain. The prototype uses MediaPipe hand landmarks and a lightweight k-nearest-neighbour recognition baseline with explicit quality gates, distance/margin rejection, temporal stability and calibration tooling. A Recognition Lab supports real-camera data collection, deterministic train/validation/test splitting, confusion-matrix analysis, difficult-pair discovery and negative-sample testing.

The paper deliberately distinguishes prototype diagnostics from field accuracy. The research contribution is therefore positioned as a system architecture and validation framework for counter-level accessibility rather than a claim of universal ISL translation accuracy.

**Keywords:** Indian Sign Language, accessibility, government services, sign-language recognition, human-in-the-loop AI, open-set recognition, computer vision, assistive technology.

## 1. Introduction

Public-service interaction often assumes that a citizen and clerk can exchange information through spoken language, text or conventional visual forms. For an ISL user, this assumption can fail at the point where a service must actually be completed. SANKET addresses this operational gap by placing accessibility support inside the clerk workflow.

The Indian Sign Language Research and Training Centre (ISLRTC) states that its ISL Dictionary contains 10,000 terms and includes everyday, academic, legal/administrative, medical, technical and agricultural terminology. ISLRTC also notes regional variation and the presence of synonyms and context-specific signs. These properties make a simple one-to-one English-word classifier an incomplete representation of ISL.

SANKET therefore treats recognition as one component of a broader accessibility system.

## 2. Research Questions

RQ1. Can a lightweight landmark-based recognizer provide a useful prototype signal for a constrained set of counter-relevant signs?

RQ2. Can explicit rejection and temporal stability reduce the operational risk of confidently presenting incorrect signs?

RQ3. Can a local evaluation workflow make recognition quality measurable through held-out data, confusion matrices and negative testing?

RQ4. Can recognition be integrated into a clerk-first workflow that includes visual communication aids, learning and human escalation?

RQ5. Can the system's claims be kept auditable through dataset provenance, calibration records and explicit limitations?

## 3. Related Work

Research on ISL recognition includes image-based CNN systems, live video recognition and CNN/LSTM approaches. These studies demonstrate the feasibility of automated recognition but also illustrate that reported performance is highly dependent on dataset composition, vocabulary, signer diversity and evaluation protocol.

ISLTranslate provides a large continuous ISL-English resource, while INCLUDE provides a word-level ISL video dataset. The ISLRTC Dictionary provides an authoritative government reference resource and notes that ISL contains regional variation and context-sensitive signs.

SANKET uses these findings to avoid treating a small isolated-sign prototype as a universal translator.

## 4. System Architecture

The workflow is:

Citizen → supported ISL → camera → hand detection → quality gate → feature normalization → classifier → confidence/rejection → clerk-facing message → service action.

For uncertain cases:

Recognition → low confidence/unknown → retry or interpreter escalation.

The clerk-facing learning loop is:

Observed communication need → ISL Quest recommendation → practice → improved clerk readiness → Sugamya Score signal.

## 5. Recognition Method

The current prototype represents each detected hand using 21 landmarks. A wrist-relative and scale-normalized representation creates a 42-dimensional feature vector.

The classifier uses nearest-neighbour similarity with:
- multiple neighbours;
- class voting;
- distance threshold;
- first-vs-second-class margin;
- vote-ratio requirement;
- hand-quality gate;
- temporal stability.

The design intentionally rejects uncertain observations instead of always returning the nearest known class.

## 6. Evaluation Method

Real camera samples are collected per supported sign. The intended target is 20–50 samples per sign, with 30+ recommended where feasible.

A deterministic split uses approximately:
- 70% training;
- 15% validation;
- 15% test.

Thresholds are selected using validation data. The test set is reserved for final diagnostic reporting.

Metrics include:
- accuracy;
- precision;
- recall;
- F1;
- macro-F1;
- confusion matrix;
- difficult sign pairs;
- negative/open-set false acceptance when negative data exist.

## 7. Human-in-the-Loop Design

SANKET does not assume that automation should replace interpreters.

The operating principle is:

> Technology when it can. Humans when it must.

High-confidence recognition can be committed. Medium-confidence recognition requests confirmation/retry. Low-confidence or unknown observations should move toward retry or interpreter escalation.

## 8. Clerk Communication

Citizen-to-clerk communication is clerk-facing.

Clerk-to-citizen communication is visual-first. The prototype may use simple emoji cues for basic English instructions, but emoji are explicitly not treated as ISL.

Validated ISL assets can be shown separately with provenance.

## 9. Ethics and Safety

The system should not silently make high-stakes decisions from uncertain recognition. It should communicate uncertainty and preserve a human escalation route.

User data should be minimized. Real camera samples should be collected only with appropriate consent and retained according to a defined policy.

## 10. Limitations

Current limitations include:
- prototype-scale vocabulary;
- dependence on captured data quality;
- limited signer diversity until more data are collected;
- static-feature limitations for dynamic signs;
- need for ISL-expert validation of sign mappings and visual assets;
- no claim of field deployment accuracy;
- interpreter transport may remain prototype-level.

## 11. Expected Contribution

SANKET's contribution is a practical architecture for **counter-level accessibility infrastructure** with measurable uncertainty and institutional feedback, rather than a claim to solve general ISL translation.

## 12. Conclusion

A useful accessibility system must be judged not only by classifier accuracy but by whether it fails safely, communicates clearly, provides human escalation and produces measurable evidence for improvement. SANKET operationalizes these principles in a government-counter prototype.

## References

See `REFERENCES.md` and `REFERENCES.bib`.
