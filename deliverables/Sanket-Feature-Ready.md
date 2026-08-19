# Sanket — ISL Accessibility Platform for Sarkari Clerks

> A civic-tech platform that bridges the communication gap between **deaf/hard-of-hearing citizens** and **government (sarkari) clerks** using **Indian Sign Language (ISL)**, AI-assisted sign recognition, and multilingual conversion (English / Hindi / Marathi).

---

## 1. Why This Project Exists (The Problem)

In India, millions of deaf and hard-of-hearing citizens need to interact with government offices — for water bills, tax certificates, complaints, documents, and more. But most government clerks:

- Do **not** know Indian Sign Language (ISL).
- Have **no tool** to understand a deaf citizen's signs.
- Fall back on writing on paper or relying on a third person, which is slow, awkward, and privacy-breaking.

Meanwhile, a deaf citizen walking into a municipal office has **no reliable way** to be understood. This creates exclusion from basic civic services — a direct barrier to equality.

**Sanket** solves this by turning a regular laptop/phone into a two-way ISL interpreter + training tool that any clerk can use, in their own language.

---

## 2. Why the Name "Sanket"?

**"Sanket" (संकेत)** is a Hindi/Sanskrit word meaning **"signal", "sign", or "symbol"**.

- It perfectly captures the core idea: **signs and signals** are how deaf citizens communicate.
- It is short, memorable, and linguistically native to the exact audience (Hindi/Marathi speaking regions) the platform serves.
- It signals *intent* at a glance — a "signal" bridge between two worlds.

> Just as a signal carries meaning without sound, Sanket carries a citizen's intent without requiring spoken words.

---

## 3. Who Is It For? (Users)

| User | Need | How Sanket Helps |
|------|------|------------------|
| **Deaf Citizen** | Be understood at a government office | Signs are converted to text + ISL symbols the clerk reads; clerk's reply is shown as ISL symbols |
| **Government Clerk** | Understand & reply to deaf citizens without knowing ISL | Live interpreter + a "Learn ISL" trainer so clerks can self-train |
| **Office / Admin** | Track training & service quality | Leaderboard, task tracking, admin oversight |
| **College Demo / Judges** | See a complete, working civic-tech solution | Polished UI, gamification, real ML-backed recognition |

---

## 4. Complete Feature List

### A. Live Two-Way Interpreter (`/interpreter` and `/interpreter/calibrate`)
- **Real-time sign → text**: A citizen's sign is recognized and shown as text to the clerk.
- **Clerk reply → ISL symbols**: Whatever the clerk types or speaks is converted into **ISL symbol chips** (emoji + word) that the deaf citizen can read.
- **Multilingual (EN / हि / मर)**: The entire interface and all conversions switch between English, Hindi, and Marathi. Sign names, ISL labels, and speech output all localize.
- **Demo Mode**: Clickable sign buttons simulate citizen input (essential because browser mic/Web Speech doesn't work in Brave — see Limitations).
- **Voice input**: Clerk can speak; text is captured via Web Speech API (works in Chrome/Edge).
- **Text-to-ISL (`textToISL`)**: Keyword-maps clerk sentences ("water bill") → ISL signs (💧 जल / 🧾 बिल).

### B. Learn ISL Trainer (`/learn`)
- **Webcam Practice with kNN Train Mode**: Clerks can **train the model live** by showing a sign to the webcam; the system captures samples and builds a personal k-Nearest-Neighbours classifier stored in `localStorage`.
- **Live detection**: After training, the webcam detects the shown sign and displays "Detected: <sign>".
- **Sign library**: 25 municipal signs across Greetings, Basic Conversation, Services, Documents, and Civic/Office categories.
- **Theme**: Royal-blue primary with orange accent — clean, government-friendly, high-contrast for accessibility.

### C. Gamification & Engagement
- **Leaderboard**: Tracks learner progress (mock-seeded with 11 learners locally; real data on Vercel+Atlas).
- **Tasks system**: Guided learning/training tasks to keep clerks practicing.
- **ISL Quest** (localStorage progress): Dark mode, streaks, and progress persisted on the device.

### D. Multilingual Engine
- `getLocalizedName(sign, lang)` — returns sign name in EN/HI/MR.
- `speak(text, lang)` — Text-to-Speech in the chosen language.
- `textToISL(text, lang)` — sentence → ISL symbol tokens, localized.
- `LANG_MAP` + `t()` dictionary (EN keys → HI/MR) for UI strings.

### E. Admin & Oversight
- Admin navigation (currently hidden from normal users; admin screen scoped for later).
- Foundation for monitoring training coverage across offices.

### F. Deployment & Resilience
- **MongoDB Atlas** for real data (when deployed on Vercel).
- **Mock fallback**: When the database is unreachable (e.g. local network blocks Atlas), the app gracefully falls back to mock auth + leaderboard so the demo never breaks.
- `vercel.json` + `DEPLOY.md` for one-click-style Vercel deployment.
- PWA-ready (manifest, service worker, installable).

---

## 5. Why We Used Each Technology

| Tech | Why |
|------|-----|
| **Next.js 14 (React, TypeScript)** | Fast, SSR/SSG, easy deploy on Vercel, type-safe for a reliable demo |
| **TypeScript (strict)** | Prevents runtime bugs during a live college demo |
| **kNN Classifier (client-side)** | No heavy model download; trains instantly from the clerk's own webcam; stored locally |
| **Web Speech API** | Free, built-in TTS + STT for multilingual voice (no external cost) |
| **MongoDB Atlas** | Scalable cloud DB for real learner/leaderboard data |
| **localStorage** | Persists trained samples & progress with zero backend dependency |
| **Tailwind CSS** | Rapid, consistent, accessible UI theming (royal blue / orange) |
| **Vercel** | Zero-config deploy; the only environment where Atlas is reachable from this setup |

---

## 6. Why Each Feature Is Necessary

- **Two-way interpreter** → Without it, only one side is helped. Real access requires *both* understanding the citizen AND letting the clerk respond in ISL-readable form.
- **Hindi/Marathi support** → Government offices in Maharashtra/India operate in vernacular languages. English-only would exclude the very users we serve.
- **Demo Mode** → Browser speech mic fails in Brave; demo buttons guarantee a flawless live presentation.
- **Train Mode** → Clerks can't be pre-trained on every office's signs; letting them train on their own webcam makes it adaptive and personal.
- **Mock fallback** → A demo must never crash if the network/DB is blocked. Graceful degradation is a must.
- **Gamification** → Adoption depends on clerks actually practicing ISL; leaderboards/tasks drive repeat use.

---

## 7. Current Limitations (Honest Notes)

1. **Brave browser**: Web Speech mic does **not** work in Brave. Use **Chrome or Edge** for live voice. Demo Mode covers this gap.
2. **Local DB**: The local network blocks MongoDB Atlas DNS/TLS, so the app runs on **mock data locally**. Deploy to **Vercel** for real Atlas-backed data.
3. **Auth & leaderboard** are currently mock/seeded; real persistence activates after Vercel deploy.
4. **Admin UI** is scaffolded but not fully built.

---

## 8. How to Run / Demo

```bash
# Local (mock mode)
npx next dev -p 3000
# open http://localhost:3000/interpreter

# Production with real DB
# 1. Log into Vercel, link repo rudrakhairnar16-bit/sanket
# 2. Add MONGODB_URI from .env
# 3. Deploy (see DEPLOY.md)
```

**Demo flow for judges:**
1. Open `/learn` → Train Mode → show a sign to webcam → detect it.
2. Open `/interpreter` → switch to 🇮🇳 HI → click sign buttons (citizen) → type clerk reply → see ISL symbols in Hindi.
3. Show leaderboard & tasks for engagement proof.

---

## 9. Summary

**Sanket** ("signal/sign") is a complete, demo-ready civic-tech solution that lets government clerks understand and serve deaf citizens through Indian Sign Language — with live interpretation, multilingual (EN/HI/MR) conversion, on-device sign training, and gamified learning. It turns any ordinary device into an accessibility bridge, making basic civic services truly inclusive.

*"Sanket — where every sign gets a signal."*
