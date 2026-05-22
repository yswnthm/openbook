import { expect, test, describe, afterEach, mock } from 'bun:test';
import { render, screen, cleanup } from '@testing-library/react';
import TeamPage from '../page';
import React from 'react';

// Mock components
mock.module('@/components/landing', () => ({
  CombinedFooter: () => <div data-testid="footer">Footer</div>,
  Header: () => <div data-testid="header">Header</div>,
  LandingBackground: () => <div data-testid="background">Background</div>,
  PageHero: () => <div data-testid="page-hero">PageHero</div>,
  CallToAction: () => <div data-testid="cta">CallToAction</div>,
  AnimateInView: ({ children }: any) => <div>{children}</div>
}));

mock.module('lucide-react', () => ({
    Github: () => <svg />,
    Twitter: () => <svg />,
    Globe: () => <svg />
}));

mock.module('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>
}));

afterEach(cleanup);

describe('TeamPage', () => {
  test('renders TeamHero and hides old sections', () => {
    render(<TeamPage />);
    // Expect failure initially because page.tsx still has old components
    expect(screen.queryByTestId('team-hero')).not.toBeNull(); 
    expect(screen.queryByTestId('page-hero')).toBeNull();
    expect(screen.queryByTestId('cta')).toBeNull();
  });
});
