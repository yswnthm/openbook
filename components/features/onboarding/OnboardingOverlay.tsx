'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function OnboardingOverlay() {
    const { isVisible, activeStep, steps, skipTutorial } = useOnboarding();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Effect to update rect when step changes or resize happens
    useEffect(() => {
        if (!isVisible) return;

        const updateRect = () => {
            const currentStep = steps[activeStep];
            if (currentStep?.targetId) {
                const element = document.getElementById(currentStep.targetId);
                if (element) {
                    setTargetRect(element.getBoundingClientRect());
                } else {
                    setTargetRect(null);
                }
            } else {
                setTargetRect(null);
            }
        };

        // Initial update
        updateRect();

        // Use ResizeObserver for more robust updates
        const resizeObserver = new ResizeObserver(updateRect);
        resizeObserver.observe(document.body);

        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [isVisible, activeStep, steps]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 overflow-hidden"
                    data-testid="onboarding-overlay"
                >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <mask id="overlay-mask">
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                {targetRect && (
                                    <motion.rect
                                        initial={false}
                                        animate={{
                                            x: targetRect.left,
                                            y: targetRect.top,
                                            width: targetRect.width,
                                            height: targetRect.height
                                        }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        fill="black"
                                        rx="8"
                                    />
                                )}
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="rgba(0,0,0,0.4)"
                            mask="url(#overlay-mask)"
                            className="backdrop-blur-[2px]"
                        />
                    </svg>
                    
                    {/* Clickable backdrop area (if we want to allow clicking outside to close) */}
                    {/* For now, we rely on the tooltip buttons to navigate, but could add a skip here */}
                </motion.div>
            )}
        </AnimatePresence>
    );
}