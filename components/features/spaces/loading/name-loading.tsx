'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';


interface NameLoadingProps {
    isLoading?: boolean;
    defaultText?: string;
    className?: string;
}

/**
 * Component to display loading states for conversation names
 * Shows a placeholder with loading animation when names are being generated
 */
export function NameLoading({ isLoading = true, defaultText: _defaultText = 'Untitled Conversation', className }: NameLoadingProps) {
    // Loading text states
    const loadingTexts = ['Generating title...', 'Analyzing conversation...', 'Creating title...'];

    const [loadingTextIndex, setLoadingTextIndex] = React.useState(0);

    // Cycle through loading texts for better UX
    React.useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isLoading, loadingTexts.length]);

    if (!isLoading) return null;

    return (
        <div className={cn('flex items-center gap-1 text-xs', className)}>
            <Loader2 className="h-2.5 w-2.5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground text-xs">{loadingTexts[loadingTextIndex]}</span>
        </div>
    );
}

/**
 * Component to display a conversation name that may be loading or generated
 * Handles transitions between loading and final states
 */
export function ConversationNameDisplay({
    name,
    isLoading,
    isAutoNamed,
    className,
}: {
    name: string;
    isLoading?: boolean;
    isAutoNamed?: boolean;
    className?: string;
}) {
    return (
        <div className={cn('relative', className)}>
            {/* Always show the name (or default) */}
            <span className={cn('transition-opacity duration-200', isLoading ? 'opacity-60' : 'opacity-100')}>
                {name || 'Untitled Conversation'}
            </span>

            {/* Show loading indicator when generating */}
            {isLoading && (
                <div className="absolute -bottom-3.5 left-0 right-0">
                    <NameLoading />
                </div>
            )}

            {/* Minimalistic indicator for auto-named conversations */}
            {!isLoading && isAutoNamed && (
                <div
                    className="absolute -top-0.5 -right-2 w-1 h-1 rounded-full bg-blue-400/70"
                    title="Automatically named based on conversation content"
                />
            )}
        </div>
    );
}
