# SIMPLE ATTENDANCE TRACKER - SETUP GUIDE

## 📁 Folder Structure

```
attendance-tracker/
├── backend/
│   ├── simple-server.js         # Main server file (NEW)
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.jsx         # Single-page app (REFACTORED)
│   │       └── layout.jsx
│   ├── package.json
│   └── node_modules/
└── README-SIMPLE.md             # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
node simple-server.js
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 3. Use the App

1. Open browser: `http://localhost:3000`
2. Enter your MITS register number
3. Enter your MITS password
4. Click "Fetch Attendance"
5. Wait for automation to complete (browser will open)
6. View your attendance dashboard

## 🎯 How It Works

### Backend Flow

1. Receives `registerNumber` and `password` via POST request
2. Launches Playwright browser (visible for transparency)
3. Navigates to `http://mitsims.in`
4. Clicks "Student" link
5. Enters credentials
6. Logs in
7. Navigates to attendance section
8. Scrapes attendance table
9. Calculates skippable classes (75% rule)
10. Returns JSON data
11. Closes browser

### Frontend Flow

1. **Input Screen**: Single form with register number + password
2. **Loading State**: Shows spinner while automation runs
3. **Dashboard**: Automatically displays after fetch completes
   - Summary cards (total, safe, danger)
   - Subject cards with attendance details
   - Skippable classes calculation
   - Progress bars
4. **Fetch Again**: Button to start over

## 📊 Skip-Class Calculation

For each subject, the app calculates how many classes you can skip while maintaining 75%:

**Formula:**
```
skippable = floor((attended - 0.75 × total) / 0.75)
```

**Example:**
- Attended: 80 classes
- Total: 100 classes
- Current: 80%
- Skippable: floor((80 - 75) / 0.75) = **6 classes**

After skipping 6 classes:
- Attended: 80 (no change)
- Total: 106 (6 skipped = not attended)
- New: 80/106 = 75.47% ✓

## 🔒 Security Notes

- **NO authentication system** - No user accounts, no JWT, no database for users
- **Credentials NOT stored** - Register number and password are only used for MITSIMS login
- **In-memory only** - All processing happens during the request
- **Browser visible** - Shows exactly what's happening
- **Local execution** - Everything runs on your machine

## 🛠️ API Endpoint

### POST `/api/fetch-attendance`

**Request:**
```json
{
  "registerNumber": "your-register-number",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance fetched successfully",
  "subjects": [
    {
      "name": "Data Structures",
      "attended": 45,
      "total": 50,
      "percentage": 90,
      "skippable": 20,
      "status": "safe"
    }
  ],
  "summary": {
    "totalSubjects": 6,
    "safeSubjects": 5,
    "dangerSubjects": 1
  }
}
```

## 🐛 Troubleshooting

### Playwright not installed
```bash
cd backend
npm install playwright
npx playwright install chromium
```

### CORS errors
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000

### Login fails
- Check your MITSIMS credentials
- Make sure MITSIMS website is accessible
- Watch the browser automation to see what's happening

### No attendance data found
- The MITSIMS website structure may have changed
- Check the browser automation to see the page structure
- You may need to update the selectors in `simple-server.js`

## 🎨 Customization

### Change target percentage (default: 75%)
Edit `simple-server.js` line ~186:
```javascript
const targetPercentage = 75; // Change to your requirement
```

### Change ports
- Backend: Edit `simple-server.js` line 7
- Frontend: Run with `npm run dev -- -p PORT`

### Enable headless mode (no browser window)
Edit `simple-server.js` line 43:
```javascript
headless: true, // Change from false to true
```

## 📝 Differences from Original

| Feature | Original | Simple Version |
|---------|----------|----------------|
| Authentication | Email/Password + JWT | None |
| Database | SQLite with users | None (optional for subjects) |
| Pages | Login, Register, Dashboard | Single page |
| Flow | Multi-step | One-click |
| Automation | Separate modal | Integrated |
| Credentials | App login + MITS login | MITS login only |

## 🔥 What Was Removed

- ❌ User authentication (JWT, bcrypt)
- ❌ User database tables
- ❌ Login/Register pages
- ❌ Auth middleware
- ❌ Separate dashboard page
- ❌ Auth context
- ❌ Protected routes
- ❌ Session management

## ✅ What Remains

- ✅ Playwright automation
- ✅ MITSIMS scraper
- ✅ Attendance calculation
- ✅ Skip-class logic
- ✅ Beautiful UI
- ✅ Single endpoint
- ✅ Single page

---

**That's it! Simple, direct, and functional.** 🎉
