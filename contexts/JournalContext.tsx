'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { JournalEntry, Block } from '@/lib/types';
import { useUser } from './UserContext';
import { useLimitModal } from './LimitModalContext';
import { JOURNAL_ENTRIES_KEY } from '@/lib/storageKeys';

const STORAGE_KEY = JOURNAL_ENTRIES_KEY;
const JOURNAL_LIMIT = 10;

interface JournalContextType {
    entries: JournalEntry[];
    createEntry: (title: string, notebook_id?: string) => JournalEntry | null;
    updateEntry: (id: string, updates: Partial<Pick<JournalEntry, 'title' | 'blocks'>>) => void;
    deleteEntry: (id: string) => void;
    getEntry: (id: string) => JournalEntry | undefined;
    searchEntries: (query: string) => Array<JournalEntry & { match?: { text: string; context: 'title' | 'content' } }>;
    initialized: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// Helper utilities
// -----------------------------------------------------------------------------

/**
 * Generate a unique "Untitled" style title within the provided entries scope.
 * If other "Untitled" or "Untitled n" titles exist (optionally scoped to a
 * notebook), this helper will increment the numeric suffix to ensure the
 * returned title is unique.
 */
function generateUniqueUntitledTitle(entries: JournalEntry[], notebook_id?: string): string {
    const baseTitle = 'Untitled';

    const relevantEntries = notebook_id ? entries.filter((e) => e.notebook_id === notebook_id) : entries;
    const existingTitles = new Set(relevantEntries.map((e) => e.title));

    // If "Untitled" itself is free we can return it directly.
    if (!existingTitles.has(baseTitle)) return baseTitle;

    let suffix = 2; // start from 2 because "Untitled" is considered the first
    let candidate = `${baseTitle} ${suffix}`;

    while (existingTitles.has(candidate)) {
        suffix += 1;
        candidate = `${baseTitle} ${suffix}`;
    }

    return candidate;
}

export const JournalProvider = ({ children }: { children: ReactNode }) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [initialized, setInitialized] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const { premium } = useUser();
    const { showLimitModal } = useLimitModal();

    // Load entries from localStorage on mount
    useEffect(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                setEntries(JSON.parse(data));
                setInitialized(true);
            } catch (e) {
                console.error('Failed to parse journal entries from storage', e);
                setLoadFailed(true);
            }
        } else {
            // Mark as initialized if no data was present
            setInitialized(true);
        }
    }, []);

    // Persist entries on change, but skip initial load to avoid overwriting
    useEffect(() => {
        if (!initialized || loadFailed) {
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (e) {
            console.error('Failed to persist entries', e);
        }
    }, [entries, initialized, loadFailed]);

    const createEntry = useCallback(
        (title: string, notebook_id?: string) => {
            let result: JournalEntry | null = null;

            setEntries((prev) => {
                if (!premium && notebook_id) {
                    // Count existing entries for this notebook using latest state
                    const notebookEntries = prev.filter((entry) => entry.notebook_id === notebook_id);
                    if (notebookEntries.length >= JOURNAL_LIMIT) {
                        // Use a timeout to show modal to avoid side-effects inside updater
                        setTimeout(() => {
                            showLimitModal(
                                `You've reached the maximum of ${JOURNAL_LIMIT} journals per notebook. Please delete some journals to create new ones.`,
                                'journal',
                            );
                        }, 0);
                        return prev;
                    }
                }

                const now = new Date().toISOString();
                const id =
                    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                        ? crypto.randomUUID()
                        : Math.random().toString(36).substring(2, 9);

                // Determine a unique default title based on the latest state (prev)
                const trimmedInputTitle = title.trim();
                const defaultTitle = generateUniqueUntitledTitle(prev, notebook_id);

                // Use input title only if it's non-empty and not an auto-generated placeholder
                const finalTitle = !trimmedInputTitle || trimmedInputTitle === 'Untitled' ? defaultTitle : trimmedInputTitle;

                const newEntry: JournalEntry = {
                    id,
                    title: finalTitle,
                    blocks: [],
                    createdAt: now,
                    updatedAt: now,
                    notebook_id,
                };

                result = newEntry;
                return [newEntry, ...prev];
            });

            return result;
        },
        [premium, showLimitModal],
    );

    const updateEntry = useCallback((id: string, updates: Partial<Pick<JournalEntry, 'title' | 'blocks'>>) => {
        setEntries((prev) => {
            return prev.map((entry) => {
                if (entry.id !== id) return entry;

                // Prepare new values defaulting to current ones
                let newTitle = entry.title;
                let newBlocks = entry.blocks;

                if (updates.title !== undefined) {
                    const trimmed = updates.title.trim();

                    if (trimmed) {
                        // Non-empty explicit title provided by the user
                        newTitle = trimmed;
                    } else {
                        // Empty/whitespace title – fall back to a unique auto-generated one
                        newTitle = generateUniqueUntitledTitle(prev, entry.notebook_id);
                    }
                }

                if (updates.blocks !== undefined) {
                    newBlocks = updates.blocks;
                }

                return {
                    ...entry,
                    title: newTitle,
                    blocks: newBlocks,
                    updatedAt: new Date().toISOString(),
                };
            });
        });
    }, []);

    const deleteEntry = useCallback((id: string) => {
        setEntries((prev) => {
            const updated = prev.filter((entry) => entry.id !== id);
            return updated;
        });
    }, []);

    const getEntry = useCallback(
        (id: string) => {
            return entries.find((entry) => entry.id === id);
        },
        [entries],
    );

    const searchEntries = useCallback(
        (query: string) => {
            const lower = query.toLowerCase().trim();
            if (!lower) return [];

            return entries
                .filter(
                    (entry) =>
                        entry.title.toLowerCase().includes(lower) ||
                        entry.blocks.some((block) => block.content?.toLowerCase().includes(lower)),
                )
                .map((entry) => {
                    // Find matching block content for context
                    const matchingBlock = entry.blocks.find((block) => block.content?.toLowerCase().includes(lower));

                    return {
                        ...entry,
                        match: matchingBlock
                            ? {
                                text: matchingBlock.content,
                                context: 'content' as const,
                            }
                            : {
                                text: entry.title,
                                context: 'title' as const,
                            },
                    };
                });
        },
        [entries],
    );

    const contextValue = React.useMemo(() => ({
        entries,
        createEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        searchEntries,
        initialized
    }), [entries, createEntry, updateEntry, deleteEntry, getEntry, searchEntries, initialized]);

    return (
        <JournalContext.Provider value={contextValue}>
            {children}
        </JournalContext.Provider>
    );
};

export const useJournalContext = () => {
    const context = useContext(JournalContext);
    if (context === undefined) {
        throw new Error('useJournalContext must be used within a JournalProvider');
    }
    return context;
};
