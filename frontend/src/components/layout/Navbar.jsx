'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, BarChart3 } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            AttendanceTracker
                        </span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {isAuthenticated && user && (
                            <>
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <User className="w-5 h-5" />
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
