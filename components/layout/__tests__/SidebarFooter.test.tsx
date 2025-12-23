import { expect, test, describe, afterEach, mock } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { SidebarFooter } from "../SidebarFooter";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import React from "react";

try {
  GlobalRegistrator.register();
} catch {}

// Mock SettingsPanel to just render children
mock.module('@/components/features/settings/settings-panel', () => ({
  SettingsPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

afterEach(cleanup);

describe("SidebarFooter", () => {
  test("should have IDs for Settings and Clear Storage buttons", () => {
    const mockClear = () => {};
    const { container } = render(<SidebarFooter onClearStorage={mockClear} />);

    const settingsBtn = container.querySelector('#sidebar-settings-trigger');
    const clearBtn = container.querySelector('#sidebar-clear-storage-trigger');

    expect(settingsBtn).not.toBeNull();
    expect(clearBtn).not.toBeNull();
  });
});
