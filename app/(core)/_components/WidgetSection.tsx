import React, { memo, useCallback } from 'react';
import { Streak } from '@/components/features/spaces/Streak';
import { SurprisePromptButton } from '@/components/features/spaces/SurprisePromptButton';

export const WidgetSection: React.FC<{
    status: string;
    appendWithPersist: (messageProps: { role: 'user' | 'assistant'; content: string }, options?: any) => Promise<any>;
    lastSubmittedQueryRef: React.MutableRefObject<string>;
    setHasSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}> = memo(({ status, appendWithPersist, lastSubmittedQueryRef, setHasSubmitted }) => {
    const handleSurprisePrompt = useCallback(
        (prompt: string) => {
            if (status !== 'ready') return;
            void appendWithPersist({
                content: prompt,
                role: 'user',
            });
            lastSubmittedQueryRef.current = prompt;
            setHasSubmitted(true);
        },
        [status, appendWithPersist, lastSubmittedQueryRef, setHasSubmitted],
    );

    return (
        <div id="onboarding-widgets-container" className="w-full mt-0 sm:mt-2 md:mt-4">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {/* Daily streak indicator */}
                <Streak />

                {/* Surprise prompt button */}
                <SurprisePromptButton onPrompt={handleSurprisePrompt} />
            </div>
        </div>
    );
});

WidgetSection.displayName = 'WidgetSection';
