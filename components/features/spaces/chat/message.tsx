import React, { useState, useCallback, memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AlignLeft, ArrowRight, ChevronLeft, ChevronRight, Copy, Download, X, Edit } from 'lucide-react';
import { TextUIPart, ReasoningUIPart, ToolInvocationUIPart, SourceUIPart } from '@ai-sdk/ui-utils';

// Define MessagePart type
type MessagePart = TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart;

interface MessageProps {
    message: any;
    index: number;
    lastUserMessageIndex: number;
    isEditingMessage: boolean;
    editingMessageIndex: number;
    input: string;
    setInput: (value: string) => void;
    setIsEditingMessage: (value: boolean) => void;
    setEditingMessageIndex: (value: number) => void;
    renderPart: (
        part: MessagePart,
        messageIndex: number,
        partIndex: number,
        parts: MessagePart[],
        message: any,
    ) => React.ReactNode;
    status: string;
    messages: any[];
    setMessages: (messages: any[]) => void;
    append: (message: any, options?: any) => Promise<string | null | undefined>;
    reload: () => Promise<string | null | undefined>;

}

const Message: React.FC<MessageProps> = ({
    message,
    index,
    lastUserMessageIndex,
    isEditingMessage,
    editingMessageIndex,
    input,
    setInput,
    setIsEditingMessage,
    setEditingMessageIndex,
    renderPart,
    status,
    messages,
    setMessages,
    append,
    reload,

}) => {
    // Move handlers inside the component
    const handleMessageEdit = useCallback(
        (index: number) => {
            setIsEditingMessage(true);
            setEditingMessageIndex(index);
            setInput(messages[index].content);
        },
        [messages, setInput, setIsEditingMessage, setEditingMessageIndex],
    );

    const handleMessageUpdate = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (input.trim()) {
                // Get the history *before* the message being edited
                const historyBeforeEdit = messages.slice(0, editingMessageIndex);

                // Get the original message to preserve attachments if any
                const originalMessage = messages[editingMessageIndex];

                // Update the hook's message state to remove messages after the edited one
                setMessages(historyBeforeEdit);

                // Store the edited message content for the next step
                const editedContent = input.trim();

                // Clear the input field immediately
                setInput('');

                // Reset suggested questions


                // Extract attachments from the original message
                const attachments = originalMessage?.experimental_attachments || [];

                // Append the edited message with proper attachments using chatRequestOptions format
                append(
                    {
                        role: 'user', // Role is always 'user' for edited messages
                        content: editedContent,
                    },
                    {
                        experimental_attachments: attachments,
                    },
                );

                // Reset editing state
                setIsEditingMessage(false);
                setEditingMessageIndex(-1);
            } else {
                toast.error('Please enter a valid message.');
            }
        },
        [
            input,
            messages,
            editingMessageIndex,
            setMessages,
            setInput,
            append,

            setIsEditingMessage,
            setEditingMessageIndex,
        ],
    );



    const handleRegenerate = useCallback(async () => {
        if (status !== 'ready') {
            toast.error('Please wait for the current response to complete!');
            return;
        }

        const lastUserMessage = messages.findLast((m) => m.role === 'user');
        if (!lastUserMessage) return;

        // Remove the last assistant message
        const newMessages = messages.slice(0, -1);
        setMessages(newMessages);


        // Resubmit the last user message
        await reload();
    }, [status, messages, setMessages, reload]);

    if (message.role === 'user') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mb-4 px-0"
            >
                <div className="grow min-w-0">
                    {isEditingMessage && editingMessageIndex === index ? (
                        <form onSubmit={handleMessageUpdate} className="w-full">
                            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                        Edit Query
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setInput('');
                                            }}
                                            className="h-8 px-2 text-xs rounded-full"
                                            disabled={status === 'submitted' || status === 'streaming'}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs rounded-full"
                                            disabled={status === 'submitted' || status === 'streaming'}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        rows={3}
                                        className="w-full resize-none rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 text-base text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-primary/50"
                                        placeholder="Edit your message..."
                                    />
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="group relative">
                            {/* Header section with user info and buttons - similar to AI messages */}
                            <div className="flex items-center justify-between mt-5 mb-2 overflow-hidden pr-1">
                                {!isEditingMessage && index === lastUserMessageIndex && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMessageEdit(index)}
                                            className="h-7 w-7 p-0 rounded-full flex items-center justify-center"
                                            disabled={status === 'submitted' || status === 'streaming'}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(message.content);
                                                toast.success('Copied to clipboard');
                                            }}
                                            className="h-7 w-7 p-0 rounded-full flex items-center justify-center"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Message content */}
                            <div className="relative">
                                <p className="text-xl font-medium font-sans break-words text-neutral-900 dark:text-neutral-100">
                                    {message.content}
                                </p>
                            </div>
                            {message.experimental_attachments && message.experimental_attachments.length > 0 && (
                                <AttachmentsBadge attachments={message.experimental_attachments} />
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    if (message.role === 'assistant') {
        return (
            <>
                {message.parts?.map((part: MessagePart, partIndex: number) =>
                    renderPart(part, index, partIndex, message.parts as MessagePart[], message),
                )}
            </>
        );
    }

    return null;
};

// Export the attachments badge component for reuse
const AttachmentsBadge = ({ attachments }: { attachments: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const imageAttachments = attachments.filter((att) => att.contentType?.startsWith('image/'));

    if (imageAttachments.length === 0) return null;

    return (
        <>
            <div className="mt-2 flex flex-wrap gap-2">
                {imageAttachments.map((attachment, i) => {
                    // Truncate filename to 15 characters
                    const fileName = attachment.name || `Image ${i + 1}`;
                    const truncatedName = fileName.length > 15 ? fileName.substring(0, 12) + '...' : fileName;

                    return (
                        <button
                            key={i}
                            onClick={() => {
                                setSelectedIndex(i);
                                setIsOpen(true);
                            }}
                            className="flex items-center gap-1.5 max-w-xs rounded-full pl-1 pr-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <div className="h-6 w-6 rounded-full overflow-hidden shrink-0">
                                <img src={attachment.url} alt={fileName} className="h-full w-full object-cover" />
                            </div>
                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
                                {truncatedName}
                            </span>
                        </button>
                    );
                })}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="p-0 bg-white dark:bg-neutral-900 sm:max-w-4xl">
                    <div className="flex flex-col h-full">
                        <header className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        navigator.clipboard.writeText(imageAttachments[selectedIndex].url);
                                        toast.success('Image URL copied to clipboard');
                                    }}
                                    className="h-8 w-8 rounded-md text-neutral-600 dark:text-neutral-400"
                                    title="Copy link"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>

                                <a
                                    href={imageAttachments[selectedIndex].url}
                                    download={imageAttachments[selectedIndex].name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                                    title="Download"
                                >
                                    <Download className="h-4 w-4" />
                                </a>

                                <Badge
                                    variant="secondary"
                                    className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mr-8"
                                >
                                    {selectedIndex + 1} of {imageAttachments.length}
                                </Badge>
                            </div>
                            <div className="w-8"></div>{' '}
                            {/* Spacer to balance the header and avoid overlap with close button */}
                        </header>

                        <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                            <div className="relative max-w-full max-h-[60vh]">
                                <img
                                    src={imageAttachments[selectedIndex].url}
                                    alt={imageAttachments[selectedIndex].name || `Image ${selectedIndex + 1}`}
                                    className="max-w-full max-h-[60vh] object-contain rounded-md"
                                />

                                {imageAttachments.length > 1 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setSelectedIndex((prev) =>
                                                    prev === 0 ? imageAttachments.length - 1 : prev - 1,
                                                )
                                            }
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 shadow-xs"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setSelectedIndex((prev) =>
                                                    prev === imageAttachments.length - 1 ? 0 : prev + 1,
                                                )
                                            }
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 shadow-xs"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {imageAttachments.length > 1 && (
                            <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
                                <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                                    {imageAttachments.map((attachment, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedIndex(idx)}
                                            className={`relative h-12 w-12 rounded-md overflow-hidden shrink-0 transition-all ${selectedIndex === idx
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                : 'opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={attachment.url}
                                                alt={attachment.name || `Thumbnail ${idx + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <footer className="border-t border-neutral-200 dark:border-neutral-800 p-3">
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
                                <span className="truncate max-w-[80%]">
                                    {imageAttachments[selectedIndex].name || `Image ${selectedIndex + 1}`}
                                </span>
                                {imageAttachments[selectedIndex].size && (
                                    <span>{Math.round(imageAttachments[selectedIndex].size / 1024)} KB</span>
                                )}
                            </div>
                        </footer>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

Message.displayName = 'Message';

// Helper: shallow compare parts that this component renders through renderPart
function partsShallowEqual(a: any[] | undefined, b: any[] | undefined): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        const pa = a[i] as any;
        const pb = b[i] as any;
        if (pa?.type !== pb?.type) return false;
        // For text parts, compare text content
        if (pa?.type === 'text' && pa?.text !== pb?.text) return false;
    }
    return true;
}

function getLastAssistantIndex(messages: any[]): number {
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i]?.role === 'assistant') return i;
    }
    return -1;
}

const arePropsEqual = (prev: MessageProps, next: MessageProps) => {
    // Index should be stable; if not, re-render
    if (prev.index !== next.index) return false;

    // Message identity and content
    const pm = prev.message as any;
    const nm = next.message as any;
    if (pm !== nm) {
        if (pm?.id !== nm?.id) return false;
        if (pm?.role !== nm?.role) return false;
        if (pm?.content !== nm?.content) return false;
        if (!partsShallowEqual(pm?.parts, nm?.parts)) return false;
    }

    // Editing state: only re-render if this row becomes/was the one being edited
    const prevEditingThis = prev.isEditingMessage && prev.editingMessageIndex === prev.index;
    const nextEditingThis = next.isEditingMessage && next.editingMessageIndex === next.index;
    if (
        prev.isEditingMessage !== next.isEditingMessage ||
        prev.editingMessageIndex !== next.editingMessageIndex
    ) {
        if (prevEditingThis || nextEditingThis) return false;
    }

    // Input changes matter only if editing this row
    if (prev.input !== next.input && nextEditingThis) return false;

    // Last user message index affects only that row (edit controls visibility)
    if (prev.lastUserMessageIndex !== next.lastUserMessageIndex) {
        if (
            prev.index === prev.lastUserMessageIndex ||
            next.index === next.lastUserMessageIndex
        ) {
            return false;
        }
    }

    // Status changes:
    // - affect edit controls for the last user message row
    // - affect the last assistant row (loading dots / actions controlled upstream)
    if (prev.status !== next.status) {
        const isLastUserRow = next.message.role === 'user' && next.index === next.lastUserMessageIndex;
        const isEditingRow = nextEditingThis;
        const lastAssistantIndex = getLastAssistantIndex(next.messages);
        const isLastAssistantRow = next.message.role === 'assistant' && next.index === lastAssistantIndex;
        if (isLastUserRow || isEditingRow || isLastAssistantRow) return false;
    }



    // Ignore changes to functions and other props not directly used for rendering this row
    return true; // props considered equal -> skip re-render
};

const MemoMessage = memo(Message, arePropsEqual);
MemoMessage.displayName = 'Message';

export { MemoMessage as Message };
