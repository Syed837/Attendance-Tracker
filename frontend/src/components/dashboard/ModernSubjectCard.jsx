import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ModernSubjectCard({ subject, index }) {
    const { name, code, attended, total, percentage, skippable, status } = subject;
    // Use the backend-provided status for the Safe/Danger decision
    // This ensures global policy (Overall %) overrides individual subject %
    const isSafe = status === 'Safe';

    // What-If Calculator State
    const [whatIfClasses, setWhatIfClasses] = useState(0);
    const [projectedPercentage, setProjectedPercentage] = useState(percentage);

    useEffect(() => {
        if (!total) return;
        const newTotal = total + whatIfClasses;
        const newAttended = attended + whatIfClasses;
        const newPercentage = (newAttended / newTotal) * 100;
        setProjectedPercentage(newPercentage.toFixed(2));
    }, [whatIfClasses, attended, total]);

    // Circular Progress Calculation
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const strokeColor = isSafe ? '#10B981' : '#EF4444'; // Green or Red

    return (
        <div
            className="glass rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between h-full relative overflow-hidden group hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, opacity: 0 }} // opacity 0 start is handled by keyframe usually, but ensuring it prevents flash
        >


            {/* Header */}
            <div className="mb-4 pr-16">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    {code}
                </p>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {name}
                </h3>
            </div>

            {/* Progress & Stats Row */}
            <div className="flex items-center justify-between mb-6">
                {/* Circular Progress */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="transparent"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke={strokeColor}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    {/* Centered Percentage */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xl font-bold ${isSafe ? 'text-gray-900' : 'text-red-600'}`}>
                            {percentage}%
                        </span>
                    </div>
                </div>

                {/* Stats Columns */}
                <div className="flex-1 ml-6 space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-sm text-gray-500 font-medium">Attended</span>
                        <span className="text-lg font-bold text-gray-900">{attended}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 font-medium">Total</span>
                        <span className="text-lg font-bold text-gray-900">{total}</span>
                    </div>
                </div>
            </div>

            {/* Mini What-If Calculator */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">What-If</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-600">
                        If I attend next <span className="font-bold text-indigo-600">{whatIfClasses}</span> classes
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        value={whatIfClasses}
                        onChange={(e) => setWhatIfClasses(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />

                    {whatIfClasses > 0 && (
                        <div className="flex items-center justify-between text-xs mt-2">
                            <span className="text-gray-500">New %:</span>
                            <span className={`font-bold ${projectedPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                {projectedPercentage}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
