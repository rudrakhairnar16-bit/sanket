# SANKET — National Last-Mile Handoff

## Purpose

This document separates tasks that can be finished in software from tasks that require genuine human/data/expert/field work.

| Workstream | Current state | Why it needs external work | Next action |
|---|---|---|---|
| Real camera dataset | Tooling ready; genuine data required | Code cannot manufacture authentic human signing | Collect 20–50 samples/sign, preferably 30+ |
| Signer diversity | Pending | Requires multiple real signers | Collect signer-diverse samples |
| Confusion analysis | Tooling ready | Requires collected dataset | Run Recognition Lab after capture |
| Threshold calibration | Tooling ready | Requires representative validation data | Calibrate on validation split |
| Open-set evaluation | Tooling ready | Requires genuine negative examples | Capture varied non-target/unknown frames |
| ISL sign validation | Pending | Requires appropriate expert/source review | Review labels, meanings and visual assets |
| Dynamic ISL | Planned | Requires temporal data/model | Research sequence recognition |
| Field benchmark | Pending | Requires real users/environment | Conduct documented pilot |
| Interpreter transport | Prototype/handoff | Requires actual service/backend | Integrate and test production pathway |

## Evidence rule

No accuracy, impact, deployment, certification or endorsement claim should be published until the corresponding evidence exists.

## Public-repository rule

The OpenCode execution prompt is an internal implementation artifact. It must not be committed to the public GitHub repository unless explicitly requested later.
