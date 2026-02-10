# 🔒 Production-Ready MITS GEMS Attendance Tracker

A secure, mobile-friendly attendance tracker with **backend scraping** architecture.

## ✨ Features

- 📱 **Mobile-First UI** - Fully responsive design
- 🔐 **Secure Backend** - Password NEVER stored client-side
- 📊 **Real-Time Data** - Live attendance from MITS GEMS
- 📈 **Trends Graph** - Track attendance over time
- 🧮 **What-If Calculator** - Simulate future attendance
- 📥 **Export to PDF/CSV** - Download reports
- 🌙 **Dark Mode** - Eye-friendly interface
- 🔄 **Smart Refresh** - Timestamp tracking

---

## 🏗️ Architecture

```
Frontend (Next.js)  →  Backend (Express + Playwright)  →  MITS GEMS
  Vercel                Railway/Render                   (Scraping)
```

**Security Features**:
- ✅ Credentials ONLY in-memory (backend)
- ✅ Rate limiting (5 requests /15min)
- ✅ HTTPS communication
- ✅ CORS protection
- ✅ No password storage anywhere

---

## 🚀 Quick Start (Local)

### 1. Backend
```bash
cd backend-prod
npm install
npx playwright install chromium
npm start  # Runs on port 5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on port 3000
```

Visit: http://localhost:3000

---

## 📦 Public Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

**TL;DR:**
1. Deploy backend to **Railway/Render**
2. Deploy frontend to **Vercel**
3. Update environment variables

---

## 📁 Project Structure

```
attendance-tracker/
├── backend-prod/          # Secure backend
│   ├── src/
│   │   ├── services/      # Playwright scraper
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Security layers
│   │   └── server.js
│   └── Dockerfile
├── frontend/              # Next.js app
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # UI components
│   │   └── services/      # API client
│   └── next.config.js
└── DEPLOYMENT.md
```

---

## 🔒 Security

**Client-Side (Frontend)**:
- ❌ Password NEVER stored
- ✅ Only register number cached
- ✅ All requests via HTTPS

**Server-Side (Backend)**:
- ✅ Credentials in-memory only
- ✅ Rate limiting enforced
- ✅ Helmet.js security headers
- ✅ Input validation

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, Playwright
- **Deployment**: Vercel, Railway/Render
- **Security**: Helmet, CORS, Rate Limiting

---

## 📝 License

MIT

---

## ⚠️ Disclaimer

This tool is for **educational purposes** only. Always protect your credentials and follow your institution's guidelines.
