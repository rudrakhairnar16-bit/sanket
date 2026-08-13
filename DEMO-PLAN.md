# Sanket — Inter-University Round Demo Plan (Friday)

**Pitch in one line:** *"From 30 days of training to 30 seconds of service."*
Sanket is not a classroom. Sanket is the moment a deaf citizen walks up to a clerk's desk and gets served — today, not after a training course.

**Demo spine: MOMENT → HABIT → SCORE**

---

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
- Show: **Sanket Sahayak** page → citizen signs (or click) → clerk one-tap reply → ISL chips + TTS → "You helped a citizen" (+25 XP)
- Upload to YouTube (unlisted) — link in slide footer

### Pre-warm on the demo laptop (Chrome) — 2 min
1. Open `http://localhost:3000/assist` once — let the greeting play.
2. Open `/interpreter/calibrate` and import `sanket-knn-model.json` (or train Yes / No / Wait / Thank You, 5+ samples each).
3. Leave tabs warm; MediaPipe WASM will load from CDN instantly on stage.

---

## 2. LIVE DEMO (5 min) — with human narration

| Time | What you do / say | Screen shows |
|------|-------------------|-------------|
| 0:00 | **"A deaf citizen walks into a sarkari office. Present her problem."** | Slide 1-2 |
| 0:30 | **LIVE: go to `/assist`** — app speaks first: *"Namaste, I am Sanket Sahayak."* | Welcome banner + ISL chips |
| 0:40 | Click demo sign **"Water"** (or sign on webcam) | Citizen bubble → clerk desk |
| 0:50 | Click **one-tap reply** "Water is over there" | ISL chips + TTS to citizen |
| 0:55 | "Bill payment is over here" → citizen signs **Namaste** | Full 30-second service. Say it aloud: **"30 seconds."** |
| 1:05 | **THE MOAT — LIVE:** "Recognizers stop here. We route." Sign a **low-confidence sign** (or click one the kNN won't fire on) → tap **📞 Call interpreter** → *searching…* → **"Live interpreter: Sanket Relay"** appears + interpreter message in chat | Escalation card goes violet, relay live |
| 1:25 | Tap **End relay** → "Escalation handled by a human" + count | Escalation logged |
| 1:30 | Click **Finish session** | **"You helped a citizen today 💙 +25 XP"** + counter |
| 1:50 | **"That's the moment. Now build the habit."** Open `/dashboard` | Sahayak counter card + ISL Quest card |
| 2:20 | **"And the one sign you practiced? Now the whole department."** Open admin `/admin` | Sugamya Score (shows **N escalations handled**) |
| 2:50 | **Slides 3-7** — solution, honest architecture, policy, cost, roadmap | 3 pillars → tech → policy |
| 4:30 | **"The differentiator: other teams built a recognizer. We built the routing — when recognition is low-confidence, a live human clerk who signs is one tap away. It's on the screen, it happened, it's logged."** | Architecture slide + escalation card |
| 4:45 | **Q&A (scripts in `presentation.html` / `QA-BANK.md`)** | |

### The 30-second moment — exact run (practice this!)
`/assist` → welcome speaks → click sign → clerk taps reply → ISL chips + voice → finish → +25 XP. **Under 60 seconds total. That is the demo.**

### The escalation moment — exact run (this is the moat, practice it!)
`/assist` → sign a sign the kNN won't read (or click one and let confidence stay low) → **📞 Call interpreter** → "Searching for a live interpreter…" → ~1.6s later **"Live interpreter: Sanket Relay"** + interpreter message lands in the chat → **End relay** → "Escalation handled by a human" + counter ticks.

---

## 2.5. LIVE HUMAN INTERPRETER — the escalation moment

### Setup — Simulated relay (single laptop, default, zero risk)
- No socket server needed. Tap **Call interpreter** → a simulated relay joins after ~1.6s.
- The card shows `Demo mode — a simulated interpreter joins on this machine.`
- **Use this as the primary demo.** It is 100% reliable on stage and the chat message + logged escalation tell the whole story.

### What the judges see
- A "can't read this sign" moment that does **not** dead-end — it escalates.
- The Sugamya Score formula now includes **10% "human safety net"** (escalations handled), so the score visibly rewards the relay, not just machine recognition.

---

## 3. BACKUP PLANS

| If camera fails | Solution |
|----------------|----------|
| No webcam permission | Use **Demo signs** on `/assist` — click buttons (designed for this) |
| No internet (MediaPipe CDN) | Pre-warm cache by visiting `/assist` once before demo |
| No Atlas DB | App auto-falls back to mock data — demo never crashes |
| Socket server / second laptop fails | **Simulated relay** — same button, same UI, same chat message |
| Laptop crash | Open `presentation.html` + recorded video on phone |

---

## 4. PRESENTATION TIPS

- **Never say "12.7M deaf are underserved" first.** Say *"A deaf citizen walked into a sarkari office today. She waited. She left without her answer."* — back it up with the number on the slide.
- **Demo in the first 90 seconds.** Slides exist to catch you, not to carry you.
- **Own the ML honestly before judges ask.** Lead with "we chose a demo-grade model on purpose — the moat is the certified content and the human escalation path, not the recognizer."
- **Explain "why municipal"** — municipal counters are the highest-traffic interface between government and deaf citizens; ASL school vocabulary doesn't cover "water bill" or "certificate".
- **Mention mock fallback + fail-fast DB** — "the demo cannot crash" is a real engineering point.
- **Close the loop:** open demo → counter card shows "1 assisted" — proof, not promise.
- **Use Chrome** (not Brave) for webcam. **Dark mode** looks better on projector.

---

## 5. FILES TO CARRY

- `sanket-knn-model.json` (trained model — export from your machine)
- `presentation.html` (open in Chrome, F11 for fullscreen)
- `presentation.pdf` (backup — print from browser Ctrl+P)
- Phone with recorded demo video (YouTube unlisted)

---

## 6. THE DEADLINE CHECKLIST

- [ ] `/assist` runs the 30-second moment start-to-finish, twice, with a stopwatch
- [ ] Escalation moment rehearsed: Call interpreter → relay joins → End relay → logged (simulated relay)
- [ ] Backup video recorded and uploaded (unlisted link in slide footer)
- [ ] Vercel deploy + seed (`curl -X POST /api/admin/seed`)
- [ ] `sanket-knn-model.json` exported and copied to demo laptop
- [ ] Rehearsed the "Meet Vaishnavi" story opener out loud, 3+ times
- [ ] Q&A scripts memorized — top 5 in `QA-BANK.md`

---

## 7. REHEARSAL PLAN (do this on a laptop, not a phone)

### Round 1 — "The Moment" (10 min, stopwatch required)
1. Open `http://localhost:3000/assist` in Chrome.
2. Start the stopwatch. Say the story opener out loud:
   *"A deaf citizen walks into a sarkari office. Watch this moment."*
3. Welcome speaks → click demo sign "Water" → tap reply "Water is over there" → click "Namaste" sign → Finish session.
4. Stop the stopwatch. **Target: under 60 seconds.**
5. Replay the video/do it again — cut time until smooth. The finish screen showing **+25 XP and the counter** is the photoshoot moment; pause on it.
6. **Add the escalation beat to Round 1** — after "Namaste", do Call interpreter → End relay once. Target +15 seconds. Pause on the violet "Live interpreter" card; that frame is the moat.

### Round 2 — Full run (15 min, projector/laptop + phone recording)
- Rehearse the exact table in §2 with a real timer per row.
- Mark down anything you fumbled (click target, load time, language switch) and fix it right now.
- Record ONE clean run on the phone — this becomes the backup video if the laptop dies.

### Round 3 — Q&A sparring (15 min, in team)
- One teammate plays judge. Ask all 5 questions from `QA-BANK.md` in rapid fire.
- Speaker answers with ONLY the first line of each script. If the "judge" pushes, extend.
- **Rule:** no answer longer than 20 seconds. Record and listen back.

### Round 4 — Judges' edge cases (10 min)
- "Start the demo from `/dashboard`" → can you get to the moment in 2 clicks?
- "Shut the internet off" → mock-fallback still works (blacklist wifi, reload).
- "Show it on THIS laptop" → does the Chrome build open and run without a rebuild? (It should — static export not required, but `npm run build` once locally so `next start` is available).
- Simulate camera denial → demo grid takes over (this is why we never depend on a camera).

### Stage-day checklist (tick the morning of)
- [ ] Laptop at 100%, Silver/Proseca off, browser on `/assist`
- [ ] Tabs pre-warmed: `/assist`, `/dashboard`, `/admin`, `/learn`
- [ ] Stopwatch app open (phone in front, screen off)
- [ ] `QA-BANK.md` printed on one card — first lines only
- [ ] Modem/router off-isolate decision known (fallback demo still works)
- [ ] Co-presenter knows the 4 handoff moments (§2 table timestamps)