'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface LimitReachedModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    limitType: 'notebook' | 'journal' | 'space';
}

export const LimitReachedModal = ({ isOpen, onClose, message, limitType }: LimitReachedModalProps) => {
    const { setPremium } = useUser();
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Store previously focused element and focus the modal when opened
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Focus the modal after animation completes
            const timer = setTimeout(() => {
                modalRef.current?.focus();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Return focus to previously focused element when modal closes
    useEffect(() => {
        return () => {
            if (previousFocusRef.current && !isOpen) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen]);

    // Handle focus trapping
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }

        // Trap focus within modal
        if (e.key === 'Tab') {
            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );

            if (!focusableElements?.length) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    // Define different gradients in grayscale
    const getColors = () => {
        switch (limitType) {
            case 'notebook':
                return 'from-neutral-300/20 to-neutral-500/20 border-neutral-400/30 dark:from-neutral-700/30 dark:to-neutral-900/30 dark:border-neutral-600/30';
            case 'journal':
                return 'from-neutral-200/20 to-neutral-400/20 border-neutral-300/30 dark:from-neutral-800/30 dark:to-neutral-900/30 dark:border-neutral-700/30';
            case 'space':
                return 'from-neutral-300/20 to-neutral-500/20 border-neutral-400/30 dark:from-neutral-700/30 dark:to-neutral-900/30 dark:border-neutral-600/30';
            default:
                return 'from-neutral-300/20 to-neutral-500/20 border-neutral-400/30 dark:from-neutral-700/30 dark:to-neutral-900/30 dark:border-neutral-600/30';
        }
    };

    // Get emoji based on limit type
    const getEmoji = () => {
        switch (limitType) {
            case 'notebook':
                return '📚';
            case 'journal':
                return '📝';
            case 'space':
                return '💬';
            default:
                return '✨';
        }
    };

    const handleEnablePremium = () => {
        setPremium(true);
        onClose();
    };

    // Define IDs for accessibility
    const modalTitleId = 'limit-reached-modal-title';
    const modalDescriptionId = 'limit-reached-modal-description';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20 dark:bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    role="presentation"
                >
                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={modalTitleId}
                        aria-describedby={modalDescriptionId}
                        tabIndex={-1}
                        onKeyDown={handleKeyDown}
                        className={`bg-gradient-to-br ${getColors()} max-w-md w-full rounded-xl border backdrop-blur-md shadow-lg overflow-hidden bg-white/60 dark:bg-black/60`}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative p-6">
                            <button
                                onClick={onClose}
                                aria-label="Close dialog"
                                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                            >
                                <X className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="text-4xl mb-4" aria-hidden="true">
                                    {getEmoji()}
                                </div>
                                <h3
                                    id={modalTitleId}
                                    className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-2"
                                >
                                    Limit Reached
                                </h3>
                                <p
                                    id={modalDescriptionId}
                                    className="text-sm text-neutral-600 dark:text-neutral-300 mb-6"
                                >
                                    {message}
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-700 dark:to-black text-white hover:from-neutral-700 hover:to-neutral-900 dark:hover:from-neutral-600 dark:hover:to-neutral-900 transition-colors shadow-md"
                                    >
                                        Got it
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
