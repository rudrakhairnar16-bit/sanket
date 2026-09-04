# SANKET — OpenCode Final Last-Mile Task

> **IMPORTANT: THIS FILE IS AN EXECUTION PROMPT ONLY.**
>
> **DO NOT COPY THIS FILE, ITS CONTENT, OR ANY SECRET/INTERNAL INSTRUCTIONS INTO THE GITHUB REPOSITORY.**
>
> OpenCode should read and execute this task locally, then implement only the required code/config/documentation changes in the SANKET project.
>
> Do not add `OPENCODE_FINAL_LAST_MILE_TASK.md` to GitHub.
> Do not add hidden prompts, internal reasoning, machine paths, credentials, tokens, API keys, or private notes to GitHub.
> If this file is present in the working tree during execution, remove it before the final commit unless the user explicitly asks otherwise.

---

## 1. Objective

Finish the SANKET national-level prototype smoothly and safely.

The goal is **not** to invent evidence or force every planned feature into the current build.

The goal is to:

1. audit the current repository;
2. complete everything that can be completed locally and deterministically;
3. preserve the existing working architecture;
4. avoid breaking the camera/recognition flow;
5. create clear developer handoffs for work that requires real people, real camera data, expert ISL review, external services, or field deployment;
6. keep all claims honest and evidence-backed;
7. leave the project in a clean, reproducible state.

---

## 2. First Rule: Do Not Destroy Working Features

Before changing anything:

- inspect the current code;
- inspect `README.md`;
- inspect `NATIONAL_READINESS.md`;
- inspect `NATIONAL_JUDGE_AUDIT.md`;
- inspect `NATIONAL_DEMO_RUNBOOK.md`;
- inspect `REAL_CAMERA_DATASET_GUIDE.md`;
- inspect `research/`;
- inspect `datasets/`;
- inspect `OPENCODE_MASTER_TASK.md`;
- inspect the recognition implementation under `src/lib/recognition/`;
- inspect Sahayak/Assist and Practice routes.

Do not replace working recognition code with a speculative model.

Do not upgrade major framework versions merely for cleanup.

Do not introduce paid APIs as mandatory dependencies.

Do not remove existing safety/rejection logic.

---

# 3. Work That CAN Be Completed Locally

Complete these items if missing or incomplete.

## A. Repository consistency

Ensure:

- TypeScript passes;
- imports are valid;
- no obvious dead/broken references exist;
- no accidental debug secrets are present;
- no API keys/tokens are committed;
- README links point to files that actually exist;
- research links point to files that actually exist;
- scripts listed in README exist;
- package scripts match actual files.

Run, where the environment permits:

```bash
npm run typecheck
npm test
npm run build
npm run evaluate:recognition
```

If a command fails because of the environment (for example network/DNS/native dependency/build-tool availability), document the exact failure. Do not fake a successful result.

---

## B. Camera UX

Audit every camera usage.

Requirements:

- camera viewport is square;
- consistent aspect ratio;
- no accidental stretched video;
- `object-fit: cover` or equivalent;
- clear hand-position guidance;
- visible state when no hand is detected;
- visible processing/recognition state;
- useful retry guidance;
- mobile-friendly controls;
- graceful camera permission failure.

Do not duplicate incompatible camera implementations unnecessarily.

---

## C. Recognition UX and safety

Preserve the current recognition safety architecture.

The UI should distinguish:

- HIGH / clear;
- MEDIUM / confirm;
- LOW / retry;
- UNKNOWN / unsupported.

Never force an unknown frame into a known sign.

Do not present confidence as a scientifically calibrated probability unless measured calibration supports that claim.

Keep:

- distance rejection;
- margin rejection;
- vote ratio;
- temporal stability;
- hand-quality checks;
- service-pack filtering where applicable.

Audit the actual implementation and fix obvious inconsistencies only.

---

## D. Audio direction

Verify that audio is never played to the wrong participant.

Required direction:

### Citizen → Clerk

ISL recognition may produce:

```text
recognized sign → clerk-facing text → clerk-facing audio
```

### Clerk → Citizen

Use visual communication first.

Do not accidentally call generic clerk-facing TTS for the citizen-facing response.

If a future citizen-facing speech channel is implemented, make its receiver explicit.

---

## E. Clerk English → Visual Aid

Keep the local/basic English-to-emoji visual aid deterministic and understandable.

Important:

- emoji are visual aids;
- emoji are NOT ISL;
- do not label emoji output as official translation;
- do not claim semantic equivalence beyond the supported mapping.

Add tests for the supported phrases if test infrastructure permits.

---

## F. Developer Recognition Lab

Ensure `/recognition-lab` remains usable as a developer/research tool.

It should support, where already implemented:

- sign selection;
- camera capture;
- 20–50 sample target;
- negative samples;
- dataset export;
- landmark import;
- train/validation/test split;
- threshold calibration;
- confusion matrix;
- difficult-pair analysis;
- open-set diagnostics.

Do not expose developer-only tools as ordinary citizen-facing features.

If authentication is available, prefer protecting this route.

---

# 4. Work That CANNOT Be Truthfully Completed by Code Alone

Do NOT fabricate any of the following.

## A. Real camera samples

Code cannot create authentic human webcam samples.

The team must collect:

- 20–50 samples/sign;
- preferably 30+;
- multiple signers;
- different distances;
- different backgrounds;
- varied lighting;
- natural hand orientation;
- realistic camera/device variation.

Use the existing:

`REAL_CAMERA_DATASET_GUIDE.md`

Do not generate synthetic “real” data.

---

## B. ISL expert validation

A developer cannot declare custom sign artwork or mappings “official ISLRTC”.

The following require appropriate expert/source validation:

- sign labels;
- sign meanings;
- sign assets/SVGs;
- service-specific mappings;
- dynamic sign interpretation.

Keep unvalidated assets marked as:

`validation pending` / `under review`

Do not silently upgrade them to “approved”.

---

## C. Field accuracy

Do not invent:

- accuracy;
- precision;
- recall;
- F1;
- user satisfaction;
- service-time reduction;
- accessibility improvement;
- deployment count;
- government adoption.

Only publish measured numbers from a documented evaluation.

---

## D. Dynamic ISL recognition

The current lightweight landmark pipeline is not a complete solution for dynamic signs.

Do not claim continuous/dynamic ISL understanding.

Create a roadmap/handoff for:

- temporal sequences;
- signer-independent evaluation;
- dynamic-sign datasets;
- temporal models;
- continuous-sentence research.

---

## E. Production interpreter transport

Do not claim production live interpreter transport unless the actual service is connected and tested.

Keep escalation as:

```text
AI uncertain → retry/confirm → human interpreter pathway
```

The production communications backend is a separate implementation task.

---

# 5. Dataset and Research Rules

When handling external datasets:

1. verify upstream source;
2. verify license;
3. preserve attribution;
4. preserve provenance;
5. document transformations;
6. do not redistribute restricted raw data;
7. do not merge incompatible labels without documentation;
8. do not call an inherited/derived dataset “official”;
9. do not use benchmark results from another paper as SANKET accuracy.

The current repository should contain:

- dataset source registry;
- manifest;
- conversion/import tooling;
- provenance notes;
- evaluation methodology.

Raw large third-party datasets should not be committed merely for convenience.

---

# 6. Calibration Protocol

Use this exact logic:

```text
real data
   ↓
quality filtering
   ↓
deterministic train / validation / test split
   ↓
train recognition index on TRAIN only
   ↓
calibrate thresholds on VALIDATION only
   ↓
freeze thresholds
   ↓
evaluate final metrics on TEST only
   ↓
report confusion matrix + difficult pairs + rejection/open-set results
```

Never tune thresholds on the final test set.

If the dataset is too small, report that limitation.

---

# 7. README and Claims

Keep README claims conservative.

Allowed:

- “national-level prototype”
- “validation in progress”
- “lightweight recognition baseline”
- “designed for government service counters”
- “research/documentation layer”
- “prototype operating thresholds”

Not allowed unless supported by evidence:

- “X% accurate”
- “government deployed”
- “officially certified”
- “ISLRTC approved”
- “works for all ISL”
- “real-time universal translator”
- “reduces service time by X%”
- “serves millions”
- “guaranteed accessibility improvement”

---

# 8. Security and Privacy Audit

Check for:

- secrets in source;
- insecure cookie settings;
- exposed developer routes;
- unnecessary camera persistence;
- accidental localStorage of sensitive personal data;
- unsafe API inputs;
- missing validation on user-controlled fields.

Do not add a complicated security stack if it creates demo risk.

Prefer simple, understandable protections.

Document any remaining production-security work.

---

# 9. Demo Reliability

Create a deterministic national demo path.

Requirements:

- no secret credentials;
- no dependence on an unverified external API;
- clear demo mode;
- graceful network failure;
- predictable supported-sign flow;
- obvious fallback when camera/recognition is uncertain.

The demo must not fake live government deployment.

If demo data is illustrative, label it as illustrative.

---

# 10. Documentation Handoff

For anything that cannot be completed locally, create/update a single handoff document:

`NATIONAL_LAST_MILE_HANDOFF.md`

Include:

| Item | Status | Why code cannot finish it | Human action |
|---|---|---|---|
| Real camera dataset | Pending | Requires genuine human capture | Collect samples |
| ISL validation | Pending | Requires qualified review | Validate labels/assets |
| Field benchmark | Pending | Requires real evaluation | Run protocol |
| Dynamic recognition | Planned | Requires sequence model/data | Research/implement |
| Interpreter transport | Planned | Requires real service/backend | Integrate/test |

Do not convert pending work into fake completion.

---

# 11. Final Repository Hygiene

Before finishing:

- remove temporary files;
- remove generated debug artifacts;
- remove local machine paths;
- remove secrets;
- remove internal OpenCode prompts from the public repository;
- do not add this file to GitHub;
- do not add private notes;
- do not add fake datasets;
- do not add fabricated evaluation results.

If this task file was copied into the repository during execution, delete it before final commit.

---

# 12. Final Verification

Run what is possible:

```bash
npm run typecheck
npm test
npm run build
npm run evaluate:recognition
```

Then produce a concise local report:

```text
TYPECHECK: PASS/FAIL + reason
TESTS: PASS/FAIL + reason
BUILD: PASS/FAIL + reason
RECOGNITION EVALUATION: measured/not available
REAL DATASET: collected/not collected
ISL EXPERT VALIDATION: pending/completed
DYNAMIC ISL: prototype/planned
INTERPRETER TRANSPORT: prototype/connected
SECURITY AUDIT: summary
README: verified
PUBLIC REPO HYGIENE: verified
```

Never change a FAIL to PASS because the failure is inconvenient.

---

# 13. Definition of Done

SANKET is “done for this development phase” when:

- the current prototype works without obvious regressions;
- camera UI is consistent;
- recognition refuses uncertain inputs instead of forcing labels;
- audio direction is correct;
- clerk visual responses are clearly separated from ISL claims;
- Recognition Lab is usable;
- evaluation methodology is reproducible;
- documentation is internally consistent;
- security/privacy basics are checked;
- unsupported claims are removed;
- human-dependent tasks are clearly handed off;
- the public repository contains no private OpenCode instructions;
- the national demo can be run predictably.

**Do not chase theoretical perfection. Finish cleanly, verify honestly, and leave a precise path for the next research stage.**

