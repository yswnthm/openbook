import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { CompactRequestSchema } from '@/lib/api/chat-schema';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const CompactResponseSchema = z.object({
    summary: z.string().describe('A concise summary of the conversation that preserves key context, decisions, and important information'),
    title: z.string().describe('A descriptive title for the new workspace based on the conversation topic'),
});

// Import z for schema definition
import { z } from 'zod';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        if (!body) {
            return NextResponse.json(
                { error: 'invalid_request', message: 'Request body must be a valid JSON object.' },
                { status: 400 }
            );
        }

        const parsed = CompactRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'invalid_request', message: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { messages } = parsed.data;

        // Format messages for summarization
        const conversationText = messages
            .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n');

        // Limit the conversation text length to prevent cost/performance issues
        const maxLength = 4000;
        const truncatedConversationText = conversationText.length > maxLength 
            ? conversationText.substring(0, maxLength) + '\n\n[... conversation truncated for processing ...]'
            : conversationText;

        const prompt = `Please analyze this conversation and provide a comprehensive summary that preserves the key context, decisions, learnings, and important details. The summary should be detailed enough to continue the conversation meaningfully in a new context.

Conversation:
${truncatedConversationText}

Please provide both a detailed summary and a descriptive title for continuing this discussion.`;

        const { object } = await generateObject({
            model: openai('gpt-4o-mini'),
            prompt,
            schema: CompactResponseSchema,
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error('Error compacting conversation:', error);
        return NextResponse.json(
            { error: 'server_error', message: 'Failed to compact conversation' },
            { status: 500 }
        );
    }
}