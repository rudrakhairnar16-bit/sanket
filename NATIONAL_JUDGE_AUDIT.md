# SANKET 2.0 — Developer + Judge Audit

## Verdict
Sanket has the right product story for a national accessibility hackathon: it is counter-first, clerk-first, service-pack aware, confidence-aware, and designed around an AI + human safety net.

The largest remaining risk is **not UI**. It is evidence: real-camera recognition data, authoritative ISL asset validation, and proof that the end-to-end demo behaves consistently on the exact laptop/camera used on stage.

## What was strengthened in this build

### AI / recognition
- MediaPipe Hand Landmarker is used for browser-side hand landmarks.
- Landmark features are normalized before classification.
- kNN uses weighted neighbors instead of a single nearest sample.
- Service packs restrict the vocabulary during an interaction.
- High-confidence + temporal stability are required before an automatic conversation commit.
- Medium/low/unknown results are not treated as facts.
- Real-camera samples can replace synthetic anchors once a sign has enough real examples.
- Calibration can be persisted locally.
- Recognition Lab now supports holdout evaluation, confusion matrix, difficult-pair reporting, and negative-frame testing.

### Interaction safety
- Citizen → clerk audio is explicitly routed to the clerk channel.
- Clerk → citizen replies are visual-first; the browser must not speak the clerk's own response back into the clerk's audio path.
- Emoji output is positioned as a visual aid, not as ISL translation.
- Human escalation remains available.

### Trust / judge credibility
- Prototype national dashboards are explicitly labeled as demonstration/simulation data.
- Illustrative user journeys are no longer presented as verified field success stories.
- Prototype sign SVGs are explicitly marked as placeholders/validation-pending.
- Production auth routes require an auth cookie; demo fallback is controlled by `DEMO_MODE`.
- Production cookies use the secure flag.

## Remaining P0 risks before stage

1. **Real data:** capture 20–50 samples/sign for the signs actually demonstrated. Recommended: 30.
2. **Data diversity:** use more than one person if possible; vary distance, hand position, lighting, and background.
3. **Negative set:** capture at least 30 natural non-target/unsupported hand frames.
4. **Dynamic signs:** do not present a single-frame classifier as full dynamic-sign recognition. Model sequences if dynamic signs are part of the claim.
5. **ISL validation:** validate every displayed sign and asset against authoritative ISL resources before calling it official.
6. **Live interpreter:** the current interpreter transport remains a prototype/demo path unless a real service is connected and tested.
7. **Stage device:** run the exact demo on the exact laptop, browser, camera, and network conditions used on stage.

## Judge questions Sanket should answer cleanly

**Why not just use a sign-language translator?**
> Because the product is designed around the government counter workflow: service context, clerk readiness, confidence gating, escalation, feedback, and institutional measurement.

**What happens when AI is wrong?**
> Sanket is deliberately conservative. A candidate must pass distance, margin, vote, and temporal-stability checks before it becomes a committed message. Otherwise the clerk is asked to retry/confirm or escalate.

**Is this full ISL translation?**
> No. It is a vocabulary-limited assistive prototype. Full continuous ISL understanding requires temporal modeling, broader data, signer diversity, and expert validation.

**Are your national numbers real?**
> No. They are explicitly labeled demonstration data until verified pilot data exists.

**What is your strongest technical proof?**
> The Recognition Lab: real camera data → deterministic holdout split → confusion matrix → difficult pairs → negative-frame testing → threshold calibration.

## The winning presentation principle

Do not try to win by claiming the biggest model.

Win by showing that the system understands **where AI should act, where AI should stop, and how the institution continues when AI stops.**
