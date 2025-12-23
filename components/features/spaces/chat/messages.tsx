import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Message } from '@/components/features/spaces/chat/message';
import { TextUIPart, ReasoningUIPart, ToolInvocationUIPart, SourceUIPart } from '@ai-sdk/ui-utils';
import { ReasoningPartView, ReasoningPart } from '@/components/features/spaces/chat/reasoning-part';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { CopyButton } from '@/components/features/spaces/chat/markdown';
import { MarkdownRenderer, preprocessLaTeX } from '@/components/features/spaces/chat/markdown';
import ToolInvocationListView from '@/components/features/spaces/chat/tool-invocation-list-view';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageLoading, TypingIndicator, StreamingProgress } from '@/components/features/spaces/chat/message-loading';
import { TypingMessage } from '@/components/features/spaces/chat/message-typing';
import { AIProgressIndicator, WordCountIndicator } from '@/components/features/spaces/loading/progress-indicators';
import { getModelLabel } from '@/components/features/ai/ai-model-picker';

import { LoadingDots } from '@/components/ui/loading-dots';

// Define MessagePart type
type MessagePart = TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart;

// Define interface for part, messageIndex and partIndex objects
interface PartInfo {
    part: any;
    messageIndex: number;
    partIndex: number;
}

interface MessagesProps {
    messages: any[];
    lastUserMessageIndex: number;
    isEditingMessage: boolean;
    editingMessageIndex: number;
    input: string;
    setInput: (value: string) => void;
    setIsEditingMessage: (value: boolean) => void;
    setEditingMessageIndex: (value: number) => void;
    setMessages: (messages: any[]) => void;
    append: (message: any, options?: any) => Promise<string | null | undefined>;
    reload: () => Promise<string | null | undefined>;

    status: string;
    error: any; // Add error from useChat
    selectedModel?: string;
}

// Interface for reasoning timing
interface ReasoningTiming {
    startTime: number;
    endTime?: number;
}

const Messages: React.FC<MessagesProps> = ({
    messages,
    lastUserMessageIndex,
    isEditingMessage,
    editingMessageIndex,
    input,
    setInput,
    setIsEditingMessage,
    setEditingMessageIndex,
    setMessages,
    append,
    reload,

    status,
    error,
    selectedModel,
}) => {
    // Track visibility state for each reasoning section using messageIndex-partIndex as key
    const [reasoningVisibilityMap, setReasoningVisibilityMap] = useState<Record<string, boolean>>({});
    const [reasoningFullscreenMap, setReasoningFullscreenMap] = useState<Record<string, boolean>>({});
    const [reasoningTimings, setReasoningTimings] = useState<Record<string, ReasoningTiming>>({});
    const reasoningScrollRef = useRef<HTMLDivElement>(null);

    // State to track how long the AI has been thinking
    const [thinkingDuration, setThinkingDuration] = useState<number>(0);
    const thinkingStartTime = useRef<number | null>(null);

    // Track loading states
    const isLoading = status === 'submitted' || status === 'streaming';
    const isJustThinking = status === 'submitted';
    const isStreaming = status === 'streaming';

    // Track streaming progress
    const [streamProgress, setStreamProgress] = useState<number>(0);
    const streamStartTime = useRef<number | null>(null);
    const estimatedStreamDuration = 15000; // Estimated 15 seconds for complete generation

    // Add state for typing animation
    const [useTypingAnimation, setUseTypingAnimation] = useState<boolean>(true);
    const [typingCompleted, setTypingCompleted] = useState<boolean>(false);

    // Add token counting for progress indicator
    const [tokenCount, setTokenCount] = useState<number>(0);
    const [estimatedTokens, setEstimatedTokens] = useState<number>(500);

    // Add state for advanced progress
    const [showAdvancedProgress, setShowAdvancedProgress] = useState<boolean>(false);

    // Consolidated effect for all timing and progress updates
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        // Handle thinking duration
        if (isJustThinking) {
            if (!thinkingStartTime.current) {
                thinkingStartTime.current = Date.now();
            }

            const thinkingTimer = setInterval(() => {
                if (thinkingStartTime.current) {
                    const elapsed = Math.floor((Date.now() - thinkingStartTime.current) / 1000);
                    setThinkingDuration(elapsed);
                }
            }, 2000); // Reduced from 1000ms to 2000ms
            timers.push(thinkingTimer);
        } else {
            thinkingStartTime.current = null;
            setThinkingDuration(0);
        }

        // Handle stream progress and token counting
        if (isStreaming) {
            if (!streamStartTime.current) {
                streamStartTime.current = Date.now();
                setStreamProgress(5);
            }

            const streamTimer = setInterval(() => {
                if (streamStartTime.current) {
                    const elapsed = Date.now() - streamStartTime.current;

                    // Update progress
                    const progress = Math.min(95, Math.floor((elapsed / estimatedStreamDuration) * 100));
                    setStreamProgress(progress);

                    // Update token count based on most recent assistant message
                    const lastAssistantMessage = messages.findLast((m) => m.role === 'assistant');
                    if (lastAssistantMessage?.content && elapsed > 2000) {
                        const words = lastAssistantMessage.content.trim().split(/\s+/).length;
                        const currentTokenCount = Math.round(words * 1.3);
                        setTokenCount(currentTokenCount);

                        // Update estimated total based on current rate
                        const tokensPerMs = currentTokenCount / elapsed;
                        setEstimatedTokens(Math.max(500, Math.round(tokensPerMs * estimatedStreamDuration * 0.8)));
                    }
                }
            }, 500); // Reduced from 300ms to 500ms for fewer updates
            timers.push(streamTimer);
        } else if (status === 'ready') {
            setStreamProgress(100);
            setTimeout(() => {
                streamStartTime.current = null;
                setStreamProgress(0);
                setTokenCount(0);
                setEstimatedTokens(500);
            }, 1000);
        }

        // Handle reasoning timing updates (reduced frequency from 100ms to 500ms)
        const activeReasoningSections = Object.entries(reasoningTimings).filter(([_, timing]) => !timing.endTime);
        if (activeReasoningSections.length > 0) {
            const reasoningTimer = setInterval(() => {
                const now = Date.now();
                const updatedTimes: Record<string, number> = {};

                activeReasoningSections.forEach(([key, timing]) => {
                    updatedTimes[key] = (now - timing.startTime) / 1000;
                });

                // Update reasoning timings if needed
                // Note: This is a simplified version - the original had more complex logic
            }, 500); // Reduced from 100ms to 500ms
            timers.push(reasoningTimer);
        }

        // Handle advanced progress timeout
        if (isLoading) {
            const progressTimeout = setTimeout(() => {
                setShowAdvancedProgress(true);
            }, 5000);
            timers.push(progressTimeout);
        } else {
            setShowAdvancedProgress(false);
        }

        // Cleanup all timers
        return () => {
            timers.forEach((timer) => clearInterval(timer));
        };
    }, [isJustThinking, isStreaming, status, messages, reasoningTimings, isLoading]);

    // Filter messages to only show the ones we want to display
    const memoizedMessages = useMemo(() => {
        return messages.filter((message) => {
            // Keep all user messages
            if (message.role === 'user') return true;

            // For assistant messages
            if (message.role === 'assistant') {
                // Keep messages that have tool invocations
                if (message.parts?.some((part: any) => part.type === 'tool-invocation')) {
                    return true;
                }
                // Keep messages that have text parts but no tool invocations
                if (
                    message.parts?.some((part: any) => part.type === 'text') ||
                    !message.parts?.some((part: any) => part.type === 'tool-invocation')
                ) {
                    return true;
                }
                return false;
            }
            return false;
        });
    }, [messages]);

    // Handle rendering of message parts
    const renderPart = (
        part: MessagePart,
        messageIndex: number,
        partIndex: number,
        parts: MessagePart[],
        message: any,
    ): React.ReactNode => {
        // First, update timing data for reasoning parts directly in the render function
        if (part.type === 'reasoning') {
            const sectionKey = `${messageIndex}-${partIndex}`;

            // Initialize timing data if it doesn't exist
            if (!reasoningTimings[sectionKey]) {
                // Use a functional state update to avoid stale state issues
                setReasoningTimings((prev) => ({
                    ...prev,
                    [sectionKey]: { startTime: Date.now() },
                }));
            }

            // Check if reasoning is complete but we haven't recorded the end time
            const isComplete = parts.some(
                (p: MessagePart, i: number) => i > partIndex && (p.type === 'text' || p.type === 'tool-invocation'),
            );

            if (isComplete && reasoningTimings[sectionKey] && !reasoningTimings[sectionKey].endTime) {
                // Set end time if reasoning is complete and it hasn't been set yet
                setReasoningTimings((prev) => ({
                    ...prev,
                    [sectionKey]: {
                        ...prev[sectionKey],
                        endTime: Date.now(),
                    },
                }));
            }
        }

        // Case 1: Skip rendering text parts that should be superseded by tool invocations
        if (part.type === 'text') {
            // Skip empty text parts entirely
            if (!part.text || part.text.trim() === '') return null;

            // Check if this text part should be hidden because a tool invocation will show the same info
            const hasRelatedToolInvocation = parts.some(
                (p: MessagePart) => p.type === 'tool-invocation',
                // Don't need direct comparison between different types
            );

            // If this is a summary text before/after a tool invocation, don't render it
            if (partIndex === 0 && hasRelatedToolInvocation) {
                return null;
            }
        }

        switch (part.type) {
            case 'text':
                return (
                    <div key={`${messageIndex}-${partIndex}-text`}>
                        <div className="flex items-center justify-between mt-5 mb-2">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/logo.svg"
                                    alt="Neuman"
                                    className="size-6 dark:invert"
                                    width={100}
                                    height={100}
                                    unoptimized
                                    quality={100}
                                />
                                <h2 className="text-md font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                    Neuman
                                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-normal ml-1">
                                        • {getModelLabel(message.model || selectedModel || '')}
                                    </span>
                                    {/* Show loading dots while AI is responding */}
                                    {status !== 'ready' &&
                                        message.role === 'assistant' &&
                                        messageIndex === messages.length - 1 && <LoadingDots />}
                                </h2>
                            </div>
                            {status === 'ready' && (
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const lastUserMessage = messages.findLast((m) => m.role === 'user');
                                            if (!lastUserMessage) return;

                                            // Remove the last assistant message
                                            const newMessages = messages.slice(0, -1);
                                            setMessages(newMessages);


                                            // Resubmit the last user message
                                            reload();
                                        }}
                                        className="h-8 px-2 text-xs rounded-full"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <CopyButton text={part.text} />
                                </div>
                            )}
                        </div>
                        <MarkdownRenderer content={preprocessLaTeX(part.text)} />
                    </div>
                );
            case 'reasoning': {
                const sectionKey = `${messageIndex}-${partIndex}`;
                const hasParallelToolInvocation = parts.some((p: MessagePart) => p.type === 'tool-invocation');
                const isComplete = parts.some(
                    (p: MessagePart, i: number) => i > partIndex && (p.type === 'text' || p.type === 'tool-invocation'),
                );
                const timing = reasoningTimings[sectionKey];
                let duration = null;
                if (timing) {
                    if (timing.endTime) {
                        duration = ((timing.endTime - timing.startTime) / 1000).toFixed(3);
                    }
                }

                // Safely access the tool invocation data with proper type handling
                let parallelTool = null;
                if (hasParallelToolInvocation) {
                    const toolPart = parts.find((p: MessagePart) => p.type === 'tool-invocation') as
                        | ToolInvocationUIPart
                        | undefined;
                    if (toolPart && toolPart.toolInvocation) {
                        parallelTool = toolPart.toolInvocation.toolName || null;
                    }
                }

                // Separate expanded and fullscreen states
                const isExpanded = reasoningVisibilityMap[sectionKey] ?? !isComplete;
                const isFullscreen = reasoningFullscreenMap[sectionKey] ?? false;

                // Separate setters for each state
                const setIsExpanded = (v: boolean) =>
                    setReasoningVisibilityMap((prev) => ({ ...prev, [sectionKey]: v }));
                const setIsFullscreen = (v: boolean) =>
                    setReasoningFullscreenMap((prev) => ({ ...prev, [sectionKey]: v }));

                return (
                    <ReasoningPartView
                        key={sectionKey}
                        part={part as ReasoningPart}
                        sectionKey={sectionKey}
                        isComplete={isComplete}
                        duration={duration}
                        parallelTool={parallelTool}
                        isExpanded={isExpanded}
                        isFullscreen={isFullscreen}
                        setIsExpanded={setIsExpanded}
                        setIsFullscreen={setIsFullscreen}
                    />
                );
            }
            case 'tool-invocation':
                return (
                    <ToolInvocationListView
                        key={`${messageIndex}-${partIndex}-tool`}
                        toolInvocations={[part.toolInvocation]}
                        message={message}
                    />
                );
            default:
                return null;
        }
    };

    // Add effect for auto-scrolling reasoning content
    useEffect(() => {
        // Find active reasoning parts that are not complete
        const activeReasoning = messages.flatMap((message, messageIndex) =>
            (message.parts || [])
                .map((part: any, partIndex: number) => ({ part, messageIndex, partIndex }))
                .filter(({ part }: PartInfo) => part.type === 'reasoning')
                .filter(({ messageIndex, partIndex }: PartInfo) => {
                    const message = messages[messageIndex];
                    // Check if reasoning is complete
                    return !(message.parts || []).some(
                        (p: any, i: number) => i > partIndex && (p.type === 'text' || p.type === 'tool-invocation'),
                    );
                }),
        );

        // Auto-scroll when active reasoning
        if (activeReasoning.length > 0 && reasoningScrollRef.current) {
            reasoningScrollRef.current.scrollTop = reasoningScrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Initialize reasoning timings when messages change
    useEffect(() => {
        messages.forEach((message, messageIndex) => {
            message.parts?.forEach((part: any, partIndex: number) => {
                if (part.type === 'reasoning') {
                    const sectionKey = `${messageIndex}-${partIndex}`;
                    const isComplete = message.parts[partIndex + 1]?.type === 'text';

                    if (!reasoningTimings[sectionKey]) {
                        setReasoningTimings((prev) => ({
                            ...prev,
                            [sectionKey]: { startTime: Date.now() },
                        }));
                    } else if (isComplete && !reasoningTimings[sectionKey].endTime) {
                        setReasoningTimings((prev) => ({
                            ...prev,
                            [sectionKey]: {
                                ...prev[sectionKey],
                                endTime: Date.now(),
                            },
                        }));
                    }
                }
            });
        });
    }, [messages, reasoningTimings]);

    if (memoizedMessages.length === 0) {
        return null;
    }

    // Render error message if there is an error
    const handleRetry = async () => {
        const lastUserMessage = messages.findLast((m) => m.role === 'user');
        if (!lastUserMessage) return;

        // Remove the last assistant message if it exists
        const newMessages = [...messages];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
            newMessages.pop();
        }
        setMessages(newMessages);


        // Reset thinking timer
        thinkingStartTime.current = null;
        setThinkingDuration(0);

        // Resubmit the last user message
        await reload();
    };

    // Generate loading text based on thinking duration
    const getLoadingText = () => {
        if (thinkingDuration <= 3) return 'Thinking...';
        if (thinkingDuration <= 8) return 'Analyzing your request...';
        if (thinkingDuration <= 15) return 'Processing information...';
        if (thinkingDuration <= 25) return 'Gathering relevant details...';
        return 'This is taking longer than usual...';
    };

    // Helper to render messages with typing animation if enabled
    const renderMessageContent = (message: any, key: string) => {
        if (message.role !== 'assistant' || !message.content) {
            return null;
        }

        // Only animate the most recent assistant message when streaming
        const isLatestAssistantMessage = message === messages.findLast((m) => m.role === 'assistant');
        const shouldAnimate = useTypingAnimation && isLatestAssistantMessage && isStreaming && !typingCompleted;

        if (shouldAnimate) {
            return (
                <TypingMessage
                    key={key}
                    content={message.content}
                    onComplete={() => setTypingCompleted(true)}
                    speed={15}
                />
            );
        }

        return null;
    };

    return (
        <div className="space-y-6 pb-24">
            {memoizedMessages.length > 0 ? (
                memoizedMessages.map((message, index) => (
                    <React.Fragment key={`${message.id || index}`}>
                        <Message
                            message={message}
                            index={index}
                            lastUserMessageIndex={lastUserMessageIndex}
                            isEditingMessage={isEditingMessage}
                            editingMessageIndex={editingMessageIndex}
                            input={input}
                            setInput={setInput}
                            setIsEditingMessage={setIsEditingMessage}
                            setEditingMessageIndex={setEditingMessageIndex}
                            renderPart={renderPart}
                            status={status}
                            messages={messages}
                            setMessages={setMessages}
                            append={append}
                            reload={reload}

                        />

                        {/* Render typing animation for this message if needed */}
                        {renderMessageContent(message, `typing-${index}`)}

                        {/* Show word count for completed messages */}
                        {message.role === 'assistant' && message.content && status === 'ready' && (
                            <WordCountIndicator
                                text={message.content}
                                isVisible={index === memoizedMessages.length - 1}
                            />
                        )}

                        {/* Add to journal button removed */}
                    </React.Fragment>
                ))
            ) : (
                <div className="py-12">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <Image
                            src="/logo.svg"
                            alt="Openbook"
                            className="size-24 mb-4 dark:invert"
                            width={100}
                            height={100}
                            unoptimized
                            quality={100}
                        />
                        <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Welcome to Neuman
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-md text-center">
                            Start a conversation by typing your message below.
                        </p>
                    </div>
                </div>
            )}

            {/* Loading indicator for initial response */}
            <AnimatePresence>
                {isJustThinking && lastUserMessageIndex >= 0 && (
                    <motion.div
                        key="thinking"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MessageLoading loadingText={getLoadingText()} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skeleton loader for streaming content */}
            <AnimatePresence>
                {isStreaming &&
                    !error &&
                    !typingCompleted &&
                    !messages.some((m) => m.role === 'assistant' && m.content) && (
                        <motion.div
                            key="streaming"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MessageLoading />
                            {streamProgress > 0 && streamProgress < 100 && (
                                <StreamingProgress progress={streamProgress} />
                            )}
                        </motion.div>
                    )}
            </AnimatePresence>

            {/* Advanced progress indicator for long-running requests */}
            <AnimatePresence>
                {showAdvancedProgress && isLoading && (
                    <AIProgressIndicator
                        status={status}
                        startTime={isJustThinking ? thinkingStartTime.current : streamStartTime.current}
                        tokenCount={tokenCount}
                        estimatedTokens={estimatedTokens}
                    />
                )}
            </AnimatePresence>

            {/* Typing indicator during streaming */}
            <AnimatePresence>
                {isStreaming && !typingCompleted && (
                    <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-[80px] left-1/2 transform -translate-x-1/2 z-10"
                    >
                        <TypingIndicator />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 flex items-start gap-3 mt-4"
                    >
                        <div className="flex-shrink-0 text-red-500 dark:text-red-400">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                            <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                                <p>{error.message || 'An error occurred while processing your request.'}</p>
                            </div>
                            <div className="mt-3">
                                <Button size="sm" onClick={handleRetry} className="flex items-center gap-1 text-xs">
                                    <RefreshCw className="h-3 w-3" />
                                    Retry
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={reasoningScrollRef} />
        </div>
    );
};

export default Messages;
