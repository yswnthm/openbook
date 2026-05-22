'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StudyFramework } from '@/lib/types';
import { getFrameworkDisplayName, getFrameworkDescription, getFrameworkIcon } from '@/lib/study-prompts';
import { motion } from 'framer-motion';

interface StudyFrameworkPickerProps {
    onSelect: (framework: StudyFramework) => void;
    onClose: () => void;
    className?: string;
    placement?: 'top' | 'bottom';
}

export function StudyFrameworkPicker({ onSelect, onClose, className = '', placement = 'top' }: StudyFrameworkPickerProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const frameworks = React.useMemo(
        () => [
            StudyFramework.FeynmanTechnique,
            StudyFramework.SocraticTutor,
            StudyFramework.ActiveRecall,
        ],
        [],
    );

    // Helper to calculate the next index based on direction
    const calculateNewIndex = useCallback(
        (
            currentIndex: number,
            direction: "prev" | "next",
        ): number => {
            if (direction === "prev") {
                return currentIndex > 0 ? currentIndex - 1 : frameworks.length - 1;
            }
            // direction === "next"
            return currentIndex < frameworks.length - 1 ? currentIndex + 1 : 0;
        },
        [frameworks],
    );

    // Handle keyboard interaction only when the picker itself is focused
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            switch (e.key) {
                case '1':
                case '2':
                case '3': {
                    e.preventDefault();
                    const index = parseInt(e.key, 10) - 1;
                    if (index >= 0 && index < frameworks.length) {
                        onSelect(frameworks[index]);
                    }
                    break;
                }
                case 'ArrowUp':
                case 'ArrowLeft': {
                    e.preventDefault();
                    const newIndex = calculateNewIndex(selectedIndex, 'prev');
                    setSelectedIndex(newIndex);
                    setHoveredIndex(newIndex);
                    break;
                }
                case 'ArrowDown':
                case 'ArrowRight': {
                    e.preventDefault();
                    const newIndex = calculateNewIndex(selectedIndex, 'next');
                    setSelectedIndex(newIndex);
                    setHoveredIndex(newIndex);
                    break;
                }
                case 'Enter':
                    e.preventDefault();
                    onSelect(frameworks[selectedIndex]);
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        },
        [frameworks, onSelect, onClose, selectedIndex, calculateNewIndex],
    );

    // Auto-focus the container so it can capture keyboard events immediately
    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    // Determine position based on placement prop
    const positionClasses = placement === 'top'
        ? 'bottom-full mb-2 origin-bottom'
        : 'top-full mt-2 origin-top';

    return (
        <motion.div
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            className={`
                absolute left-0 w-80 z-[1000]
                bg-white/60 dark:bg-neutral-900/60 
                backdrop-blur-xl backdrop-saturate-150
                border border-white/30 dark:border-neutral-700/40
                shadow-xl shadow-black/5 dark:shadow-black/20
                rounded-lg overflow-hidden 
                text-neutral-900 dark:text-white
                ${positionClasses}
                ${className}
            `}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1]
            }}
        >
            <div className="p-2">
                <div className="text-xs font-medium mb-2 text-neutral-800 dark:text-neutral-100">
                    Study Framework
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {frameworks.map((framework, index) => {
                        const isSelected = index === selectedIndex;
                        const isHovered = hoveredIndex === index;
                        const displayIndex = index + 1;

                        return (
                            <motion.div
                                key={framework}
                                role="button"
                                aria-label={getFrameworkDisplayName(framework)}
                                aria-pressed={isSelected}
                                className={`
                                    p-2 rounded cursor-pointer transition-all duration-150 
                                    border backdrop-blur-sm
                                    ${isSelected || isHovered
                                        ? 'bg-white/50 dark:bg-neutral-800/50 border-neutral-300/40 dark:border-neutral-600/40 shadow-md'
                                        : 'bg-white/20 dark:bg-neutral-800/20 border-neutral-200/20 dark:border-neutral-700/20 hover:bg-white/40 dark:hover:bg-neutral-800/40'
                                    }
                                `}
                                onClick={() => onSelect(framework)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-1 mb-0.5">
                                    <span className="text-sm">{getFrameworkIcon(framework)}</span>
                                    <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono bg-neutral-100/40 dark:bg-neutral-700/40 px-0.5 py-0.5 rounded">
                                        {displayIndex}
                                    </span>
                                </div>
                                <div className="text-[11px] font-medium mb-0.5 text-neutral-800 dark:text-neutral-100">
                                    {getFrameworkDisplayName(framework)}
                                </div>
                                <div className="text-[9px] text-neutral-600 dark:text-neutral-400 leading-tight">
                                    {getFrameworkDescription(framework)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="border-t border-neutral-200/20 dark:border-neutral-700/20 pt-1.5">
                    <div className="text-[9px] text-neutral-500 dark:text-neutral-400">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                                <span className="bg-neutral-100/40 dark:bg-neutral-700/40 px-0.5 py-0.5 rounded font-mono text-[8px]">1-3</span>
                                <span>select</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="bg-neutral-100/40 dark:bg-neutral-700/40 px-0.5 py-0.5 rounded font-mono text-[8px]">esc</span>
                                <span>close</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 