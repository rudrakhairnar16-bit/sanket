# Team Setup Guide

## Step 1: Install Prerequisites

- **Node.js** (v18+): https://nodejs.org
- **Docker Desktop**: https://www.docker.com/products/docker-desktop/
- **Git**: https://git-scm.com/
- **VS Code** (recommended): https://code.visualstudio.com/

---

## Step 2: Clone the Repository

Open **PowerShell/Terminal** and run:

```bash
git clone https://github.com/rudrakhairnar16-bit/sanket.git
cd sanket
```

---

## Step 3: Install Node Dependencies

```bash
npm install
```

---

## Step 4: Start MongoDB (via Docker)

Make sure **Docker Desktop** is running, then:

```bash
docker run -d --name sanket-mongo -p 27017:27017 mongo:7
```

To verify MongoDB is running:
```bash
docker ps
```

---

## Step 5: Create .env File

Create a file named `.env` inside the `sanket` folder with this content:

```
MONGODB_URI=mongodb://localhost:27017/sanket
JWT_SECRET=sanket-dev-secret-change-in-production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=placeholder
```

---

## Step 6: Start the App

```bash
npm run dev
```

Wait until you see: `✓ Ready in ...` (usually 5-10 seconds)

---

## Step 7: Seed Demo Data

Open a **new PowerShell/Terminal** window and run:

```bash
curl.exe -X POST http://localhost:3000/api/admin/seed
```

You should see:
```json
{"message":"Seed data created successfully","stats":{"users":14,"learners":12,"modules":5,"completions":36}}
```

---

## Step 8: Open the App

Go to **http://localhost:3000** in your browser.

---

## Demo Accounts

| Name | Username | Password | Role |
|---|---|---|---|
| Super Admin | `admin` | `Admin123` | Full access to everything |
| Ramesh | `ramesh` | `admin123` | Learner (12-day streak) |
| Sita | `sita` | `admin123` | Learner (8-day streak) |
| Amit | `amit` | `admin123` | Learner (5-day streak) |

---

## Quick Demo (for testing)

1. Open http://localhost:3000
2. Login as `ramesh` / `admin123`
3. Select an answer → Click **Submit**
4. Click **Leaderboard** in nav
5. Logout (top-right) → Login as `admin` / `Admin123`
6. Explore the **Dashboard** and **Modules** tabs

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm run dev` fails | Make sure you ran `npm install` first |
| MongoDB connection error | Check Docker Desktop is running, then `docker start sanket-mongo` |
| Seed endpoint returns auth error | Make sure `.env` file exists with `JWT_SECRET` |
| Port 3000 already in use | Kill the other app or change port in package.json |
| Docker not found | Install Docker Desktop from https://www.docker.com |

---

Need help? Ask Rudra or the team lead on WhatsApp/Teams.
