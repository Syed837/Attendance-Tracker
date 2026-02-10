'use client';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Calendar } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function DayWiseChart({ subjects }) {
    if (!subjects || subjects.length === 0) {
        return (
            <div className="glass rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Calendar className="w-6 h-6 text-indigo-700" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Day-Wise Attendance</h3>
                        <p className="text-sm text-gray-600">No data available</p>
                    </div>
                </div>
            </div>
        );
    }

    // Group subjects by day (extract day from subject code or name)
    const dayGroups = {
        MON: [],
        TUE: [],
        WED: [],
        THU: [],
        FRI: [],
        SAT: []
    };

    subjects.forEach(subject => {
        // Try to extract day from code or name
        const text = (subject.code + ' ' + subject.name).toUpperCase();
        if (text.includes('MON')) dayGroups.MON.push(subject);
        else if (text.includes('TUE')) dayGroups.TUE.push(subject);
        else if (text.includes('WED')) dayGroups.WED.push(subject);
        else if (text.includes('THU')) dayGroups.THU.push(subject);
        else if (text.includes('FRI')) dayGroups.FRI.push(subject);
        else if (text.includes('SAT')) dayGroups.SAT.push(subject);
    });

    // Calculate average attendance per day
    const days = Object.keys(dayGroups);
    const dayPercentages = days.map(day => {
        const subjects = dayGroups[day];
        if (subjects.length === 0) return 0;

        const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
        const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);

        return totalClasses > 0 ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(2)) : 0;
    });

    const data = {
        labels: days,
        datasets: [
            {
                label: 'Day Attendance %',
                data: dayPercentages,
                backgroundColor: days.map((_, idx) => {
                    const percentage = dayPercentages[idx];
                    if (percentage >= 75) return 'rgba(34, 197, 94, 0.7)'; // Green
                    if (percentage >= 50) return 'rgba(234, 179, 8, 0.7)'; // Yellow
                    return 'rgba(239, 68, 68, 0.7)'; // Red
                }),
                borderColor: days.map((_, idx) => {
                    const percentage = dayPercentages[idx];
                    if (percentage >= 75) return 'rgb(34, 197, 94)';
                    if (percentage >= 50) return 'rgb(234, 179, 8)';
                    return 'rgb(239, 68, 68)';
                }),
                borderWidth: 2,
                borderRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1,
                callbacks: {
                    title: function (context) {
                        const day = context[0].label;
                        const subjectsCount = dayGroups[day].length;
                        return `${day} (${subjectsCount} subject${subjectsCount !== 1 ? 's' : ''})`;
                    },
                    label: function (context) {
                        return `Attendance: ${context.parsed.y}%`;
                    },
                    afterLabel: function (context) {
                        const day = context.label;
                        const subjects = dayGroups[day];
                        const attended = subjects.reduce((sum, s) => sum + s.attended, 0);
                        const total = subjects.reduce((sum, s) => sum + s.total, 0);
                        return `Classes: ${attended}/${total}`;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    },
                    color: '#6b7280'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#6b7280',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="glass rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-xl">
                    <Calendar className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Day-Wise Attendance</h3>
                    <p className="text-sm text-gray-600">Weekly breakdown by day</p>
                </div>
            </div>

            <div className="h-64">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
