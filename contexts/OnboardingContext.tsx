'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ONBOARDING_COMPLETED_KEY } from '@/lib/storageKeys';

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    targetId: string; // ID of the DOM element to highlight
    order?: number; // Optional order for sorting steps
}

interface OnboardingContextType {
    isVisible: boolean;
    activeStep: number;
    isCompleted: boolean;
    steps: OnboardingStep[];
    startTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTutorial: () => void;
    completeTutorial: () => void;
    registerStep: (step: OnboardingStep) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isCompleted, setIsCompleted] = useLocalStorage<boolean>(ONBOARDING_COMPLETED_KEY, false);
    const [steps, setSteps] = useState<OnboardingStep[]>([]);

    const startTutorial = useCallback(() => {
        setActiveStep(0);
        setIsVisible(true);
    }, []);

    const nextStep = useCallback(() => {
        setActiveStep((prev) => {
            if (steps.length === 0) return 0;
            const maxIndex = Math.max(0, steps.length - 1);
            return Math.min(prev + 1, maxIndex);
        });
    }, [steps.length]);

    const prevStep = useCallback(() => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    }, []);

    const skipTutorial = useCallback(() => {
        setIsVisible(false);
    }, []);

    const completeTutorial = useCallback(() => {
        setIsVisible(false);
        setIsCompleted(true);
    }, [setIsCompleted]);

    const registerStep = useCallback((step: OnboardingStep) => {
        setSteps((prev) => {
            // Check if step already exists
            if (prev.find((s) => s.id === step.id)) return prev;
            const newSteps = [...prev, step];
            // Sort by order if present, default to 999 if not
            return newSteps.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        });
    }, []);

    const value = useMemo(() => ({
        isVisible,
        activeStep,
        isCompleted,
        steps,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        registerStep
    }), [
        isVisible,
        activeStep,
        isCompleted,
        steps,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        registerStep
    ]);

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
