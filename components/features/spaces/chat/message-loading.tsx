'use client';

import React from 'react';
import Image from 'next/image';
import { LoadingDots } from '@/components/ui/loading-dots';

// TODO: [TICKET-XXX] The original animated loaders were removed temporarily to mitigate
// layout thrashing on large AI messages.  While we work on a more performant solution,
// this file now exposes lightweight, accessibility-friendly indicators that still
// announce loading state changes to assistive technologies.

// A lightweight loader row shown inside the message list while the AI is thinking or streaming
export const MessageLoading: React.FC<{ loadingText?: string }> = ({ loadingText = 'Loading…' }) => {
    return (
        <div className="flex items-center gap-2 mt-5 mb-2" role="status" aria-live="polite">
            <Image
                src="/logo.svg"
                alt=""
                role="presentation"
                className="size-8 dark:invert"
                width={100}
                height={100}
                unoptimized
                quality={100}
            />
            <h2 className="text-md font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                Neuman
                <LoadingDots />
                <span className="sr-only">{loadingText}</span>
            </h2>
        </div>
    );
};

// Small dots animation that floats at the bottom of the screen while streaming
export const TypingIndicator: React.FC<{ text?: string }> = ({ text = 'Streaming…' }) => {
    return (
        <div
            className="rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 backdrop-blur flex items-center"
            role="status"
            aria-live="polite"
        >
            <LoadingDots />
            <span className="sr-only">{text}</span>
        </div>
    );
};

// Keep the previous API for streaming progress but render an accessible status text
// so that screen readers are informed about ongoing activity.
export const StreamingProgress: React.FC<{ progress?: number }> = ({ progress }) => (
    <progress
        className="sr-only"
        value={typeof progress === 'number' ? progress : undefined}
        max={100}
        aria-valuenow={typeof progress === 'number' ? progress : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading"
    >
        {typeof progress === 'number' ? `Loading ${progress}%` : 'Loading'}
    </progress>
);
