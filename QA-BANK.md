# Sanket — Killer Q&A Bank (Inter-University Round)

Practice these until they come out without thinking. **First line is your answer. The rest is depth only if they push.**

---

## Q1. "This is just kNN with bundled samples. Where's the real ML?"

**Answer (10s):** "We deliberately shipped a demo-grade recognizer so the prototype works offline on any clerk's laptop — and we're honest about it, it's in our README. The moat is not the recognizer. The moat is what ships with it: ISLRTC-certified municipal vocabulary and a structured escalation to human interpreters when confidence is low."

**If they push:**
- The classifier is Euclidean kNN over 21 MediaPipe hand landmarks with wrist-relative normalization and temporal smoothing (15-frame window, 8-frame stability before committing).
- We have a calibration UI: a clerk trains their own samples in 60 seconds, so it's not a fixed bundled model.
- Roadmap (slide): move to a gesture-specific model, but recognition is table stakes — the differentiator is deployment: 6 Lakh counters, not a mobile app.

## Q2. "ISL isn't standard — hand signs differ across states. How do you handle that?"

**Answer (10s):** "We're not fighting ISL's diversity — we're standardizing only the municipal counter need. 34 signs cover the highest-frequency requests at a counter: water bill, certificate, complaint, form. Those are the same across every state office."

**If they push:**
- Content is sourced from ISLRTC, Ministry of Social Justice & Empowerment — the Government of India's recognized body.
- Non-verbal fallback: icons + text + TTS alongside every sign — the citizen is never blocked on a single handshape.
- Roadmap: regional sign variants as tagged module packs, town-by-town (this is our slide-6 rural plan).

## Q3. "Everyone's building a sign-language interpreter. What makes yours different?"

**Answer (10s):** "They built a recognizer — camera sees a sign, screen shows text. We built the routing: when recognition is low-confidence, a human clerk who signs is one tap away, live. Recognition is table stakes; the escalation loop is what actually serves the citizen."

**If they push:**
- Their interpreter ends when the model stops being right. Ours hands over to the only two people who can truly fail-safe: a deaf citizen and a trained clerk, matched live (WebSocket relay, demoed in the app).
- The recognizer is honest-kNN and it's fine: it's a scaffold for the counter flow (Sanket Sahayak), which is the 30-second unit of value.
- Add the missing point: "everyone shipped a demo for a phone. We shipped service for a government desk — 6 Lakh of them, where the counter IS the government."

## Q4. "How is this different from existing ISL apps / government services?"

**Answer (10s):** "ISL apps teach ISL. We're the only one we know that is built to *put a deaf citizen and a clerk on opposite sides of one counter* in under 30 seconds — the citizen signs, the clerk gets text and voice, the clerk replies, the citizen gets signs and voice. It's installed where service happens, not where learning happens."

**If they push:**
- Two-sided: a 30-second service mode on the clerk's desk (Sanket Sahayak) + a gamified habit builder (ISL Quest).
- Adoption signal: the counter card counts assisted citizens — municipalities can see the service actually happened.
- One competitor teaches with one handshape per word and no two-way desk flow.

## Q5. "An app doesn't fix the human problem — will clerks actually use it?"

**Answer (10s):** "The unit of engagement is 30 seconds, not a course. A clerk who thinks a course is too long has no reason to skip a 30-second assist on their own counter."

**If they push:**
- Every assist gives +25 XP to the clerk's quest profile on the same desk — the metric of 'did this counter serve a deaf citizen' is visible as a score.
- RPwD Act 2016 compliance is a legal motivator for the department; the narrative (Meet Vaishnavi) makes it personal for the clerk.
- We're honest: adoption is THE risk. That's why the pilot is one taluka talati office, not a district rollout (slide 7).

## Q6. "How do you scale — 6 Lakh counters across India?"

**Answer (10s):** "One taluka office, one talati, in the first 90 days — measure assisted-citizen count, not installs. The village-level office is where the counter *is* the government, and where a deaf citizen's barrier is the most acute."

**If they push:**
- No new hardware: runs in Chrome on existing office PCs; offline-capable; model fits in a JSON file.
- Train-the-trainer: one ISL-trained talati per circle becomes the local node (mirrors ASHA-worker model).
- Cost is per-assist, not per-license: content is ISLRTC-certified; unit economics are a laptop + a weekend, not a training course.
- Mobile grid is next; the backend already uses one shared data layer.

## Q7. "Where do the human interpreters come from? You can't staff 6 Lakh counters with them."

**Answer (10s):** "We don't staff every counter — every counter *trains* one. The interpreter network grows out of the same train-the-trainer loop: one ISL-trained clerk per office becomes the local relay, matched live over the same WebSocket, and ISLRTC-trained interpreters back up the hard cases."

**If they push:**
- Escalations are logged, not lost — each one tells the department where machine recognition fails so training effort goes where it's needed (and the Sugamya Score rewards handling them).
- A relay is a normal clerk already on payroll taking a call — no new workforce, no cost line, mirrors the ASHA-worker model.
- Hardware reality: it's a video call to a trained human. The infrastructure we ship (WebSocket rooms, matching, rating) is exactly the plumbing a district helpline needs later.

## Q8. "Your score is just completion. How do you prove service actually improved?"

**Answer (10s):** "The score now has a human-safety-net leg: 10% of the Sugamya Score is 'escalations handled' — the times a clerk admitted the machine wasn't enough and a human completed the service. The score rewards honesty, not just completion."

**If they push:**
- Formula: 45% compliance + 30% citizen satisfaction + 15% participation + **10% human safety net (escalations handled)**.
- Escalations appear live in the admin dashboard — the department sees machine failure as a number it can train against, instead of a silent dead-end at the counter.
- The recognizer staying honest-kNN is a feature: it produces escalations, and escalations are the pilot's real learning signal.

---

## Q9. "How does the live interpreter relay actually work technically?"

**Answer (10s):** "When the kNN confidence drops below 0.45, a 'Call interpreter' button appears. One tap opens a WebSocket room — the citizen and a trained interpreter join, and they communicate via text chat with ISL chips. Future: WebRTC video for full sign language relay."

**If they push:**
- WebSocket (Socket.IO) handles room creation, join/leave events, and message routing. No media server needed for text relay.
- Fallback chain: AI recognition → low confidence → Call interpreter → WebSocket room → text chat with ISL chips (minimum viable). WebRTC video is the next step.
- Every relay session is logged: duration, outcome, interpreter rating. This data feeds the Sugamya Score and tells departments where AI fails so training can focus there.
- The relay is not a new product — it's the same WebSocket infrastructure used for the clerk-to-clerk training network. Scaling the relay means scaling the trained clerk base, not adding call center staff.

## Q10. "Is the live interpreter a real product or just a demo feature?"

**Answer (10s):** "Right now it's a simulated relay for demo reliability — same UI, same chat message, same logged escalation. The production version uses WebRTC video and is on our Phase 2 roadmap, after the pilot proves adoption."

**If they push:**
- The simulated relay shows the exact same UI flow as the production version — the judges see the escalation card, the relay status, the chat message, and the logged outcome. Nothing changes except the backend connection.
- Production roadmap: Phase 1 (Months 1-3) proves adoption with simulated relay. Phase 2 (Months 4-6) adds WebRTC video and real interpreter matching.
- The architecture is already designed for it: WebSocket rooms, session logging, Sugamya Score integration. The plumbing is in place; we just need to plug in the video stream.
- Key point: "We didn't build a demo feature. We built the escalation architecture and demoed it with simulated relay. The production version is a config change, not a rewrite."

- "Every team has an interpreter. What's yours?" → "They recognize a sign. We route a citizen — machine first, human clerk the moment confidence drops."
- "Why municipal?" → "Because the counter is where government meets a deaf citizen, and it's the one place nobody is built to serve them today."
- "What's your metric?" → "Assisted citizens per counter per month. Not sign-ups."
- "What happens when the recognizer is wrong?" → "It's a feature: one tap calls a live human clerk, and the escalation is logged into the department score."
- "What did you build this week?" → "The Sanket Sahayak desk flow — a full two-way service turn in one screen, plus honest-product packaging for judges." (adapt as needed)
- "Biggest honest risk?" → "Clerk adoption — which is exactly why the pilot is a single office, measured on assists."