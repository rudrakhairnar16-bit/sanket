# Deploy to Vercel — 5 min setup

## Prerequisites
- ✅ Node 20.x
- ✅ Build passes (`npx next build`)
- ✅ `.env` has real MongoDB Atlas URI + JWT_SECRET

## Steps (run in project root)

```powershell
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login (opens browser — you must complete this)
vercel login

# 3. Link project (select "rudrakhairnar16-bit/sanket")
vercel link

# 4. Set environment variables on Vercel (copy from .env)
vercel env add MONGODB_URI
# paste: mongodb+srv://sanket:Sanket16907@cluster0.2lbkumn.mongodb.net/?appName=Cluster0
vercel env add JWT_SECRET
# paste: MF-5*n|NtRRT!$ja@Fu1W=.vD>-A4h^Ha{ZC[x>P
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# paste: placeholder

# 5. Deploy
vercel --prod
```

## After deploy
```powershell
# Seed the Atlas database with initial modules + admin user
curl -X POST https://your-app.vercel.app/api/admin/seed
```

## Notes
- The app falls back to mock data if Atlas is unreachable — never crashes
- Node version pinned to 20.x in `vercel.json`
- Local `.env` is NOT uploaded — you must add env vars manually via `vercel env add`
