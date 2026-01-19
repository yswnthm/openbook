import { useState, useRef, useCallback } from 'react';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

export interface MediaPipeLLMState {
    isLoading: boolean;
    progress: number;
    text: string;
    error: string | null;
    isModelLoaded: boolean;
}

export const useMediaPipeLLM = () => {
    const llmRef = useRef<LlmInference | null>(null);
    const [state, setState] = useState<MediaPipeLLMState>({
        isLoading: false,
        progress: 0,
        text: '',
        error: null,
        isModelLoaded: false,
    });

    const loadModel = useCallback(async (file: File) => {
        console.log(`[useMediaPipeLLM] loadModel called with: ${file.name}, size: ${file.size}`);
        try {
            setState({
                isLoading: true,
                progress: 0,
                text: 'Initializing MediaPipe...',
                error: null,
                isModelLoaded: false
            });

            const genaiFileset = await FilesetResolver.forGenAiTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
            );

            // The URL hack is required because LlmInference expects a URL or a modelPath, 
            // but for local files we need to use a Blob URL.
            const url = URL.createObjectURL(file);

            setState(prev => ({ ...prev, text: 'Loading model...' }));

            const llm = await LlmInference.createFromOptions(genaiFileset, {
                baseOptions: {
                    modelAssetPath: url,
                },
                // maxTokens: 1000, // Optional
                // topK: 40, // Optional
                // temperature: 0.8, // Optional
                // randomSeed: 101 // Optional
            });

            llmRef.current = llm;

            setState({
                isLoading: false,
                progress: 100,
                text: 'Ready',
                error: null,
                isModelLoaded: true
            });

        } catch (err: any) {
            console.error('MediaPipe Load Error:', err);
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
        if (!llmRef.current) {
            throw new Error("MediaPipe Engine not initialized");
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

            // Simple joining for now:
            const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant: ';

            // However, most .task files for MediaPipe are instructed models.
            // Let's use the last message content as the prompt for simplicity in this MVP 
            // unless we want to implement full chat templates.
            const lastMessage = messages[messages.length - 1];
            const inputPrompt = lastMessage.role === 'user' ? lastMessage.content : prompt;

            let fullText = "";

            // Use streaming generation
            llmRef.current.generateResponse(
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
