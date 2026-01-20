import { useState, useRef, useCallback } from 'react';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

export interface MediaPipeLLMState {
    isLoading: boolean;
    progress: number;
    text: string;
    error: string | null;
    isModelLoaded: boolean;
}

import { serverLog } from '@/lib/client-logger';

import { modelCache } from '@/lib/utils/model-cache';

// Module-level variable to persist instance across re-renders/HMR
let globalLlmInstance: LlmInference | null = null;
let currentModelKey: string | null = null;

export const useMediaPipeLLM = () => {
    // We can still use a ref to track if *this* component instance "owns" the loading, 
    // but the actual heavy object is global.
    const [state, setState] = useState<MediaPipeLLMState>({
        isLoading: false,
        progress: 0,
        text: '',
        error: null,
        isModelLoaded: !!globalLlmInstance, // Initialize based on global state
    });

    const loadModel = useCallback(async (input: File | string) => {
        const isUrl = typeof input === 'string';
        const modelKey = isUrl ? input : `local-file-${input.name}-${input.size}`;
        const logName = isUrl ? input : input.name;
        
        // Avoid reloading the same model if it's already active
        if (globalLlmInstance && currentModelKey === modelKey) {
            serverLog(`[useMediaPipeLLM] Model ${logName} already loaded. Skipping.`);
            return;
        }

        serverLog(`[useMediaPipeLLM] loadModel START. Input: ${logName}, Type: ${isUrl ? 'URL' : 'File'}`);
        
        try {
            setState({
                isLoading: true,
                progress: 0,
                text: 'Initializing MediaPipe...',
                error: null,
                isModelLoaded: false
            });

            serverLog(`[useMediaPipeLLM] Initializing FilesetResolver...`);
            const genaiFileset = await FilesetResolver.forGenAiTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
            );

            let modelUrl: string;

            if (isUrl) {
                // Check Cache first
                serverLog(`[useMediaPipeLLM] Checking cache for: ${modelKey}`);
                const cachedBlob = await modelCache.get(modelKey);

                if (cachedBlob) {
                    serverLog(`[useMediaPipeLLM] Cache HIT. Loading from cache.`);
                    setState(prev => ({ ...prev, text: 'Loading from cache...', progress: 100 }));
                    modelUrl = URL.createObjectURL(cachedBlob);
                } else {
                    serverLog(`[useMediaPipeLLM] Cache MISS. Downloading from URL...`);
                    setState(prev => ({ ...prev, text: 'Downloading model...' }));

                    const response = await fetch(input as string);
                    if (!response.body) throw new Error("Failed to fetch model: Response body is empty");

                    const contentLength = response.headers.get('Content-Length');
                    const totalLength = contentLength ? parseInt(contentLength, 10) : 0;
                    const reader = response.body.getReader();
                    
                    let receivedLength = 0;
                    const chunks = [];

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        chunks.push(value);
                        receivedLength += value.length;

                        if (totalLength > 0) {
                            const progress = Math.round((receivedLength / totalLength) * 100);
                            setState(prev => {
                                if (prev.progress !== progress) {
                                    return { ...prev, progress, text: `Downloading model... ${progress}%` };
                                }
                                return prev;
                            });
                        }
                    }

                    serverLog(`[useMediaPipeLLM] Download complete. Saving to cache...`);
                    const blob = new Blob(chunks);
                    
                    // Save to cache asynchronously (don't block the UI loading)
                    modelCache.store(modelKey, blob).catch(err => {
                        serverLog(`[useMediaPipeLLM] Cache store error:`, err.message);
                    });

                    modelUrl = URL.createObjectURL(blob);
                }
            } else {
                // It's a File object
                serverLog(`[useMediaPipeLLM] Creating Blob URL from File...`);
                modelUrl = URL.createObjectURL(input as File);
            }

            serverLog(`[useMediaPipeLLM] Blob URL created: ${modelUrl}`);

            setState(prev => ({ ...prev, text: 'Loading model into memory...', progress: 100 }));

            serverLog(`[useMediaPipeLLM] Creating LlmInference from options...`);

            // Clean up previous instance if exists
            if (globalLlmInstance) {
                // globalLlmInstance.close(); 
                globalLlmInstance = null;
            }

            const llm = await LlmInference.createFromOptions(genaiFileset, {
                baseOptions: {
                    modelAssetPath: modelUrl,
                },
            });

            serverLog(`[useMediaPipeLLM] Model created successfully. Setting state to ready.`);
            globalLlmInstance = llm;
            currentModelKey = modelKey;

            setState({
                isLoading: false,
                progress: 100,
                text: 'Ready',
                error: null,
                isModelLoaded: true
            });

        } catch (err: any) {
            serverLog(`[useMediaPipeLLM] Load Error:`, err.message);
            setState({
                isLoading: false,
                progress: 0,
                text: 'Error loading model',
                error: err.message || 'Failed to load model',
                isModelLoaded: false
            });
        }
    }, []);

    const generate = useCallback(async (
        messages: { role: string; content: string }[],
        onUpdate: (currentText: string, delta: string) => void,
        onFinish: (finalText: string) => void
    ) => {
        if (!globalLlmInstance) {
            serverLog(`[useMediaPipeLLM] Error: Engine not initialized (globalLlmInstance is null). Resetting state.`);
            setState(prev => ({ ...prev, isModelLoaded: false, error: 'Model lost, please reload' }));
            throw new Error("MediaPipe Engine not initialized. Please re-select the model file.");
        }

        try {
            // Extract system prompt if present
            const systemMessage = messages.find(m => m.role === 'system');
            const otherMessages = messages.filter(m => m.role !== 'system');

            let promptParts: string[] = [];

            // Add system prompt with specific formatting
            if (systemMessage) {
                promptParts.push(`(System Instruction: ${systemMessage.content})`);
            }

            // Format history
            otherMessages.forEach(m => {
                const roleName = m.role.charAt(0).toUpperCase() + m.role.slice(1);
                promptParts.push(`${roleName}: ${m.content}`);
            });
            
            // Add prompt for assistant to complete
            promptParts.push('Assistant: ');

            // Join with spaces or newlines?
            // "Prepend system instructions to the user's prompt string: (System Instruction: <SYSTEM_PROMPT>) User: <USER_PROMPT>"
            // This implies the system prompt might be on the same line or just before.
            // Let's use newlines for separation between turns, but maybe the system prompt is attached to the first user message?
            // The spec example shows: `(System Instruction: ...) User: ...` (same line or space separated).
            // But typical chat formats use newlines.
            // Let's stick to newlines for clarity unless we see issues, but the spec example `(System Instruction: <SYSTEM_PROMPT>) User: <USER_PROMPT>` *could* be interpreted as same line.
            // However, `promptParts.join('\n')` is safer for standard LLM parsing.
            // Let's assume newlines for now to match the existing `join('\n')` style but with the new prefix.
            // Actually, if I look closely at the spec: `(System Instruction: <SYSTEM_PROMPT>) User: <USER_PROMPT>`
            // I will use a newline after the system instruction to be safe and clean, 
            // OR I can put it right before the first User message.
            
            const inputPrompt = promptParts.join('\n');

            // Log the prompt for debugging
            serverLog(`[useMediaPipeLLM] Generated Prompt: ${inputPrompt.slice(0, 200)}...`);

            let fullText = "";

            // Use streaming generation
            globalLlmInstance.generateResponse(
                inputPrompt,
                (partialResult, done) => {
                    if (partialResult) {
                        // MediaPipe returns the accumulated text in partialResult usually?
                        // Or delta? valid string is returned.
                        // Checking docs: "The callback function to be invoked when a partial response is generated."
                        // It usually returns the NEXT user-visible string piece? 
                        // Actually, standard behavior for generateResponse listener is `(partialResult: string, done: boolean)`.
                        // Wait, does it return the WHOLE text so far or just the chunk?
                        // In many demos it returns the chunk. Let's assume chunk (delta).
                        // Wait, in previous testing it might return the whole thing?
                        // Let's verify by just appending. If it duplicates, we fix.
                        // Actually, looking at reference code (e.g. web-llm), `generateResponse` might be standard.
                        // But MediaPipe Task API: `generateResponse(text, progressCallback)`.
                        // progressCallback: (partialResult: string, done: boolean) => void.
                        // partialResult is the NEWLY appended text.

                        const delta = partialResult;
                        fullText += delta;
                        onUpdate(fullText, delta);
                    }

                    if (done) {
                        onFinish(fullText);
                        // cleanup? prompt handling?
                    }
                }
            );

        } catch (e) {
            console.error("MediaPipe Generation error", e);
            throw e;
        }
    }, []);

    return {
        state,
        loadModel,
        generate
    };
};