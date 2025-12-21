'use client';

import React from 'react';
import { motion } from 'framer-motion';


interface EmptyStateProps {
    onCreateBlock: () => void;
}

export default function EmptyState({ onCreateBlock }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start justify-center py-20 cursor-text group"
            onClick={onCreateBlock}
        >
            <h3 className="text-lg font-medium text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                Start writing...
            </h3>
            <p className="mt-2 text-sm text-neutral-300 dark:text-neutral-600 font-light">
                Type <span className="font-mono text-neutral-400 dark:text-neutral-500">/</span> for commands
            </p>
        </motion.div>
    );
}
