'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { STREAK_COUNT_KEY, STREAK_LAST_VISIT_KEY } from '@/lib/streakKeys';

export const StreakTester: React.FC = () => {
    const setStreak = (days: number) => {
        // Set the streak count
        localStorage.setItem(STREAK_COUNT_KEY, days.toString());

        // Set the last visit to today to maintain the streak
        localStorage.setItem(STREAK_LAST_VISIT_KEY, new Date().toISOString());

        // Refresh the page to trigger the useStreak hook to recalculate
        window.location.reload();
    };

    const resetStreak = () => {
        localStorage.removeItem(STREAK_COUNT_KEY);
        localStorage.removeItem(STREAK_LAST_VISIT_KEY);
        window.location.reload();
    };

    const getCurrentStreak = () => {
        return localStorage.getItem(STREAK_COUNT_KEY) || '1';
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Streak Tester (Current: {getCurrentStreak()})
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Test different ranges */}
                <Button size="sm" onClick={() => setStreak(1)} variant="outline">
                    1 day (Yellow)
                </Button>
                <Button size="sm" onClick={() => setStreak(3)} variant="outline">
                    3 days (Yellow)
                </Button>
                <Button size="sm" onClick={() => setStreak(4)} variant="outline">
                    4 days (Orange)
                </Button>
                <Button size="sm" onClick={() => setStreak(6)} variant="outline">
                    6 days (Orange)
                </Button>
                <Button size="sm" onClick={() => setStreak(7)} variant="outline">
                    7 days (Gradient + 🎉)
                </Button>
                <Button size="sm" onClick={() => setStreak(30)} variant="outline">
                    30 days (🎉)
                </Button>
                <Button size="sm" onClick={() => setStreak(100)} variant="outline">
                    100 days (🎉)
                </Button>
                <Button size="sm" onClick={resetStreak} variant="destructive">
                    Reset
                </Button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400">
                Click to test different streak states. Page will reload to update the hook.
            </p>
        </div>
    );
};

