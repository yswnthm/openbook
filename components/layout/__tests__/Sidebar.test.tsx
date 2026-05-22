/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { expect, test, describe, afterEach, mock } from "bun:test";
import { render, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";

// Mocks
mock.module('@/contexts/SettingsContext', () => ({
  useSettings: () => ({
    systemPrompt: '',
    setSystemPrompt: () => {}
  })
}));
mock.module('next/navigation', () => ({
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {}
  }),
  usePathname: () => '/'
}));

mock.module('@/contexts/SpacesContext', () => ({
  useSpaces: () => ({
    spaces: [],
    switchSpace: () => {},
    deleteSpace: () => {},
    currentSpaceId: '',
    createSpace: () => {}
  })
}));

mock.module('@/contexts/NotebookContext', () => ({
  useNotebooks: () => ({
    notebooks: [],
    createNotebook: () => {},
    currentNotebookId: ''
  })
}));

mock.module('@/hooks/useJournal', () => ({
  useJournal: () => ({
    entries: [],
    deleteEntry: () => {},
    createEntry: () => {}
  })
}));

// Mock SidebarNotebook
mock.module('../SidebarNotebook', () => ({
  default: () => <div>SidebarNotebook</div>
}));

// Mock SearchModal
mock.module('@/components/features/search/search-modal', () => ({
  SearchModal: () => <div>SearchModal</div>
}));

afterEach(cleanup);

describe("Sidebar Onboarding Registration", () => {
  const TestInspector = ({ onContext }: { onContext: (ctx: any) => void }) => {
      const context = useOnboarding();
      onContext(context);
      return null;
  };

  test("should register sidebar utility steps correctly", async () => {
    const { default: Sidebar } = await import("../sidebar");
    
    let contextValue: any;

    render(
        <OnboardingProvider>
            <Sidebar isOpen={true} setIsOpen={() => {}} />
            <TestInspector onContext={(ctx) => contextValue = ctx} />
        </OnboardingProvider>
    );

    // Wait for effects
    await waitFor(() => {
        expect(contextValue.steps.length).toBeGreaterThan(0);
    });

    const stepIds = contextValue.steps.map((s: any) => s.id);

    expect(stepIds).toContain('sidebar-search');
    expect(stepIds).toContain('personalization');
    expect(stepIds).toContain('data-control');
  });
});
