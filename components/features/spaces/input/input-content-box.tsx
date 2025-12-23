'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { StudyFrameworkPicker } from '@/components/features/study';
import { AiModelPicker } from '@/components/features/ai';
import { ChatCompactConfirmation } from '@/components/features/chat';
import { StudyFramework } from '@/lib/types';
import { SearchGroupId } from '@/lib/utils';

// Simplified interfaces
interface ChatAttachment {
    name: string;
    contentType: string;
    url: string;
    size: number;
}

interface ChatCommand {
    id: string;
    label: string;
}

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onStop: () => void;
    selectedModel: string;
    onModelChange: (model: string) => void;
    selectedGroup: SearchGroupId;
    onGroupChange: (group: SearchGroupId) => void;
    attachments: ChatAttachment[];
    onAttachmentsChange: (attachments: ChatAttachment[]) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    status: 'submitted' | 'streaming' | 'ready' | 'error' | 'loading';
    onFrameworkSelect?: (framework: string) => void;
    currentSpaceId?: string;
    onCompactSpace?: (spaceId: string) => Promise<void>;
    loadingProgress?: number;
    loadingText?: string;
    loadingModelId?: string | null;
    pickerPlacement?: 'top' | 'bottom';
}

// Derive the Active Recall command from the StudyFramework enum
// Ensure the command is always lowercase
const ACTIVE_RECALL_COMMAND = `/${StudyFramework.ActiveRecall.split('-')[0].toLowerCase()}` as const; // "/active"

const BASE_COMMANDS: ChatCommand[] = [
    { id: '/model', label: 'AI model' },
    { id: '/frameworks', label: 'Study frameworks' },
    { id: ACTIVE_RECALL_COMMAND, label: 'Active Recall' },
];

// ---------------------------------------------------------------------------
// Auto-resize hook for the chat textarea. It updates the element height based
// on its scrollHeight up to the maxRows limit, falling back to overflow scroll
// when content exceeds the limit. This is lightweight and frame-synced for
// responsiveness.
function useAutoResize(value: string, maxRows: number = 5) {
    const ref = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        const ta = ref.current;
        if (!ta) return;

        // Reset to auto to correctly calculate new scrollHeight
        ta.style.height = 'auto';

        // Calculate target height
        const lineHeight = parseInt(getComputedStyle(ta).lineHeight || '24', 10);
        const maxHeight = lineHeight * maxRows;
        const nextHeight = Math.min(ta.scrollHeight, maxHeight);

        ta.style.height = `${nextHeight}px`;
        ta.style.overflowY = ta.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [value, maxRows]);

    return ref;
}

export function ChatInput({
    value,
    onChange,
    onSubmit,
    onStop,
    selectedModel,
    onModelChange,
    selectedGroup,
    onGroupChange,
    attachments,
    onAttachmentsChange,
    fileInputRef,
    status,
    onFrameworkSelect,
    currentSpaceId,
    onCompactSpace,
    loadingProgress,
    loadingText,
    loadingModelId,
    pickerPlacement = 'bottom',
}: ChatInputProps) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const textareaRef = useAutoResize(value, 5);
    const isProcessing = status === 'submitted' || status === 'streaming' || status === 'loading';

    // Create dynamic commands list based on available props
    const COMMANDS: ChatCommand[] = [
        ...BASE_COMMANDS,
        // Only include compact command if required props are provided
        ...(currentSpaceId && onCompactSpace ? [{ id: '/compact', label: 'Compact conversation' }] : []),
    ];

    // Command handling
    useEffect(() => {
        const isCommand = value?.startsWith('/') && !value.includes(' ');
        setShowSuggestions(isCommand);

        // Auto-open menus for complete commands
        if (value === '/model') setActiveMenu('model');
        else if (value === '/frameworks') setActiveMenu('frameworks');
        else if (value === '/compact') setActiveMenu('compact');
        else setActiveMenu(null);
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape' && activeMenu) {
            e.preventDefault();
            closeMenu();
        }
    };

    const handleSubmit = () => {
        if (!value?.trim() && attachments.length === 0) return;

        if (value.startsWith('/')) {
            handleCommand(value.toLowerCase());
            return;
        }

        onSubmit();
    };

    const handleCommand = (cmd: string) => {
        switch (cmd) {
            case ACTIVE_RECALL_COMMAND:
                onGroupChange('active-recall');
                onFrameworkSelect?.(StudyFramework.ActiveRecall);
                toast.success('Active Recall activated');
                onChange('');
                break;
            case '/model':
            case '/frameworks':
                // Handled by activeMenu state
                break;
            case '/compact':
                // Only allow if required props are provided
                if (currentSpaceId && onCompactSpace) {
                    // Handled by activeMenu state
                } else {
                    toast.error('Compact feature not available');
                    onChange('');
                }
                break;
            default:
                toast.info('Unknown command');
                onChange('');
        }
    };

    const selectSuggestion = (command: string) => {
        onChange(command);
        setShowSuggestions(false);
        textareaRef.current?.focus();
    };

    const closeMenu = () => {
        setActiveMenu(null);
        onChange('');
        textareaRef.current?.focus();
    };

    const handleModelSelect = (model: string) => {
        onModelChange(model);
        closeMenu();
        toast.success('Model changed');
    };

    const handleFrameworkSelect = (framework: StudyFramework) => {
        if (framework === StudyFramework.ActiveRecall) {
            onGroupChange('active-recall');
            toast.success('Active Recall activated');
        } else {
            // For all other frameworks, ensure we revert to the default chat group
            onGroupChange('chat');
            toast.success(`${framework} activated`);
        }
        onFrameworkSelect?.(framework);
        closeMenu();
    };

    const handleCompactChat = async () => {
        if (!currentSpaceId || !onCompactSpace) {
            toast.error('Unable to compact conversation');
            closeMenu();
            return;
        }

        try {
            // Compact the current conversation
            await onCompactSpace(currentSpaceId);
            toast.success('Conversation compacted successfully');
        } catch (error) {
            toast.error('Failed to compact conversation');
        }
        closeMenu();
    };

    const removeAttachment = (index: number) => {
        onAttachmentsChange(attachments.filter((_, i) => i !== index));
    };

    return (
        <div id="chat-input-container" className="relative w-full">
            {/* Loading Progress Bar - Positioned ABOVE input with improved visuals */}
            {status === 'loading' && (
                <div className="absolute bottom-full left-0 right-0 mb-3 px-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 p-2 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-3 h-3 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin shrink-0" />
                                <span className="text-[11px] text-neutral-600 dark:text-neutral-300 font-medium truncate">
                                    {loadingText || 'Downloading model assets...'}
                                </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
                                {Math.round(loadingProgress || 0)}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out rounded-full relative"
                                style={{ width: `${Math.max(5, loadingProgress || 0)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Command menus */}
            {activeMenu === 'model' && (
                <AiModelPicker
                    selectedModel={selectedModel}
                    onSelect={handleModelSelect}
                    onClose={closeMenu}
                    loadingModelId={loadingModelId}
                    loadingProgress={loadingProgress}
                    loadingText={loadingText}
                    placement={pickerPlacement}
                />
            )}
            {activeMenu === 'frameworks' && (
                <StudyFrameworkPicker
                    onSelect={handleFrameworkSelect}
                    onClose={closeMenu}
                    placement={pickerPlacement}
                />
            )}
            {activeMenu === 'compact' && (
                <ChatCompactConfirmation
                    onConfirm={handleCompactChat}
                    onCancel={closeMenu}
                />
            )}

            {/* Command suggestions */}
            {showSuggestions && !activeMenu && (
                <div className="absolute bottom-full left-0 w-80 mb-2 z-[1000] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl backdrop-saturate-150 border border-white/30 dark:border-neutral-700/40 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-lg overflow-hidden text-neutral-900 dark:text-white">
                    <div className="p-2">
                        {COMMANDS
                            // Use case-insensitive comparison to match user input regardless of casing
                            .filter(cmd => cmd.id.startsWith(value.toLowerCase()))
                            .map(cmd => (
                                <div
                                    key={cmd.id}
                                    className="flex justify-between px-2 py-1 text-xs cursor-pointer hover:bg-neutral-100/40 dark:hover:bg-neutral-800/40 rounded"
                                    onClick={() => selectSuggestion(cmd.id)}
                                >
                                    <span className="font-medium">{cmd.id}</span>
                                    <span className="text-neutral-500 dark:text-neutral-400 text-[10px]">{cmd.label}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Main input */}
            <div className="flex items-center gap-2 p-1">
                <span className="text-neutral-400 text-sm select-none">❯</span>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-neutral-400 resize-none scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent"
                    placeholder="Message or / for commands"
                    disabled={isProcessing}
                    aria-label="Message input"
                />

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.txt,.md,.csv"
                />

                {/* Send/Stop button */}
                <Button
                    onClick={isProcessing ? onStop : handleSubmit}
                    disabled={!value?.trim() && attachments.length === 0 && !isProcessing}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        'h-6 w-6 p-0 rounded-full',
                        isProcessing
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-neutral-500 hover:text-neutral-700'
                    )}
                >
                    {status === 'loading' ? (
                        <div className="flex items-center justify-center w-6 h-6">
                            <div className="w-4 h-4 rounded-full border-2 border-neutral-200 border-t-blue-500 animate-spin" />
                        </div>
                    ) : isProcessing ? (
                        <span className="text-xs">■</span>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m5 12 14-9v18L5 12z" />
                        </svg>
                    )}
                </Button>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
                <div className="flex gap-1 mt-1">
                    {attachments.map((attachment, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
                            <span className="truncate max-w-[100px]">{attachment.name}</span>
                            <button
                                onClick={() => removeAttachment(i)}
                                className="text-neutral-400 hover:text-neutral-600"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
}


// @coderabbitai input component is not working can you please check whole codebase for that, and find issue (/ command is not work and showing menu and enter/send is not working)