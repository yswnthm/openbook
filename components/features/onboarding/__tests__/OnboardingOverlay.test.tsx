// @bun-test-dom happy-dom
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { render, waitFor, act } from "@testing-library/react";
import { OnboardingOverlay } from "../OnboardingOverlay";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";
import React from "react";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const TestWrapper = ({ children }) => {
    return React.createElement(OnboardingProvider, null, children);
};

const Trigger = () => {
    const { startTutorial } = useOnboarding();
    return React.createElement('button', { onClick: startTutorial }, 'Start');
};

describe("OnboardingOverlay", () => {
    test("should not be visible by default", () => {
        const { queryByTestId } = render(
            React.createElement(TestWrapper, null,
                React.createElement(OnboardingOverlay)
            )
        );
        const overlay = queryByTestId("onboarding-overlay");
        expect(overlay).toBeNull();
    });

    test("should be visible when tutorial starts", async () => {
        const { getByText, getByTestId } = render(
            React.createElement(TestWrapper, null,
                React.createElement(Trigger),
                React.createElement(OnboardingOverlay)
            )
        );
        
        const button = getByText("Start");
        
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            const overlay = getByTestId("onboarding-overlay");
            expect(overlay).not.toBeNull();
        });
    });
});