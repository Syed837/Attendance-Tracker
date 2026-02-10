import { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Target } from 'lucide-react';

export default function WhatIfCalculator({ overall }) {
    const [classesToAttend, setClassesToAttend] = useState(0);
    const [projectedPercentage, setProjectedPercentage] = useState(overall.percentage);

    const { attended, total } = overall;

    useEffect(() => {
        if (!total) return;
        // Formula: (Current Attended + Extra) / (Current Total + Extra) * 100
        const newTotal = total + classesToAttend;
        const newAttended = attended + classesToAttend;
        const newfPercentage = (newAttended / newTotal) * 100;
        setProjectedPercentage(newfPercentage.toFixed(2));
    }, [classesToAttend, attended, total]);

    const isSafe = projectedPercentage >= 75;

    return (
        <div className="glass rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-xl">
                    <Calculator className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">What-If Calculator</h3>
                    <p className="text-sm text-gray-600">Simulate attending future classes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Input Section */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                        If I attend next <span className="text-indigo-600 text-lg mx-1">{classesToAttend}</span> classes...
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={classesToAttend}
                        onChange={(e) => setClassesToAttend(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                        <span>0</span>
                        <span>10</span>
                        <span>20</span>
                        <span>30</span>
                        <span>40</span>
                        <span>50</span>
                    </div>
                </div>

                {/* Result Section */}
                <div className={`p-6 rounded-2xl border transition-all duration-500 ${isSafe ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                        My Overall % will be
                    </p>
                    <div className="flex items-center gap-4">
                        <span className={`text-5xl font-black ${isSafe ? 'text-green-600' : 'text-red-600'}`}>
                            {projectedPercentage}%
                        </span>

                        {classesToAttend > 0 && (
                            <div className="flex flex-col text-xs font-bold animate-pulse">
                                <span className={isSafe ? 'text-green-700' : 'text-red-700'}>
                                    {projectedPercentage > overall.percentage ? 'Increasing' : 'Decreasing'}
                                </span>
                                <span className="text-gray-400">
                                    (Currently {overall.percentage}%)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Target Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                        <Target className="w-4 h-4 text-gray-400" />
                        {isSafe ? (
                            <span className="text-green-700">You will be in the <strong>Safe Zone</strong>! 🎉</span>
                        ) : (
                            <span className="text-red-700">Still in <strong>Danger Zone</strong>. Keep going! 🚨</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
