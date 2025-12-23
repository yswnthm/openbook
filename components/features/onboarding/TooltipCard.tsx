'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TooltipCard() {
    const { isVisible, activeStep, steps, nextStep, prevStep, skipTutorial, completeTutorial } = useOnboarding();
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = steps[activeStep];
    const isLastStep = activeStep === steps.length - 1;

    useEffect(() => {
        if (!isVisible || !step) return;

        const updatePosition = () => {
            if (step.targetId) {
                const target = document.getElementById(step.targetId);
                if (target && tooltipRef.current) {
                    const rect = target.getBoundingClientRect();
                    const tooltipRect = tooltipRef.current.getBoundingClientRect();
                    
                    // Basic positioning: below the target, aligned left
                    let top = rect.bottom + 12;
                    let left = rect.left;

                    // Boundary checks (simple)
                    if (left + tooltipRect.width > window.innerWidth) {
                        left = window.innerWidth - tooltipRect.width - 24;
                    }
                    if (top + tooltipRect.height > window.innerHeight) {
                         // Flip to top if not enough space below
                         top = rect.top - tooltipRect.height - 12;
                    }

                    setPosition({ top, left });
                } else {
                    // Fallback to center if target not found but ID provided
                     setPosition(null);
                }
            } else {
                // Center if no target ID
                setPosition(null);
            }
        };

        // Need a slight delay to allow rendering before measuring tooltip
        const timeout = setTimeout(updatePosition, 0);
        
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isVisible, step, activeStep]);

    useEffect(() => {
        if (!isVisible || !step) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                skipTutorial();
            } else if (e.key === 'ArrowRight') {
                if (isLastStep) completeTutorial();
                else nextStep();
            } else if (e.key === 'ArrowLeft' && activeStep > 0) {
                prevStep();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, step, activeStep, isLastStep, nextStep, prevStep, skipTutorial, completeTutorial]);

    if (!isVisible || !step) return null;

    const isCentered = !step.targetId || !position;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                ref={tooltipRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "fixed z-[51] w-[320px] rounded-xl border bg-card p-4 shadow-lg text-card-foreground",
                    isCentered && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                )}
                style={!isCentered && position ? { top: position.top, left: position.left } : {}}
            >
                <div className="space-y-2">
                    <h3 className="font-semibold leading-none tracking-tight">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <Button variant="ghost" size="sm" onClick={skipTutorial} className="text-muted-foreground">
                        Skip
                    </Button>
                    <div className="flex gap-2">
                        {activeStep > 0 && (
                            <Button variant="outline" size="sm" onClick={prevStep}>
                                Back
                            </Button>
                        )}
                        <Button 
                            size="sm" 
                            onClick={isLastStep ? completeTutorial : nextStep}
                        >
                            {isLastStep ? "Finish" : "Next"}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
