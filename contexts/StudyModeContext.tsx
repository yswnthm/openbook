'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { StudyFramework, StudyModeSettings } from '@/lib/types';

interface StudyModeContextType {
    activeFramework: StudyFramework | null;
    settings: StudyModeSettings['settings'];
    activatedAt: number | null;
    setStudyMode: (framework: StudyFramework | null, spaceId: string) => void;
    updateSettings: (settings: Partial<StudyModeSettings['settings']>, spaceId: string) => void;
    getStudyModeForSpace: (spaceId: string) => StudyModeSettings | null;
    clearStudyMode: (spaceId: string) => void;
}

const StudyModeContext = React.createContext<StudyModeContextType | undefined>(undefined);
import { STUDY_MODES_KEY } from '@/lib/storageKeys';

const STORAGE_KEY = STUDY_MODES_KEY;

export const StudyModeProvider = ({ children }: { children: ReactNode }) => {
    const [studyModes, setStudyModes] = React.useState<Record<string, StudyModeSettings>>({});
    const [currentSpaceId, setCurrentSpaceId] = React.useState<string>('');

    // Load from localStorage
    React.useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Record<string, StudyModeSettings>;
                setStudyModes(parsed);
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    // Persist to localStorage
    React.useEffect(() => {
        if (Object.keys(studyModes).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(studyModes));
        }
    }, [studyModes]);

    // Get current study mode for the active space
    const currentStudyMode = currentSpaceId ? studyModes[currentSpaceId] : null;

    const setStudyMode = React.useCallback((framework: StudyFramework | null, spaceId: string) => {
        setStudyModes((prev) => {
            if (framework === null) {
                const { [spaceId]: removed, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [spaceId]: {
                    framework,
                    activatedAt: Date.now(),
                    settings: {},
                },
            };
        });
    }, []);

    const updateSettings = React.useCallback((settings: Partial<StudyModeSettings['settings']>, spaceId: string) => {
        setStudyModes((prev) => {
            const existing = prev[spaceId];
            if (!existing) return prev;

            return {
                ...prev,
                [spaceId]: {
                    ...existing,
                    settings: {
                        ...existing.settings,
                        ...settings,
                    },
                },
            };
        });
    }, []);

    const getStudyModeForSpace = React.useCallback(
        (spaceId: string): StudyModeSettings | null => {
            return studyModes[spaceId] || null;
        },
        [studyModes],
    );

    const clearStudyMode = React.useCallback((spaceId: string) => {
        setStudyModes((prev) => {
            const { [spaceId]: removed, ...rest } = prev;
            return rest;
        });
    }, []);

    // Update current space ID when needed (this would be called from the parent)
    React.useEffect(() => {
        const handleSpaceChange = (event: CustomEvent<{ spaceId: string }>) => {
            setCurrentSpaceId(event.detail.spaceId);
        };

        window.addEventListener('spaceChanged', handleSpaceChange as EventListener);
        return () => window.removeEventListener('spaceChanged', handleSpaceChange as EventListener);
    }, []);

    const value: StudyModeContextType = {
        activeFramework: currentStudyMode?.framework || null,
        settings: currentStudyMode?.settings || {},
        activatedAt: currentStudyMode?.activatedAt || null,
        setStudyMode,
        updateSettings,
        getStudyModeForSpace,
        clearStudyMode,
    };

    return <StudyModeContext.Provider value={value}>{children}</StudyModeContext.Provider>;
};

export const useStudyMode = () => {
    const context = React.useContext(StudyModeContext);
    if (context === undefined) {
        throw new Error('useStudyMode must be used within a StudyModeProvider');
    }
    return context;
};
