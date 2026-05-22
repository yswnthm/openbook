import { describe, expect, test } from 'bun:test';
import { ChatRequestSchema } from '@/lib/api/chat-schema';
import { NextRequest } from 'next/server';
import { POST } from '../route';

describe('Chat Validation Schema', () => {
    test('passes on valid payload', () => {
        const payload = {
            messages: [{ role: 'user', content: 'hello' }],
            model: 'google-default',
            group: 'chat',
            timezone: 'America/New_York',
            systemPrompt: 'custom prompt'
        };
        const result = ChatRequestSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    test('fails on empty messages', () => {
        const payload = {
            messages: [],
            model: 'google-default',
            group: 'chat'
        };
        const result = ChatRequestSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    test('fails on unsupported model', () => {
        const payload = {
            messages: [{ role: 'user', content: 'hello' }],
            model: 'unsupported-model-id',
            group: 'chat'
        };
        const result = ChatRequestSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    test('fails on message exceeding 8000 chars', () => {
        const payload = {
            messages: [{ role: 'user', content: 'a'.repeat(8001) }],
            model: 'google-default',
            group: 'chat'
        };
        const result = ChatRequestSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    test('fails on total characters exceeding 40000', () => {
        const payload = {
            messages: [
                { role: 'user', content: 'a'.repeat(7000) },
                { role: 'assistant', content: 'b'.repeat(7000) },
                { role: 'user', content: 'c'.repeat(7000) },
                { role: 'assistant', content: 'd'.repeat(7000) },
                { role: 'user', content: 'e'.repeat(7000) },
                { role: 'assistant', content: 'f'.repeat(7000) },
            ], // 42000 chars
            model: 'google-default',
            group: 'chat'
        };
        const result = ChatRequestSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    test('fails on systemPrompt exceeding 2000 chars', () => {
        const payload = {
            messages: [{ role: 'user', content: 'hello' }],
            model: 'google-default',
            group: 'chat',
            systemPrompt: 's'.repeat(2001)
        };
        const result = ChatRequestSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
});

describe('Chat API Route POST Handler', () => {
    test('returns 400 for invalid JSON body', async () => {
        const req = new NextRequest('http://localhost/api/chat', {
            method: 'POST',
            body: 'not-a-json'
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('invalid_request');
    });

    test('returns 400 for missing request parameters', async () => {
        const req = new NextRequest('http://localhost/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [] // invalid
            })
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('invalid_request');
    });

    test('returns 400 for missing API key', async () => {
        // Temporarily clear the API key to test failure
        const originalKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        
        try {
            const req = new NextRequest('http://localhost/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'hello' }],
                    model: 'google-default',
                    group: 'chat'
                })
            });
            const res = await POST(req);
            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBe('provider_unavailable');
            expect(body.message).toContain('GOOGLE_GENERATIVE_AI_API_KEY');
        } finally {
            process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalKey;
        }
    });
});
