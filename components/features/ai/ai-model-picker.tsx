'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// Define the model options - with Google Gemini 2.5 Flash as the default
const models = [
    {
        value: 'neuman-default',
        label: 'GPT OSS 120b',
        description: 'Default (OpenAI)',
        provider: 'Groq',
        color: 'blue',
        isFree: true,
    },
    {
        value: 'neuman-deepseek-free',
        label: 'DeepSeek v3.1',
        description: 'Nex-AGI/Free',
        provider: 'OpenRouter',
        color: 'purple',
        isFree: true,
    },
    {
        value: 'neuman-gpt-oss-free',
        label: 'GPT OSS 120b',
        description: 'OpenAI Native',
        provider: 'Groq',
        color: 'blue',
        isFree: true,
    },
    {
        value: 'neuman-glm-4',
        label: 'GLM 4.5 Air',
        description: 'Z-AI/Free',
        provider: 'OpenRouter',
        color: 'orange',
        isFree: true,
    },
    {
        value: 'neuman-qwen-coder',
        label: 'Qwen 3 Coder',
        description: 'Qwen/Free',
        provider: 'OpenRouter',
        color: 'green',
        isFree: true,
    },
    {
        value: 'neuman-gemma-3n',
        label: 'Gemma 3n',
        description: 'Google/Free',
        provider: 'OpenRouter',
        color: 'gemini',
        isFree: true,
    },
    {
        value: 'neuman-gemma-3-27b',
        label: 'Gemma 3 27b',
        description: 'Google/Free',
        provider: 'OpenRouter',
        color: 'gemini',
        isFree: true,
    },
    {
        value: 'neuman-deepseek-r1',
        label: 'DeepSeek R1',
        description: 'DeepSeek/Free',
        provider: 'OpenRouter',
        color: 'purple',
        isFree: true,
    },
    {
        value: 'neuman-gemini-3',
        label: 'Gemini 3 Pro',
        description: 'Google Native',
        provider: 'Google',
        color: 'gemini',
        isFree: false,
    },
    {
        value: 'neuman-gpt-5-nano',
        label: 'GPT 5 Nano',
        description: 'OpenAI Native',
        provider: 'OpenAI',
        color: 'blue',
        isFree: false,
    },
    {
        value: 'neuman-gpt-5-mini',
        label: 'GPT 5 Mini',
        description: 'OpenAI Native',
        provider: 'OpenAI',
        color: 'blue',
        isFree: false,
    },
    {
        value: 'neuman-apriel-15b',
        label: 'Apriel 1.6 15b',
        description: 'ServiceNow/Thinker',
        provider: 'Hugging Face',
        color: 'purple',
        isFree: false,
    },
    {
        value: 'neuman-olmo-32b',
        label: 'Olmo 3.1 32B',
        description: 'AllenAI/Think',
        provider: 'Hugging Face',
        color: 'orange',
        isFree: false,
    },
];

interface AiModelPickerProps {
    selectedModel: string;
    onSelect: (model: string) => void;
    onClose: () => void;
    className?: string;
}

export function AiModelPicker({ selectedModel, onSelect, onClose, className = '' }: AiModelPickerProps) {
    const currentModel = models.find((model) => model.value === selectedModel) || models[0];

    // Close the picker when the user presses the Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <motion.div
            className={`
                absolute bottom-full left-0 w-80 mb-2 z-[1000]
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
                ease: [0.4, 0.0, 0.2, 1]
            }}
        >
            <div className="p-2">
                <div className="mb-1.5">
                    <div className="text-xs font-medium mb-0.5 text-neutral-800 dark:text-neutral-100 flex items-center justify-between">
                        <span>AI Model</span>
                        <span className="text-[10px] text-neutral-500 font-normal">
                            Provider: {(currentModel as any).provider}
                        </span>
                    </div>
                    <div className="text-[9px] text-neutral-600 dark:text-neutral-400">
                        Current: <span className="text-neutral-800 dark:text-neutral-100 font-medium">{currentModel.label}</span>
                    </div>
                </div>

                <div
                    className="max-h-[160px] overflow-y-auto mb-1.5"
                    role="listbox"
                    aria-label="Available AI models"
                >
                    <div className="space-y-2">
                        {models.map((model) => (
                            <motion.div
                                key={model.value}
                                role="option"
                                aria-selected={model.value === selectedModel}
                                className={`
                                    p-1.5 cursor-pointer rounded transition-all duration-150 
                                    border backdrop-blur-sm
                                    ${model.value === selectedModel
                                        ? 'bg-white/50 dark:bg-neutral-800/50 border-neutral-300/40 dark:border-neutral-600/40 shadow-md'
                                        : 'bg-white/20 dark:bg-neutral-800/20 border-neutral-200/20 dark:border-neutral-700/20 hover:bg-white/40 dark:hover:bg-neutral-800/40'
                                    }
                                `}
                                onClick={() => onSelect(model.value)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-100">
                                                {model.label}
                                            </span>
                                            {(model as any).isFree && (
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${(model as any).dotColor === 'red'
                                                        ? 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.4)]'
                                                        : 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]'
                                                        }`}
                                                    title={(model as any).dotColor === 'red' ? "Groq Free Model" : "Free Model"}
                                                />
                                            )}
                                        </div>
                                        <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium">
                                            {(model as any).provider}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-neutral-600 dark:text-neutral-400">
                                            {model.description}
                                        </span>
                                        {model.value === selectedModel && (
                                            <span className="text-[8px] bg-emerald-100/60 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 rounded font-medium">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-neutral-200/20 dark:border-neutral-700/20 pt-1.5">
                    <div className="text-[9px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                        <span>Click to select</span>
                        <span className="flex items-center gap-1">
                            <span className="bg-neutral-100/40 dark:bg-neutral-700/40 px-0.5 py-0.5 rounded font-mono text-[8px]">esc</span>
                            <span>close</span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
