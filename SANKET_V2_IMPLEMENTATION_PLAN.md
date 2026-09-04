# SANKET 2.0 — IMPLEMENTATION PLAN

## Current State (What's Built)
| Area | Status |
|------|--------|
| Project Setup | Next.js 14, TypeScript, Tailwind, MongoDB/Mongoose, all deps |
| Design System | glass/bento/spatial cards, navy/gold/teal palette |
| Auth | JWT + cookies, 7 roles, demo users |
| Models | 9 Mongoose models |
| Types | 7 type files (auth, assist, interpreter, learning, score, index, message) |
| Clerk Pages (8) | dashboard, leaderboard, profile, assist, learn, practice, progress, certificates |
| Admin Pages (10) | overview, analytics, staff, departments, service-packs, feedback, reports, audit, content, signs |
| Interpreter Pages (3) | overview, queue, session |
| National Pages (4) | overview, states, map, impact |
| Public Pages (8) | landing, login, problem-statement, offline, error, not-found, feedback, limitations |
| API Routes (14) | auth, leaderboard, admin, feedback, modules, completions, game-sync, interpreter, tts |
| Data | 34 municipal signs, 5 service packs, demo users/sessions/feedback, training data (170 samples) |
| Components | 12 UI, 4 layout, 3 shared (OfflineIndicator, ProductFlywheel, LiveDemoFlow) |

## PHASE 3: Recognition Engine ✅ COMPLETE
- [x] RecognitionEngine interface (`src/lib/recognition/types.ts`)
- [x] Confidence state machine (`src/lib/recognition/confidence.ts`)
- [x] DemoRecognitionEngine (`src/lib/recognition/demo-engine.ts`)
- [x] MediaPipe + kNN implementation (`src/lib/recognition/mediapipe-knn.ts`)
- [x] Training data for 34 signs (`src/data/recognition/training-data.ts`)
- [x] Engine factory with fallback (`src/lib/recognition/index.ts`)
- [x] Integrated into assist page — uses `getRecognitionEngine()`, `speakCitizenMessage()`, `getSignGuidance()`

## PHASE 4: Two-Way Communication Model ✅ COMPLETE
- [x] Message direction types (`src/types/message.ts`)
- [x] Audio direction fix (`src/lib/audio-direction.ts`)
- [x] Clerk→Citizen ISL guidance (`src/lib/sign-guidance.ts`)
- [x] Integrated into assist page — proper `createMessage()` with correct directions

## PHASE 5: Human Interpreter Safety Net ⚠️ PARTIAL
- [ ] Socket.IO server — NOT BUILT
- [x] Interpreter queue UI (src/app/(clerk)/interpreter/)
- [x] Demo mode fallback
- [x] Audit logging on escalation

## PHASE 6: ISL Quest Enhancements ✅ COMPLETE
- [x] SM-2 spaced repetition (`src/lib/learning/srs.ts`)
- [x] Adaptive recommendations (`src/lib/learning/recommendations.ts`)
- [x] Integrated into learn page (SRS due cards, difficulty badges)
- [x] Integrated into progress page (weak areas, recommended lessons)
- [x] Integrated into dashboard (recommended for you)

## PHASE 7: Sugamya Score Engine ✅ COMPLETE
- [x] Score calculator (`src/lib/score/calculator.ts`)
- [x] Configurable weights
- [x] Integrated into admin dashboard (live calculation)
- [x] Integrated into admin analytics (score section)

## PHASE 8: RBAC + Multi-tenancy + Audit ✅ COMPLETE
- [x] API middleware (`src/lib/rbac.ts`)
- [x] Audit logger (`src/lib/audit.ts`)
- [x] API helpers (`src/lib/api-helpers.ts`)
- [x] Applied to login, logout, admin dashboard, modules, feedback, interpreter routes
- [ ] Multi-tenancy scoping — NOT BUILT

## PHASE 9: PWA / Offline ✅ COMPLETE
- [ ] Service worker — NOT BUILT
- [x] PWA manifest (`public/manifest.json`)
- [x] PWA icon (`public/icon.svg`)
- [x] Offline indicator (`src/components/shared/OfflineIndicator.tsx`)

## PHASE 10: Polish + Testing + Docs ⚠️ PARTIAL
- [ ] Unit tests — NOT BUILT
- [ ] E2E tests — NOT BUILT
- [x] Limitations page (`src/app/limitations/page.tsx`)
- [x] ProductFlywheel component
- [x] LiveDemoFlow component

## REMAINING GAPS

### HIGH PRIORITY
1. Socket.IO interpreter server — real-time communication
2. Unit tests (vitest) — 5-10 critical tests
3. E2E tests (playwright) — 2-3 happy paths

### MEDIUM PRIORITY
4. Service worker — offline caching for PWA
5. Multi-tenancy helpers — scope-based queries
6. i18n foundation — Hindi support

### LOW PRIORITY
7. Additional API routes (game-sync, tts, completions with RBAC)
8. More comprehensive training data
9. Performance optimization
