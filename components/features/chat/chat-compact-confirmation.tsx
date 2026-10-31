'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ChatCompactConfirmationProps {
    onConfirm: () => void;
    onCancel: () => void;
    className?: string;
    autoFocus?: boolean;
}

export function ChatCompactConfirmation({
    onConfirm,
    onCancel,
    className = '',
    autoFocus = true,
}: ChatCompactConfirmationProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }
        },
        [onCancel],
    );

    useEffect(() => {
        if (autoFocus) {
            containerRef.current?.focus();
        }
    }, [autoFocus]);

    return (
        <motion.div
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            className={`
                absolute bottom-full left-0 w-80 mb-2 z-[70]
                bg-white/80 dark:bg-neutral-900/80 
                backdrop-blur-xl backdrop-saturate-150
                border border-white/30 dark:border-neutral-700/40
                shadow-xl shadow-black/5 dark:shadow-black/20
                rounded-lg overflow-hidden 
                text-neutral-900 dark:text-white
                ${className}
            `}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1],
            }}
        >
            <div className="p-2">
                <div className="text-xs font-medium mb-1.5 text-neutral-800 dark:text-neutral-100">
                    Compact conversation?
                </div>
                <p className="mb-2 text-[9px] text-neutral-600 dark:text-neutral-400">
                    This will summarize the conversation, create a new workspace, and reset the LLM context here while
                    keeping messages visible.
                </p>

                <div className="flex space-x-1.5 mb-1.5">
                    <motion.button
                        onClick={onConfirm}
                        className="
                            bg-red-500/70 hover:bg-red-600/70 
                            text-white px-1.5 py-0.5 rounded text-[10px] font-medium
                            backdrop-blur-sm border border-red-400/20
                            shadow-md transition-all duration-150
                        "
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Compact
                    </motion.button>
                    <motion.button
                        onClick={onCancel}
                        className="
                            bg-white/40 dark:bg-neutral-800/40 
                            hover:bg-white/60 dark:hover:bg-neutral-800/60
                            px-1.5 py-0.5 rounded text-[10px] font-medium
                            backdrop-blur-sm border border-neutral-300/20 dark:border-neutral-600/20
                            text-neutral-800 dark:text-neutral-100
                            shadow-md transition-all duration-150
                        "
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancel
                    </motion.button>
                </div>

                <div className="border-t border-neutral-200/20 dark:border-neutral-700/20 pt-1.5">
                    <div className="text-[9px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                        <span>Choose action</span>
                        <span className="flex items-center gap-1">
                            <span className="bg-neutral-100/40 dark:bg-neutral-700/40 px-0.5 py-0.5 rounded font-mono text-[8px]">
                                esc
                            </span>
                            <span>close</span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
