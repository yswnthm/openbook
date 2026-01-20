import { useState, useCallback } from 'react';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
import { serverLog } from '@/lib/client-logger';
import { modelCache } from '@/lib/utils/model-cache';

export interface MediaPipeLLMState {
    isLoading: boolean;
    progress: number;
    text: string;
    error: string | null;
    isModelLoaded: boolean;
}

// Module-level variables to persist instance across re-renders
let globalLlmInstance: LlmInference | null = null;
let currentModelKey: string | null = null;

const LAST_CUSTOM_MODEL_KEY = 'media-pipe-last-custom-key';

export const useMediaPipeLLM = () => {
    const [state, setState] = useState<MediaPipeLLMState>(() => {
        const initialLoaded = !!globalLlmInstance;
        return {
            isLoading: false,
            progress: 0,
            text: '',
            error: null,
            isModelLoaded: initialLoaded,
        };
    });

    const loadModel = useCallback(async (input: File | string) => {
        const isUrl = typeof input === 'string';
        const modelKey = isUrl ? input : `local-file-${input.name}-${input.size}`;
        const logName = isUrl ? input : input.name;
        
        if (globalLlmInstance && currentModelKey === modelKey) {
            serverLog(`[useMediaPipeLLM] Model ${logName} already loaded. Skipping.`);
            if (!state.isModelLoaded) {
                 setState(prev => ({ ...prev, isModelLoaded: true, text: 'Ready', progress: 100, isLoading: false }));
            }
            return;
        }

        try {
            setState({ isLoading: true, progress: 0, text: 'Initializing MediaPipe...', error: null, isModelLoaded: false });

            serverLog(`[useMediaPipeLLM] Initializing FilesetResolver...`);
            const genaiFileset = await FilesetResolver.forGenAiTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
            );

            let modelUrl: string;

            if (isUrl) {
                const cachedBlob = await modelCache.get(modelKey);
                if (cachedBlob) {
                    setState(prev => ({ ...prev, text: 'Loading from cache...', progress: 100 }));
                    modelUrl = URL.createObjectURL(cachedBlob);
                } else {
                    setState(prev => ({ ...prev, text: 'Downloading model...' }));
                    const response = await fetch(input as string);
                    if (!response.body) throw new Error("Empty response body");

                    const total = parseInt(response.headers.get('Content-Length') || '0', 10);
                    const reader = response.body.getReader();
                    let received = 0;
                    const chunks = [];

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                        received += value.length;
                        if (total > 0) {
                            const progress = Math.round((received / total) * 100);
                            setState(prev => prev.progress !== progress ? { ...prev, progress, text: `Downloading model... ${progress}%` } : prev);
                        }
                    }
                    const blob = new Blob(chunks);
                    modelCache.store(modelKey, blob).catch(console.error);
                    modelUrl = URL.createObjectURL(blob);
                }
            } else {
                localStorage.setItem(LAST_CUSTOM_MODEL_KEY, modelKey);
                const exists = await modelCache.exists(modelKey);
                if (!exists) {
                    modelCache.store(modelKey, input as File).catch(console.error);
                }
                modelUrl = URL.createObjectURL(input as File);
            }

            // Clean up previous instance if exists
            if (globalLlmInstance) {
                serverLog(`[useMediaPipeLLM] Disposing previous engine instance...`);
                try {
                    globalLlmInstance.close();
                } catch (e) {
                    serverLog(`[useMediaPipeLLM] Disposal error: ${e}`);
                }
                globalLlmInstance = null;
            }

            const llm = await LlmInference.createFromOptions(genaiFileset, { baseOptions: { modelAssetPath: modelUrl } });
            globalLlmInstance = llm;
            currentModelKey = modelKey;

            setState({ isLoading: false, progress: 100, text: 'Ready', error: null, isModelLoaded: true });
        } catch (err: any) {
            setState({ isLoading: false, progress: 0, text: 'Error', error: err.message, isModelLoaded: false });
        }
    }, [state.isModelLoaded]);

    const restoreCustomModel = useCallback(async () => {
        const key = localStorage.getItem(LAST_CUSTOM_MODEL_KEY);
        if (!key) return false;

        // If already loaded in memory, just sync state
        if (globalLlmInstance && currentModelKey === key) {
             if (!state.isModelLoaded) {
                 setState(prev => ({ ...prev, isModelLoaded: true, text: 'Ready', progress: 100, isLoading: false }));
             }
             return true;
        }

        const exists = await modelCache.exists(key);
        if (!exists) return false;

        try {
            setState({ isLoading: true, progress: 0, text: 'Restoring from cache...', error: null, isModelLoaded: false });
            
            serverLog(`[useMediaPipeLLM] Getting blob from cache: ${key}`);
            const blob = await modelCache.get(key);
            if (!blob) throw new Error("Cache empty");
            
            serverLog(`[useMediaPipeLLM] Blob retrieved. Size: ${blob.size} bytes`);

            const genaiFileset = await FilesetResolver.forGenAiTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm");
            
            serverLog(`[useMediaPipeLLM] Creating LlmInference...`);
            if (globalLlmInstance) {
                serverLog(`[useMediaPipeLLM] Disposing previous engine instance...`);
                try {
                    globalLlmInstance.close();
                } catch (e) {
                    serverLog(`[useMediaPipeLLM] Disposal error: ${e}`);
                }
                globalLlmInstance = null;
            }

            const llm = await LlmInference.createFromOptions(genaiFileset, { baseOptions: { modelAssetPath: URL.createObjectURL(blob) } });
            
            serverLog(`[useMediaPipeLLM] Engine created.`);
            globalLlmInstance = llm;
            currentModelKey = key;
            setState({ isLoading: false, progress: 100, text: 'Ready', error: null, isModelLoaded: true });
            return true;
        } catch (e: any) {
            serverLog(`[useMediaPipeLLM] Restore Error: ${e.message}`);
            setState({ isLoading: false, progress: 0, text: 'Restore failed', error: e.message, isModelLoaded: false });
            return false;
        }
    }, [state.isModelLoaded]);

    const generate = useCallback(async (
        messages: { role: string; content: string }[],
        onUpdate: (currentText: string, delta: string) => void,
        onFinish: (finalText: string) => void
    ) => {
        serverLog(`[useMediaPipeLLM] Generate called. globalLlmInstance exists? ${!!globalLlmInstance}`);
        if (!globalLlmInstance) {
            serverLog(`[useMediaPipeLLM] Error: Engine not initialized (globalLlmInstance is null). Resetting state.`);
            setState(prev => ({ ...prev, isModelLoaded: false, error: 'Model lost, please reload' }));
            throw new Error("MediaPipe Engine not initialized. Please re-select the model file.");
        }

        try {
            // Pass the conversation (User and Assistant) but exclude the System prompt
            const prompt = messages
                .filter(m => m.role !== 'system')
                .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n') + '\nAssistant: ';

            serverLog(`[useMediaPipeLLM] Generated Prompt (Conversation): ${prompt.slice(0, 100)}...`);

            let fullText = "";
            globalLlmInstance.generateResponse(
                prompt,
                (partialResult, done) => {
                    if (partialResult) {
                        fullText += partialResult;
                        onUpdate(fullText, partialResult);
                    }
                    if (done) {
                        onFinish(fullText);
                    }
                }
            );
        } catch (e: any) {
            console.error("MediaPipe Generation error", e);
            throw e;
        }
    }, []);

    return { state, loadModel, generate, restoreCustomModel };
};
