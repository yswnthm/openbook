import { useState, useRef, useCallback, useEffect } from 'react';
import { CreateMLCEngine, MLCEngine, InitProgressCallback } from '@mlc-ai/web-llm';

export interface WebLLMState {
    isLoading: boolean;
    progress: number;
    text: string; // The loading status text (e.g., "Loading model 50%...")
    error: string | null;
    isModelLoaded: boolean;
    isGenerating: boolean;
}


// Map our internal model IDs to MLC model IDs
export const WEB_LLM_MODELS: Record<string, string> = {
    'phi-3-mini': 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
    'phi-2': 'Phi-2-q4f16_1-MLC',
    // Add more mappings as needed
};

export const useWebLLM = () => {
    const engineRef = useRef<MLCEngine | null>(null);
    const [state, setState] = useState<WebLLMState>({
        isLoading: false,
        progress: 0,
        text: '',
        error: null,
        isModelLoaded: false,
        isGenerating: false,
    });
    const [currentModel, setCurrentModel] = useState<string | null>(null);

    const loadCounterRef = useRef(0);

    const initProgressCallback: InitProgressCallback = (report) => {
        console.log(`[WebLLM] ${report.text} (${Math.round(report.progress * 100)}%)`);
        setState((prev) => ({
            ...prev,
            progress: report.progress * 100,
            text: report.text,
        }));
    };

    const loadModel = useCallback(async (modelId: string) => {
        const mlcModelId = WEB_LLM_MODELS[modelId];
        if (!mlcModelId) {
            console.warn(`Model ${modelId} not configured for WebLLM`);
            return;
        }

        if (engineRef.current && currentModel === modelId) {
            // Already loaded
            return;
        }

        loadCounterRef.current += 1;
        const currentLoadId = loadCounterRef.current;

        try {
            setState({
                isLoading: true,
                progress: 0,
                text: 'Initializing...',
                error: null,
                isModelLoaded: false,
                isGenerating: false,
            });
            setCurrentModel(modelId);

            // Capture the specific logic of what we are loading
            // Create engine if needed, or reload model
            if (!engineRef.current) {
                const engine = await CreateMLCEngine(mlcModelId, {
                    initProgressCallback,
                });

                // CRITICAL: Check if we are still the relevant load operation
                if (currentLoadId !== loadCounterRef.current) {
                    // Cancelled during creation - unload the strictly created engine
                    if (engine) await engine.unload();
                    return;
                }
                engineRef.current = engine;
            } else {
                // We have an existing engine, we reload it
                // Capture the engine instance we are operating on
                const engine = engineRef.current;
                engine.setInitProgressCallback(initProgressCallback);
                await engine.reload(mlcModelId);

                // Check for cancellation after reload
                if (currentLoadId !== loadCounterRef.current) {
                    // Cancelled during reload
                    // Since we reused the engine ref, we might have started another load on it?
                    // If currentLoadId changed, it means another loadModel was called.
                    // The other loadModel call would have incremented the counter.
                    // IMPORTANT: The other loadModel call would ALSO be operating on engineRef.current (or waiting for it).
                    // However, MLCEngine doesn't support concurrent operations easily.
                    // If we are cancelled, it likely means we should just stop updating state.
                    // But if we want to ensure we don't leave the engine in a weird state?
                    // The requirement says: "only call await loadingEngine.unload() and set engineRef.current = null if engineRef.current === loadingEngine"

                    // In this specific branch (reload), we are reusing the single engineRef.current. 
                    // If we proceed to unload here, we might kill the NEW load that superseded us.
                    // So we should NOT unload if we are just reloading and got cancelled, UNLESS we want to kill everything.
                    // But usually, if we switch models, we just want the new one.
                    return;
                }
            }

            // Since we might have created a NEW engine in the first branch, let's verify again
            if (currentLoadId !== loadCounterRef.current) {
                if (engineRef.current) {
                    // If we just created it and were cancelled, we should have caught it above? 
                    // But if we are here, it means we survived the await.
                    // If we are cancelled now, strictly speaking we should check if we should unload.
                    // But let's assume the previous checks cover the critical creation paths.
                    return;
                }
                return;
            }

            setState((prev) => ({
                ...prev,
                isLoading: false,
                isModelLoaded: true,
                text: 'Ready'
            }));

        } catch (err: any) {
            // Check if cancelled before setting error?
            if (currentLoadId !== loadCounterRef.current) return;

            console.error('WebLLM Load Error:', err);
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: err.message || 'Failed to load model',
                text: 'Error loading model'
            }));
            setCurrentModel(null);
        }
    }, [currentModel]);



    const generate = useCallback(async (
        messages: { role: string; content: string }[],
        onUpdate: (currentText: string, delta: string) => void,
        onFinish: (finalText: string) => void,
        options?: { signal?: AbortSignal }
    ) => {
        if (!engineRef.current) {
            throw new Error("Engine not initialized");
        }

        let fullText = "";

        // Handle abort signal
        if (options?.signal?.aborted) {
            // If already aborted, don't even start
            return;
        }

        try {
            setState(prev => ({ ...prev, isGenerating: true }));

            const completion = await engineRef.current.chat.completions.create({
                messages: messages as any,
                stream: true,
            });

            // We need to manage breaking the loop manually on signal
            const abortHandler = () => {
                // We will break the loop via check inside
            };
            options?.signal?.addEventListener('abort', abortHandler);

            for await (const chunk of completion) {
                if (options?.signal?.aborted) {
                    break;
                }
                const delta = chunk.choices[0]?.delta?.content || "";
                if (delta) {
                    fullText += delta;
                    onUpdate(fullText, delta);
                }
            }

            options?.signal?.removeEventListener('abort', abortHandler);

            if (!options?.signal?.aborted) {
                onFinish(fullText);
            }

        } catch (e: any) {
            if (options?.signal?.aborted) {
                // Ignore errors if aborted
                return;
            }
            console.error("Generation error", e);
            throw e;
        } finally {
            setState(prev => ({ ...prev, isGenerating: false }));
        }
    }, []);

    const cancelLoad = useCallback(() => {
        loadCounterRef.current += 1;
        setState(prev => ({
            ...prev,
            isLoading: false,
            text: 'Cancelled',
            progress: 0
        }));
        // Incrementing the counter invalidates any in-flight load operations
    }, []);

    // Also support non-streaming for simple cases if needed, but streaming is better for chat.

    return {
        state,
        loadModel,
        generate,
        currentModel,
        cancelLoad
    };
};
