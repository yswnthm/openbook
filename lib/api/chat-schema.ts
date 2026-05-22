import { z } from 'zod';
import { SUPPORTED_MODEL_IDS } from '@/lib/ai/model-registry';

export const ChatMessageRoleSchema = z.enum(['system', 'user', 'assistant', 'data', 'tool']);

export const ChatMessageSchema = z.object({
    id: z.string().optional(),
    role: ChatMessageRoleSchema,
    content: z.string().max(8000, { message: 'Single message content must not exceed 8,000 characters.' }),
    toolInvocations: z.array(z.any()).optional(),
    experimental_attachments: z.array(z.any()).optional(),
});

export const ChatRequestSchema = z.object({
    messages: z.array(ChatMessageSchema)
        .min(1, { message: 'Messages array cannot be empty.' })
        .max(100, { message: 'Maximum 100 messages allowed.' })
        .refine(
            (msgs) => {
                const totalChars = msgs.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
                return totalChars <= 40000;
            },
            { message: 'Total request characters must not exceed 40,000.' }
        ),
    model: z.enum(SUPPORTED_MODEL_IDS, {
        errorMap: () => ({ message: 'Unsupported model ID.' }),
    }),
    group: z.enum(['chat', 'web', 'extreme', 'active-recall'] as const, {
        errorMap: () => ({ message: 'Unsupported search group.' }),
    }),
    timezone: z.string().optional(),
    systemPrompt: z.string().max(2000, { message: 'Custom system prompt must not exceed 2,000 characters.' }).optional(),
});

export const CompactRequestSchema = z.object({
    messages: z.array(ChatMessageSchema)
        .min(1, { message: 'No messages provided.' })
        .max(100, { message: 'Too many messages. Maximum 100 messages allowed.' }),
});
