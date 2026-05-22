// AI Model Providers Configuration
// Extracted from app/api/chat/route.ts

import { customProvider } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { serverEnv } from '@/lib/env/server';
import { MODEL_REGISTRY, ModelId, MODEL_IDS } from '@/lib/ai/model-registry';

// OpenRouter Configuration
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: serverEnv.OPENROUTER_API_KEY,
});

// Hugging Face Configuration
const huggingface = createOpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: serverEnv.HF_TOKEN,
});

// Groq Configuration
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: serverEnv.GROQ_API_KEY,
});

// Native OpenAI Configuration
const openai = createOpenAI({
  apiKey: serverEnv.OPENAI_API_KEY,
});

// Google Configuration
const google = createGoogleGenerativeAI({
  apiKey: serverEnv.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Cerebras Configuration
const cerebras = createOpenAI({
  baseURL: 'https://api.cerebras.ai/v1',
  apiKey: serverEnv.CEREBRAS_API_KEY,
});

// Ollama Configuration (via OpenAI compatible endpoint)
const ollama = createOpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

// Re-export SUPPORTED_MODEL_IDS and SupportedModelId for schema compatibility
export const SUPPORTED_MODEL_IDS = MODEL_IDS;
export type SupportedModelId = ModelId;

// Dynamically construct languageModels mapping from the registry
const languageModelsMap: Record<string, any> = {};

for (const [id, def] of Object.entries(MODEL_REGISTRY)) {
  const { provider, providerModel } = def;
  switch (provider) {
    case 'google':
      languageModelsMap[id] = google(providerModel);
      break;
    case 'openai':
      languageModelsMap[id] = openai(providerModel);
      break;
    case 'openrouter':
      languageModelsMap[id] = openrouter(providerModel);
      break;
    case 'huggingface':
      languageModelsMap[id] = huggingface(providerModel);
      break;
    case 'groq':
      languageModelsMap[id] = groq(providerModel);
      break;
    case 'cerebras':
      languageModelsMap[id] = cerebras(providerModel);
      break;
    case 'ollama':
      languageModelsMap[id] = ollama(providerModel);
      break;
    case 'local':
      // Local placeholder mapping
      languageModelsMap[id] = openai(providerModel);
      break;
  }
}

// Custom provider with multiple AI models
export const neuman = customProvider({
  languageModels: languageModelsMap,
});

/**
 * Get provider-specific options based on model
 */
export function getProviderOptions(_model: string) {
  const baseOptions = {
    neuman: {},
    google: {},
    openai: {},
    xai: {},
    anthropic: {},
    cerebras: {},
  } as Record<string, Record<string, unknown>>;

  return baseOptions;
}

/**
 * Get temperature setting based on model
 */
export function getTemperature(_model: string): number | undefined {
  return undefined;
}

/**
 * Get max steps for tool usage
 */
export function getMaxSteps(): number {
  return 5;
}
