import { useState, useRef, useCallback, useEffect } from 'react';
import { CreateMLCEngine, MLCEngine, InitProgressCallback } from '@mlc-ai/web-llm';

export interface WebLLMState {
    isLoading: boolean;
    progress: number;
    text: string; // The loading status text (e.g., "Loading model 50%...")
    error: string | null;
    isModelLoaded: boolean;
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
    });
    const [currentModel, setCurrentModel] = useState<string | null>(null);

    const isCancelledRef = useRef(false);

    const initProgressCallback: InitProgressCallback = (report) => {
        if (isCancelledRef.current) return;
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

        try {
            isCancelledRef.current = false;
            setState({
                isLoading: true,
                progress: 0,
                text: 'Initializing...',
                error: null,
                isModelLoaded: false
            });
            setCurrentModel(modelId);

            // Create engine if needed, or reload model
            if (!engineRef.current) {
                // We use CreateMLCEngine which creates and loads
                // But we might want to just create the engine first?
                // Actually CreateMLCEngine is a helper.
                // Let's use CreateMLCEngine which returns the engine instance.
                // It loads the model specified.
                const engine = await CreateMLCEngine(mlcModelId, {
                    initProgressCallback,
                });
                if (isCancelledRef.current) {
                    // If cancelled during creation, we interact with engine to unload?
                    // engine.unload(); // Verify if this exists or if we should just ignore.
                    return;
                }
                engineRef.current = engine;
            } else {
                engineRef.current.setInitProgressCallback(initProgressCallback);
                await engineRef.current.reload(mlcModelId);
            }

            if (isCancelledRef.current) return;

            setState((prev) => ({
                ...prev,
                isLoading: false,
                isModelLoaded: true,
                text: 'Ready'
            }));

        } catch (err: any) {
            if (isCancelledRef.current) return;
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
        onFinish: (finalText: string) => void
    ) => {
        if (!engineRef.current) {
            throw new Error("Engine not initialized");
        }

        let fullText = "";

        if (isCancelledRef.current) return;

        try {
            const completion = await engineRef.current.chat.completions.create({
                messages: messages as any,
                stream: true,
            });

            for await (const chunk of completion) {
                if (isCancelledRef.current) break;
                const delta = chunk.choices[0]?.delta?.content || "";
                if (delta) {
                    fullText += delta;
                    onUpdate(fullText, delta);
                }
            }
            if (!isCancelledRef.current) {
                onFinish(fullText);
            }

        } catch (e) {
            if (isCancelledRef.current) return;
            console.error("Generation error", e);
            throw e;
        }
    }, []);

    const cancelLoad = useCallback(() => {
        isCancelledRef.current = true;
        setState(prev => ({
            ...prev,
            isLoading: false,
            text: 'Cancelled',
            progress: 0
        }));
        // If we had a way to abort engine creation, we would do it here.
        // For now, we rely on the flag to ignore future updates.
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
