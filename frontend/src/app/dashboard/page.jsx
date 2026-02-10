'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import StatsCard from '../../components/dashboard/StatsCard';
import SubjectCard from '../../components/dashboard/SubjectCard';
import AddSubjectForm from '../../components/dashboard/AddSubjectForm';
import AddAttendanceForm from '../../components/dashboard/AddAttendanceForm';
import AutoFetchModal from '../../components/dashboard/AutoFetchModal';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import { Plus, BookOpen, TrendingUp, AlertCircle, Download, FileDown, Zap } from 'lucide-react';

export default function DashboardPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showAutoFetch, setShowAutoFetch] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadSubjects();
        }
    }, [isAuthenticated]);

    const loadSubjects = async () => {
        try {
            const data = await api.getSubjects();
            setSubjects(data.subjects || []);
        } catch (err) {
            console.error('Failed to load subjects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        api.exportPDF();
    };

    const handleExportCSV = () => {
        api.exportCSV();
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Calculate overall stats
    let totalClasses = 0;
    let totalAttended = 0;
    let subjectsBelow75 = 0;

    subjects.forEach(subject => {
        totalClasses += subject.stats?.total || 0;
        totalAttended += subject.stats?.attended || 0;
        if (subject.stats?.currentPercentage < 75) {
            subjectsBelow75++;
        }
    });

    const overallPercentage = totalClasses > 0
        ? Math.round((totalAttended / totalClasses) * 100 * 100) / 100
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your attendance</p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <Button variant="outline" onClick={handleExportPDF}>
                            <Download className="w-4 h-4" />
                            Export PDF
                        </Button>
                        <Button variant="outline" onClick={handleExportCSV}>
                            <FileDown className="w-4 h-4" />
                            Export CSV
                        </Button>
                        <Button variant="success" onClick={() => setShowAutoFetch(true)}>
                            <Zap className="w-4 h-4" />
                            Auto-Fetch
                        </Button>
                        <Button variant="primary" onClick={() => setShowAddSubject(true)}>
                            <Plus className="w-4 h-4" />
                            Add Subject
                        </Button>
                    </div>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Overall Attendance"
                        value={`${overallPercentage}%`}
                        subtitle={`${totalAttended} / ${totalClasses} classes`}
                        icon={TrendingUp}
                        color={overallPercentage >= 75 ? 'success' : 'danger'}
                    />
                    <StatsCard
                        title="Total Subjects"
                        value={subjects.length}
                        subtitle={`${subjects.length} subjects tracked`}
                        icon={BookOpen}
                        color="primary"
                    />
                    <StatsCard
                        title="Total Classes"
                        value={totalClasses}
                        subtitle={`${totalAttended} attended`}
                        icon={BookOpen}
                        color="success"
                    />
                    <StatsCard
                        title="Below Target"
                        value={subjectsBelow75}
                        subtitle={`${subjectsBelow75} subjects < 75%`}
                        icon={AlertCircle}
                        color={subjectsBelow75 > 0 ? 'warning' : 'success'}
                    />
                </div>

                {/* Subjects Grid */}
                {subjects.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No subjects yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start by adding your first subject to track attendance
                        </p>
                        <Button variant="primary" onClick={() => setShowAddSubject(true)}>
                            <Plus className="w-4 h-4" />
                            Add Your First Subject
                        </Button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Subjects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects.map(subject => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject}
                                    onClick={() => setSelectedSubject(subject)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddSubjectForm
                isOpen={showAddSubject}
                onClose={() => setShowAddSubject(false)}
                onSuccess={loadSubjects}
            />

            {selectedSubject && (
                <AddAttendanceForm
                    isOpen={!!selectedSubject}
                    onClose={() => setSelectedSubject(null)}
                    subjectId={selectedSubject.id}
                    onSuccess={() => {
                        loadSubjects();
                        setSelectedSubject(null);
                    }}
                />
            )}

            <AutoFetchModal
                isOpen={showAutoFetch}
                onClose={() => setShowAutoFetch(false)}
                onSuccess={loadSubjects}
            />
        </div>
    );
}
