import { expect, test, describe } from "bun:test";
import { render } from "@testing-library/react";
import { TooltipCard } from "../TooltipCard";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";
import React from "react";

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(OnboardingProvider, null, children);
};

// We need to inject steps into the context to test the card.
// Since we can't easily inject state into the provider from outside without a custom provider or mocking,
// we'll rely on registering a step in the test effect.

const TestScenario = () => {
    const { registerStep, startTutorial } = useOnboarding();
    
    React.useEffect(() => {
        registerStep({
            id: 'step1',
            title: 'Welcome',
            description: 'This is the first step.',
            targetId: 'target1'
        });
        startTutorial();
    }, [registerStep, startTutorial]);

    return React.createElement(TooltipCard);
};

describe("TooltipCard", () => {
    test("should render step content", async () => {
        const { findByText } = render(
            React.createElement(TestWrapper, null,
                React.createElement(TestScenario)
            )
        );

        const title = await findByText("Welcome");
        const desc = await findByText("This is the first step.");
        
        expect(title).not.toBeNull();
        expect(desc).not.toBeNull();
    });

    // We can test button interactions if we mock the context values, but integration test covers it too.
});
