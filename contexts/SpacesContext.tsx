'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import {
    generateConversationName,
    shouldUpdateConversationName,
    isDefaultAutoName,
} from '@/lib/conversation-utils';
import { useUser } from './UserContext';
import { useLimitModal } from './LimitModalContext';
import { useNotebooks } from './NotebookContext';

export type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    hidden?: boolean;
    model?: string;
};

export type Space = {
    id: string;
    name: string;
    messages: ChatMessage[];
    archived: boolean;
    createdAt: number;
    updatedAt: number;
    notebook_id?: string;
    metadata?: {
        manuallyRenamed: boolean;
        pinned?: boolean;
        lastAutoNameUpdate?: number;
        isGeneratingName?: boolean;
        contextReset?: boolean; // Flag to indicate LLM context should be reset for this space
    };
    studyMode?: {
        framework: 'memory-palace' | 'feynman-technique' | 'spaced-repetition' | 'extreme-mode' | null;
        settings?: Record<string, any>;
        activatedAt?: number;
    };
};

interface SpacesContextType {
    spaces: Space[];
    currentSpaceId: string;
    currentSpace?: Space;
    createSpace: (name: string, notebook_id?: string) => string | null;
    deleteSpace: (id: string) => void;
    archiveSpace: (id: string) => void;
    renameSpace: (id: string, name: string, isManualRename?: boolean) => void;
    switchSpace: (id: string) => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    exportSpace: (id: string) => void;
    togglePinSpace: (id: string) => void;
    resetToAutoNaming: (id: string) => void;
    markSpaceContextReset: (id: string) => void;
    searchSpaces: (query: string) => Array<{
        id: string;
        name: string;
        match: {
            text: string;
            context: 'message' | 'name';
            timestamp?: number;
        };
    }>;
}

const SpacesContext = React.createContext<SpacesContextType | undefined>(undefined);
import { SPACES_DATA_KEY } from '@/lib/storageKeys';

const STORAGE_KEY = SPACES_DATA_KEY;

export const SpacesProvider = ({ children }: { children: ReactNode }) => {
    const [spaces, setSpaces] = React.useState<Space[]>([]);
    const [currentSpaceId, setCurrentSpaceId] = React.useState<string>('');
    const { premium } = useUser();
    const { showLimitModal } = useLimitModal();
    const { notebooks, currentNotebookId } = useNotebooks();
    const pendingSpaceCreation = React.useRef<string | null>(null);

    // Load from localStorage and initialize default space
    React.useEffect(() => {
        // Wait for notebooks to be initialized first
        if (notebooks.length === 0) return;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as { spaces: Space[]; currentSpaceId: string };

                // Add metadata field to any spaces that don't have it
                const spacesWithMetadata = parsed.spaces.map((space) => ({
                    ...space,
                    metadata: space.metadata || {
                        manuallyRenamed: false,
                        isGeneratingName: false,
                    },
                }));

                setSpaces(spacesWithMetadata);
                setCurrentSpaceId(parsed.currentSpaceId);
                return;
            } catch {
                // ignore parse errors
            }
        }

        // Initialize default space within the default notebook
        const defaultNotebook = notebooks[0]; // The first notebook is the default one
        const defaultSpace: Space = {
            // [EDIT HERE] To set a default study mode (e.g., 'feynman-technique'), add:
            // studyMode: { framework: 'feynman-technique', activatedAt: Date.now() },
            id: crypto.randomUUID(),
            name: 'Untitled',
            messages: [],
            archived: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            notebook_id: defaultNotebook.id,
            metadata: {
                manuallyRenamed: false, // Allow auto-naming for the default space
                isGeneratingName: false,
            },
        };
        setSpaces([defaultSpace]);
        setCurrentSpaceId(defaultSpace.id);
    }, [notebooks]);

    // Persist to localStorage
    React.useEffect(() => {
        if (spaces.length && currentSpaceId) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ spaces, currentSpaceId }));
        }
    }, [spaces, currentSpaceId]);

    // Simulate a delay for name generation (for better UX)
    const generateNameWithDelay = React.useCallback((space: Space): Promise<string> => {
        return new Promise((resolve) => {
            // Generate a name based on conversation content
            const generatedName = generateConversationName(space);

            // Add a small delay to make the loading state visible
            // This helps users understand that something is happening
            setTimeout(() => {
                resolve(generatedName);
            }, 1500);
        });
    }, []);

    // Auto-update conversation names
    React.useEffect(() => {
        // Don't run this effect immediately on first render
        if (spaces.length === 0) return;

        // Find spaces that need name updates
        const spacesToUpdate = spaces.filter((space) => {
            // Skip spaces that have been manually renamed
            if (space.metadata?.manuallyRenamed) return false;

            // Skip spaces already in loading state
            if (space.metadata?.isGeneratingName) return false;

            // Skip spaces that were recently auto-named (within last 5 minutes)
            const lastUpdate = space.metadata?.lastAutoNameUpdate || 0;
            if (Date.now() - lastUpdate < 5 * 60 * 1000) return false;

            // Check if this space qualifies for auto-naming
            return shouldUpdateConversationName(space);
        });

        if (spacesToUpdate.length === 0) return;

        // First, mark these spaces as loading
        setSpaces((prevSpaces) =>
            prevSpaces.map((space) => {
                const needsUpdate = spacesToUpdate.some((s) => s.id === space.id);
                if (!needsUpdate) return space;

                return {
                    ...space,
                    metadata: {
                        ...(space.metadata || { manuallyRenamed: false }),
                        isGeneratingName: true,
                    },
                };
            }),
        );

        // Process each space sequentially to avoid multiple UI updates
        const processSpaces = async () => {
            for (const space of spacesToUpdate) {
                // Generate name with simulated delay
                const newName = await generateNameWithDelay(space);

                // Use functional update to ensure we're working with the latest state
                setSpaces((prev) =>
                    prev.map((s) => {
                        if (s.id !== space.id) return s;

                        // Only update if the name has actually changed
                        if (newName !== s.name) {
                            return {
                                ...s,
                                name: newName,
                                metadata: {
                                    ...(s.metadata || { manuallyRenamed: false }),
                                    lastAutoNameUpdate: Date.now(),
                                    isGeneratingName: false,
                                },
                            };
                        } else {
                            // Still update the metadata to mark it as no longer generating
                            return {
                                ...s,
                                metadata: {
                                    ...(s.metadata || { manuallyRenamed: false }),
                                    lastAutoNameUpdate: Date.now(),
                                    isGeneratingName: false,
                                },
                            };
                        }
                    }),
                );
            }
        };

        processSpaces();
    }, [spaces, generateNameWithDelay]);

    const createSpace = (name: string, notebook_id?: string) => {
        if (!premium && notebook_id) {
            const notebookSpacesCount = spaces.filter((s) => s.notebook_id === notebook_id).length;
            if (notebookSpacesCount >= 3) {
                showLimitModal(
                    "You've reached the maximum of 3 spaces per notebook in the free plan. Upgrade to premium for unlimited spaces.",
                    'space',
                );
                return null;
            }
        }

        // Pre-generate ID so each invocation works with its own reference
        const newId = crypto.randomUUID();

        // Track if this space is actually created inside the updater
        let creationSucceeded = false;

        // Store the ID we are about to attempt (for diagnostic purposes only)
        pendingSpaceCreation.current = newId;

        // Use functional form to ensure atomic checks/updates
        setSpaces((prev) => {
            // Re-check the count inside the functional update to ensure atomicity
            if (!premium && notebook_id) {
                const currentNotebookSpacesCount = prev.filter((s) => s.notebook_id === notebook_id).length;
                if (currentNotebookSpacesCount >= 3) {
                    // Abort creation – limit reached (race-condition safety)
                    if (pendingSpaceCreation.current === newId) {
                        pendingSpaceCreation.current = null;
                    }
                    return prev;
                }
            }

            // Determine a unique name based on the latest state (prev)
            const baseName = 'Untitled';
            const trimmedInputName = name.trim();

            let uniqueName = trimmedInputName;

            // Treat empty input or any auto-generated default as needing a new unique name
            if (!trimmedInputName || isDefaultAutoName(trimmedInputName)) {
                let suffix = 1;
                const relevantSpaces = notebook_id ? prev.filter((s) => s.notebook_id === notebook_id) : prev;
                const existingNames = new Set(relevantSpaces.map((s) => s.name));
                let candidate = baseName;
                while (existingNames.has(candidate)) {
                    suffix += 1;
                    candidate = `${baseName} ${suffix}`;
                }
                uniqueName = candidate;
            }

            const newSpace: Space = {
                id: newId,
                name: uniqueName,
                messages: [],
                archived: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                notebook_id,
                metadata: {
                    manuallyRenamed: false, // Default to auto-naming for new spaces
                    isGeneratingName: false,
                },
            };

            creationSucceeded = true;

            // Clear the ref for this specific creation attempt
            if (pendingSpaceCreation.current === newId) {
                pendingSpaceCreation.current = null;
            }

            // Add the new space to state
            return [...prev, newSpace];
        });

        // If creation was aborted due to limit/race condition, bail out
        if (!creationSucceeded) {
            if (pendingSpaceCreation.current === newId) {
                pendingSpaceCreation.current = null;
            }
            return null;
        }

        // Now that the state has updated, we can safely switch the current space
        setCurrentSpaceId(newId);

        return newId;
    };

    const deleteSpace = (id: string) => {
        let newSpaceId: string | undefined = undefined;

        setSpaces((prevSpaces) => {
            const filteredSpaces = prevSpaces.filter((s) => s.id !== id);
            // Find the notebook safely - use current notebooks state passed as parameter
            const currentNotebooks = notebooks; // Capture current notebooks at call time
            const defaultNotebook = currentNotebooks.length > 0 ? currentNotebooks[0] : undefined;
            // Find the space we're deleting (with latest state)
            const spaceToDelete = prevSpaces.find((s) => s.id === id);
            // Limit check removed to allow deleting 'Untitled' spaces
            // If the deleted space is NOT the current space, we just return the filtered result
            if (currentSpaceId !== id) {
                return filteredSpaces;
            }
            // Fallback logic — pick a default space with updated list, not stale state
            const defaultSpace = filteredSpaces.find(
                (s) => s.notebook_id === defaultNotebook?.id && s.name === 'Untitled'
            );
            const fallback = defaultSpace || filteredSpaces[0];
            if (fallback) {
                newSpaceId = fallback.id;
            } else {
                // Create a new Untitled space in the default notebook if no fallback exists
                const newDefaultSpace: Space = {
                    id: crypto.randomUUID(),
                    name: 'Untitled',
                    messages: [],
                    archived: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    notebook_id: defaultNotebook?.id,
                    metadata: {
                        manuallyRenamed: false,
                        isGeneratingName: false,
                    },
                };
                filteredSpaces.push(newDefaultSpace);
                newSpaceId = newDefaultSpace.id;
            }
            return filteredSpaces;
        });

        // Update currentSpaceId outside setSpaces to keep sync
        if (newSpaceId) {
            setCurrentSpaceId(newSpaceId);
        }
    };

    const archiveSpace = (id: string) => {
        setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, archived: true, updatedAt: Date.now() } : s)));
        if (currentSpaceId === id) {
            const fallback = spaces.find((s) => s.id !== id && !s.archived);
            if (fallback) setCurrentSpaceId(fallback.id);
        }
    };

    const renameSpace = (id: string, name: string, isManualRename = true) => {
        setSpaces((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        name,
                        updatedAt: Date.now(),
                        metadata: {
                            ...(s.metadata || {}),
                            manuallyRenamed: isManualRename, // Mark if this was a manual rename
                            isGeneratingName: false, // Not generating if manually renamed
                        },
                    }
                    : s,
            ),
        );
    };

    const resetToAutoNaming = (id: string) => {
        // Find the space
        const space = spaces.find((s) => s.id === id);
        if (!space) return;

        // Set it to generating state
        setSpaces((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        metadata: {
                            ...(s.metadata || {}),
                            manuallyRenamed: false,
                            isGeneratingName: true,
                        },
                    }
                    : s,
            ),
        );

        // Generate a new name
        generateNameWithDelay(space).then((newName) => {
            setSpaces((prev) =>
                prev.map((s) =>
                    s.id === id
                        ? {
                            ...s,
                            name: newName,
                            metadata: {
                                ...(s.metadata || {}),
                                manuallyRenamed: false,
                                isGeneratingName: false,
                                lastAutoNameUpdate: Date.now(),
                            },
                        }
                        : s,
                ),
            );
        });
    };

    const togglePinSpace = (id: string) => {
        setSpaces((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        metadata: {
                            ...(s.metadata || { manuallyRenamed: false }),
                            pinned: !s.metadata?.pinned,
                        },
                    }
                    : s,
            ),
        );
    };

    const switchSpace = (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setCurrentSpaceId(id);
            // Use a microtask to ensure the state update has been processed
            Promise.resolve().then(() => {
                resolve();
            });
        });
    };

    const addMessage = (newMessageToAdd: ChatMessage) => {
        const spaceUpdateTimestamp = Date.now(); // For the space's updatedAt field

        // Ensure we have a current space - if not, find or create default space
        if (!currentSpaceId || !spaces.find((s) => s.id === currentSpaceId)) {
            if (process.env.NODE_ENV !== 'production') {
                console.log('No current space found, finding or creating default space');
            }

            // First try to find existing default space (Untitled in default notebook)
            const defaultNotebook = notebooks[0];
            const existingDefault = spaces.find((s) => s.notebook_id === defaultNotebook?.id && s.name === 'Untitled');
            if (existingDefault) {
                setCurrentSpaceId(existingDefault.id);
                // Add message to existing default space
                setSpaces((prev) =>
                    prev.map((s) =>
                        s.id === existingDefault.id
                            ? {
                                ...s,
                                messages: [...s.messages, newMessageToAdd],
                                updatedAt: spaceUpdateTimestamp,
                            }
                            : s,
                    ),
                );
                return;
            }

            // Create new default space if none exists
            const defaultSpace: Space = {
                id: crypto.randomUUID(),
                name: 'Untitled',
                messages: [newMessageToAdd],
                archived: false,
                createdAt: Date.now(),
                updatedAt: spaceUpdateTimestamp,
                notebook_id: defaultNotebook?.id,
                metadata: {
                    manuallyRenamed: false,
                    isGeneratingName: false,
                },
            };
            setSpaces((prev) => [defaultSpace, ...prev]);
            setCurrentSpaceId(defaultSpace.id);
            return;
        }

        setSpaces((prev) => {
            const updated = prev.map((s) => {
                if (s.id !== currentSpaceId) return s;

                // Filter out any existing message with the same ID to prevent duplicates,
                // then add the new message.
                const updatedMessages = s.messages.filter((m) => m.id !== newMessageToAdd.id);
                updatedMessages.push(newMessageToAdd);

                const updatedSpace = {
                    ...s,
                    messages: updatedMessages,
                    updatedAt: spaceUpdateTimestamp,
                };

                // Auto-naming logic (uses newMessageToAdd.role) - but not for Untitled spaces
                if (
                    newMessageToAdd.role === 'user' &&
                    updatedSpace.messages.filter((m) => m.role === 'user').length === 1 &&
                    updatedSpace.messages.length <= 2 && // Ensure it's early in the conversation
                    !updatedSpace.metadata?.manuallyRenamed &&
                    updatedSpace.name !== 'Untitled' // Don't auto-rename Untitled spaces
                ) {
                    return {
                        ...updatedSpace,
                        metadata: {
                            ...(updatedSpace.metadata || { manuallyRenamed: false }),
                            isGeneratingName: true,
                        },
                    };
                }

                return updatedSpace;
            });
            return updated;
        });
    };

    const exportSpace = (id: string) => {
        const space = spaces.find((s) => s.id === id);
        if (!space) return;
        const dataStr = JSON.stringify(space, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${space.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const markSpaceContextReset = (id: string) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[SPACES] Marking space ${id} for context reset`);
        }
        setSpaces((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        updatedAt: Date.now(),
                        metadata: {
                            ...(s.metadata || {}),
                            manuallyRenamed: s.metadata?.manuallyRenamed ?? false,
                            contextReset: true,
                        },
                    }
                    : s,
            ),
        );
    };

    const currentSpace = spaces.find((s) => s.id === currentSpaceId);

    const searchSpaces = (
        query: string,
    ): Array<{
        id: string;
        name: string;
        match: {
            text: string;
            context: 'message' | 'name';
            timestamp?: number;
        };
    }> => {
        const lower = query.toLowerCase();
        return spaces
            .filter(
                (space) =>
                    // Search in space name
                    space.name.toLowerCase().includes(lower) ||
                    // Search in message content
                    space.messages.some((message) => message.content.toLowerCase().includes(lower)),
            )
            .map((space) => {
                // Find matching message for context
                const matchingMessage = space.messages.find((message) => message.content.toLowerCase().includes(lower));

                if (matchingMessage) {
                    return {
                        id: space.id,
                        name: space.name,
                        match: {
                            text: matchingMessage.content,
                            context: 'message' as const,
                            timestamp: matchingMessage.timestamp,
                        },
                    };
                } else {
                    return {
                        id: space.id,
                        name: space.name,
                        match: {
                            text: space.name,
                            context: 'name' as const,
                        },
                    };
                }
            });
    };

    return (
        <SpacesContext.Provider
            value={{
                spaces,
                currentSpaceId,
                currentSpace,
                createSpace,
                deleteSpace,
                archiveSpace,
                renameSpace,
                switchSpace,
                addMessage,
                exportSpace,
                togglePinSpace,
                resetToAutoNaming,
                markSpaceContextReset,
                searchSpaces,
            }}
        >
            {children}
        </SpacesContext.Provider>
    );
};

export const useSpaces = () => {
    const context = React.useContext(SpacesContext);
    if (!context) throw new Error('useSpaces must be used within SpacesProvider');
    return context;
};
