import { expect, test, describe } from 'bun:test';
import { LOCAL_MODELS, isLocalModel, getLocalModelById } from '../local-models';

describe('Local Model Registry', () => {
    test('should identify local models', () => {
        expect(isLocalModel('gemma-2b-it-gpu-int4')).toBe(true);
        expect(isLocalModel('non-existent')).toBe(false);
    });

    test('should retrieve model by id', () => {
        const model = getLocalModelById('gemma-2b-it-gpu-int4');
        expect(model).toBeDefined();
        expect(model?.name).toContain('Gemma');
    });

    test('registry should not be empty', () => {
        expect(LOCAL_MODELS.length).toBeGreaterThan(0);
    });
});
