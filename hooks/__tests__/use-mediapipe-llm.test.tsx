import { GlobalRegistrator } from '@happy-dom/global-registrator';
try {
    GlobalRegistrator.register();
} catch { }

import { expect, test, describe, afterEach, mock, beforeEach } from 'bun:test';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMediaPipeLLM } from '../use-mediapipe-llm';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

// Mock modelCache
const mockCacheGet = mock(() => Promise.resolve(null));
const mockCacheStore = mock(() => Promise.resolve());
const mockCacheExists = mock(() => Promise.resolve(false));
mock.module('@/lib/utils/model-cache', () => ({
    modelCache: {
        get: mockCacheGet,
        store: mockCacheStore,
        exists: mockCacheExists,
    }
}));

// Create a mock function we can track
const mockGenerateResponse = mock((prompt, callback) => {
    callback('Response', false);
    callback('', true);
});

// Mock MediaPipe
mock.module('@mediapipe/tasks-genai', () => ({
    FilesetResolver: {
        forGenAiTasks: mock(() => Promise.resolve('mock-genai-fileset')),
    },
    LlmInference: {
        createFromOptions: mock(() => Promise.resolve({
            generateResponse: mockGenerateResponse,
            close: mock(),
        })),
    },
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = mock((blob: Blob) => 'blob:mock-url');

// Mock fetch
const mockFetch = mock();
global.fetch = mockFetch;

describe('useMediaPipeLLM', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockGenerateResponse.mockClear();
        mockCacheGet.mockClear();
        mockCacheStore.mockClear();
        mockFetch.mockResolvedValue(new Response('ok'));
    });

    test('loadModel should check cache and fetch if MISS', async () => {
        const { result } = renderHook(() => useMediaPipeLLM());
        const modelUrl = 'https://example.com/model.task';

        mockCacheGet.mockResolvedValue(null); // Cache MISS
        mockFetch.mockResolvedValue(new Response(new Blob(['data']), { headers: { 'Content-Length': '4' } }));

        await act(async () => {
            await result.current.loadModel(modelUrl);
        });

        expect(mockCacheGet).toHaveBeenCalledWith(modelUrl);
        expect(mockFetch).toHaveBeenCalledWith(modelUrl);
        expect(mockCacheStore).toHaveBeenCalled();
    });

    test('loadModel should use cache if HIT', async () => {
        const { result } = renderHook(() => useMediaPipeLLM());
        const modelUrl = 'https://example.com/cached-model.task';

        mockCacheGet.mockResolvedValue(new Blob(['cached data'])); // Cache HIT

        await act(async () => {
            await result.current.loadModel(modelUrl);
        });

        expect(mockCacheGet).toHaveBeenCalledWith(modelUrl);
        expect(mockFetch).not.toHaveBeenCalled(); // Should NOT fetch
        expect(result.current.state.isModelLoaded).toBe(true);
    });
});
