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

// Module-level variable to persist instance across re-renders/HMR
let globalLlmInstance: LlmInference | null = null;

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
        const logName = isUrl ? input : input.name;
        
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
                serverLog(`[useMediaPipeLLM] Fetching model from URL: ${input}`);
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
                        // Only update state if progress changed significantly to avoid spamming renders
                        setState(prev => {
                            if (prev.progress !== progress) {
                                return { ...prev, progress, text: `Downloading model... ${progress}%` };
                            }
                            return prev;
                        });
                    }
                }

                serverLog(`[useMediaPipeLLM] Download complete. Creating Blob...`);
                const blob = new Blob(chunks);
                modelUrl = URL.createObjectURL(blob);
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
                // globalLlmInstance.close(); // If there is a close method
                globalLlmInstance = null;
            }

            const llm = await LlmInference.createFromOptions(genaiFileset, {
                baseOptions: {
                    modelAssetPath: modelUrl,
                },
            });

            serverLog(`[useMediaPipeLLM] Model created successfully. Setting state to ready.`);
            globalLlmInstance = llm;

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
            // MediaPipe LlmInference currently takes a single prompt string.
            // We need to format the chat history into a string prompt.
            // This formatting is model-specific (e.g. Gemma uses specific tokens).
            // For now, we will construct a simple prompt or just use the last message
            // if we assume the user will manage context manually or if single-turn.
            // But ideally, we adhere to the chat prompt format of the model.
            // Since we don't know the exact model type (could be Gemma, etc.),
            // we'll try a generic format or just pass the last user message for now.
            // Better yet, let's try to join them.

            // Construct prompt efficiently from full history
            // We use a standard "Role: Content" format which works reasonably well for many base/instruct models
            // Ideally, this should use the model's specific chat template (often stored in model metadata or tokenizer config)
            // but for now, this generic format supports system prompts and multi-turn history.
            const inputPrompt = messages.map(m => {
                // Capitalize role for standard format (User, Assistant, System)
                const roleName = m.role.charAt(0).toUpperCase() + m.role.slice(1);
                return `${roleName}: ${m.content}`;
            }).join('\n') + '\nAssistant: ';

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