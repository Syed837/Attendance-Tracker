'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { TrendingUp } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function TrendsChart({ history }) {
    if (!history || history.length < 2) {
        return (
            <div className="glass rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-indigo-700" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Attendance Trends</h3>
                        <p className="text-sm text-gray-600">Track your progress over time</p>
                    </div>
                </div>
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Fetch your attendance a few more times to see trends!</p>
                    <p className="text-xs mt-2">Minimum 2 data points required</p>
                </div>
            </div>
        );
    }

    // Prepare data for Chart.js
    const labels = history.map(item => {
        const date = new Date(item.timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const percentages = history.map(item => item.percentage);

    const data = {
        labels,
        datasets: [
            {
                label: 'Overall Attendance %',
                data: percentages,
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
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
                    label: function (context) {
                        return `Attendance: ${context.parsed.y}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                min: Math.max(0, Math.min(...percentages) - 5),
                max: Math.min(100, Math.max(...percentages) + 5),
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
                    color: '#6b7280'
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
                    <TrendingUp className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Attendance Trends</h3>
                    <p className="text-sm text-gray-600">{history.length} data points tracked</p>
                </div>
            </div>

            <div className="h-64">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
