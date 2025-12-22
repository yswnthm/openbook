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
    extractReasoningMiddleware,
} from 'ai';
import { z } from 'zod';
import { debugLog } from '@/lib/logger';

// Shared tools and services
import { academicSearchTool } from '../lib/ai/tools/academic-search';
import { executeReasonSearch } from '../lib/ai/tools/reason-search-advanced';
import { neuman, getProviderOptions, getTemperature, getMaxSteps } from '../lib/ai/providers';

const middleware = extractReasoningMiddleware({
    tagName: 'think',
});

export async function POST(req: Request) {
    const { messages, model, group, user_id, timezone, systemPrompt } = await req.json();

    // Ensure activeTools is always an array to avoid spread operator errors later
    let activeTools: readonly any[] = [];
    let instructions: string | undefined;
    try {
        ({ tools: activeTools = [], instructions } = await getGroupConfig(group));
    } catch (error: unknown) {
        debugLog('Error fetching group config:', error);
        return new Response(JSON.stringify({ error: 'Failed to load group configuration' }), {
            status: 500,
        });
    }

    // Override instructions if systemPrompt is provided (User setting)
    if (systemPrompt && systemPrompt.trim().length > 0) {
        // debugLog('Using custom system prompt:', systemPrompt);
        instructions = systemPrompt;
    }

    debugLog('--------------------------------');
    debugLog('Messages received:', JSON.stringify(messages, null, 2));
    debugLog('Messages count:', messages.length);
    debugLog('--------------------------------');
    debugLog('Running with model: ', model.trim());
    debugLog('Group: ', group);
    debugLog('Timezone: ', timezone);

    return createDataStreamResponse({
        execute: async (dataStream: any) => {
            const result = streamText({
                model: neuman.languageModel(model),
                messages: convertToCoreMessages(messages),
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
                    // The code interpreter below **does not execute code for real** – it only simulates
                    // execution and returns a descriptive message. This is purely for demonstration
                    // purposes and to avoid the security risks of arbitrary code execution.
                    code_interpreter: tool({
                        description: 'Execute Python code for calculations, data analysis, and computations.',
                        parameters: z.object({
                            code: z.string().describe('The Python code to execute'),
                        }),
                        execute: async ({ code }: { code: string }) => {
                            // This is a placeholder - in production you'd want a proper sandboxed code execution environment
                            // For now, we'll return a descriptive message about what the code would do
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
                        execute: async ({ timezone: tz, format }: { timezone?: string; format?: string }) => {
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
                            } catch (error) {
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
                        model: neuman.languageModel('openai-gpt-5-mini'),
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
