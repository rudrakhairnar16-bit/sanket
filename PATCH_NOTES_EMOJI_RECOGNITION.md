# SANKET V2 — Sahayak Emoji + Recognition Precision Patch

## Implemented

### Clerk → Citizen visual message
- Added `src/lib/emoji-message.ts`.
- Converts simple/basic English clerk sentences into deterministic emoji visual cues locally.
- Preserves the original English sentence.
- Added a custom clerk message composer to `/assist`.
- Press Enter to send (Shift+Enter for a new line).
- Added persistent "Citizen Visual Cue" after sending.
- Explicitly labels emoji as a visual aid, not validated ISL.

### Recognition precision
- Reduced classifier acceptance distance from 0.42 to 0.30.
- Increased minimum candidate margin to 0.060.
- Increased vote agreement requirement to 60%.
- Increased kNN neighborhood to 7.
- Added active service-pack filtering so unrelated signs cannot be accepted during a focused service session.
- Medium-confidence results are no longer automatically committed as recognized citizen messages.
- Only HIGH-confidence results are auto-committed in Sahayak.
- Low/unknown results remain non-committal and can lead to interpreter assistance.
- Added optional `setAllowedSignIds()` to the recognition engine contract.

## Why this change

The existing landmark kNN classifier has a small synthetic training set. A nearest-neighbor classifier can otherwise always return its closest known sign even when the hand does not match any supported sign. The patch intentionally prioritizes precision over forced guesses.

## Important limitation

This is a precision/rejection improvement, not a claim of real-world ISL accuracy. The training data still needs real, validated samples from the supported signs and proper evaluation before accuracy numbers should be presented.
