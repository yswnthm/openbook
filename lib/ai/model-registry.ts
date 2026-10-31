export interface ModelDefinition {
    readonly provider: 'openai' | 'google' | 'openrouter' | 'huggingface' | 'groq' | 'cerebras' | 'local' | 'ollama';
    readonly providerModel: string;
    readonly label: string;
    readonly description: string;
    readonly providerLabel: string;
    readonly capabilities: readonly string[];
    readonly contextWindow: string;
    readonly tier: 'premium' | 'free' | 'preview' | 'local' | 'ollama';
    readonly tags: readonly string[];
    readonly requiredEnv: readonly string[];
    readonly enabledInPicker: boolean;
}

export const MODEL_REGISTRY = {
    // --- Premium / Paid ---
    'openai-gpt-5-4-mini': {
        provider: 'openai',
        providerModel: 'gpt-5.4-mini-2026-03-17',
        label: 'GPT 5.4 Mini',
        description: 'Balanced performance for everyday tasks.',
        providerLabel: 'OpenAI',
        capabilities: ['Fast', 'Reasoning'],
        contextWindow: '400k',
        tier: 'premium',
        tags: ['openai', 'gpt', 'smart', 'fast'],
        requiredEnv: ['OPENAI_API_KEY'],
        enabledInPicker: true,
    },
    'openai-gpt-6-luna': {
        provider: 'openai',
        providerModel: 'gpt-6-luna',
        label: 'GPT-6 Luna',
        description: "OpenAI's most efficient model for high-volume tasks.",
        providerLabel: 'OpenAI',
        capabilities: ['Ultra Fast', 'Reasoning'],
        contextWindow: '1M',
        tier: 'premium',
        tags: ['openai', 'gpt', 'speed', 'cheap'],
        requiredEnv: ['OPENAI_API_KEY'],
        enabledInPicker: true,
    },
    'google-gemini-3-1-pro': {
        provider: 'google',
        providerModel: 'models/gemini-3.1-pro-preview',
        label: 'Gemini 3.1 Pro (Preview)',
        description: "Google's best model for large context and reasoning.",
        providerLabel: 'Google',
        capabilities: ['1M Context', 'Reasoning', 'Preview'],
        contextWindow: '1M',
        tier: 'preview',
        tags: ['google', 'gemini', 'long context', 'new'],
        requiredEnv: ['GOOGLE_GENERATIVE_AI_API_KEY'],
        enabledInPicker: true,
    },
    'google-gemini-3-8-flash': {
        provider: 'google',
        providerModel: 'models/gemini-3.8-flash',
        label: 'Gemini 3.8 Flash',
        description: 'Low latency, high throughput with frontier-class reasoning.',
        providerLabel: 'Google',
        capabilities: ['Fast', '1M Context'],
        contextWindow: '1M',
        tier: 'premium',
        tags: ['google', 'gemini', 'speed'],
        requiredEnv: ['GOOGLE_GENERATIVE_AI_API_KEY'],
        enabledInPicker: true,
    },
    'google-gemini-3-1-flash-lite': {
        provider: 'google',
        providerModel: 'models/gemini-3.1-flash-lite',
        label: 'Gemini 3.1 Flash Lite',
        description: 'Highly efficient lightweight model.',
        providerLabel: 'Google',
        capabilities: ['Fast', '1M Context'],
        contextWindow: '1M',
        tier: 'premium',
        tags: ['google', 'gemini', 'speed'],
        requiredEnv: ['GOOGLE_GENERATIVE_AI_API_KEY'],
        enabledInPicker: true,
    },
    'google-default': {
        provider: 'google',
        providerModel: 'models/gemini-3.8-flash',
        label: 'Gemini 3.8 Flash (Default)',
        description: 'Default build of the latest generation multimodal model.',
        providerLabel: 'Google',
        capabilities: ['Fast', 'Multimodal'],
        contextWindow: '1M',
        tier: 'premium',
        tags: ['google', 'gemini', 'new', 'default'],
        requiredEnv: ['GOOGLE_GENERATIVE_AI_API_KEY'],
        enabledInPicker: false,
    },
    // --- Cerebras ---
    'cerebras-gpt-oss-120b': {
        provider: 'cerebras',
        providerModel: 'gpt-oss-120b',
        label: 'GPT-OSS 120B',
        description: 'Large scale open model.',
        providerLabel: 'Cerebras',
        capabilities: ['Large', 'Fast'],
        contextWindow: '64k',
        tier: 'premium',
        tags: ['cerebras', 'gpt', 'oss'],
        requiredEnv: ['CEREBRAS_API_KEY'],
        enabledInPicker: true,
    },
    'cerebras-qwen-3-8-27b': {
        provider: 'cerebras',
        providerModel: 'qwen-3.8-27b',
        label: 'Qwen 3.8 27B',
        description: 'Fast Qwen model for reasoning and general tasks.',
        providerLabel: 'Cerebras',
        capabilities: ['Fast', 'Reasoning'],
        contextWindow: '64k',
        tier: 'premium',
        tags: ['cerebras', 'qwen', 'fast'],
        requiredEnv: ['CEREBRAS_API_KEY'],
        enabledInPicker: true,
    },
    // --- Free / Community ---
    'groq-gpt-oss-120b': {
        provider: 'groq',
        providerModel: 'openai/gpt-oss-120b',
        label: 'GPT-OSS 120B',
        description: 'Large open source model hosted on Groq.',
        providerLabel: 'Groq',
        capabilities: ['Fast', 'Reasoning'],
        contextWindow: '131k',
        tier: 'free',
        tags: ['groq', 'oss', 'free'],
        requiredEnv: ['GROQ_API_KEY'],
        enabledInPicker: true,
    },
    'google-gemma-4-26b': {
        provider: 'openrouter',
        providerModel: 'google/gemma-4-26b-a4b-it:free',
        label: 'Gemma 4 26B',
        description: 'Efficient open model from Google.',
        providerLabel: 'Google',
        capabilities: ['Efficient', 'Free'],
        contextWindow: '262k',
        tier: 'free',
        tags: ['google', 'gemma', 'free'],
        requiredEnv: ['OPENROUTER_API_KEY'],
        enabledInPicker: true,
    },
    'google-gemma-4-31b': {
        provider: 'openrouter',
        providerModel: 'google/gemma-4-31b-it:free',
        label: 'Gemma 4 31B',
        description: 'Larger variant of Gemma 4.',
        providerLabel: 'Google',
        capabilities: ['Balanced', 'Free'],
        contextWindow: '262k',
        tier: 'free',
        tags: ['google', 'gemma', 'free'],
        requiredEnv: ['OPENROUTER_API_KEY'],
        enabledInPicker: true,
    },
    'hf-qwen-3-8-27b': {
        provider: 'huggingface',
        providerModel: 'Qwen/Qwen3.8-27B',
        label: 'Qwen 3.8 27B',
        description: 'Qwen model served through the Hugging Face router.',
        providerLabel: 'Hugging Face',
        capabilities: ['Large', 'Tool Use'],
        contextWindow: '1M',
        tier: 'free',
        tags: ['hf', 'qwen', 'free'],
        requiredEnv: ['HF_TOKEN'],
        enabledInPicker: true,
    },
    'hf-gpt-oss-120b': {
        provider: 'huggingface',
        providerModel: 'openai/gpt-oss-120b',
        label: 'GPT-OSS 120B',
        description: 'Open-weight model served through the Hugging Face router.',
        providerLabel: 'Hugging Face',
        capabilities: ['Large', 'Tool Use'],
        contextWindow: '131k',
        tier: 'free',
        tags: ['hf', 'oss', 'free'],
        requiredEnv: ['HF_TOKEN'],
        enabledInPicker: true,
    },
    'groq-gpt-oss-20b': {
        provider: 'groq',
        providerModel: 'openai/gpt-oss-20b',
        label: 'GPT-OSS 20B',
        description: 'Fast, cost-efficient open model running on Groq LPU.',
        providerLabel: 'Groq',
        capabilities: ['Ultra Fast', 'Cheap'],
        contextWindow: '131k',
        tier: 'free',
        tags: ['groq', 'oss', 'free'],
        requiredEnv: ['GROQ_API_KEY'],
        enabledInPicker: true,
    },
    'groq-qwen-3-8-27b': {
        provider: 'groq',
        providerModel: 'qwen/qwen3.8-27b',
        label: 'Qwen 3.8 27B',
        description: 'General purpose Qwen model running on Groq.',
        providerLabel: 'Groq',
        capabilities: ['General', 'Reasoning'],
        contextWindow: '131k',
        tier: 'free',
        tags: ['groq', 'qwen', 'free'],
        requiredEnv: ['GROQ_API_KEY'],
        enabledInPicker: true,
    },
    'groq-llama-3-1-8b-instant': {
        provider: 'groq',
        providerModel: 'llama-3.1-8b-instant',
        label: 'Llama 3.1 8B Instant',
        description: 'Low-latency Llama model for high-volume workloads.',
        providerLabel: 'Groq',
        capabilities: ['Ultra Fast'],
        contextWindow: '131k',
        tier: 'free',
        tags: ['groq', 'llama', 'free'],
        requiredEnv: ['GROQ_API_KEY'],
        enabledInPicker: true,
    },
    // --- Local / WebLLM ---
    'local-phi-3-mini': {
        provider: 'local',
        providerModel: 'local-phi-3-mini',
        label: 'Phi-3 Mini (Local)',
        description: 'Runs entirely in your browser using WebGPU.',
        providerLabel: 'Microsoft',
        capabilities: ['Local', 'Private', 'Offline'],
        contextWindow: '4k',
        tier: 'local',
        tags: ['local', 'phi', 'webgpu', 'offline'],
        requiredEnv: [],
        enabledInPicker: true,
    },
    'local-phi-2': {
        provider: 'local',
        providerModel: 'local-phi-2',
        label: 'Phi-2 (Local)',
        description: 'Smaller local model for older devices.',
        providerLabel: 'Microsoft',
        capabilities: ['Local', 'Private', 'Offline'],
        contextWindow: '2k',
        tier: 'local',
        tags: ['local', 'phi', 'webgpu', 'offline'],
        requiredEnv: [],
        enabledInPicker: true,
    },
    // --- Ollama ---
    'ollama-gemma-3-270m': {
        provider: 'ollama',
        providerModel: 'gemma3:270m',
        label: 'Gemma 3 270M (Local)',
        description: 'Runs locally via Ollama.',
        providerLabel: 'Google',
        capabilities: ['Local', 'Ollama'],
        contextWindow: '32k',
        tier: 'ollama',
        tags: ['ollama', 'local', 'gemma'],
        requiredEnv: [],
        enabledInPicker: true,
    },
    'ollama-llama-3-2-3b': {
        provider: 'ollama',
        providerModel: 'llama3.2:3b',
        label: 'Llama 3.2 3B (Local)',
        description: 'Runs locally via Ollama.',
        providerLabel: 'Meta',
        capabilities: ['Local', 'Ollama'],
        contextWindow: '128k',
        tier: 'ollama',
        tags: ['ollama', 'local', 'llama'],
        requiredEnv: [],
        enabledInPicker: false,
    },
    'ollama-mistral-small-3-2': {
        provider: 'ollama',
        providerModel: 'mistral-small3.2',
        label: 'Mistral Small 3.2 (Local)',
        description: 'Runs locally via Ollama.',
        providerLabel: 'Mistral',
        capabilities: ['Local', 'Ollama'],
        contextWindow: '128k',
        tier: 'ollama',
        tags: ['ollama', 'local', 'mistral'],
        requiredEnv: [],
        enabledInPicker: false,
    },
    'ollama-gemma-3-4b': {
        provider: 'ollama',
        providerModel: 'gemma3:4b',
        label: 'Gemma 3 4B (Local)',
        description: 'Runs locally via Ollama.',
        providerLabel: 'Google',
        capabilities: ['Local', 'Ollama'],
        contextWindow: '128k',
        tier: 'ollama',
        tags: ['ollama', 'local', 'gemma'],
        requiredEnv: [],
        enabledInPicker: false,
    },
    'ollama-phi-4-mini': {
        provider: 'ollama',
        providerModel: 'phi4-mini',
        label: 'Phi-4 Mini (Local)',
        description: 'Runs locally via Ollama.',
        providerLabel: 'Microsoft',
        capabilities: ['Local', 'Ollama'],
        contextWindow: '128k',
        tier: 'ollama',
        tags: ['ollama', 'local', 'phi'],
        requiredEnv: [],
        enabledInPicker: false,
    },
    'ollama-llama-3-3-70b': {
        provider: 'ollama',
        providerModel: 'llama3.3:70b',
        label: 'Llama 3.3 70B (Local)',
        description: 'Runs locally via Ollama.',
        providerLabel: 'Meta',
        capabilities: ['Local', 'Ollama'],
        contextWindow: '128k',
        tier: 'ollama',
        tags: ['ollama', 'local', 'llama'],
        requiredEnv: [],
        enabledInPicker: false,
    },
} as const satisfies Record<string, ModelDefinition>;

export type ModelId = keyof typeof MODEL_REGISTRY;
export const MODEL_IDS = Object.keys(MODEL_REGISTRY) as ModelId[];
export const SUPPORTED_MODEL_IDS = MODEL_IDS as unknown as [string, ...string[]];

export const DEFAULT_MODEL_ID = 'google-default' as const;

export function isModelId(value: unknown): value is ModelId {
    return typeof value === 'string' && value in MODEL_REGISTRY;
}

export function getModelDefinition(modelId: ModelId): ModelDefinition {
    return MODEL_REGISTRY[modelId];
}

export function getMissingProviderKeys(modelId: ModelId, env: Record<string, string | undefined>): string[] {
    const def = MODEL_REGISTRY[modelId];
    if (!def) return [];
    return def.requiredEnv.filter((key) => !env[key]);
}

export function getMissingApiKey(modelId: string): string | null {
    if (!isModelId(modelId)) return 'INVALID_MODEL';
    const missing = getMissingProviderKeys(modelId, process.env);
    return missing.length > 0 ? missing[0] : null;
}
