'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import api from '../../lib/api';
import { AlertTriangle, Lock, Eye, EyeOff, Shield, Zap } from 'lucide-react';

export default function AutoFetchModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1); // 1: Warning, 2: Credentials, 3: Progress
    const [registerNo, setRegisterNo] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleConsent = () => {
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setStep(3);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/automation/fetch-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api.getToken()}`,
                },
                body: JSON.stringify({ username: registerNo, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Automation failed');
            }

            // Clear credentials from memory
            setRegisterNo('');
            setPassword('');

            setResults(data);
            onSuccess();
        } catch (err) {
            setError(err.message);
            setStep(2); // Go back to credentials
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setRegisterNo('');
        setPassword('');
        setError('');
        setResults(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Auto-Fetch Attendance" size="lg">
            {/* Step 1: Security Warning */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="bg-warning-50 dark:bg-warning-900/20 border-2 border-warning-500 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-warning-600 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-warning-900 dark:text-warning-100 mb-2">
                                    ⚠️ SECURITY NOTICE - READ CAREFULLY
                                </h4>
                                <ul className="text-sm text-warning-800 dark:text-warning-200 space-y-2">
                                    <li>• This feature uses <strong>local browser automation</strong></li>
                                    <li>• Your MITSIMS credentials are <strong>NEVER stored permanently</strong></li>
                                    <li>• Credentials are used <strong>in-memory only</strong> during the session</li>
                                    <li>• All automation runs <strong>locally on your device</strong></li>
                                    <li>• No credentials are sent to external servers</li>
                                    <li>• Session is cleared immediately after fetching data</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                            <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white">How it works:</h5>
                                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2 ml-5 list-decimal">
                                    <li>Browser opens MITSIMS locally (visible to you)</li>
                                    <li>Logs in with your credentials</li>
                                    <li>Fetches attendance data</li>
                                    <li>Imports data to your account</li>
                                    <li>Closes browser and clears session</li>
                                </ol>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Lock className="w-5 h-5 text-success-600 flex-shrink-0 mt-1" />
                            <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white">Privacy Guarantees:</h5>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2 ml-5 list-disc">
                                    <li>Runs entirely on your computer</li>
                                    <li>No cloud processing of credentials</li>
                                    <li>You can see the browser window during the process</li>
                                    <li>Source code is open and verifiable</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-300 dark:border-danger-700 rounded-lg p-3">
                        <p className="text-sm text-danger-800 dark:text-danger-200">
                            <strong>Note:</strong> This automation may fail if MITSIMS changes its website structure.
                            Manual entry is always available as a fallback.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" fullWidth onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" fullWidth onClick={handleConsent}>
                            <Zap className="w-4 h-4" />
                            I Understand, Proceed
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Credentials */}
            {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                        <p className="text-sm text-primary-800 dark:text-primary-200">
                            <Lock className="w-4 h-4 inline mr-1" />
                            Enter your MITSIMS credentials. They will be used only for this session and NOT saved.
                        </p>
                    </div>

                    <div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                MITSIMS Register Number *
                            </label>
                            <input
                                type="text"
                                value={registerNo}
                                onChange={(e) => setRegisterNo(e.target.value)}
                                required
                                autoComplete="off"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Your register number (e.g., 23691a4031)"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            MITSIMS Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="off"
                                className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Your MITSIMS password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            🔒 These credentials are transmitted securely and never stored on our servers.
                            The browser will open on your device, and you'll see the login process happen in real-time.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" fullWidth onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" fullWidth>
                            <Zap className="w-4 h-4" />
                            Start Auto-Fetch
                        </Button>
                    </div>
                </form>
            )}

            {/* Step 3: Progress/Results */}
            {step === 3 && (
                <div className="space-y-4">
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Fetching attendance from MITSIMS...
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                Please wait while the browser automation runs
                            </p>
                        </div>
                    )}

                    {results && !loading && (
                        <div className="space-y-4">
                            <div className="bg-success-50 dark:bg-success-900/20 border border-success-300 dark:border-success-700 rounded-lg p-4">
                                <h4 className="font-bold text-success-900 dark:text-success-100 mb-2">
                                    ✅ Automation Completed Successfully!
                                </h4>
                                <p className="text-sm text-success-800 dark:text-success-200">
                                    {results.message}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Summary:</h5>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Subjects Found:</span>
                                        <span className="ml-2 font-bold">{results.summary?.subjectsFound || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                        <span className="ml-2 font-bold text-success-600">{results.summary?.subjectsCreated || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                                        <span className="ml-2 font-bold text-primary-600">{results.summary?.subjectsUpdated || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Errors:</span>
                                        <span className="ml-2 font-bold text-danger-600">{results.summary?.errors || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {results.warning && (
                                <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-300 dark:border-warning-700 rounded-lg p-3">
                                    <p className="text-sm text-warning-800 dark:text-warning-200">
                                        {results.warning}
                                    </p>
                                </div>
                            )}

                            <Button variant="primary" fullWidth onClick={handleClose}>
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}
