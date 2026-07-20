# Deploy to Vercel (live with real MongoDB Atlas)

The local network blocks Atlas connections (DNS SRV refused / TLS intercepted).
Deploying to Vercel lets the app reach Atlas from Vercel's network.

## One-time setup
1. Install CLI:  `npm i -g vercel`
2. Login:        `vercel login`
3. Link project: `vercel link`   (select "Sanket" repo / create new)

## Set environment variables on Vercel
Run these (replace values with your real ones):
  vercel env add MONGODB_URI
  vercel env add JWT_SECRET
  vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

Use the same Atlas URI already in your local `.env`:
  mongodb+srv://sanket:Sanket16907@cluster0.2lbkumn.mongodb.net/?appName=Cluster0

JWT_SECRET: any random string >= 32 chars, e.g.  `openssl rand -base64 32`

## Deploy
  vercel --prod

Vercel will build and give you a URL. The app will then use REAL Atlas data
(login/register/leaderboard), not the local mock fallback.

## Notes
- The app already falls back to mock data if Atlas is unreachable, so it never crashes.
- NODE version pinned to 20.x in vercel.json for build stability.
