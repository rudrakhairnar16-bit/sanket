# SANKET 2.0 — Research & Documentation Master Index

**Version:** 1.0  
**Date:** 4 September 2026  
**Project:** SANKET — AI-assisted accessibility infrastructure for government service counters  
**Team:** BeyondWords

## Purpose

This folder is the evidence and documentation layer for the SANKET 2.0 national-level prototype.

It separates:
- established research findings;
- project design decisions;
- prototype implementation;
- measured prototype diagnostics;
- assumptions;
- future research.

No document in this pack should be interpreted as proof of field deployment, government adoption, or production-grade accuracy.

## Included documents

1. `SANKET_RESEARCH_PAPER.md` — original conference-style research paper draft.
2. `DETAILED_RESEARCH_REPORT.md` — detailed technical and product research report.
3. `LITERATURE_REVIEW_ISL.md` — literature review of ISL recognition/translation research.
4. `TECHNICAL_RESEARCH_REPORT.md` — computer-vision and recognition architecture report.
5. `DATASET_EVALUATION_RESEARCH.md` — dataset, split, calibration, confusion-matrix and open-set evaluation methodology.
6. `SYSTEM_DESIGN_SRS.md` — research-backed system requirements specification.
7. `ETHICS_PRIVACY_ACCESSIBILITY.md` — safety, privacy, accessibility and human-in-the-loop principles.
8. `DATA_PROVENANCE_LICENSE_MATRIX.md` — dataset/source provenance and licensing considerations.
9. `RESEARCH_EVIDENCE_MATRIX.md` — claim-to-evidence matrix.
10. `VALIDATION_PROTOCOL.md` — reproducible validation protocol.
11. `VIVA_AND_JUDGE_RESEARCH_QA.md` — research-oriented viva/judge questions and defensible answers.
12. `REFERENCES.md` — references and source links.
13. `REFERENCES.bib` — BibTeX starter bibliography.
14. `OPENCODE_RESEARCH_INTEGRATION_TASK.md` — instructions for OpenCode to integrate and keep research claims synchronized with implementation.

## Evidence hierarchy

**Tier A — authoritative**
- Government/ISLRTC documentation and dictionary information.
- Official dataset repositories and their stated licenses.

**Tier B — peer-reviewed / scholarly**
- ACL, EMNLP, IEEE and other scholarly publications.

**Tier C — project evidence**
- SANKET's own captured samples, validation split, test metrics, confusion matrix and calibration outputs.

**Tier D — design inference**
- Product decisions, architecture choices and future proposals.

Always label Tier C and Tier D claims as project-specific rather than universal facts.

## Important research conclusion

SANKET's defensible research contribution is not “we invented sign-language recognition.”

The stronger contribution is the **counter-level accessibility workflow** that combines:
- recognition with explicit uncertainty;
- clerk-facing communication;
- human interpreter escalation;
- clerk learning;
- institutional readiness measurement;
- service-oriented workflows;
- evidence-driven validation.

The recognition model is a replaceable component inside this larger accessibility system.
