// AI Model Providers Configuration
// Extracted from app/api/chat/route.ts

import { customProvider, wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Middleware for reasoning extraction
const middleware = extractReasoningMiddleware({
  tagName: 'think',
});

// OpenRouter Configuration
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Hugging Face Configuration
const huggingface = createOpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});

// Groq Configuration
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Native OpenAI Configuration
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Configuration
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
// Cerebras Configuration
const cerebras = createOpenAI({
  baseURL: 'https://api.cerebras.ai/v1',
  apiKey: process.env.CEREBRAS_API_KEY,
});

// Ollama Configuration (via OpenAI compatible endpoint)
const ollama = createOpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

// Custom provider with multiple AI models
export const neuman = customProvider({
  languageModels: {
    'google-default': google('models/gemini-3-flash-preview'),

    'google-gemma-3n': openrouter('google/gemma-3n-e2b-it:free'),
    'google-gemma-3-27b': openrouter('google/gemma-3-27b-it:free'),
    'google-gemini-3-flash': google('models/gemini-3-flash-preview'),
    'google-gemini-2-5-pro': google('models/gemini-2.5-pro'),
    'google-gemini-2-5-flash': google('models/gemini-2.5-flash'),
    'openai-gpt-5-mini': openai('gpt-5-mini-2025-08-07'),
    'openai-gpt-5-nano': openai('gpt-5-nano-2025-08-07'),
    'hf-apriel-15b': huggingface('ServiceNow-AI/Apriel-1.6-15b-Thinker:together'),

    'hf-olmo-32b': huggingface('allenai/Olmo-3.1-32B-Think:publicai'),
    'groq-compound': groq('groq/compound'),
    'moonshot-kimi-k2': groq('moonshotai/kimi-k2-instruct-0905'),
    'groq-qwen-3': groq('qwen/qwen3-32b'),
    'groq-llama-4-maverick-17b-128e-instruct': groq('meta-llama/llama-4-maverick-17b-128e-instruct'),

    // Cerebras Models
    'cerebras-llama-3-3-70b': cerebras('llama-3.3-70b'),
    'cerebras-gpt-oss-120b': cerebras('gpt-oss-120b'),
    'cerebras-qwen-3-32b': cerebras('qwen-3-32b'),
    'cerebras-qwen-3-235b': cerebras('qwen-3-235b-a22b-instruct-2507'),

    // WebLLM (Browser)


    // Ollama (Localhost)
    'ollama-llama-3': ollama('llama3'),
    'ollama-mistral': ollama('mistral'),
    'ollama-gemma-2': ollama('gemma2'),
    'ollama-phi-3': ollama('phi3'),
    'ollama-llama-3-70b': ollama('llama3:70b'),
    'ollama-gemma-3-270m': ollama('gemma3:270m'),
  },
});

/**
 * Get provider-specific options based on model
 */
export function getProviderOptions(model: string) {
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
export function getTemperature(model: string): number | undefined {
  return undefined;
}

/**
 * Get max steps for tool usage
 */
export function getMaxSteps(): number {
  return 5;
}


