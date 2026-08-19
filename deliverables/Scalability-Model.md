# Sanket — Scalability Model

## From One Municipal Office to 500,000 Trained Staff

---

## 1. Scaling Philosophy

Sanket scales by **proving assists, not installs**. The unit of value is one served citizen at one counter — not one downloaded app, not one completed course.

```
Hackathon MVP → Single Municipality Pilot → City-Wide Rollout → State Integration → National Deployment
```

---

## 2. Phase-wise Scalability

### Phase 1: Pilot (Months 1–3)
- **Scope:** 1 municipality, 3 departments
- **Users:** 50–100 clerks
- **Infrastructure:** Vercel (serverless) + MongoDB Atlas (free tier)
- **Cost:** ₹2.5L/year total, ₹500/clerk/year
- **Validation metric:** 70%+ daily lesson completion rate

### Phase 2: City-Wide (Months 4–6)
- **Scope:** 1 municipality, all departments (15–20 depts)
- **Users:** 500+ clerks across 5–10 offices
- **Infrastructure:** Vercel Pro + MongoDB Atlas M10
- **Cost scaling:** Linear — same ₹500/clerk/year
- **Validation metric:** 50%+ clerks reach 30-day streak

### Phase 3: Regional (Months 7–12)
- **Scope:** 5 Tier 2/3 cities in Gujarat + Maharashtra
- **Users:** 5,000+ clerks
- **Infrastructure:** Vercel Enterprise + MongoDB Atlas M20 + CDN
- **Regional variants:** Gujarati, Marathi sign packs
- **Validation metric:** 5,000+ clerks actively learning ISL

### Phase 4: State-Level (Year 2)
- **Scope:** Gujarat + Maharashtra state-wide
- **Users:** 25,000+ certified clerks
- **Infrastructure:** Dedicated MongoDB cluster + regional CDN
- **Policy integration:** State government MoU, GSRDM partnership
- **Validation metric:** ISL certification recognized by state government

### Phase 5: National (Years 3–5)
- **Scope:** All 36 states/UTs
- **Users:** 500,000+ trained government staff
- **Infrastructure:** Multi-region deployment + ISLRTC content pipeline
- **Policy integration:** DEPwD national adoption
- **Validation metric:** National accessibility dashboard operational

---

## 3. Technical Scaling Model

| Component | Pilot | City-Wide | Regional | State | National |
|-----------|-------|-----------|----------|-------|----------|
| Hosting | Vercel Free | Vercel Pro | Vercel Enterprise | Dedicated | Multi-region |
| Database | Atlas Free | Atlas M10 | Atlas M20 | Atlas M30 | Atlas M40+ |
| ML Model | On-device kNN | On-device kNN | On-device kNN | On-device kNN | On-device kNN + fine-tuned |
| Content | 34 signs | 34 signs | 34 + regional packs | 50+ signs | 10,000+ ISLRTC signs |
| Interpreter | Simulated relay | Simulated relay | WebRTC relay | WebRTC + matching | National relay network |
| Nudges | — | WhatsApp | WhatsApp + SMS | WhatsApp + SMS | Full comms suite |

---

## 4. Cost Scaling

| Scale | Users | Annual Cost | Per User/Year |
|-------|-------|-------------|---------------|
| Pilot | 100 | ₹2,50,000 | ₹2,500 |
| City-Wide | 500 | ₹2,50,000 | ₹500 |
| Regional | 5,000 | ₹12,00,000 | ₹240 |
| State | 25,000 | ₹45,00,000 | ₹180 |
| National | 5,00,000 | ₹5,00,00,000 | ₹100 |

**Economies of scale:** Marginal cost per clerk decreases as the platform amortizes fixed infrastructure costs across more users. Content is ISLRTC-certified (government-owned), so no per-user licensing fees.

---

## 5. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Clerk adoption failure | Pilot at single office; measure assists, not installs |
| AI recognition poor quality | Honest kNN + live human interpreter relay as safety net |
| Internet connectivity in rural areas | Offline-first PWA; core flow works without network |
| ISL regional variation | Regional variant packs; calibration per clerk; human relay fallback |
| MongoDB downtime | Mock data fallback — demo cannot crash |

---

## 6. Success Metrics Dashboard

| Metric | Pilot Target | National Target |
|--------|-------------|-----------------|
| Daily Active Learners (DAL) | >70% | >60% |
| 30-day Streak Achievement | >50% | >40% |
| Citizen Satisfaction Score | >4.0/5.0 | >4.0/5.0 |
| Assisted Citizens per Counter | 5+/month | 10+/month |
| Escalation Resolution Rate | >90% | >95% |

---

*Dr. Kiran & Pallavi Patel Global University — Team Beyond Words*
