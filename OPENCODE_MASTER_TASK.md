# SANKET 2.0 — OpenCode Master Implementation Task

## Mission

You are working on the SANKET 2.0 national-level prototype.

Your job is to finish, verify, and harden the existing implementation without breaking already-working features.

SANKET positioning:

> AI-assisted accessibility infrastructure for government service counters.

Do NOT turn SANKET into a generic sign-language translator.

Core product pillars:

1. MOMENT — Sanket Sahayak: help the clerk communicate with an ISL-using citizen at the counter.
2. HABIT — ISL Quest: improve clerk readiness through short learning.
3. SCORE — Sugamya Score: measure institutional accessibility readiness.
4. Human Safety Net: interpreter escalation when AI confidence is insufficient.

Golden principle:

> Technology when it can. Humans when it must.

---

# 1. First: Audit Before Editing

Before changing code:

- inspect the whole repository;
- inspect package.json and scripts;
- inspect the existing recognition engine;
- inspect Sahayak/Assist;
- inspect Practice;
- inspect Recognition Lab;
- inspect sign data/assets;
- inspect auth/middleware;
- inspect all existing tests;
- inspect README and national-level documentation.

Do not replace working architecture just because a different implementation is possible.

Preserve existing functionality unless a change is required to fix a documented problem.

Create a short audit note if you discover a serious issue.

---

# 2. Camera Requirements

Every SANKET camera surface must be visually consistent.

Requirements:

- square camera viewport;
- responsive on desktop and mobile;
- no stretched video;
- `object-fit: cover`;
- clear hand-position guidance inside the square;
- clear camera permission/error state;
- show whether a hand is detected;
- show recognition state;
- avoid excessive re-renders;
- maintain usable performance.

Use the existing camera abstraction where possible.

Do not introduce a second unrelated camera implementation.

---

# 3. Recognition Requirements

Current baseline:

- MediaPipe Hand Landmarker;
- 21 hand landmarks;
- SANKET normalized 42-D representation;
- kNN-style classification;
- confidence and unknown rejection;
- temporal stability.

Harden it rather than replacing it blindly.

The classifier must NOT always return the nearest known sign.

A prediction should be rejected when:

- distance is too large;
- nearest and second-nearest classes are too close;
- vote ratio is too weak;
- hand quality is poor;
- temporal stability is insufficient.

Current target confidence bands:

- HIGH: >= 0.82
- MEDIUM: >= 0.62
- LOW: >= 0.45

Only HIGH-confidence recognition should automatically become a committed citizen message in Sahayak.

MEDIUM should request confirmation/retry.

LOW/UNKNOWN should favor retry or interpreter escalation.

Do not present confidence as a scientifically calibrated probability unless calibration evidence supports that claim.

---

# 4. Real Camera Dataset

The repository already contains the Recognition Lab and dataset infrastructure.

Use it.

Target:

- 20–50 real camera samples per sign;
- recommended target: 30+;
- maximum captured samples per sign: 50.

Dataset diversity should include, where possible:

- different people/signers;
- left/right hand variation where relevant;
- different distances from camera;
- different lighting;
- different backgrounds;
- slightly different hand positions;
- natural signing variation.

Do not claim that the model is production-accurate merely because 20–50 samples were collected.

Dynamic signs require temporal sequences. Do not pretend that isolated static frames fully represent dynamic ISL signs.

---

# 5. Train / Validation / Test

Maintain deterministic split:

- 70% train
- 15% validation
- 15% test

For very small classes, preserve at least one validation and one test example where mathematically possible.

Prefer signer-aware splitting when signer IDs are available.

Never leak near-identical frames from the same continuous capture into both train and test if that would inflate evaluation.

The evaluation report must clearly state:

- number of signs;
- total samples;
- train samples;
- validation samples;
- test samples;
- data sources;
- whether the split is signer-aware;
- limitations.

---

# 6. Confusion Matrix

Recognition Lab must provide a confusion matrix based on the held-out test set.

Also calculate, where supported:

- per-class precision;
- per-class recall;
- per-class F1;
- macro-F1;
- overall accuracy.

Highlight difficult sign pairs.

A difficult pair should be based on actual validation/test confusion or another explicit diagnostic criterion, not guessed manually.

Do not hide poor-performing signs.

---

# 7. Threshold Calibration

Use validation data for threshold selection.

Do NOT tune thresholds on the final test set.

Calibration should consider:

- nearest-neighbor distance;
- margin between first and second class;
- vote ratio;
- accepted vs rejected examples.

When negative/unknown samples are available, include them in rejection evaluation.

Report:

- chosen distance threshold;
- chosen margin threshold;
- validation acceptance/precision behavior;
- false accept rate where measurable;
- rejection rate;
- number of negative samples.

After applying calibration:

- persist calibration locally;
- make it reloadable by the recognition engine;
- provide a clear reload/reinitialize action in Recognition Lab if needed.

Never describe validation-derived thresholds as universally optimal.

---

# 8. Negative / Unknown Testing

Use the existing negative-frame capture support.

Test cases should include:

- no hand;
- poor hand framing;
- unrelated hand pose;
- unsupported sign;
- out-of-vocabulary pose.

The system should reject unknowns instead of forcing them into a known sign.

Track open-set diagnostic metrics when negative samples exist.

---

# 9. Sahayak Integration

Sanket Sahayak is the primary counter workflow.

Ensure:

### Citizen → Clerk

ISL hand sign
→ camera
→ recognition
→ confidence gate
→ committed text
→ clerk-facing audio/text.

Audio must be directed to the clerk only.

### Clerk → Citizen

Clerk types a simple English response
→ visual communication aid
→ emoji/visual cues where appropriate
→ supported ISL visual/sign guidance where validated assets exist.

Do NOT play clerk response audio through the citizen-recognition channel.

Do not pretend emoji are ISL.

Clearly label emoji as visual communication aids.

---

# 10. Clerk English → Emoji

Keep the local deterministic English-to-emoji converter.

Basic sentences should produce a simple visual representation.

Examples of intended behavior:

- "Please wait a moment." → waiting/time visual
- "Please show your document." → show/document visual
- "Please sign here." → writing/location visual
- "Please enter your phone number." → phone/number visual
- "Please take a seat." → seat visual
- "Your payment is received." → payment/success visual
- "I will call an interpreter." → call/interpreter visual

Do not use emoji as a replacement for validated ISL.

If an official/validated sign asset exists, it may be shown separately.

---

# 11. ISL Assets and Provenance

Do NOT label custom/generated SVGs as official ISLRTC assets without validation.

For every sign asset, preserve provenance.

Preferred states:

- validated;
- under-review;
- placeholder;
- unavailable.

If using ISLRTC dictionary material:

- preserve acknowledgement;
- respect the source's stated conditions;
- do not imply official endorsement by ISLRTC.

Do not fabricate missing signs.

---

# 12. External Dataset Integration

The repository includes dataset source documentation and an importer.

Potential sources documented in the project include:

- FDMSE-ISL;
- INCLUDE/OpenHands;
- ISLTranslate;
- RealSign;
- ISLRTC resources.

Before using any external dataset:

1. verify its license;
2. verify label mapping;
3. verify whether redistribution is allowed;
4. preserve provenance;
5. convert only to the SANKET feature format when appropriate.

The current external importer expects already-extracted SANKET-normalized 42-D landmark vectors.

Do not silently mix incompatible labels.

Do not bundle huge third-party raw datasets into the repository unless licensing and repository-size constraints explicitly permit it.

If raw videos/images are available locally, add preprocessing only when it can be done reliably and reproducibly.

---

# 13. Data Converter

Use/extend:

`scripts/convert-landmarks.ts`

Supported normalized sample shape should remain compatible with:

- `{ signId, landmarks: number[] }`
- `{ samples: [...] }`

Expected feature length:

- 42 numbers per sample.

Reject malformed samples.

Provide useful validation errors.

---

# 14. Recognition Lab

`/recognition-lab` is a developer/calibration tool.

It must support:

- sign selection;
- camera initialization;
- sample capture;
- progress per sign;
- clear current sign;
- clear all samples;
- negative sample capture;
- dataset export;
- landmark import;
- evaluation;
- confusion matrix;
- difficult sign pairs;
- open-set rejection diagnostics;
- threshold calibration;
- apply/save calibration;
- reload/reinitialize recognition engine.

Make it obvious that its metrics are prototype diagnostics, not field deployment accuracy.

If publicly deployed, protect the route or clearly restrict it to authorized developer/admin users.

---

# 15. Model/Data Versioning

Add or preserve a clear model/data version.

The evaluation report should identify:

- recognition version;
- dataset version;
- number of classes;
- number of samples;
- calibration version/date if available.

If practical, include a dataset hash/manifest identifier.

This makes national-demo results reproducible.

---

# 16. Performance

Do not process the camera unnecessarily fast.

Requirements:

- prevent overlapping recognition calls;
- use monotonic video timestamps;
- avoid processing every render;
- keep camera UI responsive;
- avoid memory leaks;
- clean up MediaPipe/model resources on unmount;
- reset shared recognition state correctly.

Do not add heavy WebGL/3D just for visual effects.

Clarity and reliability are more important.

---

# 17. Testing

Run:

1. `npm run typecheck`
2. `npm test`
3. `npm run build`

If an environment/network issue prevents a command from completing:

- record the exact failure;
- do not fake a PASS;
- still perform all possible static/type checks.

Add focused tests for:

- normalization;
- invalid landmarks;
- unknown rejection;
- confidence classification;
- deterministic dataset split;
- calibration;
- confusion matrix;
- difficult pairs;
- emoji conversion;
- message direction/audio routing.

---

# 18. Security / Auth

Preserve the existing clerk-focused auth architecture.

Check:

- protected routes;
- public routes;
- cookie security;
- server-side token verification;
- demo mode behavior.

Do not weaken authentication merely to make the demo work.

If a route is developer-only, do not expose it as an unrestricted public feature.

---

# 19. Documentation

Update documentation whenever implementation changes.

At minimum keep these aligned:

- `README.md`
- `REAL_CAMERA_DATASET_GUIDE.md`
- `DATASET_INTEGRATION_STATUS.md`
- `NATIONAL_READINESS.md`
- `NATIONAL_JUDGE_AUDIT.md`
- `NATIONAL_DEMO_RUNBOOK.md`
- `PATCH_NOTES_REAL_DATASET.md`

Do not make unsupported claims such as:

- government deployment;
- official ISLRTC approval;
- production accuracy;
- millions of users;
- measured impact without evidence;
- live interpreter infrastructure when it is only a prototype.

Use wording such as:

- prototype;
- illustrative;
- demonstration data;
- validation pending;
- designed for scale;
- field validation required.

---

# 20. Final Acceptance Checklist

Before declaring completion, verify:

[ ] Camera viewport is square everywhere.

[ ] MediaPipe Hand Landmarker is used consistently.

[ ] Hand-quality rejection works.

[ ] Unknown rejection works.

[ ] Recognition uses temporal stability.

[ ] Real camera dataset can be captured.

[ ] 20–50 sample target is enforced.

[ ] Train/validation/test split is deterministic.

[ ] No obvious train/test leakage.

[ ] Confusion matrix is generated from held-out data.

[ ] Difficult pairs are calculated from evidence.

[ ] Thresholds are calibrated on validation data.

[ ] Test data remains untouched during threshold tuning.

[ ] Negative/unknown samples can be evaluated.

[ ] Sahayak commits only high-confidence recognition automatically.

[ ] Citizen→clerk audio is correctly routed.

[ ] Clerk→citizen response does not incorrectly trigger clerk-facing TTS.

[ ] English→emoji works locally without paid API dependency.

[ ] Emoji is not presented as official ISL.

[ ] ISL asset provenance is explicit.

[ ] External dataset provenance/license is documented.

[ ] Recognition Lab can export/import data.

[ ] Recognition engine can reload calibration.

[ ] `/recognition-lab` access is considered/protected.

[ ] `npm run typecheck` passes.

[ ] `npm test` passes, or exact environment blocker is documented.

[ ] `npm run build` passes, or exact environment blocker is documented.

[ ] README/documentation matches actual behavior.

---

# Definition of Done

SANKET is considered ready for the national prototype demo only when:

1. Sahayak camera works reliably.
2. The recognizer rejects uncertain/unknown signs instead of guessing constantly.
3. Real camera samples can be collected and evaluated.
4. Metrics come from an explicit held-out evaluation set.
5. Thresholds are calibrated without test-set leakage.
6. Difficult signs are visible instead of hidden.
7. Clerk↔citizen audio/visual channels are correctly separated.
8. Dataset and ISL asset provenance is honest.
9. The app remains free of mandatory paid AI dependencies.
10. The documentation does not overclaim.

Final principle:

> Make SANKET more reliable, measurable, explainable, and demo-ready — not merely more flashy.

Do not delete existing working features without a documented reason.
