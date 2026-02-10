import Card from '../ui/Card';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';

export default function SubjectCard({ subject, onClick }) {
    const { name, code, stats } = subject;
    const {
        currentPercentage,
        targetPercentage,
        total,
        attended,
        absent,
        status,
        canSkip,
        mustAttend,
        message
    } = stats || {};

    const getStatusIcon = () => {
        switch (status) {
            case 'excellent':
                return <CheckCircle className="w-5 h-5 text-success-600" />;
            case 'good':
                return <TrendingUp className="w-5 h-5 text-primary-600" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-warning-600" />;
            case 'critical':
                return <TrendingDown className="w-5 h-5 text-danger-600" />;
            default:
                return <BookOpen className="w-5 h-5 text-gray-600" />;
        }
    };

    const getProgressColor = () => {
        if (currentPercentage >= targetPercentage + 10) return 'bg-success-500';
        if (currentPercentage >= targetPercentage) return 'bg-primary-500';
        if (currentPercentage >= targetPercentage - 10) return 'bg-warning-500';
        return 'bg-danger-500';
    };

    const getBgColor = () => {
        if (currentPercentage >= targetPercentage + 10) return 'bg-success-50 dark:bg-success-900/10';
        if (currentPercentage >= targetPercentage) return 'bg-primary-50 dark:bg-primary-900/10';
        if (currentPercentage >= targetPercentage - 10) return 'bg-warning-50 dark:bg-warning-900/10';
        return 'bg-danger-50 dark:bg-danger-900/10';
    };

    return (
        <Card hover className={`cursor-pointer ${getBgColor()}`} onClick={onClick}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
                    {code && <p className="text-sm text-gray-600 dark:text-gray-400">{code}</p>}
                </div>
                {getStatusIcon()}
            </div>

            {/* Stats */}
            <div className="space-y-3">
                {/* Progress bar */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Attendance</span>
                        <span className="font-bold text-gray-900 dark:text-white">{currentPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                            style={{ width: `${Math.min(currentPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Classes info */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{total || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Present</p>
                        <p className="text-lg font-bold text-success-600">{attended || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Absent</p>
                        <p className="text-lg font-bold text-danger-600">{absent || 0}</p>
                    </div>
                </div>

                {/* Skip/Attend message */}
                {message && (
                    <div className={`p-3 rounded-lg ${canSkip !== undefined
                            ? 'bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-400'
                            : 'bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400'
                        }`}>
                        <p className="text-sm font-medium text-center">{message}</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
