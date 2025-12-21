'use client';

import { useState, useRef, useEffect } from 'react';
import {
    ChevronDown,
    ChevronRight,
    BookOpen,
    Edit2,
    Trash2,
    PenLine,
    Pin,
    PinOff,
    RefreshCw,
    Clock,
    ChevronLeft,
    MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Notebook } from '@/lib/types';
import { useNotebooks } from '@/contexts/NotebookContext';
import { useSpaces, Space } from '@/contexts/SpacesContext';
import { useJournal } from '@/hooks/useJournal';
import { useRouter } from 'next/navigation';
import { ConversationNameDisplay } from '@/components/features/spaces/loading/name-loading';
import { format } from 'date-fns';
import { useMotion, useHoverAnimation, useElementTransition } from '@/hooks/useMotion';

interface SidebarNotebookProps {
    notebook: Notebook;
    currentPageType: string;
    currentPageId: string;
}

export default function SidebarNotebook({ notebook, currentPageType, currentPageId }: SidebarNotebookProps) {
    const { toggleNotebookExpansion, renameNotebook, deleteNotebook, notebooks } = useNotebooks();
    const {
        spaces,
        currentSpaceId,
        createSpace,
        switchSpace,
        deleteSpace,
        renameSpace,
        togglePinSpace,
        resetToAutoNaming,
    } = useSpaces();
    const { createEntry, entries, deleteEntry, updateEntry } = useJournal();
    const router = useRouter();
    const { settings, prefersReducedMotion } = useMotion();
    const hoverAnimation = useHoverAnimation();
    const elementTransition = useElementTransition();

    const [editingNotebookName, setEditingNotebookName] = useState(false);
    const [notebookName, setNotebookName] = useState(notebook.name);
    const [journalsOpen, setJournalsOpen] = useState(true);
    const [spacesOpen, setSpacesOpen] = useState(true);
    const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
    const [editingJournalTitle, setEditingJournalTitle] = useState('');
    const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
    const [editingSpaceName, setEditingSpaceName] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        id: string;
        name: string;
        type: 'journal' | 'space';
    } | null>(null);

    const focusInputRef = useRef<HTMLInputElement>(null);

    // Filter entries and spaces by notebook
    const notebookEntries = entries.filter((entry) => entry.notebook_id === notebook.id);
    const notebookSpaces = spaces.filter((space) => space.notebook_id === notebook.id);

    // Sort entries by updated date (most recent first)
    const sortedEntries = [...notebookEntries].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    // Sort spaces: pinned first, then by last updated
    const sortedSpaces = [...notebookSpaces].sort((a, b) => {
        if (a.metadata?.pinned && !b.metadata?.pinned) return -1;
        if (!a.metadata?.pinned && b.metadata?.pinned) return 1;
        return b.updatedAt - a.updatedAt;
    });

    const handleNotebookToggle = () => {
        toggleNotebookExpansion(notebook.id);
    };

    const handleNotebookRename = () => {
        setEditingNotebookName(true);
        setNotebookName(notebook.name);
    };

    const handleFinishNotebookRename = () => {
        if (notebookName.trim() && notebookName !== notebook.name) {
            renameNotebook(notebook.id, notebookName.trim());
        }
        setEditingNotebookName(false);
    };

    const handleCreateJournal = () => {
        const defaultTitle = 'Untitled';
        const newEntry = createEntry(defaultTitle, notebook.id);
        if (!newEntry) {
            // Limit hit – abort early
            return;
        }

        setEditingJournalId(newEntry.id);
        setEditingJournalTitle(defaultTitle);
        if (!journalsOpen) setJournalsOpen(true);
    };

    const handleCreateSpace = () => {
        const defaultTitle = 'Untitled';
        const newSpaceId = createSpace(defaultTitle, notebook.id);
        if (!newSpaceId) {
            // Limit hit – abort early
            return;
        }

        setEditingSpaceId(newSpaceId);
        setEditingSpaceName(defaultTitle);
        if (!spacesOpen) setSpacesOpen(true);
    };

    const handleJournalClick = (entryId: string) => {
        router.push(`/journal/${entryId}`);
    };

    const handleSpaceClick = (spaceId: string) => {
        switchSpace(spaceId);
        router.push(`/space/${spaceId}`);
    };

    const handleDeleteJournal = (e: React.MouseEvent, journalId: string, journalName: string) => {
        e.stopPropagation();
        setItemToDelete({ id: journalId, name: journalName, type: 'journal' });
        setShowDeleteConfirm(true);
    };

    const handleDeleteSpace = (e: React.MouseEvent, spaceId: string, spaceName: string) => {
        e.stopPropagation();
        setItemToDelete({ id: spaceId, name: spaceName, type: 'space' });
        setShowDeleteConfirm(true);
    };

    const handleRenameJournal = (e: React.MouseEvent, journalId: string, currentTitle: string) => {
        e.stopPropagation();
        setEditingJournalId(journalId);
        setEditingJournalTitle(currentTitle);
    };

    const handleRenameSpace = (e: React.MouseEvent, spaceId: string, currentName: string) => {
        e.stopPropagation();
        setEditingSpaceId(spaceId);
        setEditingSpaceName(currentName);
    };

    const handleFinishJournalRename = (journalId: string) => {
        if (editingJournalTitle.trim()) {
            updateEntry(journalId, { title: editingJournalTitle.trim() });
        }
        setEditingJournalId(null);
        setEditingJournalTitle('');
    };

    const handleFinishSpaceRename = (spaceId: string) => {
        if (editingSpaceName.trim()) {
            renameSpace(spaceId, editingSpaceName.trim(), true);
        }
        setEditingSpaceId(null);
        setEditingSpaceName('');
    };

    // Focus input on edit
    useEffect(() => {
        if (editingNotebookName && focusInputRef.current) {
            focusInputRef.current.focus();
            focusInputRef.current.select();
        }
    }, [editingNotebookName]);

    return (
        <div className="mb-2">
            {/* Back button and Notebook Header when expanded */}
            {notebook.isExpanded && (
                <motion.div
                    initial={elementTransition.initial}
                    animate={elementTransition.animate}
                    exit={elementTransition.exit}
                    transition={elementTransition.transition}
                    className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-2"
                >
                    <div className="flex items-center gap-2 relative">
                        <motion.button
                            {...hoverAnimation}
                            onClick={handleNotebookToggle}
                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150"
                            title="Back to notebooks"
                        >
                            <ChevronLeft className="h-4 w-4 text-neutral-400" />
                        </motion.button>
                        <BookOpen className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        {editingNotebookName ? (
                            <input
                                ref={focusInputRef}
                                value={notebookName}
                                onChange={(e) => setNotebookName(e.target.value)}
                                onBlur={handleFinishNotebookRename}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleFinishNotebookRename();
                                    if (e.key === 'Escape') setEditingNotebookName(false);
                                }}
                                className="flex-1 px-1 py-0.5 text-sm font-medium bg-white dark:bg-neutral-800 border border-emerald-400/60 rounded focus:outline-none"
                            />
                        ) : (
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex-1">
                                {notebook.name}
                            </span>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Collapsed notebook view */}
            {!notebook.isExpanded && (
                <motion.div
                    initial={elementTransition.initial}
                    animate={elementTransition.animate}
                    exit={elementTransition.exit}
                    transition={elementTransition.transition}
                    className="group relative"
                >
                    <div className="flex items-center justify-between px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-md transition-colors duration-150">
                        <div className="flex items-center flex-1 min-w-0">
                            <motion.button
                                {...hoverAnimation}
                                onClick={handleNotebookToggle}
                                className="flex items-center gap-2 flex-1 min-w-0"
                            >
                                <ChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                                <BookOpen className="h-4 w-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                                    {notebook.name}
                                </span>
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <motion.button
                                {...hoverAnimation}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotebookRename();
                                }}
                                className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150"
                                title="Rename notebook"
                            >
                                <Edit2 className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                            </motion.button>
                            <motion.button
                                {...hoverAnimation}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotebook(notebook.id);
                                }}
                                className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150"
                                title="Delete notebook"
                            >
                                <Trash2 className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Notebook Content - only show when expanded */}
            <AnimatePresence>
                {notebook.isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="space-y-2 overflow-hidden"
                    >
                        {/* Journals Section */}
                        <div>
                            <div
                                className="px-4 py-1.5 flex items-center justify-between cursor-pointer"
                                onClick={() => setJournalsOpen(!journalsOpen)}
                            >
                                <div className="flex items-center gap-1">
                                    <PenLine className="h-3 w-3 text-neutral-400" />
                                    <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tracking-wider">
                                        JOURNALS
                                    </h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <motion.button
                                        {...hoverAnimation}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateJournal();
                                        }}
                                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150"
                                        title="New journal"
                                    >
                                        <PenLine className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                    </motion.button>
                                    <ChevronDown
                                        className={cn(
                                            'h-3 w-3 text-neutral-400 transition-transform duration-200 ease-in-out',
                                            journalsOpen ? 'rotate-180' : '',
                                        )}
                                    />
                                </div>
                            </div>

                            {journalsOpen && (
                                <div className="space-y-0.5 mt-1">
                                    {sortedEntries.map((entry) => (
                                        <div key={entry.id} className="group relative">
                                            <div
                                                className={cn(
                                                    'flex w-full items-center cursor-pointer',
                                                    currentPageType === 'journal' && currentPageId === entry.id
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                                        : '',
                                                )}
                                                onClick={() => handleJournalClick(entry.id)}
                                            >
                                                {editingJournalId === entry.id ? (
                                                    <div className="flex items-center w-full px-4 py-1">
                                                        <input
                                                            value={editingJournalTitle}
                                                            onChange={(e) => setEditingJournalTitle(e.target.value)}
                                                            onBlur={() => handleFinishJournalRename(entry.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter')
                                                                    handleFinishJournalRename(entry.id);
                                                                if (e.key === 'Escape') setEditingJournalId(null);
                                                            }}
                                                            className="w-full px-1 py-0.5 text-sm bg-white dark:bg-neutral-800 border border-emerald-400/60 rounded focus:outline-none"
                                                            autoFocus
                                                        />
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="w-full text-left px-4 py-1.5 text-sm flex items-center"
                                                        style={{
                                                            color:
                                                                currentPageType === 'journal' &&
                                                                    currentPageId === entry.id
                                                                    ? 'var(--tw-color-emerald-600)'
                                                                    : 'var(--tw-color-neutral-600)',
                                                        }}
                                                    >
                                                        <div className="flex items-center truncate pl-5">
                                                            <span className="truncate font-medium">{entry.title}</span>
                                                        </div>
                                                    </button>
                                                )}

                                                {!editingJournalId && (
                                                    <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                            onClick={(e) =>
                                                                handleRenameJournal(e, entry.id, entry.title)
                                                            }
                                                            title="Rename journal"
                                                        >
                                                            <Edit2 className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                                        </button>
                                                        <button
                                                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                            onClick={(e) =>
                                                                handleDeleteJournal(e, entry.id, entry.title)
                                                            }
                                                            title="Delete journal"
                                                        >
                                                            <Trash2 className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Spaces Section */}
                        <div>
                            <div
                                className="px-4 py-1.5 flex items-center justify-between cursor-pointer"
                                onClick={() => setSpacesOpen(!spacesOpen)}
                            >
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3 text-neutral-400" />
                                    <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tracking-wider">
                                        SPACES
                                    </h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <motion.button
                                        {...hoverAnimation}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateSpace();
                                        }}
                                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150"
                                        title="New space"
                                    >
                                        <MessageSquare className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                    </motion.button>
                                    <ChevronDown
                                        className={cn(
                                            'h-3 w-3 text-neutral-400 transition-transform duration-200 ease-in-out',
                                            spacesOpen ? 'rotate-180' : '',
                                        )}
                                    />
                                </div>
                            </div>

                            {spacesOpen && (
                                <div className="space-y-0.5 mt-1">
                                    {sortedSpaces.map((space) => (
                                        <div key={space.id} className="group relative">
                                            <div
                                                className={cn(
                                                    'flex w-full items-center cursor-pointer',
                                                    (currentPageType === 'space' && currentPageId === space.id) ||
                                                        (currentPageType === '' && currentSpaceId === space.id)
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                                        : '',
                                                )}
                                                onClick={() => handleSpaceClick(space.id)}
                                            >
                                                {editingSpaceId === space.id ? (
                                                    <div className="flex items-center w-full px-4 py-1">
                                                        <input
                                                            value={editingSpaceName}
                                                            onChange={(e) => setEditingSpaceName(e.target.value)}
                                                            onBlur={() => handleFinishSpaceRename(space.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter')
                                                                    handleFinishSpaceRename(space.id);
                                                                if (e.key === 'Escape') setEditingSpaceId(null);
                                                            }}
                                                            className="w-full px-1 py-0.5 text-sm bg-white dark:bg-neutral-800 border border-emerald-400/60 rounded focus:outline-none"
                                                            autoFocus
                                                        />
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="w-full text-left px-4 py-1.5 text-sm flex items-center"
                                                        style={{
                                                            color:
                                                                (currentPageType === 'space' && currentPageId === space.id) ||
                                                                    (currentPageType === '' && currentSpaceId === space.id)
                                                                    ? 'var(--tw-color-emerald-600)'
                                                                    : 'var(--tw-color-neutral-600)',
                                                        }}
                                                    >
                                                        <div className="flex items-center truncate pl-5">
                                                            {space.metadata?.pinned && (
                                                                <Pin className="h-3 w-3 mr-1.5 flex-shrink-0 text-blue-400" />
                                                            )}
                                                            <ConversationNameDisplay
                                                                name={space.name}
                                                                isLoading={space.metadata?.isGeneratingName}
                                                                isAutoNamed={!space.metadata?.manuallyRenamed}
                                                                className="truncate font-medium"
                                                            />
                                                        </div>
                                                    </button>
                                                )}

                                                {!editingSpaceId && (
                                                    <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        {!space.metadata?.isGeneratingName &&
                                                            space.metadata?.manuallyRenamed &&
                                                            space.messages.length > 0 && (
                                                                <button
                                                                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        resetToAutoNaming(space.id);
                                                                    }}
                                                                    title="Reset to auto naming"
                                                                >
                                                                    <RefreshCw className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                                                </button>
                                                            )}
                                                        <button
                                                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePinSpace(space.id);
                                                            }}
                                                            title={space.metadata?.pinned ? 'Unpin space' : 'Pin space'}
                                                        >
                                                            {space.metadata?.pinned ? (
                                                                <PinOff className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                                            ) : (
                                                                <Pin className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                                            )}
                                                        </button>
                                                        <button
                                                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                            onClick={(e) => handleRenameSpace(e, space.id, space.name)}
                                                            title="Rename space"
                                                        >
                                                            <Edit2 className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                                        </button>
                                                        <button
                                                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                            onClick={(e) => handleDeleteSpace(e, space.id, space.name)}
                                                            title="Delete space"
                                                        >
                                                            <Trash2 className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="bg-white dark:bg-neutral-900 rounded-md shadow-md max-w-xs w-full border border-neutral-100 dark:border-neutral-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center">
                            <Trash2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400 mr-2" />
                            <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                Delete {itemToDelete?.type === 'journal' ? 'Journal' : 'Space'}
                            </h3>
                        </div>

                        <div className="p-4">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                Delete &quot;{itemToDelete?.name}&quot;? This cannot be undone.
                            </p>

                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                    onClick={() => {
                                        if (itemToDelete) {
                                            if (itemToDelete.type === 'journal') {
                                                deleteEntry(itemToDelete.id);
                                            } else {
                                                deleteSpace(itemToDelete.id);
                                            }
                                            setShowDeleteConfirm(false);
                                            setItemToDelete(null);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
