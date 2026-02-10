# 🚀 Production Deployment Guide

## Architecture Overview

- **Frontend**: Next.js → Deployed on **Vercel**
- **Backend**: Node.js + Playwright → Deployed on **Railway** or **Render**
- **Communication**: HTTPS REST API

---

## Backend Deployment (Railway/Render)

### Option 1: Railway (Recommended)

1. **Create Railway Account**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Select** `backend-prod` folder as root directory
4. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=5
   ```
5. **Deploy** - Railway will automatically use the Dockerfile

### Option 2: Render

1. **Create Render Account**: https://render.com
2. **New Web Service** → Connect GitHub repo
3. **Configure**:
   - **Build Command**: `npm install && npx playwright install chromium`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend-prod`
4. **Environment Variables**: Same as Railway
5. **Deploy**

---

## Frontend Deployment (Vercel)

1. **Create Vercel Account**: https://vercel.com
2. **Import Project** → Select GitHub repo
3. **Configure**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
4. **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
   ```
   ⚠️ **Replace with your actual backend URL from Railway/Render**
5. **Deploy**

---

## Post-Deployment Setup

### 1. Update CORS in Backend

After deploying frontend, update the backend `FRONTEND_URL` environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```

### 2. Test Deployment

1. Open your Vercel frontend URL
2. Login with MITS credentials
3. Verify attendance fetches correctly
4. Check Network tab for HTTPS communication

---

## Security Checklist ✅

- [ ] Password NEVER stored in localStorage
- [ ] Only register number cached
- [ ] HTTPS communication (automatic on Vercel/Railway)
- [ ] Rate limiting enabled
- [ ] CORS restricted to frontend origin
- [ ] Credentials deleted after scraping

---

## Troubleshooting

### Backend Error: "Playwright browser not found"
- Solution: Railway/Render should auto-install via Dockerfile. If not working, manually add to build command: `npx playwright install chromium`

### Frontend Error: "Failed to fetch"
- Check: NEXT_PUBLIC_API_URL is correct
- Check: Backend is deployed and running
- Check: CORS allows your frontend URL

### Rate Limit Errors
- Normal behavior after 5 requests in 15 minutes
- Wait or adjust `RATE_LIMIT_MAX_REQUESTS` in backend env

---

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

---

## Local Development

### Backend
```bash
cd backend-prod
npm install
npx playwright install chromium
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Monitoring

- **Railway**: Built-in logs and metrics
- **Render**: Logs available in dashboard
- **Vercel**: Analytics and deployment logs

---

## Cost Estimate

- **Railway**: ~$5-10/month (depending on usage)
- **Render**: Free tier available (limited hours)
- **Vercel**: Free tier (sufficient for personal use)

**Total**: $0-10/month
