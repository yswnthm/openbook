'use client';

import React from 'react';



export const TypingMessage: React.FC<{ content: string; onComplete?: () => void; speed?: number }> = ({ onComplete }) => {
    const hasCompletedRef = React.useRef(false);

    React.useEffect(() => {
        if (hasCompletedRef.current) return;
        // Immediately signal completion since no typing simulation is performed.
        onComplete?.();
        hasCompletedRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps -- we intentionally want this to run only once on mount
    }, []);

    return null;
};
