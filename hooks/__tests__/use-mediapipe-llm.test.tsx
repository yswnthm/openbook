import { GlobalRegistrator } from '@happy-dom/global-registrator';
try {
    GlobalRegistrator.register();
} catch {}

import { expect, test, describe, afterEach, mock, beforeEach, spyOn } from 'bun:test';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMediaPipeLLM } from '../use-mediapipe-llm';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

// Mock MediaPipe
mock.module('@mediapipe/tasks-genai', () => ({
    FilesetResolver: {
        forGenAiTasks: mock(() => Promise.resolve('mock-genai-fileset')),
    },
    LlmInference: {
        createFromOptions: mock(() => Promise.resolve({
            generateResponse: mock(),
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
        // Reset MediaPipe mocks if needed, or rely on mock implementation
    });

    afterEach(() => {
        // clean up
    });

    test('loadModel should handle URL string and track progress', async () => {
        const { result } = renderHook(() => useMediaPipeLLM());

        // Mock fetch response with stream for progress
        const mockResponse = new Response(new Blob(['mock data']), {
            headers: { 'Content-Length': '100' }
        });
        
        // We need to simulate a stream to test progress
        // Ideally we mock fetch to return a stream we can control, but for a basic "Red" test
        // just returning a blob response is enough to trigger the "fetch" logic vs "File" logic.
        // However, to test progress updates specifically, we might need a more complex mock.
        // For now, let's just test that it accepts a string and tries to fetch.
        
        mockFetch.mockResolvedValue(mockResponse);

        const modelUrl = 'https://example.com/model.task';

        // @ts-ignore - Validating that we CAN call it with string, even if TS types aren't updated yet in the file (but we will update them)
        await act(async () => {
            await result.current.loadModel(modelUrl);
        });

        // Verify fetch was called
        expect(mockFetch).toHaveBeenCalledWith(modelUrl);

        // Verify state eventually becomes ready
        await waitFor(() => {
             expect(result.current.state.isModelLoaded).toBe(true);
        });
    });
});
