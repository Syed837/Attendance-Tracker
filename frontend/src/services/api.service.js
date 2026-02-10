/**
 * API Service for Backend Communication
 * 
 * SECURITY:
 * - Never stores password
 * - Only register number can be cached
 * - All communication via HTTPS in production
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Fetch attendance from backend
 * @param {string} registerNumber - Student register number
 * @param {string} password - Student password (IN-MEMORY ONLY, NEVER STORED)
 * @returns {Promise<Object>} Attendance data
 */
export async function fetchAttendance(registerNumber, password) {
    try {
        const response = await fetch(`${API_URL}/api/attendance/fetch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                registerNumber,
                password, // Sent securely, NEVER cached
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
}

/**
 * Health check
 */
export async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        return await response.json();
    } catch (error) {
        console.error('Backend health check failed:', error);
        return { status: 'error' };
    }
}
