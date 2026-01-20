import { GlobalRegistrator } from '@happy-dom/global-registrator';
try {
    GlobalRegistrator.register();
} catch {}

import { expect, test, describe, afterEach, mock, jest } from 'bun:test';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import React from 'react';

// --- MOCKS ---

// 1. Mock useOnlineStatus to return FALSE
mock.module('@/hooks/useOnlineStatus', () => ({
    useOnlineStatus: () => false,
}));

// 2. Spy on toast
const toastErrorSpy = jest.fn();
mock.module('sonner', () => ({
    toast: { 
        error: toastErrorSpy, 
        info: () => {} 
    },
}));

// 3. Mock useChat to spy on append
const appendSpy = jest.fn().mockResolvedValue(null);
mock.module('@ai-sdk/react', () => ({
    useChat: () => ({
        messages: [],
        input: 'test message',
        setInput: () => {},
        append: appendSpy,
        handleSubmit: () => {},
        setMessages: () => {},
        reload: () => {},
        stop: () => {},
        status: 'ready',
        error: null,
    }),
}));

// 4. Other necessary mocks to prevent crashes
mock.module('nuqs', () => ({
    useQueryState: () => ['', () => {}],
    parseAsString: { withDefault: () => {} },
}));

mock.module('next-themes', () => ({
    useTheme: () => ({ theme: 'light' }),
}));

// Mutable mock state
let mockSelectedModel = 'openai-gpt-4';

mock.module('@/hooks/use-local-storage', () => ({
    // Default to a cloud model
    useLocalStorage: () => [mockSelectedModel, (newModel: string) => { mockSelectedModel = newModel; }],
}));

mock.module('@/contexts/SidebarContext', () => ({
    useSidebar: () => ({ isOpen: true }),
}));

mock.module('@/contexts/SpacesContext', () => ({
    useSpaces: () => ({
        currentSpace: { messages: [] },
        currentSpaceId: '123',
        switchSpace: () => {},
        addMessage: () => {},
        createSpace: () => {},
        markSpaceContextReset: () => {},
    }),
}));

mock.module('@/contexts/SettingsContext', () => ({
    useSettings: () => ({ systemPrompt: '' }),
}));

mock.module('@/contexts/StudyModeContext', () => ({
    useStudyMode: () => ({
        getStudyModeForSpace: () => null,
        setStudyMode: () => {},
    }),
}));

mock.module('@/contexts/OnboardingContext', () => ({
    OnboardingProvider: ({ children }: any) => <div>{children}</div>,
    useOnboarding: () => ({
        registerStep: () => {},
        isCompleted: true,
        startTutorial: () => {},
        steps: [],
    }),
}));

mock.module('@/hooks/use-web-llm', () => ({
    useWebLLM: () => ({
        state: { isLoading: false, isModelLoaded: false },
        loadModel: () => {},
        generate: () => {},
    }),
}));

mock.module('@/hooks/use-mediapipe-llm', () => ({
    useMediaPipeLLM: () => ({
        state: { isLoading: false, isModelLoaded: false },
        loadModel: () => {},
        generate: () => {},
    }),
}));

mock.module('@/lib/local-models', () => ({
    isLocalModel: () => false,
    getLocalModelById: () => null,
}));

mock.module('next/link', () => ({
    default: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

mock.module('next/font/google', () => ({
    Syne: () => ({ style: { fontFamily: 'Syne' }, className: 'className', variable: 'variable' }),
    Inter: () => ({ style: { fontFamily: 'Inter' }, className: 'className', variable: 'variable' }),
}));

// Mock ChatInput to expose trigger
mock.module('@/components/features/spaces/input/input-content-box', () => ({
    ChatInput: ({ onSubmit }: { onSubmit: () => void }) => (
        <button data-testid="submit-button" onClick={onSubmit}>
            Submit Message
        </button>
    ),
}));

// Mock other components
mock.module('@/components/layout/top-bar', () => ({ TopBar: () => <div>TopBar</div> }));
mock.module('@/components/ui/theme-toggle', () => ({ ThemeToggle: () => <div>ThemeToggle</div> }));
mock.module('@/components/modals/InstallPrompt', () => ({ InstallPrompt: () => <div>InstallPrompt</div> }));
mock.module('@/components/features/spaces/chat/messages', () => ({ default: () => <div>Messages</div> }));
mock.module('./_components/WidgetSection', () => ({ WidgetSection: () => <div>WidgetSection</div> }));
mock.module('@/lib/utils', () => ({
    cn: (...args: any[]) => args.join(' '),
    getUserId: () => 'user-123',
    SearchGroupId: {},
}));

afterEach(cleanup);

describe('ChatClient Offline Behavior', () => {
    test('should block cloud model requests when offline', async () => {
        // Dynamic import
        const { default: ChatClient } = await import('../ChatClient');

        const { getByTestId } = render(<ChatClient />);

        const submitBtn = getByTestId('submit-button');
        fireEvent.click(submitBtn);

        // Expectation:
        // 1. Toast error should be called
        // 2. useChat.append should NOT be called
        
        // Waiting for potential async effects
        await waitFor(() => {
             // This is expected to PASS now
             expect(toastErrorSpy).toHaveBeenCalledWith(expect.stringContaining('offline'), expect.anything());
             expect(appendSpy).not.toHaveBeenCalled();
        });
    });

    test('should ALLOW local model requests when offline', async () => {
        // Set model to local
        mockSelectedModel = 'local-gemma-2b';
        
        // Re-import to ensure we get a fresh component/hook state if possible, 
        // but react-testing-library render should pick up the new mock return value on next render.
        const { default: ChatClient } = await import('../ChatClient');
        
        // Reset spies
        toastErrorSpy.mockClear();
        appendSpy.mockClear();

        const { getByTestId, unmount } = render(<ChatClient />);

        const submitBtn = getByTestId('submit-button');
        fireEvent.click(submitBtn);

        await waitFor(() => {
             // Should NOT show offline error
             // We check that we didn't get the specific offline message
             expect(toastErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('offline'), expect.anything());
        });
        
        unmount();
    });
});
