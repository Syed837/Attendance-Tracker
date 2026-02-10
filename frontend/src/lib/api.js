const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * API client with authentication support
 */
class ApiClient {
    constructor() {
        this.baseURL = API_URL;
    }

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    setToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    }

    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return { data, status: response.status };
        } catch (error) {
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Auth methods
    async register(registerNumber, password, name) {
        const { data } = await this.post('/auth/register', { registerNumber, password, name });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async login(registerNumber, password) {
        const { data } = await this.post('/auth/login', { registerNumber, password });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async getProfile() {
        const { data } = await this.get('/auth/profile');
        return data;
    }

    logout() {
        this.removeToken();
    }

    // Subject methods
    async getSubjects() {
        const { data } = await this.get('/subjects');
        return data;
    }

    async getSubject(id) {
        const { data } = await this.get(`/subjects/${id}`);
        return data;
    }

    async createSubject(subjectData) {
        const { data } = await this.post('/subjects', subjectData);
        return data;
    }

    async updateSubject(id, subjectData) {
        const { data } = await this.put(`/subjects/${id}`, subjectData);
        return data;
    }

    async deleteSubject(id) {
        const { data } = await this.delete(`/subjects/${id}`);
        return data;
    }

    // Attendance methods
    async getAttendance(subjectId) {
        const { data } = await this.get(`/attendance/${subjectId}`);
        return data;
    }

    async addAttendance(attendanceData) {
        const { data } = await this.post('/attendance', attendanceData);
        return data;
    }

    async updateAttendance(id, attendanceData) {
        const { data } = await this.put(`/attendance/${id}`, attendanceData);
        return data;
    }

    async deleteAttendance(id) {
        const { data } = await this.delete(`/attendance/${id}`);
        return data;
    }

    async bulkImportAttendance(subjectId, records) {
        const { data } = await this.post('/attendance/bulk', { subjectId, records });
        return data;
    }

    // Export methods
    async exportPDF() {
        const token = this.getToken();
        window.open(
            `${this.baseURL}/export/pdf?token=${token}`,
            '_blank'
        );
    }

    async exportCSV() {
        const token = this.getToken();
        window.open(
            `${this.baseURL}/export/csv?token=${token}`,
            '_blank'
        );
    }
}

export default new ApiClient();
