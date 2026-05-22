import React from 'react';
import { MarkdownRenderer } from '@/components/features/spaces/chat/markdown';
import type { ToolInvocation as UIToolInvocation } from '@ai-sdk/ui-utils';

// Minimal representation of a chat message used in this component
interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content?: string;
    parts?: any[];
    experimental_attachments?: any[];
    // Allow additional properties without losing type-safety on known ones
    [key: string]: unknown;
}

interface ToolInvocationListViewProps {
    toolInvocations: UIToolInvocation[];
    message: ChatMessage;
}

const ToolInvocationListView: React.FC<ToolInvocationListViewProps> = ({ toolInvocations, message: _message }) => {
    if (!toolInvocations || toolInvocations.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 mt-4">
            {toolInvocations.map((invocation, index) => (
                <div
                    key={`${invocation.toolName}-${index}`}
                    className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                >
                    <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-sm text-neutral-800 dark:text-neutral-200">
                        {invocation.toolName}
                    </div>
                    <div className="p-4 text-sm">
                        {'result' in invocation && invocation.result != null && (
                            <MarkdownRenderer content={String(invocation.result)} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToolInvocationListView;
