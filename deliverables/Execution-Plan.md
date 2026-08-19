# Sanket — Execution Plan

## Team: Beyond Words (KPGU University)
## Track: Public Services — Indian Sign Language for All

---

## 1. Project Overview

Sanket is a civic tech platform that helps government clerks learn Indian Sign Language (ISL) through daily bite-sized lessons, gamified streaks, and admin compliance dashboards. The core product — **Sanket Sahayak** — enables a clerk to serve a deaf citizen in under 30 seconds at a municipal counter.

**Key differentiator:** When AI recognition confidence is low, the system escalates to a live human interpreter via relay — no citizen is ever dead-ended.

---

## 2. Implementation Phases

### Phase 1: Pilot — Single Municipality (Months 1–3)

| Action | Timeline | Success Metric |
|--------|----------|----------------|
| Deploy Sanket in 1 municipal office (e.g., Ahmedabad Municipal Corporation) | Week 1–2 | App live on 5+ clerk desks |
| Onboard 50–100 clerks from 3 departments (Water Tax, Property Tax, Health) | Week 3–4 | 50+ active accounts |
| Daily ISL lessons + streak tracking for all enrolled clerks | Month 1 onward | 70%+ daily lesson completion |
| Admin dashboard for compliance monitoring | Month 1 | Real-time analytics operational |
| QR code feedback at 5 service desks | Month 2 | 100+ citizen responses |
| Live Human Interpreter relay (simulated for demo) | Month 1 | Escalation flow functional |

### Phase 2: Scale — City-Wide Rollout (Months 4–6)

| Action | Timeline | Success Metric |
|--------|----------|----------------|
| Expand to all departments in pilot municipality (15–20 depts) | Month 4 | 200+ clerks onboarded |
| Onboard 500+ clerks across 5–10 municipal offices | Month 5–6 | 500+ active accounts |
| WhatsApp nudge integration for low-engagement clerks | Month 4 | 30% improvement in DAU |
| ISL Champion program: top 10% performers | Month 5 | 50+ champions identified |
| Monthly certificate generation | Month 4 | Auto-certificates at milestones |
| WebRTC live interpreter relay (production) | Month 5–6 | Real-time video relay operational |

### Phase 3: Regional Expansion (Months 7–12)

- Partner with 5 municipal corporations in Gujarat and Maharashtra
- Add regional language support (Marathi → Gujarati → Tamil → Bengali)
- PWA offline mode for areas with unreliable internet
- Department-level leaderboards with inter-city rankings
- Train-the-trainer program: 1 ISL Champion per office as peer trainer
- Target: 5,000+ clerks actively learning ISL

### Phase 4: State-Level Integration (Year 2)

- State government MoU for mandatory ISL training
- Pilot with Gujarat State Rural Development Mission (GSRDM)
- ISL proficiency certification recognized by state government
- Citizen feedback dashboard shared with district collectors
- Target: 25,000+ clerks certified in basic ISL

### Phase 5: National Rollout (Years 3–5)

- Platform adopted by Department of Empowerment of PwDs (DEPwD)
- Integration with ISLRTC for certified content pipeline (10,000+ signs)
- All 36 states/UTs onboarded
- Policy mandate: ISL training as part of annual performance review
- Target: 500,000+ government staff trained in ISL

---

## 3. Technical Architecture

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | One repo, fast builds, modern React |
| Backend | Next.js API Routes | No separate server; deploy as one unit |
| Database | MongoDB Atlas | Flexible schema; free tier |
| Auth | JWT + bcrypt (httpOnly cookies) | Simple, secure, no third-party |
| ML | MediaPipe Hands + Euclidean kNN | Browser-based hand landmark detection |
| Interpreter Relay | WebSocket (Socket.IO) + WebRTC | Real-time escalation to human interpreter |

---

## 4. Team & Roles

| Member | Role |
|--------|------|
| Pratiksha Jawale | Team Lead |
| Rudra Khaire | Developer |
| Mahi Panchal | Developer |
| Suhani Pawar | Developer |
| Sheena Sharma | Developer |

---

## 5. Budget

| Item | Cost |
|------|------|
| Platform license (500 clerk accounts) | ₹1,80,000/year |
| Technical support & maintenance | ₹70,000/year |
| **Total per municipality** | **₹2,50,000/year** |
| **Per clerk per year** | **₹500** |

---

*Dr. Kiran & Pallavi Patel Global University — B.Tech CSE, 2nd Year*
