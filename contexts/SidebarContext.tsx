'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SIDEBAR_STATE_KEY } from '@/lib/storageKeys';

interface SidebarContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize from localStorage to avoid flash if possible, or default to true
    const [isOpen, setIsOpenState] = useState(() => {
        if (typeof window === 'undefined') return true;
        try {
            const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
            return savedState !== null ? savedState === 'true' : true;
        } catch {
            return true;
        }
    });

    const setIsOpen = useCallback((value: boolean | ((val: boolean) => boolean)) => {
        setIsOpenState(value);
    }, []);

    const toggle = useCallback(() => {
        setIsOpenState((prev) => !prev);
    }, []);

    // Update localStorage when state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(SIDEBAR_STATE_KEY, String(isOpen));
        }
    }, [isOpen]);

    const value = React.useMemo(() => ({ isOpen, setIsOpen, toggle }), [isOpen, setIsOpen, toggle]);

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
