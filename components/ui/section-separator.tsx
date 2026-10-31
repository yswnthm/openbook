'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionSeparatorProps {
    className?: string;
}

export function SectionSeparator({ className }: SectionSeparatorProps) {
    return (
        <div className={cn('relative flex items-center justify-center py-8', className)}>
            {/* Left Line with Gradient Fade */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-[1px] w-24 md:w-64 bg-gradient-to-r from-transparent via-primary/50 to-primary origin-right"
            />

            {/* Center Animated Node */}
            <div className="relative mx-4 flex items-center justify-center">
                {/* Pulsing Outer Glow */}
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                />

                {/* Core Dot */}
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(var(--primary),0.5)]"
                />

                {/* Rotating Ring (Subtle) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-6 h-6 rounded-full border border-primary/20 border-t-transparent"
                />
            </div>

            {/* Right Line with Gradient Fade */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-[1px] w-24 md:w-64 bg-gradient-to-l from-transparent via-primary/50 to-primary origin-left"
            />
        </div>
    );
}
