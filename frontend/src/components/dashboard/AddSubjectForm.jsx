'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import api from '../../lib/api';

export default function AddSubjectForm({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        targetPercentage: 75,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.createSubject(formData);
            setFormData({ name: '', code: '', targetPercentage: 75 });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Subject">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Mathematics"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject Code (Optional)
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., MATH101"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Attendance (%)
                    </label>
                    <input
                        type="number"
                        name="targetPercentage"
                        value={formData.targetPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" fullWidth onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Add Subject
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
