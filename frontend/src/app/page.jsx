'use client';

import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, TrendingDown, Calendar, AlertTriangle, CheckCircle, Moon, Sun, RefreshCw, Download } from 'lucide-react';
import ModernSubjectCard from '../components/dashboard/ModernSubjectCard';
import WhatIfCalculator from '../components/dashboard/WhatIfCalculator';
import DayWiseChart from '../components/dashboard/DayWiseChart';


export default function Home() {
    const [registerNumber, setRegisterNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [lastFetched, setLastFetched] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Helper function to get relative time
    const getRelativeTime = (timestamp) => {
        if (!timestamp) return '';
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    // Load saved credentials and Theme on mount
    useEffect(() => {
        // SECURITY: Only load register number, NEVER password
        const savedReg = localStorage.getItem('mits_reg');
        if (savedReg) {
            setRegisterNumber(savedReg);
            setRememberMe(true);
        }

        // Theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.body.classList.add('dark');
        }

        // Last Fetch Timestamp
        const savedTimestamp = localStorage.getItem('lastFetchTimestamp');
        if (savedTimestamp) {
            setLastFetched(parseInt(savedTimestamp));
        }
    }, []);

    // Export to CSV
    const exportToCSV = () => {
        if (!attendanceData) return;

        const csvContent = [
            ['Attendance Report'],
            ['Generated:', new Date().toLocaleDateString()],
            ['Overall Attendance:', `${attendanceData.overall.percentage}%`],
            [''],
            ['Subject Code', 'Subject Name', 'Attended', 'Total', 'Percentage', 'Status'],
            ...attendanceData.subjects.map(s => [
                s.code,
                s.name,
                s.attended,
                s.total,
                `${s.percentage}%`,
                s.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        setShowExportMenu(false);
    };

    // Export to PDF
    const exportToPDF = async () => {
        if (!attendanceData) return;

        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(99, 102, 241);
        doc.text('Attendance Report', 14, 20);

        // Overall Stats
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Overall Attendance: ${attendanceData.overall.percentage}%`, 14, 37);
        doc.text(`Status: ${attendanceData.overall.percentage >= 75 ? 'Safe' : 'Danger'}`, 14, 44);

        // Subject Table
        autoTable(doc, {
            startY: 52,
            head: [['Code', 'Subject Name', 'Attended', 'Total', '%', 'Status']],
            body: attendanceData.subjects.map(s => [
                s.code,
                s.name,
                s.attended,
                s.total,
                `${s.percentage}%`,
                s.status
            ]),
            headStyles: { fillColor: [99, 102, 241] },
            alternateRowStyles: { fillColor: [245, 247, 250] },
        });

        doc.save(`attendance-${new Date().toISOString().split('T')[0]}.pdf`);
        setShowExportMenu(false);
    };

    // Toggle Theme
    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleFetchAttendance = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setAttendanceData(null);

        // Save or Clear credentials based on Remember Me
        // SECURITY: Only register number is saved, NEVER password
        if (rememberMe) {
            localStorage.setItem('mits_reg', registerNumber);
        } else {
            localStorage.removeItem('mits_reg');
        }

        // SECURITY: Remove password storage
        // Password is NEVER stored, only sent to backend API

        try {
            // Import API service
            const { fetchAttendance: apiFetchAttendance } = await import('../services/api.service');

            // Call backend API
            // Password stays in-memory, never cached
            const data = await apiFetchAttendance(registerNumber, password);

            if (data.success) {
                setAttendanceData(data);
                const timestamp = Date.now();
                setLastFetched(timestamp);
                localStorage.setItem('lastFetchTimestamp', timestamp.toString());

                // Save to attendance history
                const historyItem = {
                    timestamp,
                    percentage: data.overall.percentage,
                    attended: data.overall.attended,
                    total: data.overall.total
                };

                const existingHistory = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
                const updatedHistory = [...existingHistory, historyItem];
                // Keep only last 30 entries
                const trimmedHistory = updatedHistory.slice(-30);
                localStorage.setItem('attendanceHistory', JSON.stringify(trimmedHistory));
            } else {
                setError(data.error || 'Failed to fetch attendance');
            }
        } catch (err) {
            setError(err.message || 'Connection failed. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // PREMIUM DESIGN OVERHAUL: Glassmorphism + Animated Background
    return (
        <div className="min-h-screen text-gray-900 font-sans p-4 md:p-8">
            <div className="container mx-auto max-w-7xl relative">

                {/* Top-Right Action Buttons */}
                <div className="absolute top-0 right-0 flex gap-3 z-50 animate-fade-in-down">
                    {/* Export Button with Dropdown (only shown when data is loaded) */}
                    {attendanceData && (
                        <div className="relative">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="glass hover:bg-white/30 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                                aria-label="Export Data"
                                title="Export attendance data"
                            >
                                <Download className="w-6 h-6 text-indigo-600" />
                            </button>

                            {/* Dropdown Menu */}
                            {showExportMenu && (
                                <div className="absolute top-14 right-0 glass rounded-xl shadow-xl overflow-hidden min-w-40 z-50">
                                    <button
                                        onClick={exportToPDF}
                                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-white/30 transition-colors flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export as PDF
                                    </button>
                                    <button
                                        onClick={exportToCSV}
                                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-white/30 transition-colors flex items-center gap-2 border-t border-gray-200"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export as CSV
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Refresh Button (only shown when data is loaded) */}
                    {attendanceData && (
                        <button
                            onClick={() => {
                                setAttendanceData(null);
                                handleFetchAttendance({ preventDefault: () => { } });
                            }}
                            disabled={loading}
                            className="glass hover:bg-white/30 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group"
                            aria-label="Refresh Attendance"
                            title={lastFetched ? `Last updated ${getRelativeTime(lastFetched)}` : 'Refresh'}
                        >
                            <RefreshCw className={`w-6 h-6 text-indigo-600 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        </button>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full glass hover:bg-white/20 transition-all duration-300"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-12 pt-8 animate-fade-in-down">
                    <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-md mb-4 tracking-tighter">
                        Attendance Tracker
                    </h1>
                    <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
                        Monitor your academic progress with precision and style.
                    </p>
                </div>

                {/* Login Form */}
                {!attendanceData && (
                    <div className="max-w-md mx-auto animate-fade-in-up">
                        <div className="glass rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
                            <form onSubmit={handleFetchAttendance} className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                                        Register Number
                                    </label>
                                    <input
                                        type="text"
                                        value={registerNumber}
                                        onChange={(e) => setRegisterNumber(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/50 border border-white/40 rounded-xl focus:ring-4 focus:ring-white/50 focus:border-white transition-all outline-none font-medium text-gray-900 placeholder-gray-500 backdrop-blur-sm"
                                        placeholder="Enter your register number"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/50 border border-white/40 rounded-xl focus:ring-4 focus:ring-white/50 focus:border-white transition-all outline-none font-medium text-gray-900 placeholder-gray-500 backdrop-blur-sm"
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Remember Me Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm font-semibold text-gray-700 cursor-pointer">
                                        Remember Me
                                    </label>
                                </div>

                                {error && (
                                    <div className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-r-lg backdrop-blur-md">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <TrendingDown className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-800 font-bold">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black/80 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Connecting...
                                        </span>
                                    ) : (
                                        'Access Dashboard'
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-6">
                                    Secure connection via local automation. No data stored.
                                </p>
                            </form>
                        </div>
                    </div>
                )}

                {/* Dashboard View */}
                {attendanceData && (
                    <div className="animate-fade-in-up">

                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {/* Overall Attendance Card */}
                            <div className="glass p-6 rounded-2xl shadow-lg flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="p-4 bg-white/60 text-purple-700 rounded-xl shadow-sm">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Overall %</p>
                                    <p className={`text-3xl font-black ${attendanceData.summary.overallPercentage >= 75 ? 'text-green-700' : 'text-red-700'}`}>
                                        {attendanceData.summary.overallPercentage}%
                                    </p>
                                </div>
                            </div>

                            {/* Total Subjects Card */}
                            <div className="glass p-6 rounded-2xl shadow-lg flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="p-4 bg-white/60 text-indigo-700 rounded-xl shadow-sm">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Total Subjects</p>
                                    <p className="text-3xl font-black text-gray-800">{attendanceData.summary.totalSubjects}</p>
                                </div>
                            </div>

                            {/* Bunk Status Card (Replaces Safe Subjects) */}
                            <div className={`glass p-6 rounded-2xl shadow-lg flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300 ${attendanceData.overall.status === 'Safe' ? 'border-green-300' : 'border-red-300'}`}>
                                <div className={`p-4 rounded-xl shadow-sm ${attendanceData.overall.status === 'Safe' ? 'bg-white/60 text-green-700' : 'bg-white/60 text-red-700'}`}>
                                    {attendanceData.overall.status === 'Safe' ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold uppercase tracking-wide ${attendanceData.overall.status === 'Safe' ? 'text-green-700' : 'text-red-700'}`}>
                                        {attendanceData.overall.status === 'Safe' ? 'Bunk Budget' : 'Deficit'}
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <p className={`text-3xl font-bold ${attendanceData.overall.status === 'Safe' ? 'text-green-900' : 'text-red-900'}`}>
                                            {attendanceData.overall.status === 'Safe' ? attendanceData.overall.skippable : attendanceData.overall.mustAttend}
                                        </p>
                                        <span className={`text-sm font-medium ${attendanceData.overall.status === 'Safe' ? 'text-green-700' : 'text-red-700'}`}>
                                            {attendanceData.overall.status === 'Safe' ? 'classes available' : 'classes needed'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Subjects Card */}
                            <div className="glass p-6 rounded-2xl shadow-lg flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="p-4 bg-white/60 text-red-700 rounded-xl shadow-sm">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Danger (&lt;75%)</p>
                                    <p className="text-3xl font-black text-gray-800">{attendanceData.summary.dangerSubjects}</p>
                                </div>
                            </div>
                        </div>

                        {/* What-If Calculator */}
                        <WhatIfCalculator overall={attendanceData.overall} />

                        {/* Day-Wise Attendance Chart */}
                        <DayWiseChart subjects={attendanceData.subjects} />

                        {/* Subject Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                            {attendanceData.subjects.map((subject, index) => (
                                <ModernSubjectCard key={index} subject={subject} index={index} />
                            ))}
                        </div>

                        {/* Fetch Again Button */}
                        <div className="text-center mt-16 pb-8">
                            <button
                                onClick={() => {
                                    setAttendanceData(null);
                                    setRegisterNumber('');
                                    setPassword('');
                                    setError('');
                                }}
                                className="group inline-flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Check Another Student
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
