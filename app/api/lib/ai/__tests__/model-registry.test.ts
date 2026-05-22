import { describe, expect, test } from 'bun:test';
import { MODEL_REGISTRY, isModelId, getMissingApiKey, getMissingProviderKeys } from '@/lib/ai/model-registry';
import { neuman } from '@/app/api/lib/ai/providers';

describe('AI Model Registry and Provider Validation', () => {
    test('isModelId correctly identifies valid and invalid IDs', () => {
        expect(isModelId('google-default')).toBe(true);
        expect(isModelId('openai-gpt-5-mini')).toBe(true);
        expect(isModelId('invalid-model-id-123')).toBe(false);
        expect(isModelId(null)).toBe(false);
        expect(isModelId(undefined)).toBe(false);
    });

    test('getModelDefinition returns valid definitions for all registered models', () => {
        for (const def of Object.values(MODEL_REGISTRY)) {
            expect(def).toBeDefined();
            expect(def.label).toBeString();
            expect(def.label.length).toBeGreaterThan(0);
            expect(def.description).toBeString();
            expect(def.description.length).toBeGreaterThan(0);
            expect(def.providerLabel).toBeString();
            expect(def.providerLabel.length).toBeGreaterThan(0);
            expect(def.contextWindow).toBeString();
            expect(def.contextWindow.length).toBeGreaterThan(0);
            expect(Array.isArray(def.capabilities)).toBe(true);
            expect(Array.isArray(def.tags)).toBe(true);
            expect(Array.isArray(def.requiredEnv)).toBe(true);
        }
    });

    test('every model in registry has a corresponding model configured in neuman custom provider', () => {
        for (const id of Object.keys(MODEL_REGISTRY)) {
            // Verify neuman returns a language model instance without throwing
            const model = neuman.languageModel(id);
            expect(model).toBeDefined();
            expect(model.modelId).toBeString();
        }
    });

    test('getMissingProviderKeys and getMissingApiKey correctly determine missing keys', () => {
        const mockEnv = {
            OPENAI_API_KEY: 'test-key',
            // GOOGLE_GENERATIVE_AI_API_KEY is missing
        };

        const gpt5Missing = getMissingProviderKeys('openai-gpt-5-mini', mockEnv);
        expect(gpt5Missing).toEqual([]);

        const geminiMissing = getMissingProviderKeys('google-gemini-2-5-pro', mockEnv);
        expect(geminiMissing).toEqual(['GOOGLE_GENERATIVE_AI_API_KEY']);

        // Check with getMissingApiKey using actual process.env
        const originalOpenaiKey = process.env.OPENAI_API_KEY;
        try {
            delete process.env.OPENAI_API_KEY;
            const missing = getMissingApiKey('openai-gpt-5-mini');
            expect(missing).toBe('OPENAI_API_KEY');
        } finally {
            process.env.OPENAI_API_KEY = originalOpenaiKey;
        }
    });

    test('invalid model ID returns INVALID_MODEL for getMissingApiKey', () => {
        const missing = getMissingApiKey('non-existent-model');
        expect(missing).toBe('INVALID_MODEL');
    });
});
