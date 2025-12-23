import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

import { expect, test, describe } from "bun:test";
import { renderHook } from "@testing-library/react";
import { OnboardingProvider, useOnboarding } from "./OnboardingContext";
import React from "react";

describe("OnboardingContext", () => {
    test("should throw error if used outside of provider", () => {
        // Suppress console.error for expected errors
        const originalError = console.error;
        console.error = () => {};
        try {
            expect(() => renderHook(() => useOnboarding())).toThrow();
        } finally {
            console.error = originalError;
        }
    });

    test("should provide initial state", () => {
        const wrapper = ({ children }) => (
            React.createElement(OnboardingProvider, null, children)
        );
        const { result } = renderHook(() => useOnboarding(), { wrapper });

        expect(result.current.isVisible).toBe(false);
        expect(result.current.activeStep).toBe(0);
        expect(result.current.isCompleted).toBe(false);
    });

    test("should allow registering steps", () => {
        const wrapper = ({ children }) => (
            React.createElement(OnboardingProvider, null, children)
        );
        const { result } = renderHook(() => useOnboarding(), { wrapper });

        const step = {
            id: "step1",
            title: "Step 1",
            description: "Description 1",
            targetId: "target1"
        };

        React.act(() => {
            result.current.registerStep(step);
        });

        expect(result.current.steps).toHaveLength(1);
        expect(result.current.steps[0]).toEqual(step);
    });

    test("should mark as completed", () => {
        const wrapper = ({ children }) => (
            React.createElement(OnboardingProvider, null, children)
        );
        const { result } = renderHook(() => useOnboarding(), { wrapper });

        React.act(() => {
            result.current.completeTutorial();
        });

        expect(result.current.isCompleted).toBe(true);
        expect(result.current.isVisible).toBe(false);
    });
});
