import { GlobalRegistrator } from "@happy-dom/global-registrator";
try {
  GlobalRegistrator.register();
} catch {}

import { expect, test, describe, afterEach, mock } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { WidgetSection } from "../_components/WidgetSection";
import React from "react";

// Mock child components
mock.module('@/components/features/spaces/Streak', () => ({
  Streak: () => <div data-testid="streak">Streak</div>
}));

mock.module('@/components/features/spaces/SurprisePromptButton', () => ({
  SurprisePromptButton: () => <div data-testid="surprise">Surprise</div>
}));

afterEach(cleanup);

describe("WidgetSection", () => {
  test("should have id 'onboarding-widgets-container'", () => {
    const mockAppend = () => Promise.resolve();
    const mockRef = { current: "" };
    const mockSetHasSubmitted = () => {};

    const { container } = render(
      <WidgetSection 
        status="ready" 
        appendWithPersist={mockAppend}
        lastSubmittedQueryRef={mockRef}
        setHasSubmitted={mockSetHasSubmitted}
      />
    );

    const wrapper = container.querySelector('#onboarding-widgets-container');
    expect(wrapper).not.toBeNull();
  });
});
