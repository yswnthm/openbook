'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

export function OfflineIndicator({ className }: { className?: string }) {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-lg animate-in fade-in slide-in-from-bottom-2",
                className
            )}
        >
            <WifiOff className="h-4 w-4" />
            <span>You are offline</span>
        </div>
    );
}
