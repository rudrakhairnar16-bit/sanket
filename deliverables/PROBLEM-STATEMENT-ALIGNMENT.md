# Yuva 6.0 — Problem Statement Alignment (Sanket)

> **Problem statement:** *"Indian Sign Language for All"* — mainstream ISL learning and usage through training, technology, incentives, or policy integration, across at least one critical sector.

**Chosen sector: PUBLIC SERVICES** (municipal/government offices) — one of the four allowed sectors (education, healthcare, public services, workplaces).

**Core numbers:** ~18M hearing-impaired Indians · ~3.5M govt clerks in municipal offices · RPwD Act 2016 recognises ISL but ground-level integration is near zero.

---

## 1. Constraint-by-constraint mapping

| # | Constraint | Sanket's answer |
|---|-----------|-----------------|
| 1 | **Defined audience**: students / workplace employees / public service staff | **Public service staff** — government clerks in municipal offices. Plus citizens via the public `/learn` ISL Quest (no login). |
| 2 | **Easy adoption**, minimal prerequisites/infrastructure | Web app — zero install. 3-minute daily lesson (1 video + 1 MCQ). Free-tier stack (Vercel + MongoDB Atlas). Offline PWA + graceful mock fallback so it works on weak networks. Webcam practice runs fully in-browser (MediaPipe), no ML server. |
| 3 | **Linguistic diversity** — ISL distinct from regional sign variants | Content curated from **ISLRTC** (national standard ISL, 10,000+ term dictionary). UI localized EN/HI/MR. ⚠️ *Gap: add an explicit "ISL vs regional variants" explainer module/slide.* |
| 4 | **Tier 2/3 cities + rural reach** | Offline-first PWA for low connectivity; WhatsApp/SMS nudge (planned — clerks respond to mobile alerts); low-bandwidth design; mock fallback never crashes offline. ⚠️ *Gap: formalize a rural outreach strategy slide (SMS-based lessons, department champions in panchayat/block offices).* |

## 2. Expected outcomes mapping

| # | Outcome required | Where Sanket delivers |
|---|------------------|----------------------|
| 1 | **Learning/integration model with clear adoption pathway** | Daily 3-min lesson → MCQ → streak → badge → milestone certificate (7/14/21/30 days). Webcam practice. Public ISL Quest (XP, levels 1–20, 10 badges). Admin compliance dashboards track adoption per department. |
| 2 | **Curriculum outline / training programme for the sector** | 5 daily modules (Thank You, Please Wait, Sign Here, Water Bill, Submit) + 34 signs across 6 categories (Greetings, Office, Emergency, Daily Life, Numbers, Questions). Spaced repetition resurfaces weak answers 2–3 days later. ISLRTC-sourced content with attribution. |
| 3 | **Adoption strategy: partnerships, champions, incentives** | **Incentives:** streaks, department-vs-department leaderboards, badges, XP, PDF certificates, QR citizen-feedback loop (converts training → real-world impact). **Champions:** department-admin role hierarchy. **Partnerships:** ISLRTC (content pipeline), municipalities (pilot), Deaf-community review for production content. |
| 4 | **Scalability plan: pilot → national rollout** | Hackathon MVP → single-municipality pilot → statewide rollout. Admin hierarchy already supports multi-department scope → district/state heatmaps. Outcome metric shifts from *training completion* to *on-ground usage* (citizen feedback). |

## 3. One-line pitch (aligned to the PS)

> "Sanket trains India's 3.5 million government clerks in Indian Sign Language — 3 minutes a day, on any device — then verifies real-world impact through citizen feedback, scaling from one municipality to the nation."

## 4. Open gaps to close before the round

1. WhatsApp/SMS nudge — button exists, live integration (Twilio) is the honest next step
2. Sign recognition is demo-grade kNN — production path = ISLRTC-certified model/content
3. Video content is placeholder — swap for real ISLRTC clips before final
4. Interpreter socket server needs its own deployment (Railway/Fly.io) in production
5. Explicit **ISL vs regional variants** positioning (constraint 3) — add explainer
6. Rural/Tier 2/3 outreach strategy — add a slide (SMS-first, panchayat champions)
