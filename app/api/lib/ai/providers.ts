// AI Model Providers Configuration
// Extracted from app/api/chat/route.ts

import { customProvider, wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Middleware for reasoning extraction
const middleware = extractReasoningMiddleware({
  tagName: 'think',
});

// OpenRouter Configuration
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Custom provider with multiple AI models
// Custom provider with multiple AI models
export const neuman = customProvider({
  languageModels: {
    'neuman-default': openrouter('openai/gpt-oss-120b:free'),
    'neuman-deepseek-free': openrouter('nex-agi/deepseek-v3.1-nex-n1:free'),
    'neuman-gpt-oss-free': openrouter('openai/gpt-oss-120b:free'),
    'neuman-glm-4': openrouter('z-ai/glm-4.5-air:free'),
    'neuman-qwen-coder': openrouter('qwen/qwen3-coder:free'),
    'neuman-gemma-3n': openrouter('google/gemma-3n-e2b-it:free'),
    'neuman-gemma-3-27b': openrouter('google/gemma-3-27b-it:free'),
    'neuman-deepseek-r1': openrouter('deepseek/deepseek-r1-0528:free'),
    'neuman-gemini-3': openrouter('google/gemini-3-pro-preview'),
    'neuman-gpt-5-mini': openrouter('openai/gpt-5-mini-2025-08-07'),
    'neuman-gpt-5-nano': openrouter('openai/gpt-5-nano-2025-08-07')
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

/**
 * Available model names
 */
export const AVAILABLE_MODELS = [
  'neuman-default',
  'neuman-deepseek-free',
  'neuman-gpt-oss-free',
  'neuman-glm-4',
  'neuman-qwen-coder',
  'neuman-gemma-3n',
  'neuman-gemma-3-27b',
  'neuman-deepseek-r1',
  'neuman-gemini-3',
  'neuman-gpt-5-mini',
  'neuman-gpt-5-nano',
  'neuman-gpt-oss',
] as const;

export type AvailableModel = (typeof AVAILABLE_MODELS)[number];

/**
 * Check if a model name is valid
 */
export function isValidModel(model: string): model is AvailableModel {
  return AVAILABLE_MODELS.includes(model as AvailableModel);
}
