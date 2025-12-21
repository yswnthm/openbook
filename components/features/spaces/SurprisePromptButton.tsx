'use client';

import React, { useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRandomPrompt } from '@/lib/surprisePrompts';

interface SurprisePromptButtonProps {
    onPrompt?: (prompt: string) => void;
}

export const SurprisePromptButton: React.FC<SurprisePromptButtonProps> = ({ onPrompt }) => {
    const handleClick = useCallback(() => {
        const prompt = getRandomPrompt();
        if (onPrompt) {
            onPrompt(prompt);
        }
    }, [onPrompt]);

    return (
        <Button
            type="button"
            variant="outline"
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:shadow-xs transition-all h-auto"
            onClick={handleClick}
        >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">Surprise me!!</span>
        </Button>
    );
};

