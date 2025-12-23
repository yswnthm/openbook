import { GlobalRegistrator } from "@happy-dom/global-registrator";
try {
  GlobalRegistrator.register();
} catch {}

import { expect, test, describe, afterEach, mock, beforeEach } from "bun:test";
import { render, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";

// Mocks
// Note: We use the REAL OnboardingContext now.

// ... other mocks ...
mock.module('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    setInput: () => {},
    append: () => Promise.resolve(),
    handleSubmit: () => {},
    setMessages: () => {},
    reload: () => {},
    stop: () => {},
    status: 'ready',
    error: null
  })
}));

mock.module('nuqs', () => ({
  useQueryState: () => ['', () => {}],
  parseAsString: { withDefault: () => {} }
}));

mock.module('next-themes', () => ({
  useTheme: () => ({ theme: 'light' })
}));

mock.module('sonner', () => ({
  toast: { error: () => {}, info: () => {} }
}));

mock.module('@/hooks/use-local-storage', () => ({
  useLocalStorage: () => ['openai-gpt-5-mini', () => {}]
}));

mock.module('@/contexts/SidebarContext', () => ({
  useSidebar: () => ({ isOpen: true })
}));

mock.module('@/contexts/SpacesContext', () => ({
  useSpaces: () => ({
    currentSpace: { messages: [] },
    currentSpaceId: '123',
    switchSpace: () => {},
    addMessage: () => {},
    createSpace: () => {},
    markSpaceContextReset: () => {}
  })
}));

mock.module('@/contexts/SettingsContext', () => ({
  useSettings: () => ({ systemPrompt: '' })
}));

mock.module('@/contexts/StudyModeContext', () => ({
  useStudyMode: () => ({
    getStudyModeForSpace: () => null,
    setStudyMode: () => {}
  })
}));

mock.module('@/hooks/use-web-llm', () => ({
  useWebLLM: () => ({
    state: { isLoading: false, isModelLoaded: false },
    loadModel: () => {},
    generate: () => {}
  })
}));

mock.module('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => <a>{children}</a>
}));

mock.module('next/font/google', () => ({
  Syne: () => ({ style: { fontFamily: 'Syne' }, className: 'className', variable: 'variable' }),
  Inter: () => ({ style: { fontFamily: 'Inter' }, className: 'className', variable: 'variable' }) 
}));

mock.module('next/font/local', () => ({
  default: () => ({
    style: { fontFamily: 'mock-font' },
    className: 'mock-font-class',
    variable: '--mock-font-variable'
  })
}));

// Mock Components
mock.module('@/components/layout/top-bar', () => ({
  TopBar: () => <div data-testid="top-bar">TopBar</div>
}));

mock.module('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <div>ThemeToggle</div>
}));

mock.module('@/components/modals/InstallPrompt', () => ({
  InstallPrompt: () => <div>InstallPrompt</div>
}));

mock.module('@/components/features/spaces/chat/messages', () => ({
  default: () => <div data-testid="messages">Messages</div>
}));

mock.module('@/components/features/spaces/input/input-content-box', () => ({
  ChatInput: () => <div data-testid="chat-input">ChatInput</div>
}));

mock.module('./_components/WidgetSection', () => ({
  WidgetSection: () => <div data-testid="widget-section">WidgetSection</div>
}));

mock.module('@/lib/utils', () => ({
    cn: (...args: any[]) => args.join(' '),
    getUserId: () => 'user-123',
    SearchGroupId: {}
}));

afterEach(cleanup);

describe("ChatClient Onboarding Registration", () => {
  // Helper to access context
  const TestInspector = ({ onContext }: { onContext: (ctx: any) => void }) => {
      const context = useOnboarding();
      onContext(context);
      return null;
  };

  test("should register all onboarding steps correctly", async () => {
    // Dynamic import to ensure mocks are applied
    const { default: ChatClient } = await import("../ChatClient");
    
    let contextValue: any;

    render(
        <OnboardingProvider>
            <ChatClient />
            <TestInspector onContext={(ctx) => contextValue = ctx} />
        </OnboardingProvider>
    );

    // Wait for effects to run and steps to be registered
    await waitFor(() => {
        expect(contextValue.steps.length).toBeGreaterThan(0);
    });

    // Verify steps are registered
    const stepIds = contextValue.steps.map((s: any) => s.id);

    expect(stepIds).toContain('chat-input');
    expect(stepIds).toContain('model-switching');
    expect(stepIds).toContain('study-frameworks');
    expect(stepIds).toContain('compacting');
    expect(stepIds).toContain('daily-tools');
    expect(stepIds).toContain('sidebar-search');
  });
});
