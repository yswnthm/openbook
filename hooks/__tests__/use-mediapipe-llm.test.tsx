import { GlobalRegistrator } from '@happy-dom/global-registrator';
try {
    GlobalRegistrator.register();
} catch {}

import { expect, test, describe, afterEach, mock, beforeEach } from 'bun:test';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMediaPipeLLM } from '../use-mediapipe-llm';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

// Create a mock function we can track
const mockGenerateResponse = mock((prompt, callback) => {
    // Simulate generation
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
        // Default mock implementation for logging calls
        mockFetch.mockResolvedValue(new Response('ok'));
    });

    afterEach(() => {
        // clean up
    });

    test('loadModel should handle URL string and track progress', async () => {
        const { result } = renderHook(() => useMediaPipeLLM());

        const mockResponse = new Response(new Blob(['mock data']), {
            headers: { 'Content-Length': '100' }
        });
        mockFetch.mockResolvedValue(mockResponse);

        const modelUrl = 'https://example.com/model.task';

        await act(async () => {
            // @ts-ignore
            await result.current.loadModel(modelUrl);
        });

        expect(mockFetch).toHaveBeenCalledWith(modelUrl);

        await waitFor(() => {
             expect(result.current.state.isModelLoaded).toBe(true);
        });
    });

    test('generate should inject system prompt correctly', async () => {
        const { result } = renderHook(() => useMediaPipeLLM());
        
        // Load model first
        const mockResponse = new Response(new Blob(['mock data']), { headers: { 'Content-Length': '10' } });
        mockFetch.mockResolvedValue(mockResponse);
        await act(async () => {
             // @ts-ignore
             await result.current.loadModel('https://example.com/model.task');
        });

        const messages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello!' }
        ];

        const mockOnUpdate = mock();
        const mockOnFinish = mock();

        await act(async () => {
            await result.current.generate(messages, mockOnUpdate, mockOnFinish);
        });

        // Current implementation does "System: Content", but spec wants "(System Instruction: Content) User: Content"
        // So this expectation should FAIL currently.
        expect(mockGenerateResponse).toHaveBeenCalledWith(
            expect.stringContaining('(System Instruction: You are a helpful assistant.)'),
            expect.any(Function)
        );
    });

    test('loadModel should handle File object correctly', async () => {
        const { result } = renderHook(() => useMediaPipeLLM());
        
        const mockFile = new File(['dummy content'], 'model.task', { type: 'application/octet-stream' });

        await act(async () => {
            // @ts-ignore
            await result.current.loadModel(mockFile);
        });

        // Verify URL.createObjectURL was called with the file
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockFile);
        
        // Verify state eventually becomes ready
        await waitFor(() => {
             expect(result.current.state.isModelLoaded).toBe(true);
        });
    });
});