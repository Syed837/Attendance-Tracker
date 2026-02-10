import express from 'express';
import { body, validationResult } from 'express-validator';
import { AttendanceScraperService } from '../services/scraper.service.js';
import { scraperRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/attendance/fetch
 * 
 * Fetch attendance from MITS GEMS
 * 
 * SECURITY:
 * - Rate limited to 5 requests per 15 minutes
 * - Validates input
 * - Never logs credentials
 * - Credentials deleted after scraping
 */
router.post(
    '/fetch',
    scraperRateLimiter, // Rate limiting
    [
        // Input validation
        body('registerNumber')
            .trim()
            .notEmpty()
            .withMessage('Register number is required')
            .isLength({ min: 3, max: 50 })
            .withMessage('Invalid register number format'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Invalid password format'),
    ],
    async (req, res, next) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: errors.array()[0].msg,
                });
            }

            const { registerNumber, password } = req.body;

            // SECURITY: Never log credentials
            console.log(`\n📥 Attendance request for: ${registerNumber}`);

            // Create scraper instance
            const scraper = new AttendanceScraperService();

            // Fetch attendance (credentials stay in-memory)
            const attendanceData = await scraper.fetchAttendance(registerNumber, password);

            // Return data
            res.json(attendanceData);
        } catch (error) {
            // Pass to error handler
            next(error);
        }
    }
);

export default router;
