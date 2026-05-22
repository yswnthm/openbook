'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Check,
    Sparkles,
    Zap,
    Cpu,
    BrainCircuit,
    Globe,
    Command
} from 'lucide-react';

import { MODEL_REGISTRY, isModelId, getModelDefinition } from '@/lib/ai/model-registry';

// Richer model definitions
interface ModelDef {
    value: string;
    label: string;
    description: string;
    provider: string;
    capabilities: string[];
    contextWindow: string; // e.g. "128k"
    tier: 'premium' | 'free' | 'preview' | 'local' | 'ollama';
    tags: string[]; // for search
}

const ALL_MODELS: ModelDef[] = Object.entries(MODEL_REGISTRY)
    .filter(([_, def]) => def.enabledInPicker)
    .map(([value, def]) => ({
        value,
        label: def.label,
        description: def.description,
        provider: def.providerLabel,
        capabilities: [...def.capabilities],
        contextWindow: def.contextWindow,
        tier: def.tier,
        tags: [...def.tags],
    }));

export const getModelLabel = (value: string) => {
    if (isModelId(value)) {
        return getModelDefinition(value).label;
    }
    return value;
};

interface AiModelPickerProps {
    selectedModel: string;
    onSelect: (model: string) => void;
    onClose: () => void;
    className?: string;
    loadingModelId?: string | null;
    loadingProgress?: number;
    loadingText?: string;
    placement?: 'top' | 'bottom';
}

export function AiModelPicker({ selectedModel, onSelect, onClose, className = '', loadingModelId, loadingProgress, loadingText, placement = 'top' }: AiModelPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [availability, setAvailability] = useState<Record<string, boolean>>({});

    // Fetch model availability on mount
    useEffect(() => {
        let active = true;
        fetch('/api/ai/models')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch availability');
                return res.json();
            })
            .then((data) => {
                if (active) setAvailability(data);
            })
            .catch((err) => {
                console.error('Failed to fetch model availability:', err);
            });
        return () => {
            active = false;
        };
    }, []);

    // Filter models based on search
    const filteredModels = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return ALL_MODELS;

        return ALL_MODELS.filter(m =>
            m.label.toLowerCase().includes(query) ||
            m.description.toLowerCase().includes(query) ||
            m.provider.toLowerCase().includes(query) ||
            m.tags.some(t => t.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    // Group models by tier
    const groupedModels = useMemo(() => {
        return {
            premium: filteredModels.filter(m => m.tier === 'premium'),
            preview: filteredModels.filter(m => m.tier === 'preview'),
            free: filteredModels.filter(m => m.tier === 'free'),
            local: filteredModels.filter(m => m.tier === 'local'),
            ollama: filteredModels.filter(m => m.tier === 'ollama'),
        };
    }, [filteredModels]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Focus search on mount
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Determine position based on placement prop
    const positionClasses = placement === 'top'
        ? 'bottom-12 origin-bottom'
        : 'top-full mt-2 origin-top';

    return (
        <motion.div
            className={`
                absolute left-0 w-[480px] z-[1000]
                bg-white/90 dark:bg-[#0A0A0A]/90
                backdrop-blur-2xl backdrop-saturate-150
                border border-black/5 dark:border-white/10
                shadow-2xl shadow-black/20 dark:shadow-black/40
                rounded-2xl overflow-hidden flex flex-col
                max-h-[600px]
                ${positionClasses}
                ${className}
            `}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Header / Search */}
            <div className="p-3 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5 shrink-0">
                <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search models (e.g., 'reasoning', 'coding')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
                            w-full pl-9 pr-4 py-2.5 
                            bg-black/5 dark:bg-white/5 
                            rounded-xl text-sm font-medium
                            text-neutral-900 dark:text-neutral-100
                            placeholder-neutral-500
                            outline-none focus:ring-2 focus:ring-blue-500/50
                            border-transparent border
                        "
                    />
                    <div className="absolute right-3 flex gap-1">
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-1.5 font-mono text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                            <span className="text-xs">Esc</span>
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                {Object.entries(groupedModels).map(([tier, models]) => {
                    if (models.length === 0) return null;

                    let title = '';
                    let Icon = Sparkles;
                    let colorClass = '';

                    switch (tier) {
                        case 'premium':
                            title = 'Premium Models';
                            Icon = Zap;
                            colorClass = 'text-amber-500';
                            break;
                        case 'preview':
                            title = 'Preview Builds';
                            Icon = BrainCircuit;
                            colorClass = 'text-blue-500';
                            break;
                        case 'free':
                            title = 'Community & Free';
                            Icon = Globe;
                            colorClass = 'text-emerald-500';
                            break;
                        case 'local':
                            title = 'On-Device (WebGPU)';
                            Icon = Cpu;
                            colorClass = 'text-purple-500';
                            break;
                        case 'ollama':
                            title = 'Local (Ollama)';
                            Icon = Cpu;
                            colorClass = 'text-orange-500';
                            break;
                    }

                    return (
                        <div key={tier} className="mb-4 last:mb-0">
                            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                <Icon className={`w-3 h-3 ${colorClass}`} />
                                {title}
                            </div>
                            <div className="space-y-1">
                                {models.map((model) => (
                                    <ModelItem
                                        key={model.value}
                                        model={model}
                                        isSelected={model.value === selectedModel}
                                        onSelect={() => onSelect(model.value)}
                                        isLoading={model.value === loadingModelId}
                                        progress={loadingProgress}
                                        loadingText={loadingText}
                                        isUnavailable={availability[model.value] === false}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {filteredModels.length === 0 && (
                    <div className="p-8 text-center text-neutral-500">
                        <Command className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No models found matching &quot;{searchQuery}&quot;</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-black/5 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-900/50 text-[10px] text-neutral-400 flex justify-between px-4">
                <span>Press ↵ to select</span>
                <span>All models secured & private</span>
            </div>
        </motion.div>
    );
}

function ModelItem({
    model,
    isSelected,
    onSelect,
    isLoading,
    progress,
    loadingText,
    isUnavailable
}: {
    model: ModelDef;
    isSelected: boolean;
    onSelect: () => void;
    isLoading?: boolean;
    progress?: number;
    loadingText?: string;
    isUnavailable?: boolean;
}) {
    return (
        <button
            onClick={isUnavailable ? undefined : onSelect}
            disabled={isUnavailable}
            className={`
                w-full text-left relative group
                p-3 rounded-xl transition-all duration-200
                border
                overflow-hidden
                ${isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-transparent border-transparent hover:bg-neutral-100 dark:hover:bg-white/5'
                }
                ${isUnavailable ? 'opacity-40 cursor-not-allowed' : ''}
            `}
        >
            {isLoading && (
                <div className="absolute inset-0 z-0 bg-blue-50/50 dark:bg-blue-900/10 pointer-events-none" />
            )}

            {/* Progress Bar background for loading state */}
            {isLoading && (
                <div
                    className="absolute left-0 bottom-0 h-[2px] bg-blue-500 z-20 transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(5, progress || 0)}%` }}
                />
            )}

            <div className="flex justify-between items-start gap-3 relative z-10">
                {/* Icon / Avatar placeholder */}
                <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold shadow-sm
                    ${isSelected
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }
                `}>
                    {model.provider.substring(0, 1)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm font-semibold truncate pr-2 ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-900 dark:text-neutral-100'}`}>
                            {model.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                        {isLoading && (
                            <div className="flex flex-col items-end ml-auto">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                                        {Math.round(progress || 0)}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <p className="text-xs text-blue-600 dark:text-blue-400 animate-pulse font-medium mb-1.5 truncate">
                            {loadingText || 'Downloading model...'}
                        </p>
                    ) : (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-1.5">
                            {model.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 items-center">
                        <Badge>{model.provider}</Badge>
                        <Badge variant="outline">{model.contextWindow}</Badge>
                        {isUnavailable && (
                            <Badge variant="destructive" className="font-semibold animate-pulse">
                                Unavailable
                            </Badge>
                        )}
                        {model.capabilities.map(cap => (
                            <Badge key={cap} variant="secondary" className="opacity-80">{cap}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </button>
    );
}

function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'outline' | 'secondary' | 'destructive', className?: string }) {
    const variants = {
        default: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-transparent',
        outline: 'bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-500',
        secondary: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border-transparent',
        destructive: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-transparent'
    };

    return (
        <span className={`
            px-1.5 py-0.5 rounded-md text-[9px] font-medium border
            uppercase tracking-wide
            ${variants[variant]}
            ${className}
        `}>
            {children}
        </span>
    );
}
