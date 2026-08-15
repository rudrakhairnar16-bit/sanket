# Sanket (संकेत)

**ISL for Sarkari Clerks** — A civic tech platform helping government clerks learn Indian Sign Language through daily bite-sized lessons, gamified streaks, and admin compliance dashboards.

Built for **Yuva 6.0 Hackathon** by Team KPGU.

---

## The Problem

- **~3.5 million** government clerks serve in municipal offices across India
- **~63 million** Indians have hearing/speech disabilities (Census 2011)
- Most citizens with hearing/speech disabilities struggle to access basic public services because clerks don't know sign language
- The **Rights of Persons with Disabilities Act, 2016** and **Accessible India Campaign (Sugamya Bharat Abhiyan)** mandate accessibility, but ground-level adoption is minimal

Sanket makes ISL training frictionless — **3 minutes a day**, integrated into the clerk's workflow.

---

## Features

### 🙏 Sanket Sahayak — Help a citizen in 30 seconds (`/assist`)
- **Public, no login** — lives on the counter, not in a classroom
- **Welcome-first flow**: the app speaks before the citizen has to — text, ISL chips, and TTS in EN/HI/MR
- **Two-way desk flow**: citizen signs (webcam or one-tap demo) → clerk sees text + hears it → clerk taps a one-tap reply or types → ISL chips + voice back to the citizen
- **14 desk-ready one-tap replies**: "Namaste", "Please wait", "Please fill this form", "Bill payment is over here", "Your complaint is registered"…
- **+25 XP + assist counter** per finished session (`sanket-assist-count`) — the counter card on the clerk dashboard shows real assists
- **Auto demo fallback**: no camera/model? Clickable sign grid — the flow never crashes on stage

### 👨‍🏫 Learner View
- **Daily ISL lesson**: Watch a short video → answer one MCQ
- **Streak tracking**: Build daily streaks with visual progress
- **Gamification**: Department vs. department leaderboard, milestone badges
- **Webcam practice**: Real-time hand sign detection using MediaPipe (5 signs: Namaste, Thank You, Wait, Yes, No)
- **Spaced repetition**: Wrong answers resurface 2-3 days later for review
- **Milestone certificate**: Auto-generate PDF certificate at 7/14/21/30 day streaks

### 📊 Admin Dashboard
- **Compliance analytics**: Department-wise completion rates with bar charts
- **Leaderboard**: Top-performing clerks across departments
- **Content management**: Create/edit/activate/deactivate lesson modules
- **CSV export**: Download compliance data for reporting
- **QR code generator**: Generate citizen feedback QR codes for each desk
- **Role hierarchy**: Super Admin (all departments) vs. Department Admin

### 📱 Citizen Feedback Loop
- QR code at each desk links to a one-question form
- Citizens answer: *"Did this staff member try to use sign language?"*
- Feedback metrics shown on admin dashboard (converts training completion → real-world impact)

### 🌐 ISL Quest — Public Learning (`/learn`)
- **No login required** — open to all citizens
- **Flashcard Mode**: 3D card flip animation, 35 signs across 6 categories (Greetings, Office, Emergency, Daily Life, Numbers, Questions)
- **Quiz Challenge**: MCQ tests with scoring (+20 XP correct, +5 XP wrong)
- **Webcam Practice**: Real-time MediaPipe hand tracking for 5 signs (+50 XP)
- **XP & Leveling**: Level 1-20 progression system with 10 unlockable badges
- **Daily Streak**: Tracks consecutive practice days
- **ISL Dictionary**: Search any sign by name or meaning with category filter
- **Dark Mode**: Toggle for comfortable evening learning
- **Hindi Bilingual**: Switch between English and हिंदी UI
- **Sound Effects**: Web Audio API chimes for correct/incorrect answers
- **Citizen Leaderboard**: Top learners ranked by XP on `/learn`
- **Progress Sharing**: Share achievements on WhatsApp

### 👤 New User Onboarding
- First-time users see a welcome banner with 3 intro tasks
- First sign "Namaste" auto-assigned (not random)
- Progress tracking for onboarding completion

### 🔄 Game Progress Sync
- Logged-in users' ISL Quest progress auto-syncs to MongoDB
- Leaderboard shows both daily lesson streaks and ISL Quest XP
- Data merges across devices (takes max XP on conflict)
- "Save Progress" button in dashboard for manual sync

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS | One repo, fast builds, modern React |
| **Backend** | Next.js API Routes | No separate server; deploy as one unit |
| **Database** | MongoDB + Mongoose | Flexible schema; free Atlas tier |
| **Auth** | JWT + bcrypt (httpOnly cookies) | Simple, secure, no third-party |
| **Video** | Cloudinary (free tier) | Upload, transcode, CDN delivery |
| **Charts** | Recharts | React-native charting |
| **PDF** | jsPDF | Client-side certificate generation |
| **ML** | MediaPipe Hands (tasks-vision) + Euclidean kNN | Browser-based hand landmark detection |

### ⚠️ Honest note on the recognition model

The recognizer is a **demo-grade Euclidean kNN** over 21 MediaPipe hand landmarks (wrist-relative normalization, 15-frame temporal smoothing). It is deliberately simple so the prototype works entirely on-device and offline on any clerk's laptop. **It is not production ML, and we don't claim it is.**

We believe the moat is *not* the recognizer. The differentiators are:
1. **ISLRTC-certified municipal vocabulary** — content, not the classifier
2. **Structured escalation to human interpreters** when confidence is low (roadmap)
3. **Deployment where service happens** — the 30-second Sanket Sahayak desk flow

Recognition quality is table stakes and will improve; adoption at 6 lakh counters is the product.
| **Deployment** | Vercel + MongoDB Atlas | Free tiers for both |

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- **Docker** (recommended — for local MongoDB + one-command setup) OR MongoDB Atlas account (free tier)
- Cloudinary account (free tier) — optional, for video uploads

### 1. Clone & Install
```bash
git clone https://github.com/rudrakhairnar16-bit/sanket.git
cd sanket
npm install
```

### 2. Start MongoDB (choose one)

**Option A — Docker (recommended, easiest):**
```bash
docker run -d --name sanket-mongo -p 27017:27017 mongo:7
```

**Option B — MongoDB Atlas (free tier):**
Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com) and get your connection string.

### 3. Environment Variables
Create a `.env` file in the root directory:

**If using Docker (local):**
```env
MONGODB_URI=mongodb://localhost:27017/sanket
JWT_SECRET=sanket-dev-secret-change-in-production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=placeholder
```

**If using MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/sanket
JWT_SECRET=<any-random-string-at-least-32-chars>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. (Optional) Run All Services with Docker Compose

```bash
docker compose up -d
```

This starts MongoDB + the Next.js app in one command. The app will be available at `http://localhost:3000`.

---

### 6. Live Interpreter (Socket.IO)

The interpreter feature uses a **separate Socket.IO server** for real-time WebRTC signaling:

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Socket.IO server (port 3001)
npm run socket
```

**Production:** The Socket.IO server runs as a standalone Node process. Deploy it to Railway / Fly.io alongside your Vercel deployment:
```bash
node server-socket.js
```

The interpreter falls back to **Demo mode** when the socket server is off — the app still works for walkthroughs.

---

### 7. Seed Demo Data
> **⚠️ This clears all existing data and populates the database with demo records.**

Visit: `POST /api/admin/seed`

Or use curl:
```bash
curl -X POST http://localhost:3000/api/admin/seed
```

### 8. Demo Accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `Admin123` | Super Admin |
| `wateradmin` | `admin123` | Department Admin (Water Tax) |
| `ramesh` | `admin123` | Learner (12-day streak) |
| `sita` | `admin123` | Learner (8-day streak) |
| `amit` | `admin123` | Learner (5-day streak) |

*(All learner accounts use password `admin123`)*

---

## What's Real vs. Simulated (for Demo)

| Feature | Status | Notes |
|---|---|---|
| Auth & streak logic | ✅ Real | Full JWT auth, server-enforced 1 module/day |
| Quiz engine | ✅ Real | MCQ with correct/incorrect tracking |
| Admin CRUD | ✅ Real | Create/edit/deactivate modules |
| Charts & CSV export | ✅ Real | Recharts, client-side CSV generation |
| Webcam sign practice | ✅ Real (demo) | MediaPipe + rule-based classifier for 5 signs. Not a production-grade model — use ISLRTC-certified content for deployment |
| Citizen feedback | ✅ Real | Public form, stores in DB |
| Spaced repetition | ✅ Real | 2-3 day window for wrong-answer review |
| PDF certificate | ✅ Real | jsPDF-generated with streak info |
| QR code generation | ⚠️ Partially real | QR links to live form; print-ready download provided |
| Hindi bilingual UI | ✅ Real | 70+ translation map across all learner screens |
| Dark mode | ✅ Real | Tailwind `dark:class` — toggle on learn page, dashboard, admin |
| ISL Dictionary (search) | ✅ Real | 35 signs searchable by name/meaning with category filter |
| Sound effects | ✅ Real | Web Audio API tones for quiz correct/incorrect |
| ISL Quest leaderboard | ✅ Real | XP-based ranking with top-7 display |
| Game progress sync | ✅ Real | Auto-syncs to MongoDB for logged-in users |
| WhatsApp/SMS nudge | ❌ Planned | Pitch mentions this as next step; not implemented |
| Video content | ⚠️ Placeholder | Demo uses placeholder video URLs. Real content should use ISLRTC dictionary |

---

## Content Attribution

All ISL sign content is curated from the **Indian Sign Language Research and Training Centre (ISLRTC)** — an autonomous body under the Department of Empowerment of Persons with Disabilities, Ministry of Social Justice & Empowerment, Government of India.

- ISLRTC's public ISL Dictionary covers **10,000+ signed terms**
- We curate ~10-15 clerk-relevant terms for the demo
- Full attribution: *"Content sourced from ISLRTC, Ministry of Social Justice & Empowerment, Government of India."*

> **For production use:** Any original content beyond the ISLRTC set should be reviewed by Deaf community members or certified ISL interpreters before deployment.

---

## Production Seed

After deploying to production, seed the database by running the seed script:

```bash
# Set your MongoDB Atlas URI (or use .env with MONGODB_URI)
export MONGODB_URI="mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/sanket?retryWrites=true&w=majority"

# Run the standalone seed script
npx tsx scripts/seed.ts
```

This creates:
- **2 admins**: `admin` / `Admin123`, `wateradmin` / `admin123`
- **12 learners**: `ramesh`, `sita`, `amit`, `priya`, `vikram`, `anita`, `rajesh`, `neha`, `suresh`, `kavita`, `deepak`, `pooja` (all password: `admin123`)
- **5 modules**: Thank You, Please Wait, Sign Here, Water Bill, Submit
- **Completion history** for learners with streaks

> The API endpoint `POST /api/admin/seed` does the same but requires running inside Next.js. Use the script for production deployments.

---

## Live Demo

> **⚠️ Deploy status:** The URLs below are NOT live yet. `sanket.vercel.app` belongs to an unrelated project and `sanket-isl.vercel.app` is a 404. **Run from `localhost:3000` for the demo**, and update this section after the fresh Vercel deploy + `POST /api/admin/seed`.

**Used in the demo (local):** `http://localhost:3000`

| Login | URL |
|-------|-----|
| Sanket Sahayak (public) | `/assist` |
| Clerk Dashboard | `/dashboard` |
| Admin Panel | `/admin` |
| ISL Quest (Public) | `/learn` |
| Citizen Feedback | `/feedback/[username]` |
| Playground (guest) | `/login` → click "Play ISL Quest" |

> **Tip:** Visit `/learn` first to try ISL Quest without logging in! 🎮

---

## Scalability Narrative

```
Hackathon MVP → Single Municipality Pilot → Statewide Rollout
```

1. **Next step**: WhatsApp/SMS nudge integration (Twilio API) — clerks respond better to mobile alerts
2. **Scale**: Admin hierarchy already supports multi-department scope; add district/state heatmap
3. **Content**: Partner with ISLRTC for certified content pipeline
4. **Outcome**: Shift from measuring *training completion* to measuring *on-ground usage* via citizen feedback

---

## 90-Second Judge Demo Script

```
[OPEN http://localhost:3000/assist in Chrome, logged out]

1. THE MOMENT — 30-second service (0-40s)
   → "A deaf citizen walks into a sarkari office. Watch what happens."
   → The app speaks first: "Namaste, I am Sanket Sahayak."
   → Click the demo sign "Water" → citizen bubble appears on the clerk desk
   → Clerk taps one-tap reply "Water is over there" → ISL chips + voice
   → Citizen signs "Namaste" → clerk says "Namaste" back
   → Click Finish Session → "You helped a citizen today 💙 +25 XP"
   → "30 seconds. Not 30 days. That's the moment."

2. THE HABIT (40-60s)
   → Open /dashboard: "The same clerk, the same desk — Sanket makes it a habit."
   → Point to Sahayak counter card + ISL Quest card (streaks, XP, badges)

3. THE SCORE (60-80s)
   → Sign out, login as "admin"
   → "And now the department sees it: assisted citizens, compliance, real data."
   → Point to the analytics dashboard (charts, CSV export, leaderboard)

4. CLOSE (80-90s)
   → "From 30 days of training to 30 seconds of service. Sanket."
   → Open floor for Q&A (answers in QA-BANK.md)
```

---

## License

MIT — Built for educational purposes at Yuva 6.0 Hackathon.

## Team

- **Rudra Khaire**
- **Pratiksha Jawale** (Team Leader)
- **Mahi Panchal**
- **Suhani Pawar**
- **Sheena Sharma**

Dr. Kiran and Pallavi Patel Global University (KPGU) — B.Tech CSE, 2nd Year
