# Dataset Integration Status

## Integrated into SANKET code

- INCLUDE / OpenHands / RealSign / ISLRTC / FDMSE-ISL source registry and provenance docs.
- Generic 42-D SANKET landmark import format.
- CLI converter for already-extracted MediaPipe landmark JSON.
- Browser import path into the same calibration store used by Recognition Lab.
- RealSign is isolated conceptually as a future A-Z/fingerspelling module rather than being mixed into municipal-word recognition.
- Local camera calibration remains the final deployment gate.

## Not bundled

The raw third-party video/image archives are intentionally not embedded in the production ZIP because of size and differing upstream licensing/redistribution conditions. INCLUDE is CC BY 4.0; RealSign's repository states CC0-1.0; other sources require their own terms to be followed.

## Critical honesty rule

External benchmark results are **not** SANKET accuracy results. SANKET accuracy must be reported only from the held-out evaluation of the actual SANKET feature pipeline.
