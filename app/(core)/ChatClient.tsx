'use client';
import 'katex/dist/katex.min.css';

import { AnimatePresence, motion } from 'framer-motion';
import { useChat, UseChatOptions, Message } from '@ai-sdk/react';
import { Info } from '@phosphor-icons/react';
import { parseAsString, useQueryState } from 'nuqs';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
    Moon,
    Plus,
    Sun,
    Search,
    ChevronDown,
    Settings,
    MessageSquare,
    Flag,
    HelpCircle,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import Link from 'next/link';
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TopBar } from '@/components/layout/top-bar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { InstallPrompt } from '@/components/modals/InstallPrompt';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn, getUserId, SearchGroupId } from '@/lib/utils';
import { SIDEBAR_STATE_KEY, SELECTED_MODEL_KEY } from '@/lib/storageKeys';
import { useSidebar } from '@/contexts/SidebarContext';

import Messages from '@/components/features/spaces/chat/messages';
import { Input } from '@/components/ui/input';


import { useSpaces, type ChatMessage } from '@/contexts/SpacesContext'; // Adjusted path, assuming ChatMessage is exported from index of SpacesContext
import { ChatInput } from '@/components/features/spaces/input/input-content-box';
import { useSettings } from '@/contexts/SettingsContext';
import { useStudyMode } from '@/contexts/StudyModeContext';
import { StudyModeBadge } from '@/components/features/study/study-mode-badge';
import { StudyFramework } from '@/lib/types';
import { getFrameworkDisplayName } from '@/lib/study-prompts';
import { useWebLLM } from '@/hooks/use-web-llm';

import { Streak } from '@/components/features/spaces/Streak';
import { SurprisePromptButton } from '@/components/features/spaces/SurprisePromptButton';

interface Attachment {
    name: string;
    contentType: string;
    url: string;
    size: number;
}

const SIDEBAR_WIDTH = 256; // 64 * 4 = 256px
const SIDEBAR_WIDTH_SM = 240; // Smaller width for smaller screens

// Lightweight debounce and throttle utilities (no external deps)
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const debounced = (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, wait);
    };
    (debounced as any).cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    return debounced as T & { cancel: () => void };
}

function throttle<T extends (...args: any[]) => void>(fn: T, wait: number) {
    let last = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    const throttled = (...args: Parameters<T>) => {
        const now = Date.now();
        const remaining = wait - (now - last);
        lastArgs = args;
        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            last = now;
            fn(...args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                last = Date.now();
                timeout = null;
                if (lastArgs) fn(...lastArgs);
            }, remaining);
        }
    };
    (throttled as any).cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    return throttled as T & { cancel: () => void };
}

// Define WidgetSection outside of HomeContent to avoid recreating it on every render
const WidgetSection: React.FC<{
    status: string;
    appendWithPersist: (messageProps: { role: 'user' | 'assistant'; content: string }, options?: any) => Promise<any>;
    lastSubmittedQueryRef: React.MutableRefObject<string>;
    setHasSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}> = memo(({ status, appendWithPersist, lastSubmittedQueryRef, setHasSubmitted }) => {
    const handleSurprisePrompt = useCallback(
        (prompt: string) => {
            if (status !== 'ready') return;
            void appendWithPersist({
                content: prompt,
                role: 'user',
            });
            lastSubmittedQueryRef.current = prompt;
            setHasSubmitted(true);
        },
        [status, appendWithPersist, lastSubmittedQueryRef, setHasSubmitted],
    );

    return (
        <div className="w-full mt-0 sm:mt-2 md:mt-4">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {/* Daily streak indicator */}
                <Streak />

                {/* Surprise prompt button */}
                <SurprisePromptButton onPrompt={handleSurprisePrompt} />
            </div>
        </div>
    );
});

WidgetSection.displayName = 'WidgetSection';

const HomeContent = () => {
    const { isOpen: isSidebarOpen } = useSidebar();
    const [query] = useQueryState('query', parseAsString.withDefault(''));
    const [q] = useQueryState('q', parseAsString.withDefault(''));

    // Conversation spaces context
    const { currentSpace, currentSpaceId, switchSpace, addMessage, createSpace, markSpaceContextReset } = useSpaces();
    // Study mode context
    const { getStudyModeForSpace, setStudyMode } = useStudyMode();
    const { systemPrompt } = useSettings();
    // Set GPT-5 Mini as the default model
    // [EDIT HERE] To change the default model, replace 'openai-gpt-5-mini' with another model ID from ai-model-picker.tsx
    // Example: 'openai-gpt-5-1' or 'deepseek-free'
    const [selectedModel, setSelectedModel] = useLocalStorage(SELECTED_MODEL_KEY, 'openai-gpt-5-mini');

    // One-time migration: move previously saved model from the legacy key
    useEffect(() => {
        const legacyKey = 'neuman-selected-model';
        if (typeof window === 'undefined') return;

        // Only migrate if the legacy key exists and the new key is still empty
        const legacyValue = localStorage.getItem(legacyKey);
        const currentValue = localStorage.getItem(SELECTED_MODEL_KEY);
        if (legacyValue && !currentValue) {
            localStorage.setItem(SELECTED_MODEL_KEY, legacyValue);
            localStorage.removeItem(legacyKey);

            // Update React state so the UI reflects the migrated value immediately
            setSelectedModel(legacyValue);
        }
    }, [setSelectedModel]);

    const initialState = useMemo(
        () => ({
            query: query || q,
        }),
        [query, q],
    );

    const lastSubmittedQueryRef = useRef(initialState.query);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const initializedRef = useRef(false);
    const [selectedGroup, setSelectedGroup] = useState<SearchGroupId>('chat');
    const [hasSubmitted, setHasSubmitted] = React.useState(false);
    const [hasManuallyScrolled, setHasManuallyScrolled] = useState(false);
    const isAutoScrollingRef = useRef(false);
    const [windowWidth, setWindowWidth] = useState<number>(() =>
        typeof window !== 'undefined' ? window.innerWidth : 1024,
    );


    // Get stored user ID
    const userId = useMemo(() => getUserId(), []);

    // Create refs to access space functions without adding them as dependencies
    const spaceFunctionsRef = useRef({ addMessage });
    spaceFunctionsRef.current = { addMessage };

    // Get current study mode for the active space
    const currentStudyMode = useMemo(() => {
        return currentSpaceId ? getStudyModeForSpace(currentSpaceId) : null;
    }, [currentSpaceId, getStudyModeForSpace]);





    // Handle conversation compacting (summarize, create new space, reset context)
    const handleCompactSpace = useCallback(
        async (spaceId: string) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`[COMPACT] Starting compact process for space: ${spaceId}`);
            }

            const space = currentSpace;
            if (!space || space.messages.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(
                        `[COMPACT] No conversation to compact - space: ${space?.name}, messages: ${space?.messages?.length}`,
                    );
                }
                throw new Error('No conversation to compact');
            }

            if (process.env.NODE_ENV === 'development') {
                console.log(`[COMPACT] Compacting ${space.messages.length} messages from space: ${space.name}`);
            }

            try {
                // Call the compact API
                const response = await fetch('/api/chat/compact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: space.messages }),
                });

                if (!response.ok) {
                    throw new Error(`API failed with status: ${response.status}`);
                }

                const { summary, title } = await response.json();
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[COMPACT] Generated summary for: "${title}"`);
                }

                // Create new space with the summary
                const newSpaceId = createSpace(`${title} (Continued)`);
                if (newSpaceId) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`[COMPACT] Created new space: ${newSpaceId}`);
                    }

                    // Switch to the new space first and wait for state to update
                    await switchSpace(newSpaceId);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`[COMPACT] Switched to new space: ${newSpaceId}`);
                    }

                    // Add the summary as the first message in the new space
                    const summaryMessage: ChatMessage = {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `**Previous Conversation Summary:**\n\n${summary}\n\n---\n\nHow can I help you continue from here?`,
                        timestamp: Date.now(),
                    };

                    // Add the summary message to the new space
                    addMessage(summaryMessage);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`[COMPACT] Added summary message to new space`);
                    }

                    // CRITICAL: Reset useChat context for the original space
                    // We need to mark this space as "context-reset" so it doesn't inherit history
                    // Store this in space metadata to prevent context bleeding
                    markSpaceContextReset(spaceId);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`[COMPACT] Marked original space ${spaceId} as context-reset`);
                    }
                }

                // Clear study mode for the original space
                setStudyMode(null, spaceId);
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[COMPACT] Cleared study mode for original space: ${spaceId}`);
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(`[COMPACT] Error during compact:`, error);
                }
                throw error;
            }
        },
        [currentSpace, createSpace, switchSpace, addMessage, setStudyMode, markSpaceContextReset],
    );

    const chatOptions: UseChatOptions = useMemo(() => {
        // Determine API endpoint based on study mode
        const apiEndpoint = currentStudyMode?.framework ? `/api/study/${currentStudyMode.framework}` : '/api/chat';

        return {
            api: apiEndpoint,
            experimental_throttle: 500,
            maxSteps: 5,
            body: {
                model: selectedModel,
                group: selectedGroup,
                user_id: userId,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                systemPrompt, // Added custom system prompt
            },
            onFinish: async (aiMessageFromSDK: Message, { finishReason }: { finishReason: string }) => {
                if (aiMessageFromSDK.content && (finishReason === 'stop' || finishReason === 'length')) {
                    // Persist assistant message to current space
                    const assistantChatMessage: ChatMessage = {
                        id: aiMessageFromSDK.id,
                        role: 'assistant',
                        content: aiMessageFromSDK.content,
                        timestamp: aiMessageFromSDK.createdAt ? aiMessageFromSDK.createdAt.getTime() : Date.now(),
                        model: selectedModel,
                    };
                    spaceFunctionsRef.current.addMessage(assistantChatMessage);

                }
            },
            onError: (error) => {
                console.error('Chat error:', error.cause, error.message);
                toast.error('An error occurred.', {
                    description: `Oops! An error occurred while processing your request. ${error.message}`,
                });
            },
        };
    }, [selectedModel, selectedGroup, userId, currentStudyMode, systemPrompt]);

    const { input, messages, setInput, append, handleSubmit, setMessages, reload, stop, status: chatStatus, error } =
        useChat(chatOptions);

    // WebLLM Integration
    const { state: webLLMState, loadModel: loadWebLLMModel, generate: generateWebLLM, currentModel: currentWebLLMModel } = useWebLLM();

    // Determine if using local model
    const isLocalModel = selectedModel.startsWith('local-');

    // Combined status
    const status = isLocalModel
        ? (webLLMState.isLoading ? 'loading' : (webLLMState.isModelLoaded ? 'ready' : (chatStatus === 'streaming' ? 'streaming' : 'ready'))) // Simplify status mapping
        : chatStatus;

    // Load local model when selected
    useEffect(() => {
        if (isLocalModel) {
            const modelId = selectedModel.replace('local-', '');
            loadWebLLMModel(modelId);
        }
    }, [isLocalModel, selectedModel, loadWebLLMModel]);

    // Show model loading progress in toast or UI
    useEffect(() => {
        if (isLocalModel && webLLMState.isLoading) {
            // Alternatively could use a persistent toast or just rely on the UI status
            // For now, let's just log or rely on status
        }
    }, [isLocalModel, webLLMState.isLoading, webLLMState.text]);

    // Wrap append to persist user messages to current space
    const appendWithPersist = useCallback(
        async (messageProps: { role: 'user' | 'assistant' | 'system'; content: string }, options: any = {}): Promise<any> => {
            if (messageProps.role === 'user') {
                const userChatMessage: ChatMessage = {
                    id: crypto.randomUUID(),
                    role: 'user', // explicitly 'user'
                    content: messageProps.content,
                    timestamp: Date.now(),
                };
                spaceFunctionsRef.current.addMessage(userChatMessage); // Persist to SpacesContext/localStorage

                // Pass the same object (with id, role, content) to useChat's append
                // The @ai-sdk/react 'Message' type has id, role, content.
                // Our ChatMessage {id, role, content, timestamp} is compatible for append.
                // Our ChatMessage {id, role, content, timestamp} is compatible for append.

                if (isLocalModel) {
                    // Handle Local Logic
                    // 1. Manually add user message to UI immediately
                    // setMessages(prev => [...prev, userChatMessage]); // Actually useEffect syncs this from space, but for instant feedback:
                    // Wait, useEffect syncs from currentSpace.messages which we just updated via addMessage.
                    // But let's assume we want to trigger generation.

                    if (!webLLMState.isModelLoaded) {
                        toast.error(`Model is still loading: ${webLLMState.text} (${Math.round(webLLMState.progress)}%)`);
                        return null;
                    }

                    try {
                        // Create a placeholder assistant message
                        const assistantMsgId = crypto.randomUUID();
                        const assistantMsgTimestamp = Date.now();

                        // We need to construct the full context for the model
                        // Get current history from currentSpace or messages
                        const history = [...messages, userChatMessage].map(m => ({
                            role: m.role,
                            content: m.content
                        }));

                        // Start generation
                        // We won't add assistant message to space yet, only after completion or chunks?
                        // Actually, better to add to space at the end?
                        // Or we can add a placeholder?
                        // Let's mimic useChat: stream content.

                        // Since we don't have setStatus exposed from useChat easily to 'streaming', 
                        // we might rely on our own 'status' derived state if we could control it.
                        // But useChat controls its own status.
                        // We override 'status' variable in scope above! 
                        // But we need to update 'messages' state to show the streaming response.

                        let currentText = '';

                        await generateWebLLM(
                            history,
                            (text, delta) => {
                                currentText = text;
                                // Update UI messages with partial assistant response
                                // We need to append or update the last message if it's assistant
                                // But 'messages' state update here might clash with useEffect syncing from space.
                                // Ideally we temporarily disable sync or validly update space?
                                // Updating space on every token is too expensive (localStorage).
                                // So we update 'messages' state directly for UI.

                                setMessages(prev => {
                                    const last = prev[prev.length - 1];
                                    if (last && last.role === 'assistant' && last.id === assistantMsgId) {
                                        return [...prev.slice(0, -1), { ...last, content: text }];
                                    } else {
                                        return [...prev, {
                                            id: assistantMsgId,
                                            role: 'assistant',
                                            content: text,
                                            timestamp: assistantMsgTimestamp
                                        }];
                                    }
                                });
                            },
                            (finalText) => {
                                // On finish, save to space
                                const assistantChatMessage: ChatMessage = {
                                    id: assistantMsgId,
                                    role: 'assistant',
                                    content: finalText,
                                    timestamp: assistantMsgTimestamp,
                                    model: selectedModel,
                                };
                                spaceFunctionsRef.current.addMessage(assistantChatMessage);
                                // transform status back to ready (implicitly handled by derived status)
                            }
                        );

                        return null; // Return null as we handled it

                    } catch (err: any) {
                        console.error("Local generation failed", err);
                        toast.error("Local generation failed: " + err.message);
                    }

                } else {
                    const result = await append(userChatMessage, options);
                    return result;
                }
            } else {
                // For other roles (system, assistant), just append to useChat state
                // We don't persist system messages to history to avoid clutter
                const result = await append(messageProps, options);
                return result;
            }
        },
        [append],
    ); // Remove addMessage dependency since we're using the ref

    const isFrameworkSwitchingRef = useRef(false);

    // Handle framework selection
    const handleFrameworkSelect = useCallback(
        (frameworkString: string) => {
            if (!currentSpaceId) return;

            const framework = frameworkString as StudyFramework;

            // 1. Set flag to indicate we are switching frameworks
            isFrameworkSwitchingRef.current = true;

            // 2. Create the activation message manually (hidden from UI)
            const name = getFrameworkDisplayName(framework);
            const userChatMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'user',
                content: `Activate ${name}`,
                timestamp: Date.now(),
                hidden: true,
            };

            // 3. Persist to storage immediately
            spaceFunctionsRef.current.addMessage(userChatMessage);

            // 4. Update study mode state (this triggers the effect)
            setStudyMode(framework, currentSpaceId);

            // Dispatch space change event for StudyModeContext
            window.dispatchEvent(
                new CustomEvent('spaceChanged', {
                    detail: { spaceId: currentSpaceId },
                }),
            );
        },
        [currentSpaceId, setStudyMode],
    );

    // Handle study mode badge click (to change or disable mode)
    const handleStudyModeBadgeClick = useCallback(() => {
        if (!currentSpaceId) return;

        // For now, just clear the study mode. Later we can show a selector.
        setStudyMode(null, currentSpaceId);
        toast.info('Study mode disabled');
    }, [currentSpaceId, setStudyMode]);



    // Sync chat internal messages when switching spaces (only on space change, not on every message addition)
    useEffect(() => {
        if (currentSpace?.messages) {
            // Check if this space has been marked for context reset
            if (currentSpace.metadata?.contextReset) {
                console.log(
                    `[CONTEXT] Space ${currentSpaceId} marked for context reset - clearing LLM context but keeping messages visible`,
                );
                // Keep messages visible in UI but don't send them to LLM context
                // The messages will be shown but useChat will start with empty context
                const sortedMessages = [...currentSpace.messages].sort((a, b) => a.timestamp - b.timestamp);
                setMessages([]); // Clear LLM context
                // Note: We still show messages in the UI through the Messages component which uses currentSpace.messages
            } else {
                // Normal case: sync all messages to LLM context
                console.log(
                    `[CONTEXT] Syncing ${currentSpace.messages.length} messages to LLM context for space: ${currentSpaceId}`,
                );
                const sortedMessages = [...currentSpace.messages].sort((a, b) => a.timestamp - b.timestamp);
                setMessages(sortedMessages);

                // If we just switched frameworks, trigger a reload to send the new activation message
                if (isFrameworkSwitchingRef.current) {
                    console.log('[FRAMEWORK] Triggering reload for framework activation');
                    reload();
                    isFrameworkSwitchingRef.current = false;
                }
            }
        }
        // Reset initialization flag when switching spaces to allow new queries
        initializedRef.current = false;
        // Only run this effect when the space ID changes OR the framework changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSpaceId, currentStudyMode?.framework]);

    useEffect(() => {
        if (!initializedRef.current && initialState.query) {
            // Check if this query is already the last message in the space
            const lastMessage = messages[messages.length - 1];
            const isQueryAlreadyProcessed =
                lastMessage && lastMessage.role === 'user' && lastMessage.content === initialState.query;

            if (!isQueryAlreadyProcessed) {
                initializedRef.current = true;
                console.log('[initial query]:', initialState.query);
                setHasSubmitted(true);
                appendWithPersist({
                    content: initialState.query,
                    role: 'user',
                });
            }
        }
    }, [initialState.query, appendWithPersist, setInput, messages]);

    // Reset UI state when switching spaces
    useEffect(() => {
        setHasSubmitted(false);
        setHasManuallyScrolled(false);
    }, [currentSpaceId]);

    // Wrap setMessages to satisfy MessagesProps (only array setter)
    const updateMessages = useCallback(
        (msgs: any[]) => {
            setMessages(msgs);
        },
        [setMessages],
    );



    // Determine which messages to display based on context reset flag
    const displayMessages = useMemo(() => {
        if (currentSpace?.metadata?.contextReset) {
            // For context-reset spaces, show all messages from space but useChat context is empty
            console.log(
                `[DISPLAY] Using space messages for context-reset space: ${currentSpace.messages.length} messages`,
            );
            return [...currentSpace.messages]
                .filter(m => !m.hidden)
                .sort((a, b) => a.timestamp - b.timestamp);
        } else {
            // For normal spaces, use useChat messages
            // We also need to filter useChat messages that correspond to hidden messages
            // However, useChat messages don't have the 'hidden' property directly on them usually
            // but we can filter by content or check against currentSpace.messages

            // Simpler approach: Filter messages from useChat state by checking if they are hidden in currentSpace messages
            // But useChat messages (from Vercel SDK) might not map 1:1 with IDs if we didn't set them carefully.
            // We set IDs carefully in appendWithPersist, but here we are using 'messages' from useChat.

            // Actually, we sync 'messages' from 'currentSpace.messages' in the useEffect above:
            // setMessages(sortedMessages);
            // So 'messages' state IS 'currentSpace.messages' (for the most part).

            console.log(`[DISPLAY] Using useChat messages for normal space: ${messages.length} messages`);

            // We need to cast 'messages' or check generic properties.
            // Since we sync from currentSpace, let's treat them as potentially containing 'hidden' if we passed it through.
            // But 'messages' from useChat is typed as 'Message[]' from AI SDK.
            // Our effect `setMessages(sortedMessages)` passes our ChatMessage[] (which has hidden) to useChat.
            // So we can cast or check property presence.
            return messages.filter((m: any) => !m.hidden);
        }
    }, [currentSpace?.metadata?.contextReset, currentSpace?.messages, messages]);

    const lastUserMessageIndex = useMemo(() => {
        for (let i = displayMessages.length - 1; i >= 0; i--) {
            if (displayMessages[i].role === 'user') {
                return i;
            }
        }
        return -1;
    }, [displayMessages]);

    // Scroll to bottom on message change or refresh
    useEffect(() => {
        // Don't scroll if user has manually scrolled up during conversation
        if (hasManuallyScrolled && status === 'streaming') return;

        // Create a smooth scroll to bottom function
        const scrollToBottom = () => {
            if (bottomRef.current) {
                isAutoScrollingRef.current = true;

                // Use different scroll behavior based on device size
                const behavior = windowWidth < 640 ? 'auto' : 'smooth';
                const blockValue = windowWidth < 640 ? 'end' : 'center';

                // Add a slight visual effect by using a timeout
                setTimeout(() => {
                    bottomRef.current?.scrollIntoView({
                        behavior,
                        block: blockValue as ScrollLogicalPosition,
                    });

                    // Reset auto-scroll flag after animation
                    setTimeout(
                        () => {
                            isAutoScrollingRef.current = false;
                        },
                        behavior === 'auto' ? 10 : 300,
                    );
                }, 50);
            }
        };

        // Call scroll function when:
        // 1. Messages array changes (new message added)
        // 2. When streaming starts
        // 3. When suggested questions appear
        console.log(`[SCROLL] Scrolling for ${displayMessages.length} display messages, status: ${status}`);
        scrollToBottom();

        // Add a debounced scroll listener to detect manual scrolling
        const debouncedScrollHandler = debounce(() => {
            if (!isAutoScrollingRef.current && status === 'streaming') {
                const mobileAdjust = windowWidth < 640 ? 80 : 120;
                const isAtBottom =
                    window.innerHeight + window.scrollY >= document.body.offsetHeight - mobileAdjust;
                setHasManuallyScrolled(!isAtBottom);
            }
        }, 150);

        window.addEventListener('scroll', debouncedScrollHandler);
        return () => {
            window.removeEventListener('scroll', debouncedScrollHandler);
            (debouncedScrollHandler as any).cancel?.();
        };
    }, [displayMessages, status, windowWidth, hasManuallyScrolled]);

    // Handle window resize with throttling
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const throttledResizeHandler = throttle(() => {
            setWindowWidth(window.innerWidth);
        }, 250);

        window.addEventListener('resize', throttledResizeHandler);
        return () => {
            window.removeEventListener('resize', throttledResizeHandler);
            (throttledResizeHandler as any).cancel?.();
        };
    }, []);

    const AboutButton = () => {
        return (
            <Link href="https://x.com/GoOpenBook">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-8 h-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                    <Info className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </Button>
            </Link>
        );
    };



    // Define the model change handler
    const handleModelChange = useCallback(
        (model: string) => {
            setSelectedModel(model);
        },
        [setSelectedModel],
    );



    // Helper function to determine if content is being processed/loaded
    const isProcessing = useMemo(() => {
        return status !== 'ready';
    }, [status]);

    return (
        <div className="flex flex-col !font-sans items-center min-h-screen bg-background text-foreground transition-all duration-500">
            <div
                className={cn(
                    'w-full transition-all duration-300 flex flex-col items-center',
                )}
            >
                <TopBar
                    className="p-3 sm:p-4 bg-transparent"
                    actions={
                        currentStudyMode?.framework ? (
                            <StudyModeBadge
                                framework={currentStudyMode.framework as StudyFramework}
                                onClick={handleStudyModeBadgeClick}
                            />
                        ) : null
                    }
                />
                <div className="w-full p-2 sm:p-4 md:p-10 !mt-32 sm:!mt-40 flex !flex-col border-b border-neutral-100 dark:border-neutral-800 md:border-0">
                    <div
                        className={`w-full max-w-[95%] xs:max-w-[90%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl space-y-2 sm:space-y-3 mx-auto transition-all duration-300 overflow-visible`}
                    >
                        {status === 'ready' && displayMessages.length === 0 && (
                            <div className="text-center py-4 sm:py-6">
                                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 text-neutral-800 dark:text-neutral-100 font-syne!">
                                    What do you want to learn about?
                                </h1>

                            </div>
                        )}
                        {displayMessages.length === 0 && !hasSubmitted && (
                            <div className="relative z-50 !mt-1 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-md p-1">
                                <ChatInput
                                    value={input}
                                    onChange={setInput}
                                    onSubmit={() => {
                                        lastSubmittedQueryRef.current = input;
                                        appendWithPersist({
                                            content: input,
                                            role: 'user',
                                        });
                                        setInput(''); // Clear input after submit
                                        setHasSubmitted(true);
                                        setHasManuallyScrolled(false); // Reset manual scroll when user submits

                                        // Smooth scroll to bottom after a small delay
                                        setTimeout(() => {
                                            bottomRef.current?.scrollIntoView({
                                                behavior: windowWidth < 640 ? 'auto' : 'smooth',
                                                block: windowWidth < 640 ? 'end' : 'center',
                                            });
                                        }, 100);
                                    }}
                                    onStop={stop}
                                    selectedModel={selectedModel}
                                    onModelChange={setSelectedModel}
                                    selectedGroup={selectedGroup}
                                    onGroupChange={setSelectedGroup}
                                    attachments={attachments}
                                    onAttachmentsChange={setAttachments}
                                    fileInputRef={fileInputRef}
                                    status={status}
                                    onFrameworkSelect={handleFrameworkSelect}
                                    currentSpaceId={currentSpaceId}
                                    onCompactSpace={handleCompactSpace}
                                    pickerPlacement="bottom" // Explicitly bottom for centered input
                                />
                            </div>
                        )}

                        {/* Add the widget section below form when no messages */}
                        {displayMessages.length === 0 && (
                            <div className="mt-0 sm:mt-4">
                                <WidgetSection
                                    status={status}
                                    appendWithPersist={appendWithPersist}
                                    lastSubmittedQueryRef={lastSubmittedQueryRef}
                                    setHasSubmitted={setHasSubmitted}
                                />
                            </div>
                        )}

                        {/* Use the Messages component */}
                        {displayMessages.length > 0 && (
                            <div className="mt-4 sm:mt-8 md:mt-12 w-full overflow-visible">
                                <Messages
                                    messages={displayMessages}
                                    lastUserMessageIndex={lastUserMessageIndex}
                                    isEditingMessage={isEditingMessage}
                                    editingMessageIndex={editingMessageIndex}
                                    input={input}
                                    setInput={setInput}
                                    setIsEditingMessage={setIsEditingMessage}
                                    setEditingMessageIndex={setEditingMessageIndex}
                                    setMessages={updateMessages}
                                    append={appendWithPersist}

                                    reload={reload}
                                    status={status}
                                    error={error}
                                    selectedModel={selectedModel}
                                />
                            </div>
                        )}

                        {/* Bottom reference element for scrolling */}
                        <div ref={bottomRef} className="h-0 w-full opacity-0 pointer-events-none" aria-hidden="true" />
                    </div>

                    {(displayMessages.length > 0 || hasSubmitted) && (
                        <div
                            className="fixed bottom-0 left-0 right-0 pb-3 sm:pb-4 z-40 pointer-events-none"
                            style={{
                                paddingLeft: isSidebarOpen ? SIDEBAR_WIDTH : 0,
                                paddingRight: 0,
                                transition: 'padding-left 0.3s ease',
                            }}
                        >
                            <div className="w-full max-w-[95%] xs:max-w-[90%] sm:max-w-2xl md:max-w-3xl mx-auto pointer-events-auto">
                                <div className="relative z-50 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-md p-1 shadow-lg w-full">
                                    <ChatInput
                                        value={input}
                                        onChange={setInput}
                                        onSubmit={() => {
                                            lastSubmittedQueryRef.current = input;
                                            appendWithPersist({
                                                content: input,
                                                role: 'user',
                                            });
                                            setInput(''); // Clear input after submit
                                            setHasSubmitted(true);
                                            setHasManuallyScrolled(false); // Reset manual scroll when user submits

                                            // Smooth scroll to bottom after a small delay
                                            setTimeout(() => {
                                                bottomRef.current?.scrollIntoView({
                                                    behavior: windowWidth < 640 ? 'auto' : 'smooth',
                                                    block: windowWidth < 640 ? 'end' : 'center',
                                                });
                                            }, 100);
                                        }}
                                        onStop={stop}
                                        selectedModel={selectedModel}
                                        onModelChange={setSelectedModel}
                                        selectedGroup={selectedGroup}
                                        onGroupChange={setSelectedGroup}
                                        attachments={attachments}
                                        onAttachmentsChange={setAttachments}
                                        fileInputRef={fileInputRef}
                                        status={status}
                                        onFrameworkSelect={handleFrameworkSelect}
                                        currentSpaceId={currentSpaceId}
                                        onCompactSpace={handleCompactSpace}
                                        loadingProgress={webLLMState.progress}
                                        loadingText={webLLMState.text}
                                        loadingModelId={webLLMState.isLoading ? `local-${currentWebLLMModel}` : null}
                                        pickerPlacement="top"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatClient = () => {
    return (
        <Suspense>
            <HomeContent />
            <InstallPrompt />
        </Suspense>
    );
};

export default ChatClient;
