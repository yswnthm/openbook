'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notebook } from '@/lib/types';
import { useUser } from './UserContext';
import { useLimitModal } from './LimitModalContext';

interface NotebookContextType {
    notebooks: Notebook[];
    currentNotebookId: string;
    currentNotebook?: Notebook;
    createNotebook: (name?: string) => string | null;
    deleteNotebook: (id: string) => void;
    renameNotebook: (id: string, name: string) => void;
    switchNotebook: (id: string) => void;
    toggleNotebookExpansion: (id: string) => void;
    reorderNotebooks: (notebooks: Notebook[]) => void;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);
import { NOTEBOOKS_DATA_KEY } from '@/lib/storageKeys';

const STORAGE_KEY = NOTEBOOKS_DATA_KEY;
const NOTEBOOK_LIMIT = 3;

// Helper to generate a unique notebook name
function generateUniqueNotebookName(notebooks: Notebook[]): string {
    const baseName = 'Notebook';
    const usedNumbers = new Set<number>();
    notebooks.forEach((notebook) => {
        const match = notebook.name.match(/^Notebook(?: (\d+))?$/i);
        if (match) {
            const num = match[1] ? parseInt(match[1], 10) : 1;
            usedNumbers.add(num);
        }
    });
    // Find the smallest missing positive integer
    let n = 1;
    while (usedNumbers.has(n)) {
        n++;
    }
    return n === 1 ? baseName : `${baseName} ${n}`;
}

export const NotebookProvider = ({ children }: { children: ReactNode }) => {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [currentNotebookId, setCurrentNotebookId] = useState<string>('');
    const { premium } = useUser();
    const { showLimitModal } = useLimitModal();

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as { notebooks: Notebook[]; currentNotebookId: string };
                setNotebooks(parsed.notebooks);
                setCurrentNotebookId(parsed.currentNotebookId);
                return;
            } catch {
                // ignore parse errors
            }
        }

        // Initialize default notebook
        const defaultNotebook: Notebook = {
            id: crypto.randomUUID(),
            name: 'Default',
            order: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isExpanded: true,
            metadata: {},
        };
        setNotebooks([defaultNotebook]);
        setCurrentNotebookId(defaultNotebook.id);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (notebooks.length && currentNotebookId) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ notebooks, currentNotebookId }));
        }
    }, [notebooks, currentNotebookId]);

    const currentNotebook = notebooks.find((notebook) => notebook.id === currentNotebookId);

    const createNotebook = (name?: string): string | null => {
        // Check if limit is reached for free users
        if (!premium && notebooks.length >= NOTEBOOK_LIMIT) {
            showLimitModal(
                `You've reached the maximum of ${NOTEBOOK_LIMIT} notebooks. Please delete some notebooks to create new ones.`,
                'notebook',
            );
            return null;
        }
        const notebookName = name && name.trim() ? name : generateUniqueNotebookName(notebooks);
        const newNotebook: Notebook = {
            id: crypto.randomUUID(),
            name: notebookName,
            order: notebooks.length,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isExpanded: true,
            metadata: {},
        };
        setNotebooks((prev) => [...prev, newNotebook]);
        setCurrentNotebookId(newNotebook.id);
        return newNotebook.id;
    };

    const deleteNotebook = (id: string) => {
        // Don't allow deleting the last notebook
        if (notebooks.length <= 1) return;

        setNotebooks((prev) => prev.filter((notebook) => notebook.id !== id));

        // If we're deleting the current notebook, switch to the first remaining one
        if (currentNotebookId === id) {
            const remaining = notebooks.filter((notebook) => notebook.id !== id);
            if (remaining.length > 0) {
                setCurrentNotebookId(remaining[0].id);
            }
        }
    };

    const renameNotebook = (id: string, name: string) => {
        setNotebooks((prev) =>
            prev.map((notebook) => (notebook.id === id ? { ...notebook, name, updatedAt: Date.now() } : notebook)),
        );
    };

    const switchNotebook = (id: string) => {
        setCurrentNotebookId(id);
    };

    const toggleNotebookExpansion = (id: string) => {
        setNotebooks((prev) =>
            prev.map((notebook) =>
                notebook.id === id
                    ? { ...notebook, isExpanded: !notebook.isExpanded, updatedAt: Date.now() }
                    : { ...notebook, isExpanded: false, updatedAt: Date.now() },
            ),
        );
    };

    const reorderNotebooks = (reorderedNotebooks: Notebook[]) => {
        const updatedNotebooks = reorderedNotebooks.map((notebook, index) => ({
            ...notebook,
            order: index,
            updatedAt: Date.now(),
        }));
        setNotebooks(updatedNotebooks);
    };

    return (
        <NotebookContext.Provider
            value={{
                notebooks,
                currentNotebookId,
                currentNotebook,
                createNotebook,
                deleteNotebook,
                renameNotebook,
                switchNotebook,
                toggleNotebookExpansion,
                reorderNotebooks,
            }}
        >
            {children}
        </NotebookContext.Provider>
    );
};

export const useNotebooks = () => {
    const context = useContext(NotebookContext);
    if (context === undefined) {
        throw new Error('useNotebooks must be used within a NotebookProvider');
    }
    return context;
};
