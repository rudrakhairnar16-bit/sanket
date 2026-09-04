# OpenCode — Research Integration Task

## Mission

Keep SANKET's implementation and research documentation synchronized.

### Read first

- `OPENCODE_MASTER_TASK.md`
- `research/RESEARCH_DOCUMENTATION_MASTER.md`
- `research/SANKET_RESEARCH_PAPER.md`
- `research/DETAILED_RESEARCH_REPORT.md`
- `research/TECHNICAL_RESEARCH_REPORT.md`
- `research/DATASET_EVALUATION_RESEARCH.md`
- `research/DATA_PROVENANCE_LICENSE_MATRIX.md`
- `research/VALIDATION_PROTOCOL.md`

## Tasks

1. Audit current recognition implementation against the research claims.
2. Remove any unsupported accuracy/deployment/endorsement claims.
3. Ensure evaluation metrics are generated from the actual held-out test set.
4. Ensure calibration uses validation data only.
5. Ensure negative samples are evaluated separately.
6. Ensure difficult sign pairs come from measured confusion.
7. Ensure dataset provenance is preserved.
8. Ensure external licenses are not misrepresented.
9. Ensure dynamic signs are not described as solved by static recognition.
10. Ensure Sahayak audio direction is correct.
11. Ensure emoji are labelled visual aids, not ISL.
12. Keep README, research reports and judge documentation synchronized.

## Required final output

After implementation, produce a concise machine-readable summary containing:

- code version;
- dataset version;
- classes;
- samples;
- train/validation/test counts;
- calibration thresholds;
- accuracy;
- macro-F1;
- negative sample count;
- open-set false acceptance;
- top difficult pairs;
- known limitations.

Never fabricate a metric. If data are unavailable, write `NOT MEASURED`.
