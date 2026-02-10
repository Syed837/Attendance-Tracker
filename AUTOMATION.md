# Browser Automation Setup Guide

## ⚠️ SECURITY NOTICE

This feature allows **LOCAL** browser automation to fetch attendance from MITSIMS. Please read and understand the security implications before using.

### Security Guarantees:
- ✅ Credentials are **NEVER** stored permanently
- ✅ All processing happens **in-memory only**
- ✅ Automation runs **locally on your device**
- ✅ No credentials sent to external servers
- ✅ Browser session cleared immediately after completion
- ✅ You can see the browser window during automation

---

## Prerequisites

1. **Node.js v18+** installed
2. **Backend and Frontend** running
3. **Chromium browser** (installed via Playwright)

---

## Installation

### 1. Install Playwright

The backend needs Playwright for browser automation:

```bash
cd attendance-tracker/backend
npm install playwright
```

### 2. Install Chromium Browser

```bash
npx playwright install chromium
```

This downloads the Chromium browser used for automation (about 400MB).

### 3. Restart Backend Server

After installing Playwright, restart the backend:

```bash
npm run dev
```

---

## How to Use Auto-Fetch

### From the Dashboard:

1. **Click "Auto-Fetch" button** (green button with ⚡ icon)

2. **Read Security Warning**
   - Review all security notices
   - Understand that credentials are used in-memory only
   - Click "I Understand, Proceed"

3. **Enter MITSIMS Credentials**
   - Username: Your MITSIMS username
   - Password: Your MITSIMS password
   - These are NOT saved anywhere

4. **Watch Automation Run**
   - Browser window will open (visible to you)
   - You'll see it log into MITSIMS
   - Data will be fetched
   - Browser closes automatically

5. **Review Results**
   - See how many subjects were found
   - Check for any errors
   - Subjects are now in your dashboard

---

## What Gets Imported

The automation fetches:
- ✅ Subject names
- ✅ Total classes conducted
- ✅ Classes attended
- ✅ Current attendance percentage

**Note:** Individual date-wise records need manual entry as MITSIMS doesn't provide individual dates in the table view.

---

## Troubleshooting

### Error: "Playwright not installed"

**Solution:**
```bash
cd backend
npm install playwright
npx playwright install chromium
```

### Error: "Login form not found"

**Cause:** MITSIMS website structure changed

**Solution:**
- Use manual entry instead
- Report the issue
- The selectors in `mitsims-scraper.js` may need updating

### Error: "No attendance data found"

**Possible Causes:**
- MITSIMS UI changed
- Attendance page has different structure
- Network issues

**Solution:**
- Try again
- Use manual entry as fallback
- Check MITSIMS website directly

### Browser doesn't close

**Solution:**
- Manually close the browser window
- The session data is already cleared

---

## Manual Entry Fallback

If automation fails, you can always use manual entry:

1. Visit http://mitsims.in/# yourself
2. Login with your credentials
3. View your attendance
4. Come back to our app
5. Use "Add Subject" and record attendance manually

---

## Technical Details

### How It Works

```
1. User clicks "Auto-Fetch"
2. Frontend shows security warning
3. User consents and enters credentials
4. Credentials sent to backend API (local server only)
5. Backend launches Playwright
6. Chromium browser opens (visible)
7. Browser navigates to MITSIMS
8. Bot fills login form
9. Bot clicks login button
10. Bot waits for dashboard
11. Bot navigates to attendance page
12. Bot scrapes table data
13. Bot closes browser
14. Backend clears session
15. Data returned to frontend
16. Frontend displays results
17. Credentials purged from memory
```

### What Gets Stored

**Permanently Stored:**
- Subject names
- Attendance stats
- Your user account

**NEVER Stored:**
- MITSIMS username
- MITSIMS password
- Browser session

**Temporarily in Memory:**
- Credentials (cleared after < 1 minute)
- Browser session (cleared immediately)

---

## Code Files

### Backend
- `src/services/mitsims-scraper.js` - Playwright automation logic
- `src/controllers/automationController.js` - API handler
- `src/routes/automation.js` - Routes

### Frontend
- `src/components/dashboard/AutoFetchModal.jsx` - Auto-fetch UI
- Updated `src/app/dashboard/page.jsx` - Added button

---

## API Endpoints

### Test Automation Availability
```
GET /api/automation/test
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "ok",
  "message": "Browser automation is available",
  "browser": "Chromium"
}
```

### Auto-Fetch Attendance
```
POST /api/automation/fetch-attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "your-mitsims-username",
  "password": "your-mitsims-password"
}
```

**Response:**
```json
{
  "message": "Automation completed successfully",
  "summary": {
    "subjectsFound": 6,
    "subjectsCreated": 6,
    "subjectsUpdated": 0,
    "errors": 0
  },
  "subjects": [...]
}
```

---

## Important Notes

### Legal Considerations

- ✅ User explicitly consents to automation
- ✅ Runs on user's own device
- ✅ Uses user's own credentials
- ✅ Only accesses data user already has access to
- ✅ No bypassing of security measures
- ✅ No violation of authentication

### Privacy

- Your credentials never leave your local network
- No cloud processing of sensitive data
- No logging of credentials
- Open source - you can verify the code

### Reliability

- May break if MITSIMS changes website
- Network issues can cause failures
- Always have manual entry as backup

---

## Customization

If MITSIMS changes their website structure, you'll need to update the selectors in:

**File:** `backend/src/services/mitsims-scraper.js`

**Key areas to update:**
1. Login form selectors
2. Attendance page navigation
3. Table data extraction

---

## Best Practices

1. **Use Auto-Fetch sparingly**
   - Only when adding new subjects
   - Or when attendance changes significantly

2. **Verify Results**
   - Always check the imported data
   - Compare with MITSIMS directly

3. **Manual Updates**
   - For daily updates, use manual entry
   - It's faster and more reliable

4. **Keep Browser Visible**
   - Never run in headless mode
   - Transparency is key

---

## Future Enhancements

- [ ] Support for other college portals
- [ ] Date-wise record extraction
- [ ] Scheduled auto-sync
- [ ] Better error messages
- [ ] Support for multiple colleges

---

**Remember:** Manual entry is always available and is often the best option for regular updates. Auto-fetch is best for initial setup with many subjects.
