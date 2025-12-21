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

// Custom provider with multiple AI models
// Custom provider with multiple AI models
export const neuman = customProvider({
  languageModels: {
    'neuman-default': google('models/gemini-3-flash-preview'),
    'neuman-deepseek-free': openrouter('nex-agi/deepseek-v3.1-nex-n1:free'),
    'neuman-glm-4': openrouter('z-ai/glm-4.5-air:free'),
    'neuman-qwen-coder': openrouter('qwen/qwen3-coder:free'),
    'neuman-gemma-3n': openrouter('google/gemma-3n-e2b-it:free'),
    'neuman-gemma-3-27b': openrouter('google/gemma-3-27b-it:free'),
    'neuman-deepseek-r1': openrouter('deepseek/deepseek-r1-0528:free'),
    'neuman-gemini-3-flash': google('models/gemini-3-flash-preview'),
    'neuman-gemini-2-5-pro': google('models/gemini-2.5-pro'),
    'neuman-gpt-5-mini': openai('gpt-5-mini-2025-08-07'),
    'neuman-gpt-5-nano': openai('gpt-5-nano-2025-08-07'),
    'neuman-apriel-15b': huggingface('ServiceNow-AI/Apriel-1.6-15b-Thinker:together'),

    'neuman-olmo-32b': huggingface('allenai/Olmo-3.1-32B-Think:publicai'),
    'neuman-groq-compound': groq('groq/compound'),
    'neuman-kimi-k2': groq('moonshotai/kimi-k2-instruct-0905'),
    'neuman-qwen-3': groq('qwen/qwen3-32b'),
    'neuman-llama-4-maverick-17b-128e-instruct': groq('meta-llama/llama-4-maverick-17b-128e-instruct')
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


