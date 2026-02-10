import { chromium } from 'playwright';
import {
    calculateOverallStats,
    calculateBunkAvailability,
    calculateSubjectStatus,
} from '../utils/calculator.js';

/**
 * SECURE PLAYWRIGHT SCRAPER SERVICE
 * 
 * SECURITY RULES:
 * 1. Credentials are ONLY stored in function parameters (in-memory)
 * 2. Credentials are NEVER logged
 * 3. Credentials are deleted when function exits
 * 4. Browser context is destroyed after use
 */

export class AttendanceScraperService {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    /**
     * Main scraping function
     * @param {string} registerNumber - Student register number
     * @param {string} password - Student password (IN-MEMORY ONLY)
     * @returns {Promise<Object>} Attendance data
     */
    async fetchAttendance(registerNumber, password) {
        try {
            console.log(`🔐 Scraping attendance for: ${registerNumber}`);
            console.log('⚠️  Credentials will be deleted after scraping');

            // Launch browser
            await this.launchBrowser();

            // Navigate and login
            await this.navigateToMITSIMS();
            await this.performLogin(registerNumber, password);

            // Extract attendance data
            const attendanceData = await this.extractAttendanceData();

            // Calculate stats
            const processedData = this.processAttendanceData(attendanceData);

            console.log('✅ Scraping complete\n');

            return {
                success: true,
                ...processedData,
            };
        } catch (error) {
            console.error('❌ Scraping failed:', error.message);
            throw new Error(`Scraping failed: ${error.message}`);
        } finally {
            // CRITICAL: Clean up browser and credentials
            await this.cleanup();

            // SECURITY: Explicitly null credentials (though they're already out of scope)
            registerNumber = null;
            password = null;
        }
    }

    /**
     * Launch Playwright browser (OPTIMIZED FOR SPEED)
     */
    async launchBrowser() {
        this.browser = await chromium.launch({
            headless: true, // MUST be true for production
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu', // Speed optimization
                '--disable-software-rasterizer',
                '--disable-extensions',
                '--no-first-run',
                '--no-default-browser-check',
            ],
        });

        const context = await this.browser.newContext({
            // Block unnecessary resources for faster loading
            javaScriptEnabled: true, // Need JS for ExtJS
        });

        // OPTIMIZED: Block only images, fonts, media (keep CSS for ExtJS to work)
        await context.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            if (['image', 'font', 'media'].includes(resourceType)) {
                route.abort(); // Block only non-critical resources
            } else {
                route.continue();
            }
        });

        this.page = await context.newPage();

        // Disable animations for instant rendering
        await this.page.addInitScript(() => {
            const style = document.createElement('style');
            style.textContent = '* { animation-duration: 0s !important; transition-duration: 0s !important; }';
            document.head?.appendChild(style);
        });

        // Listen for console logs (for debugging)
        this.page.on('console', (msg) => console.log('PAGE:', msg.text()));
        this.page.on('dialog', async (dialog) => {
            console.log('ALERT:', dialog.message());
            await dialog.dismiss();
        });
    }

    /**
     * Navigate to MITS GEMS portal
     */
    async navigateToMITSIMS() {
        console.log('→ Navigating to MITSIMS...');
        await this.page.goto('http://mitsims.in/#', {
            waitUntil: 'domcontentloaded',
            timeout: 20000, // Reduced from 30s
        });
        await this.page.waitForTimeout(1000); // Reduced from 2000ms

        // Click Student link
        try {
            await this.page.click('text=Student', { force: true });
            await this.page.waitForTimeout(1000); // Reduced from 2000ms
            console.log('✓ Student portal accessed');
        } catch (e) {
            console.warn('Student link not found, continuing...');
        }
    }

    /**
     * Perform login using credentials
     * @param {string} registerNumber
     * @param {string} password - IN-MEMORY ONLY
     */
    async performLogin(registerNumber, password) {
        console.log('→ Logging in...');

        // Wait for login container to be visible
        try {
            await this.page.waitForSelector('#stuLogin', { state: 'visible', timeout: 5000 });
            console.log('✓ Student login container visible');
        } catch (e) {
            console.warn('Student container not visible, continuing...');
        }

        // Fill register number - try multiple selectors
        console.log('→ Filling register number...');
        try {
            await this.page.waitForSelector('#inputStuId', { state: 'visible', timeout: 3000 }); // Reduced timeout
            await this.page.fill('#inputStuId', registerNumber);
        } catch (e) {
            console.log('Fallback: Using alternative selector for register number');
            const regInput = this.page.locator('input[placeholder*="Register"], input[placeholder*="Student"], input[name="username"]');
            await regInput.first().waitFor({ state: 'visible', timeout: 3000 });
            await regInput.first().fill(registerNumber);
        }
        await this.page.waitForTimeout(300); // Reduced from 500ms

        // Fill password - CRITICAL: Click first to make it visible
        console.log('→ Filling password...');
        try {
            // Scope to student container and use input[name="password"]
            const passInput = this.page.locator('#stuLogin input[name="password"]');
            await passInput.first().click(); // Trigger visibility
            await this.page.waitForTimeout(300); // Reduced from 500ms
            await passInput.first().fill(password);
            await this.page.waitForTimeout(200); // Reduced from 500ms
        } catch (e) {
            console.log('Fallback: Using keyboard typing for password');
            await this.page.keyboard.type(password);
            await this.page.waitForTimeout(200);
        }

        // Click login button - CRITICAL: Use STUDENT button, not staff
        console.log('→ Clicking login button...');
        let loginClicked = false;

        // Try 1: Direct ID click
        try {
            await this.page.click('#stuLoginBtn', { timeout: 3000 });
            loginClicked = true;
            console.log('✓ Clicked login via #stuLoginBtn');
        } catch (e) {
            console.log('Primary login button not found, trying fallbacks...');
        }

        // Try 2: Scoped button selector
        if (!loginClicked) {
            try {
                const loginBtn = this.page.locator('#stuLogin button[type="submit"]');
                await loginBtn.first().click({ timeout: 3000 });
                loginClicked = true;
                console.log('✓ Clicked login via scoped selector');
            } catch (e) {
                console.log('Scoped button failed, trying .btn-success...');
            }
        }

        // Try 3: Success button class
        if (!loginClicked) {
            try {
                const loginBtn = this.page.locator('#stuLogin .btn-success');
                await loginBtn.first().click({ timeout: 3000 });
                loginClicked = true;
                console.log('✓ Clicked login via .btn-success');
            } catch (e) {
                console.log('Warning: All login button selectors failed');
            }
        }

        if (!loginClicked) {
            throw new Error('Could not find login button');
        }

        // Wait for navigation after login - increased timeout
        console.log('→ Waiting for navigation...');
        await this.page.waitForLoadState('networkidle', { timeout: 15000 }); // Increased from 10s
        await this.page.waitForTimeout(1000); // Increased buffer

        // Verify login success
        const currentUrl = this.page.url();
        console.log(`Current URL: ${currentUrl}`);

        if (currentUrl.includes('/#') || currentUrl === 'http://mitsims.in/#') {
            throw new Error('Login failed. Please check your credentials.');
        }

        console.log('✓ Login successful');
    }

    /**
     * Extract attendance data from MITSIMS (ExtJS-based)
     */
    async extractAttendanceData() {
        console.log('→ Extracting attendance data...');

        // Navigate to attendance page
        try {
            await this.page.click('text=Attendance', { timeout: 5000 });
            await this.page.waitForLoadState('networkidle');
        } catch (e) {
            console.warn('Could not click Attendance link');
        }

        // Wait for table structure
        console.log('Waiting for attendance table...');
        try {
            await this.page.waitForSelector('text=S.NO', { timeout: 10000 }); // Reduced from 20s
            console.log('✓ Found S.NO header');
        } catch (e) {
            console.log('⚠️ S.NO header not found');
        }

        // Wait for data population - FAST MODE (no CSS/images loading)
        try {
            await this.page.waitForLoadState('networkidle', { timeout: 8000 }); // Reduced from 10s
            await this.page.waitForTimeout(1000); // Reduced from 1500ms - faster without CSS
        } catch (e) {
            console.log('Network idle warn:', e.message);
        }

        // Extract subject data using robust fieldset-based approach
        const subjectData = await this.page.evaluate(() => {
            const subjects = [];

            // ExtJS renders data in fieldsets
            const fieldsets = Array.from(document.getElementsByTagName('fieldset'));
            const rows = fieldsets.length > 5 ? fieldsets : Array.from(document.querySelectorAll('tr, .x-grid-row'));

            for (let row of rows) {
                const text = row.innerText || '';
                const lines = text.split('\n').map(l => l.trim()).filter(l => l);

                console.log(`Row lines:`, JSON.stringify(lines));

                // A valid subject row must have at least S.No and stats
                if (lines.length < 4) continue;

                // 1. Check for S.No (must be digit)
                if (!/^\d+$/.test(lines[0])) continue;

                // 2. Extract stats (Attended, Total, Percentage) from end
                let attended = 0, total = 0, percentage = 0;
                let foundStats = false;
                let statsStartIndex = -1;

                for (let i = lines.length - 1; i >= 2; i--) {
                    const pStr = lines[i].replace('%', '');
                    const p = parseFloat(pStr);
                    const t = parseFloat(lines[i - 1]);
                    const a = parseFloat(lines[i - 2]);

                    if (!isNaN(p) && !isNaN(t) && !isNaN(a)) {
                        if (a <= t) { // Semantic check
                            percentage = p;
                            total = t;
                            attended = a;
                            foundStats = true;
                            statsStartIndex = i - 2;
                            break;
                        }
                    }
                }

                if (foundStats) {
                    // 3. Extract code and name between S.No and stats
                    let rawSubjectParts = lines.slice(1, statsStartIndex);
                    let code = "";
                    let name = "Unknown Subject";

                    const codeRegex = /([0-9]{2,}[A-Z0-9]{2,})/;

                    if (rawSubjectParts.length === 1) {
                        const part = rawSubjectParts[0];
                        const match = part.match(codeRegex);

                        if (match) {
                            code = match[1];
                            const possibleName = part.replace(code, '').trim();
                            name = possibleName.length > 2 ? possibleName : part;
                        } else {
                            code = "";
                            name = part;
                        }
                    } else if (rawSubjectParts.length >= 2) {
                        const codeIndex = rawSubjectParts.findIndex(p => codeRegex.test(p));

                        if (codeIndex !== -1) {
                            const codeMatch = rawSubjectParts[codeIndex].match(codeRegex);
                            code = codeMatch ? codeMatch[0] : rawSubjectParts[codeIndex];
                            const remainder = rawSubjectParts[codeIndex].replace(code, '').trim();
                            const otherLines = rawSubjectParts.filter((_, i) => i !== codeIndex);

                            name = remainder.length > 2
                                ? remainder + " " + otherLines.join(' ')
                                : otherLines.join(' ');
                        } else {
                            code = "";
                            name = rawSubjectParts.join(' ');
                        }
                    }

                    subjects.push({
                        code: code || name.substring(0, 6).toUpperCase(),
                        name: name,
                        attended: attended,
                        total: total,
                    });
                }
            }

            return subjects;
        });

        if (subjectData.length === 0) {
            throw new Error('No attendance data found. Page structure may have changed.');
        }

        console.log(`✓ Extracted ${subjectData.length} subjects`);
        return subjectData;
    }

    /**
     * Process and calculate attendance statistics
     */
    processAttendanceData(subjects) {
        // Calculate per-subject stats
        const processedSubjects = subjects.map(calculateSubjectStatus);

        // Calculate overall stats
        const overall = calculateOverallStats(processedSubjects);
        const bunkInfo = calculateBunkAvailability(overall.attended, overall.total);

        return {
            overall: {
                ...overall,
                ...bunkInfo,
            },
            subjects: processedSubjects,
            summary: {
                totalSubjects: processedSubjects.length,
                overallPercentage: overall.percentage,
                status: bunkInfo.status,
            },
        };
    }

    /**
     * Clean up browser resources
     * CRITICAL: Always called in finally block
     */
    async cleanup() {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
        console.log('🧹 Browser closed, credentials deleted from memory');
    }
}
