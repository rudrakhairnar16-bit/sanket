<p align="center">
  <img src="https://img.shields.io/badge/Sanket-संकेत-6366f1?style=for-the-badge&labelColor=0b1120&color=818cf8" alt="Sanket"/>
  <img src="https://img.shields.io/badge/ISL_for_Sarkari_Clerks-civic_tech-0b1120?style=for-the-badge&labelColor=1e293b&color=c9a961" alt="ISL for Sarkari Clerks"/>
  <img src="https://img.shields.io/badge/Yuva_6.0-Hackathon-0b1120?style=for-the-badge&labelColor=1e293b&color=4ade80" alt="Yuva 6.0"/>
  <img src="https://img.shields.io/badge/Live_Demo-sanket--isl.vercel.app-0b1120?style=for-the-badge&labelColor=1e293b&color=fb923c" alt="Live Demo"/>
</p>

<p align="center">
  <b>From 30 days of training, to 30 seconds of service.</b><br>
  <sub>A civic tech platform helping government clerks learn Indian Sign Language through daily bite-sized lessons, gamified streaks, and admin compliance dashboards.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/MediaPipe-FF6F00?style=flat-square&logo=google&logoColor=white" alt="MediaPipe"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

---

## The Problem

<p align="center">
  <img src="https://img.shields.io/badge/18M-Deaf_Citizens-gold?style=for-the-badge&labelColor=0b1120" alt="18M"/>
  <img src="https://img.shields.io/badge/3.5M-Govt_Clerks-blue?style=for-the-badge&labelColor=0b1120" alt="3.5M"/>
  <img src="https://img.shields.io/badge/<5%-ISL_Proficiency-red?style=for-the-badge&labelColor=0b1120" alt="<5%"/>
  <img src="https://img.shields.io/badge/0-Counter_Tools-red?style=for-the-badge&labelColor=0b1120" alt="0"/>
</p>

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         THE SILENCE AT THE COUNTER                     │
│                                                                         │
│   🧏 Deaf Citizen                    🧑‍💼 Clerk                          │
│   ┌─────────────┐                    ┌─────────────┐                   │
│   │ Signs:      │                    │ Understands: │                   │
│   │ "bill"      │ ──── ??? ────▶     │ ???          │                   │
│   │ "water"     │                    │ ???          │                   │
│   │ "certificate"│                   │ ???          │                   │
│   └─────────────┘                    └─────────────┘                   │
│                                                                         │
│   Root Cause: ISL lessons exist OFF the counter.                        │
│   Consequence: Written notes, family interpreters, or simply leave.     │
│   Mandate: RPwD Act 2016 + Sugamya Bharat Abhiyan.                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Our Solution — Moment → Habit → Score

<p align="center">
  <img src="https://img.shields.io/badge/1-MOMENT-4ade80?style=for-the-badge&labelColor=0b1120" alt="Moment"/>
  <img src="https://img.shields.io/badge/2-HABIT-818cf8?style=for-the-badge&labelColor=0b1120" alt="Habit"/>
  <img src="https://img.shields.io/badge/3-SCORE-fb923c?style=for-the-badge&labelColor=0b1120" alt="Score"/>
</p>

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          MOMENT → HABIT → SCORE                             │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   1 · MOMENT    │    │   2 · HABIT     │    │   3 · SCORE     │          │
│  │                 │    │                 │    │                 │          │
│  │  Sanket Sahayak │    │   ISL Quest     │    │  Sugamya Score  │          │
│  │  30-sec service │───▶│  3-min lessons  │───▶│  Compliance     │          │
│  │  at the counter │    │  XP, streaks    │    │  Dashboard      │          │
│  │                 │    │  badges          │    │  Real data      │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
│                                                                              │
│  "The desk flow wins the clerk today; the gamified habit and the             │
│   departmental score make it stick."                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## How It Works — Architecture Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW: SIGN TO CLERK                            │
│                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐│
│  │ 📷       │    │ 🧠       │    │ 💬       │    │ 🔄       │    │ 🗄️     ││
│  │ MediaPipe│───▶│ kNN      │───▶│ Clerk UI │───▶│ API      │───▶│ MongoDB││
│  │ 21 hand  │    │ k=3      │    │ React    │    │ Server-  │    │ Atlas  ││
│  │ landmarks│    │ conf≥0.45│    │ ISL chips│    │ less     │    │        ││
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └────────┘│
│       │               │                                                   │
│       │               ▼                                                   │
│       │         ┌──────────┐                                              │
│       │         │ ⚠️ LOW   │                                              │
│       │         │CONFIDENCE│                                              │
│       │         │  < 0.45  │                                              │
│       │         └────┬─────┘                                              │
│       │              │                                                    │
│       │              ▼                                                    │
│       │    ┌─────────────────┐                                            │
│       │    │ 📞 CALL         │                                            │
│       │    │ INTERPRETER     │                                            │
│       │    │ WebSocket Relay │                                            │
│       │    │ → Text + ISL    │                                            │
│       │    └─────────────────┘                                            │
│       │                                                                    │
│  Runs ON-DEVICE. No server round-trip. Offline-capable.                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    SANKET SAHAYAK — 30-SECOND FLOW                          │
│                                                                              │
│  🧏 Citizen                                           🧑‍💼 Clerk              │
│  ─────────                                           ─────────              │
│                                                                              │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │ App     │────▶│ Citizen │────▶│ Clerk   │────▶│ Reply   │              │
│  │ Speaks  │     │ Signs   │     │ Sees +  │     │ ISL +   │              │
│  │ First   │     │ Camera/ │     │ Hears   │     │ Voice   │              │
│  │         │     │ One-Tap │     │ Text    │     │ Back    │              │
│  └─────────┘     └─────────┘     └─────────┘     └─────────┘              │
│       │                                              │                      │
│       └──────────────────────────────────────────────┘                      │
│                        ┌─────────────┐                                     │
│                        │ 🎉 +25 XP   │                                     │
│                        │ "You helped  │                                     │
│                        │  a citizen"  │                                     │
│                        └─────────────┘                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Features

### 🙏 Sanket Sahayak — Help a Citizen in 30 Seconds

```
  URL: /assist (public, no login)
  ┌─────────────────────────────────────────────────────┐
  │  WELCOME: "Namaste, I am Sanket Sahayak"           │
  │  ↓                                                  │
  │  CITIZEN: Signs "water" (webcam or one-tap)        │
  │  ↓                                                  │
  │  CLERK: Sees text + hears TTS in EN/HI/MR         │
  │  ↓                                                  │
  │  CLERK: Taps one-tap reply → ISL chips + voice     │
  │  ↓                                                  │
  │  ✅ SESSION COMPLETE → +25 XP                       │
  └─────────────────────────────────────────────────────┘
```

- **14 desk-ready one-tap replies** — Namaste, Please wait, Bill payment is over here...
- **Auto demo fallback** — no camera? Clickable sign grid — never crashes on stage
- **Live typing preview** — ISL symbols show above input as clerk types

### 👨‍🏫 ISL Quest — Gamified Learning

```
  ┌─────────────────────────────────────────────────┐
  │              ISL QUEST — DAILY HABIT             │
  │                                                  │
  │  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐    │
  │  │ 📖   │   │ 🎯   │   │ 🏆   │   │ 🎓   │    │
  │  │Lesson│──▶│ Quiz │──▶│ XP   │──▶│ Cert │    │
  │  │ 3min │   │ MCQ  │   │ +20  │   │ PDF  │    │
  │  └──────┘   └──────┘   └──────┘   └──────┘    │
  │                                                  │
  │  34 Signs · 6 Categories · Spaced Repetition    │
  │  Daily Streaks · Leaderboards · Badges          │
  └─────────────────────────────────────────────────┘
```

- **35 signs** across 6 categories (Greetings, Office, Emergency, Daily Life, Numbers, Questions)
- **Webcam practice** — real-time MediaPipe hand tracking for 5 signs (+50 XP)
- **Spaced repetition** — wrong answers resurface 2-3 days later
- **Milestone certificates** — auto-generated PDF at 7/14/21/30 day streaks

### 📊 Admin Dashboard — Real Compliance Data

```
  ┌─────────────────────────────────────────────────────┐
  │                 SUGAMYA SCORE                        │
  │                                                      │
  │  ┌──────────────────────────────────────────────┐   │
  │  │  45% Compliance (DAL + streak)               │   │
  │  │  ████████████████████░░░░░░░░░░░  45%        │   │
  │  │                                              │   │
  │  │  30% Citizen Satisfaction (QR feedback)      │   │
  │  │  █████████████░░░░░░░░░░░░░░░░░  30%        │   │
  │  │                                              │   │
  │  │  15% Participation (active learners)         │   │
  │  │  ███████░░░░░░░░░░░░░░░░░░░░░░░  15%        │   │
  │  │                                              │   │
  │  │  10% Human Safety Net (escalations)          │   │
  │  │  █████░░░░░░░░░░░░░░░░░░░░░░░░░  10%        │   │
  │  └──────────────────────────────────────────────┘   │
  │                                                      │
  │  Charts · CSV Export · QR Generator · Leaderboard   │
  └─────────────────────────────────────────────────────┘
```

### 📞 Live Human Interpreter (Emergency Relay)

```
  ┌─────────────────────────────────────────────────────────────┐
  │              ESCALATION FLOW                                 │
  │                                                              │
  │  AI Confidence ≥ 0.45        AI Confidence < 0.45           │
  │  ┌─────────────────┐         ┌─────────────────┐           │
  │  │ ✅ Recognized    │         │ ⚠️ Low Confidence│           │
  │  │ Show result      │         │ Show result      │           │
  │  └─────────────────┘         └────────┬────────┘           │
  │                                       │                      │
  │                                       ▼                      │
  │                              ┌─────────────────┐           │
  │                              │ 📞 Call          │           │
  │                              │ Interpreter      │           │
  │                              └────────┬────────┘           │
  │                                       │                      │
  │                              ┌────────▼────────┐           │
  │                              │ WebSocket Relay  │           │
  │                              │ Text + ISL Chips │           │
  │                              └────────┬────────┘           │
  │                                       │                      │
  │                              ┌────────▼────────┐           │
  │                              │ End Relay → Log  │           │
  │                              │ Sugamya Score +10%│          │
  │                              └─────────────────┘           │
  │                                                              │
  │  "We built the routing, not just the recognizer."           │
  └─────────────────────────────────────────────────────────────┘
```

### 🌐 ISL Quest — Public Learning

| Feature | Details |
|---------|---------|
| **Flashcard Mode** | 3D card flip animation, 35 signs |
| **Quiz Challenge** | MCQ tests, +20 XP correct, +5 XP wrong |
| **Webcam Practice** | MediaPipe hand tracking, +50 XP |
| **XP & Leveling** | Level 1-20, 10 unlockable badges |
| **Daily Streak** | Consecutive practice tracking |
| **ISL Dictionary** | Search by name/meaning with category filter |
| **Dark Mode** | Toggle for comfortable evening learning |
| **Hindi Bilingual** | EN ↔ हिंदी UI switch |
| **Sound Effects** | Web Audio API chimes |
| **Citizen Leaderboard** | Top learners ranked by XP |

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        TECH STACK                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FRONTEND          │  Next.js 14 App Router              │   │
│  │                    │  React 18 + Tailwind CSS            │   │
│  │                    │  PWA · Dark Mode · EN/HI/MR         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  BACKEND           │  Next.js API Routes (Serverless)    │   │
│  │                    │  No separate server needed          │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  DATABASE          │  MongoDB Atlas (Mongoose ODM)       │   │
│  │                    │  Fail-fast · Mock fallback          │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  AUTH              │  JWT + bcrypt (httpOnly cookies)    │   │
│  │                    │  No third-party dependencies        │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ML / CV           │  MediaPipe Hands (tasks-vision)     │   │
│  │                    │  Euclidean kNN · On-device          │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  CHARTS            │  Recharts (React-native)            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  PDF               │  jsPDF (Client-side generation)     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  VIDEO             │  Cloudinary (free tier)             │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  DEPLOYMENT        │  Vercel + MongoDB Atlas             │   │
│  │                    │  Auto-scaling · Free tiers          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

> **⚠️ Honest note on the recognition model:** The recognizer is a **demo-grade Euclidean kNN** over 21 MediaPipe hand landmarks. It is deliberately simple so the prototype works entirely on-device and offline. **It is not production ML, and we don't claim it is.**
>
> The moat is *not* the recognizer. The differentiators are:
> 1. **ISLRTC-certified municipal vocabulary** — content, not the classifier
> 2. **Structured escalation to human interpreters** when confidence is low
> 3. **Deployment where service happens** — the 30-second Sanket Sahayak desk flow

---

## Setup Instructions

### Prerequisites

```
  ┌─────────────────────────────────────────┐
  │  Required:                              │
  │  ✓ Node.js 18+ and npm                 │
  │  ✓ Docker (recommended) OR MongoDB Atlas│
  │                                         │
  │  Optional:                              │
  │  ✓ Cloudinary account (video uploads)   │
  └─────────────────────────────────────────┘
```

### Quick Start (Docker)

```bash
# 1. Clone & Install
git clone https://github.com/rudrakhairnar16-bit/sanket.git
cd sanket
npm install

# 2. Start MongoDB
docker run -d --name sanket-mongo -p 27017:27017 mongo:7

# 3. Create .env
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/sanket
JWT_SECRET=sanket-dev-secret-change-in-production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=placeholder
EOF

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Quick Start (MongoDB Atlas)

```bash
# 1. Clone & Install
git clone https://github.com/rudrakhairnar16-bit/sanket.git
cd sanket
npm install

# 2. Create .env
cat > .env << EOF
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/sanket
JWT_SECRET=<any-random-string-at-least-32-chars>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
EOF

# 3. Run
npm run dev
```

### Docker Compose (All Services)

```bash
docker compose up -d
# App at http://localhost:3000
```

### Live Interpreter (Socket.IO)

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Socket.IO server (port 3001)
npm run socket
```

> Falls back to **Demo mode** when socket server is off — app still works.

### Seed Demo Data

```bash
curl -X POST http://localhost:3000/api/admin/seed
```

> ⚠️ This clears all existing data and populates with demo records.

### Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| `admin` | `Admin123` | Super Admin |
| `wateradmin` | `admin123` | Department Admin (Water Tax) |
| `ramesh` | `admin123` | Learner (12-day streak) |
| `sita` | `admin123` | Learner (8-day streak) |
| `amit` | `admin123` | Learner (5-day streak) |

---

## What's Real vs. Simulated

```
┌─────────────────────────────────────────────────────────────┐
│                    REALITY CHECK                              │
│                                                              │
│  ✅ REAL                                                     │
│  ├── Auth & streak logic (JWT, server-enforced)             │
│  ├── Quiz engine (MCQ with tracking)                        │
│  ├── Admin CRUD (create/edit/deactivate)                    │
│  ├── Charts & CSV export (Recharts)                         │
│  ├── Citizen feedback (public form → DB)                    │
│  ├── Spaced repetition (2-3 day window)                     │
│  ├── PDF certificate (jsPDF)                                │
│  ├── Hindi bilingual (70+ translations)                     │
│  ├── Dark mode (Tailwind dark:class)                        │
│  ├── ISL Dictionary (35 signs searchable)                   │
│  ├── Sound effects (Web Audio API)                          │
│  ├── ISL Quest leaderboard (XP-based)                       │
│  └── Game progress sync (MongoDB)                           │
│                                                              │
│  ⚠️ PARTIAL                                                  │
│  ├── QR code generation (links to live form)                │
│  ├── Webcam sign practice (demo-grade classifier)           │
│  └── Video content (placeholder URLs)                       │
│                                                              │
│  ❌ PLANNED                                                  │
│  ├── WhatsApp/SMS nudge integration                         │
│  └── WebRTC live interpreter relay                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Scalability Roadmap

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    PILOT → NATIONAL                                           │
│                                                                              │
│  PHASE 1          PHASE 2          PHASE 3          PHASE 4       PHASE 5  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  ┌──────────┐│
│  │  PILOT   │───▶│CITY-WIDE │───▶│ REGIONAL │───▶│  STATE   │─▶│ NATIONAL ││
│  │ Months   │    │ Months   │    │ Months   │    │  Year 2  │  │ Years    ││
│  │ 1-3      │    │ 4-6      │    │ 7-12     │    │          │  │ 3-5      ││
│  │          │    │          │    │          │    │          │  │          ││
│  │ 1 munici-│    │ 5-10     │    │ 5 Tier   │    │ Gujarat  │  │ 36       ││
│  │ pality   │    │ offices  │    │ 2/3      │    │ + Maha-  │  │ states   ││
│  │ 3 depts  │    │ 500+     │    │ cities   │    │ rashtra  │  │ & UTs    ││
│  │ 50-100   │    │ clerks   │    │ 5,000+   │    │ 25,000+  │  │ 500,000+ ││
│  │ clerks   │    │          │    │ clerks   │    │ certified│  │ trained  ││
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  └──────────┘│
│                                                                              │
│  Partners: GSRDM · Maharashtra SRC · DEPwD · ISLRTC Certified              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 90-Second Demo Script

```
┌─────────────────────────────────────────────────────────────────┐
│  THE MOMENT — 30-second service (0-40s)                        │
│  ─────────────────────────────────────────────────────────────  │
│  "A deaf citizen walks into a sarkari office. Watch this."     │
│  → App speaks first: "Namaste, I am Sanket Sahayak"           │
│  → Click "Water" → citizen bubble appears                      │
│  → Clerk taps reply "Water is over there" → ISL + voice       │
│  → Citizen signs "Namaste" → finish → +25 XP                   │
│  → "30 seconds. Not 30 days. That's the moment."              │
│                                                                 │
│  THE HABIT (40-60s)                                             │
│  ─────────────────────────────────────────────────────────────  │
│  → Open /dashboard: "Same clerk, same desk — habit."           │
│  → Point to Sahayak counter card + ISL Quest card              │
│                                                                 │
│  THE SCORE (60-80s)                                             │
│  ─────────────────────────────────────────────────────────────  │
│  → Login as admin → "The department sees it: real data."       │
│  → Analytics dashboard, charts, CSV, leaderboard               │
│                                                                 │
│  CLOSE (80-90s)                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  → "From 30 days of training to 30 seconds of service."       │
│  → Open floor for Q&A (QA-BANK.md)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Content Attribution

All ISL sign content is curated from the **Indian Sign Language Research and Training Centre (ISLRTC)** — an autonomous body under the Department of Empowerment of Persons with Disabilities, Ministry of Social Justice & Empowerment, Government of India.

- ISLRTC's public ISL Dictionary covers **10,000+ signed terms**
- We curate ~34 clerk-relevant terms for the demo
- Full attribution: *"Content sourced from ISLRTC, Ministry of Social Justice & Empowerment, Government of India."*

> **For production use:** Any original content beyond the ISLRTC set should be reviewed by Deaf community members or certified ISL interpreters before deployment.

---

## License

MIT — Built for educational purposes at Yuva 6.0 Hackathon.

---

## Team — Beyond Words

```
┌─────────────────────────────────────────────────────────────┐
│                     TEAM BEYOND WORDS                        │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  │   PJ     │ │   RK     │ │   MP     │ │   SP     │ │   SS     │
│  │ Pratiksha│ │  Rudra   │ │  Mahi    │ │  Suhani  │ │  Sheena  │
│  │ Jawale   │ │  Khaire  │ │  Panchal │ │  Pawar   │ │  Sharma  │
│  │          │ │          │ │          │ │          │ │          │
│  │Team Lead │ │Developer │ │Developer │ │Developer │ │Developer │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
│                                                              │
│  Dr. Kiran & Pallavi Patel Global University (KPGU)         │
│  B.Tech CSE · 2nd Year                                      │
└─────────────────────────────────────────────────────────────┘
```

---

<p align="center">
  <img src="https://img.shields.io/badge/Sanket-संकेत-6366f1?style=for-the-badge&labelColor=0b1120" alt="Sanket"/>
  <img src="https://img.shields.io/badge/ISL_for_Sarkari_Clerks-civic_tech-0b1120?style=for-the-badge&labelColor=1e293b&color=c9a961" alt="ISL"/>
  <img src="https://img.shields.io/badge/6_Lakh_Counters-not_a_classroom-0b1120?style=for-the-badge&labelColor=1e293b&color=4ade80" alt="6 Lakh Counters"/>
</p>
