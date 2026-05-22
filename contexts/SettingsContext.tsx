'use client';

import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface SettingsContextType {
    systemPrompt: string;
    setSystemPrompt: (prompt: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [systemPrompt, setSystemPrompt] = useLocalStorage<string>('settings-system-prompt', '');

    const value = React.useMemo(() => ({
        systemPrompt,
        setSystemPrompt
    }), [systemPrompt, setSystemPrompt]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
