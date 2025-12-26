'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionSeparatorProps {
    className?: string;
}

export function SectionSeparator({ className }: SectionSeparatorProps) {
    return (
        <div className={cn('relative flex items-center justify-center py-12', className)}>
            {/* Left Line */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-[2px] w-full max-w-[100px] md:max-w-[300px] bg-primary/20 origin-right"
            />

            {/* Matchbox Container */}
            <div className="relative mx-6 h-14 w-24 flex items-center justify-center">
                {/* Drawer (Inner Box) - Slides out to the right */}
                <motion.div
                    initial={{ x: 0 }}
                    whileInView={{ x: 15 }} // Slides out
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1.2, delay: 0.2, type: 'spring', bounce: 0.3 }}
                    className="absolute inset-y-1 inset-x-1 bg-primary/40 rounded-sm border border-primary/50"
                >
                    {/* Matches (Texture inside drawer) */}
                    <div className="absolute right-1 top-1 bottom-1 w-2 flex flex-col justify-evenly">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    </div>
                </motion.div>

                {/* Sleeve (Outer Box) - Stays stationary */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-background border-2 border-primary rounded-md z-10 flex items-center justify-center shadow-sm"
                >
                    {/* Decorative pattern on the matchbox sleeve - "Strike" strip */}
                    <div className="absolute left-0 top-2 bottom-2 w-3 bg-primary/10 border-r border-primary/20 flex flex-col items-center justify-center gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-primary/20" />
                        <div className="w-1 h-1 rounded-full bg-primary/20" />
                        <div className="w-1 h-1 rounded-full bg-primary/20" />
                        <div className="w-1 h-1 rounded-full bg-primary/20" />
                    </div>

                    {/* Center Design / Logo area */}
                    <div className="ml-2 w-10 h-8 border border-primary/20 rounded-sm flex items-center justify-center">
                        <div className="w-6 h-[2px] bg-primary/40 rotate-45" />
                        <div className="absolute w-6 h-[2px] bg-primary/40 -rotate-45" />
                    </div>
                </motion.div>
            </div>

            {/* Right Line */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-[2px] w-full max-w-[100px] md:max-w-[300px] bg-primary/20 origin-left"
            />
        </div>
    );
}
