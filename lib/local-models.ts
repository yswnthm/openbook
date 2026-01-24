/**
 * Registry of curated local LLM models (MediaPipe/LiteRT binary (.bin) files).
 */

export interface LocalModelMetadata {
    id: string;
    name: string;
    description: string;
    url: string;
    size: string;
    provider: 'Google' | 'Meta' | 'Mistral' | 'Other';
    params: string;
}

export const LOCAL_MODELS: LocalModelMetadata[] = [
    {
        id: 'gemma-2b-it-gpu-int4',
        name: 'Gemma 2B (Instruct)',
        description: 'Google Gemma 2B Instruct model, optimized for GPU with 4-bit quantization.',
        url: 'https://storage.googleapis.com/mediapipe-assets/gemma-2b-it-gpu-int4.bin',
        size: '1.35 GB',
        provider: 'Google',
        params: '2B'
    },
    {
        id: 'gemma-2-2b-it-gpu-int8',
        name: 'Gemma 2 2B (Instruct)',
        description: 'Newer Gemma 2 model. Higher quality reasoning in a small footprint.',
        url: 'https://storage.googleapis.com/mediapipe-assets/gemma-2-2b-it-gpu-int8.bin',
        size: '1.6 GB',
        provider: 'Google',
        params: '2B'
    }
];

export const isLocalModel = (modelId: string): boolean => {
    return LOCAL_MODELS.some(m => m.id === modelId);
};

export const getLocalModelById = (id: string): LocalModelMetadata | undefined => {
    return LOCAL_MODELS.find(m => m.id === id);
};
