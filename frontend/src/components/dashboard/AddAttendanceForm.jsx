'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';

export default function AddAttendanceForm({ isOpen, onClose, subjectId, onSuccess }) {
    const [formData, setFormData] = useState({
        date: formatDate(new Date()),
        attended: true,
        note: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.addAttendance({
                subjectId,
                ...formData,
            });
            setFormData({ date: formatDate(new Date()), attended: true, note: '' });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Attendance Record">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date *
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="attended"
                        id="attended"
                        checked={formData.attended}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <label htmlFor="attended" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mark as attended
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Note (Optional)
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add any notes..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" fullWidth onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Add Record
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
