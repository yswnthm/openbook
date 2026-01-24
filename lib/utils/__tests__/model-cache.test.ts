import { expect, test, describe, beforeEach, mock } from 'bun:test';
import { modelCache } from '../model-cache';

// Mock Cache API
const mockPut = mock(() => Promise.resolve());
const mockMatch = mock(() => Promise.resolve(null));
const mockDelete = mock(() => Promise.resolve(true));

global.caches = {
    open: mock(() => Promise.resolve({
        put: mockPut,
        match: mockMatch,
        delete: mockDelete,
    })),
    delete: mock(() => Promise.resolve(true)),
} as any;

describe('modelCache', () => {
    beforeEach(() => {
        mockPut.mockClear();
        mockMatch.mockClear();
        mockDelete.mockClear();
    });

    test('store should call cache.put with a Response', async () => {
        const key = 'test-model';
        const data = new Blob(['test content']);
        
        await modelCache.store(key, data);
        
        expect(mockPut).toHaveBeenCalled();
        const [receivedKey, receivedResponse] = mockPut.mock.calls[0];
        expect(receivedKey).toBe(key);
        expect(receivedResponse).toBeInstanceOf(Response);
    });

    test('get should return a Blob if model exists', async () => {
        const key = 'test-model';
        const data = new Blob(['test content']);
        mockMatch.mockResolvedValue(new Response(data));
        
        const result = await modelCache.get(key);
        
        expect(result).toBeInstanceOf(Blob);
        const text = await result?.text();
        expect(text).toBe('test content');
    });

    test('get should return null if model does not exist', async () => {
        mockMatch.mockResolvedValue(null);
        const result = await modelCache.get('missing');
        expect(result).toBeNull();
    });

    test('exists should return true if match found', async () => {
        mockMatch.mockResolvedValue(new Response(''));
        const result = await modelCache.exists('exists');
        expect(result).toBe(true);
    });
});
