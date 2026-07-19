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
| **ML** | MediaPipe Hands (tasks-vision) | Browser-based hand landmark detection |
| **Deployment** | Vercel + MongoDB Atlas | Free tiers for both |

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- **Docker** (recommended — for local MongoDB) OR MongoDB Atlas account (free tier)
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

### 5. Seed Demo Data
> **⚠️ This clears all existing data and populates the database with demo records.**

Visit: `POST /api/admin/seed`

Or use curl:
```bash
curl -X POST http://localhost:3000/api/admin/seed
```

### 6. Demo Accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Super Admin |
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

## Live Demo

**Deployed at:** `https://sanket.vercel.app` (after Vercel deploy)

| Login | URL |
|-------|-----|
| Clerk Dashboard | `/dashboard` |
| Admin Panel | `/admin` |
| ISL Quest (Public) | `/learn` — no login required |

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
[OPEN sanket on laptop, already logged out]

1. **Login as Clerk** (0-15s)
   → Username: "ramesh", Password: "admin123"
   → "This is Ramesh from Water Tax department. He starts his day here."

2. **Complete Daily Lesson** (15-45s)
   → Watch the ISL video (click play on placeholder)
   → "One short video, one question — takes 3 minutes."
   → Select answer, click Submit
   → "Correct! His streak updates to 13 days."

3. **Show Streak & Leaderboard** (45-60s)
   → Point to streak counter: "13-day streak — gamification drives daily habit."
   → Click Leaderboard: "Water Tax department leads this week. Healthy inter-department competition."

4. **Switch to Admin** (60-75s)
   → Sign out, login as "admin"
   → "The admin dashboard shows compliance across all departments."
   → Point to chart: "Real-time completion data, exportable as CSV."

5. **Citizen Impact** (75-90s)
   → Click QR Codes tab: "Each desk has a QR code. Citizens scan and answer: did this clerk try to use sign language?"
   → "We move from measuring training to measuring real-world impact."
   → "Sanket — making public services truly accessible, 3 minutes at a time."
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
