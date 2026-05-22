/**
 * NOTE: TypeScript checking is enabled for this file. Any type issues should be addressed rather than suppressed.
 */
/**
 * Main AI Chat API Route
 * Handles streaming chat with academic search and reason search tools
 */

import { getGroupConfig } from '@/app/(config)/actions';
import {
    convertToCoreMessages,
    streamText,
    tool,
    createDataStreamResponse,
    generateObject,
    NoSuchToolError,
} from 'ai';
import { z } from 'zod';
import { debugLog } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequestSchema } from '@/lib/api/chat-schema';
import { isAuthenticated } from '@/lib/auth';

// Shared tools and services
import { academicSearchTool } from '../lib/ai/tools/academic-search';
import { executeReasonSearch } from '../lib/ai/tools/reason-search-advanced';
import { neuman, getProviderOptions, getTemperature, getMaxSteps } from '../lib/ai/providers';
import { getMissingApiKey } from '@/lib/ai/model-registry';

export async function POST(req: NextRequest) {
    // 1. Safely parse JSON and validate request body schema
    const body = await req.json().catch(() => null);
    if (!body) {
        return NextResponse.json(
            { error: 'invalid_request', message: 'Request body must be a valid JSON object.' },
            { status: 400 }
        );
    }

    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'invalid_request', message: parsed.error.errors[0].message },
            { status: 400 }
        );
    }

    const { messages, model, group, timezone, systemPrompt } = parsed.data;

    // 2. Validate provider key presence
    const missingKey = getMissingApiKey(model);
    if (missingKey) {
        return NextResponse.json(
            { error: 'provider_unavailable', message: `Model provider is unavailable because the API key ${missingKey} is not configured on the server.` },
            { status: 400 }
        );
    }

    // 3. Ensure activeTools is always an array to avoid spread operator errors later
    let activeTools: readonly any[] = [];
    let instructions: string | undefined;
    try {
        ({ tools: activeTools = [], instructions } = await getGroupConfig(group));
    } catch (error: unknown) {
        debugLog('Error fetching group config:', error);
        return NextResponse.json(
            { error: 'server_error', message: 'Failed to load group configuration' },
            { status: 500 }
        );
    }

    // 4. Handle custom systemPrompt according to authentication policy
    const authenticated = isAuthenticated(req);
    if (systemPrompt && systemPrompt.trim().length > 0) {
        if (authenticated) {
            // Authenticated developer override: fully replace base instructions
            instructions = systemPrompt;
        } else {
            // Anonymous override protection: append user rules to the safety-critical base instructions
            const baseInstructions = instructions || '';
            instructions = `${baseInstructions}\n\n### User Custom Guidelines:\n${systemPrompt}`;
        }
    }

    // 5. Metadata-only safe logging (no raw message content logged to production paths)
    const totalChars = messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
    debugLog('--------------------------------');
    debugLog('Messages count:', messages.length, 'Total characters:', totalChars);
    debugLog('Running with model: ', model.trim());
    debugLog('Group: ', group);
    debugLog('Timezone: ', timezone);
    debugLog('--------------------------------');

    return createDataStreamResponse({
        execute: async (dataStream: any) => {
            const result = streamText({
                model: neuman.languageModel(model),
                messages: convertToCoreMessages(messages as any),
                temperature: getTemperature(model),
                maxSteps: getMaxSteps(),
                experimental_activeTools: [...activeTools],
                system: instructions,
                toolChoice: 'auto',
                providerOptions: getProviderOptions(model) as any,
                tools: {
                    academic_search: academicSearchTool,
                    reason_search: tool({
                        description: 'Perform a reasoned web search with multiple steps and sources.',
                        parameters: z.object({
                            topic: z.string().describe('The main topic or question to research'),
                            depth: z.enum(['basic', 'advanced']).describe('Search depth level'),
                        }),
                        execute: async ({ topic, depth }: { topic: string; depth: 'basic' | 'advanced' }) => {
                            return await executeReasonSearch(topic, depth, dataStream);
                        },
                    }),
                    // Simulated python code execution helper
                    simulated_code_interpreter: tool({
                        description: 'Simulate Python code execution for calculations, data analysis, and computations (no real sandboxed execution).',
                        parameters: z.object({
                            code: z.string().describe('The Python code to simulate'),
                        }),
                        execute: async ({ code }: { code: string }) => {
                            return {
                                success: true,
                                message: `Code execution simulation: ${code.slice(0, 100)}${code.length > 100 ? '...' : ''}`,
                                note: 'Code interpreter simulation - actual execution requires proper sandboxing infrastructure'
                            };
                        },
                    }),
                    datetime: tool({
                        description: 'Get current date and time information with timezone support.',
                        parameters: z.object({
                            timezone: z.string().optional().describe('Timezone identifier (e.g., "America/New_York", "UTC")'),
                            format: z.string().optional().describe('Date format preference'),
                        }),
                        execute: async ({ timezone: tz, format: _format }: { timezone?: string; format?: string }) => {
                            const now = new Date();
                            const userTimezone = tz || timezone || 'UTC';

                            try {
                                const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    timeZone: userTimezone,
                                    timeZoneName: 'short',
                                });

                                const formatted = dateTimeFormat.format(now);

                                return {
                                    datetime: formatted,
                                    timezone: userTimezone,
                                    iso: now.toISOString(),
                                    timestamp: now.getTime(),
                                };
                            } catch {
                                // Fallback to UTC if timezone is invalid
                                const utcFormat = new Intl.DateTimeFormat('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    timeZone: 'UTC',
                                    timeZoneName: 'short',
                                });

                                return {
                                    datetime: utcFormat.format(now),
                                    timezone: 'UTC',
                                    iso: now.toISOString(),
                                    timestamp: now.getTime(),
                                    note: `Invalid timezone '${userTimezone}', falling back to UTC`,
                                };
                            }
                        },
                    }),
                },
                // Tool repair system for handling malformed tool calls
                experimental_repairToolCall: async ({
                    toolCall,
                    tools,
                    parameterSchema,
                    error,
                }: {
                    toolCall: any;
                    tools: any;
                    parameterSchema: (toolCall: any) => any;
                    error: any;
                }) => {
                    if (NoSuchToolError.isInstance(error)) {
                        return null;
                    }

                    debugLog('Fixing tool call================================');
                    debugLog('toolCall', toolCall);
                    debugLog('tools', tools);
                    debugLog('parameterSchema', parameterSchema);
                    debugLog('error', error);

                    const toolDefinition = tools[toolCall.toolName as keyof typeof tools];
                    if (!toolDefinition) {
                        debugLog(`Tool "${toolCall.toolName}" not found for repair.`);
                        return null;
                    }

                    const { object: repairedArgs } = await generateObject({
                        model: neuman.languageModel('google-gemini-2-5-pro'),
                        schema: toolDefinition.parameters,
                        prompt: [
                            `The model tried to call the tool "${toolCall.toolName}"` +
                            ` with the following arguments:`,
                            JSON.stringify(toolCall.args),
                            `The tool accepts the following schema:`,
                            JSON.stringify(parameterSchema(toolCall)),
                            'Please fix the arguments.',
                            `Today's date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
                        ].join('\n'),
                    });

                    debugLog('repairedArgs', repairedArgs);

                    return {
                        toolCallId: toolCall.toolCallId,
                        toolName: toolCall.toolName,
                        args: repairedArgs,
                    } as any;
                },
                // Event handlers for debugging and monitoring
                onChunk(event) {
                    if (event.chunk.type === 'tool-call') {
                        debugLog('Called Tool: ', event.chunk.toolName);
                    }
                },
                onStepFinish(event) {
                    if (event.warnings) {
                        debugLog('Warnings: ', event.warnings);
                    }
                },
                onFinish(event) {
                    debugLog('Fin reason: ', event.finishReason);
                    debugLog('Reasoning: ', event.reasoning);
                    debugLog('reasoning details: ', event.reasoningDetails);
                    debugLog('Steps: ', event.steps);
                    debugLog('Messages: ', event.response.messages);
                    debugLog('Response: ', event.response);
                },
                onError(event) {
                    debugLog('Error: ', event.error);
                },
            });

            result.mergeIntoDataStream(dataStream, {
                sendReasoning: true,
            });
        },
    });
}
