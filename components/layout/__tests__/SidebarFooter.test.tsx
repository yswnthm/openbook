import { expect, test, describe, afterEach, mock } from "bun:test";
import { render, cleanup } from "@testing-library/react";
import { SidebarFooter } from "../SidebarFooter";
import React from "react";

mock.module('@/contexts/SettingsContext', () => ({
  useSettings: () => ({
    systemPrompt: '',
    setSystemPrompt: () => {}
  })
}));

afterEach(cleanup);

describe("SidebarFooter", () => {
  test("should have IDs for Settings and Clear Storage buttons", () => {
    const mockClear = () => {};
    const { container } = render(
      <SidebarFooter onClearStorage={mockClear} />
    );

    const settingsBtn = container.querySelector('#sidebar-settings-trigger');
    const clearBtn = container.querySelector('#sidebar-clear-storage-trigger');

    expect(settingsBtn).not.toBeNull();
    expect(clearBtn).not.toBeNull();
  });
});
