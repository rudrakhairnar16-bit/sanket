# Sanket — Inter-University Round Demo Plan (Friday)

## 1. BEFORE FRIDAY (today/tomorrow)

### Deploy on Vercel (15 min)
```powershell
cd C:\Users\Rudra\Desktop\sanket
npm i -g vercel
vercel login          # opens browser — login with GitHub
vercel link           # select rudrakhairnar16-bit/sanket
vercel env add MONGODB_URI   # paste Atlas URI from .env
vercel env add JWT_SECRET    # paste JWT_SECRET from .env
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   # "placeholder"
vercel --prod
```

### After deploy — seed DB
```powershell
curl -X POST https://your-app.vercel.app/api/admin/seed
```

### Record backup video (10 min)
- Phone recording of screen + webcam
- Show: Learn page → Train 4 signs → Interpreter → Clerk replies → TTS
- Upload to YouTube (unlisted) — link in slide footer

### Train & export model
- Open `http://localhost:3000/learn` in Chrome
- Train Yes / No / Wait / Thank You (5+ samples each)
- Click **📤 Export Model** → save `sanket-knn-model.json`
- Copy to demo laptop → open `/interpreter/calibrate` → **📥 Import Model**

---

## 2. DEMO FLOW (5 min)

| Time | Action | Screen shows |
|------|--------|-------------|
| 0:00 | **Slide 1-2** (Problem) | 18M deaf · <5% clerks |
| 0:30 | **Slide 3** (Solution) | 3 pillars |
| 1:00 | **Slide 4** (Architecture) | Tech stack |
| 1:30 | **Slide 5-7** (Policy/Roadmap) | KPI table, cost, phases |
| 2:30 | **LIVE DEMO** — switch to browser | |
| 2:35 | Open `/learn` → Webcam Practice | Show trained signs |
| 3:00 | Go to `/interpreter` | Two-way chat |
| 3:30 | Click Demo sign "Water" | Shows meaning + ISL symbol |
| 4:00 | Type "Your bill is ready" | ISL chips appear |
| 4:15 | Click **Speak** | TTS in Hindi |
| 4:30 | Open `/dashboard` | Streak, XP, leaderboard |
| 4:45 | **Slide 9-10** (Thank You) | Q&A |

---

## 3. BACKUP PLANS

| If camera fails | Solution |
|----------------|----------|
| No webcam permission | Use **Demo signs** on `/interpreter/calibrate` — click buttons |
| No internet (MediaPipe CDN) | Pre-warm cache by visiting `/learn` once before demo |
| Laptop crash | Open `presentation.html` + recorded video on phone |
| Atlas DB down | App auto-falls back to mock data — works anyway |

---

## 4. PRESENTATION TIPS

- **Start with the problem** — 18M deaf Indians gets attention
- **Demo first, slides later** — judges remember what works
- **Explain "why municipal"** — this is NOT generic ASL, it's built for clerks
- **Mention mock fallback** — "never crashes" is a strong engineering point
- **Use Chrome** (not Brave) for webcam — Edge also works
- **Dark mode** — looks better on projector

---

## 5. FILES TO CARRY

- `sanket-knn-model.json` (trained model — export from your machine)
- `presentation.html` (open in Chrome, F11 for fullscreen)
- `presentation.pdf` (backup — print from browser Ctrl+P)
- Phone with recorded demo video (YouTube unlisted)
