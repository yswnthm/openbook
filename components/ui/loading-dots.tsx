'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Minimalistic animated dot loader used across the chat UI.
 * Shows three tiny dots fading/bouncing in sequence.
 */
export function LoadingDots({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-1', className)} aria-label="Loading">
            <span
                className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce"
                style={{ animationDelay: '-0.3s' }}
            />
            <span
                className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce"
                style={{ animationDelay: '-0.15s' }}
            />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" />
        </div>
    );
}
