import { GlobalRegistrator } from "@happy-dom/global-registrator";
try {
  GlobalRegistrator.register();
} catch {}

import { expect, test, describe, afterEach, mock, beforeEach } from "bun:test";
import { render, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";

// Mocks
mock.module('next/image', () => ({
  default: (props: any) => <img {...props} />
}));

mock.module('next/navigation', () => ({
  useRouter: () => ({ push: mock(() => {}) }),
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

// Mock SidebarFooter to avoid deep rendering issues
mock.module('../SidebarFooter', () => ({
  SidebarFooter: () => <div data-testid="sidebar-footer">SidebarFooter</div>
}));

// Mock SidebarNotebook
mock.module('../SidebarNotebook', () => ({
  default: () => <div>SidebarNotebook</div>
}));

// Mock SearchModal and SettingsPanel
mock.module('@/components/features/search/search-modal', () => ({
  SearchModal: () => <div>SearchModal</div>
}));

mock.module('@/components/features/settings/settings-panel', () => ({
  SettingsPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
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
