# SANKET 2.0 — National Demo Runbook

## Goal
Demonstrate a complete government-counter accessibility loop without overclaiming model accuracy or deployment status.

## 6-minute judge flow
1. **Problem (30s):** A Deaf citizen reaches a public-service counter; the barrier is the interaction, not the citizen.
2. **MOMENT (90s):** Login as a clerk → open **Sanket Sahayak** → choose a service pack → square camera → show a supported sign.
3. **Safety (45s):** Explain that only high-confidence, stable results are auto-committed; uncertain results do not become facts and can escalate.
4. **Clerk → citizen (45s):** Type a short English sentence. Show the deterministic emoji visual aid and any validated/prototype sign guidance. Explicitly state that emoji is a visual aid, not ISL translation.
5. **HABIT (45s):** Show ISL Quest / practice and how interaction feedback can drive learning recommendations.
6. **SCORE (45s):** Show Sugamya Score as a prototype readiness metric, not an official government standard.
7. **Proof (60s):** Open `/recognition-lab`: real-camera dataset capture → 70/15/15 holdout → confusion matrix → difficult pairs → negative frames → threshold calibration.

## Before presenting
- Capture **30 real samples per sign** for the vocabulary you will actually demonstrate.
- Prioritize signs in the selected service pack instead of trying to collect all 34 at once.
- Capture at multiple distances/positions and in the actual demo lighting.
- Capture at least **30 negative frames** containing natural non-target poses or unsupported signs.
- Run the holdout evaluation and save calibration only when the result is defensible.
- Re-open Sahayak after applying calibration so the recognition engine loads the saved thresholds.

## What to say about AI
> “This prototype is intentionally vocabulary-limited. It uses hand landmarks plus a conservative classifier. When the evidence is weak, Sanket refuses to guess and provides a retry or human-escalation path.”

## What NOT to claim
- Do not claim production ISL translation.
- Do not claim field accuracy from the Recognition Lab.
- Do not claim government deployment, government partnerships, or live interpreter connectivity unless independently established.
- Do not present demonstration dashboard numbers as real national statistics.
- Do not call placeholder SVGs official ISL assets.
