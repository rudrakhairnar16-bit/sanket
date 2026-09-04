# Real Camera Dataset + Calibration Patch

- Added `/recognition-lab` developer page.
- Added local real-camera sample capture using the same MediaPipe Hand Landmarker family as Sahayak.
- Added 20 minimum / 30 recommended / 50 maximum samples per sign guardrails.
- Added localStorage persistence for captured 42-D normalized landmark vectors.
- MediaPipe classifier now loads browser-local real samples alongside repository samples.
- Added leave-one-out diagnostic evaluator and confusion matrix.
- Added conservative distance/margin calibration helper.
- Added `npm run evaluate:recognition` for repository baseline diagnostics.
- Dynamic signs remain a separate problem because static landmarks do not encode temporal motion.
- No field-accuracy claim is made by this patch.
