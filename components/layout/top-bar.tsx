'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface TopBarProps {
    children?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    hideSidebarTrigger?: boolean;
}

export function TopBar({ children, actions, className, hideSidebarTrigger: _hideSidebarTrigger = false }: TopBarProps) {
    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-40 flex h-16 items-center px-4 transition-all duration-300',
                // Default transparency, but can support background via className if needed
                'bg-transparent',
                className
            )}
        >
            {/* Left / Center Section */}
            <div className="flex flex-1 items-center gap-4">
                {/* Placeholder for sidebar trigger if we decide to move it here later, 
                     currently passed via children or handled in page layout */}
                {children}
            </div>

            {/* Right Section (Theme Toggle + Actions) */}
            <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto">
                {actions}
                <ThemeToggle />
            </div>
        </header>
    );
}
