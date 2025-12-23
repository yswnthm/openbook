'use client';

import { useState, useEffect } from 'react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Search,
    PenLine,
    ChevronDown,
    MessageSquare,
    LogOut,
    FolderPlus,
    Trash2,
    Edit2,
    MoreHorizontal,
    X,
    Pin,
    PinOff,
    RefreshCw,
    Clock,
    AppWindowMac,
    Plus,
    Settings,
} from 'lucide-react';
import Image from 'next/image';
import { useSpaces, Space as SpaceType } from '@/contexts/SpacesContext';
import { useNotebooks } from '@/contexts/NotebookContext';
import { useRouter, usePathname } from 'next/navigation';

import { useJournal } from '@/hooks/useJournal';
import { cn } from '@/lib/utils';
import { clearAllStorageData } from '@/lib/storageKeys';
import { ConversationMetadata } from '@/components/features/spaces/conversation-metadata';
import { ConversationNameDisplay, NameLoading } from '@/components/features/spaces/loading/name-loading';
import { format } from 'date-fns';
import SidebarNotebook from '@/components/layout/SidebarNotebook';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchModal } from '@/components/features/search/search-modal';
import { SettingsPanel } from '@/components/features/settings/settings-panel';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const [initialExpansionDone, setInitialExpansionDone] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        id: string;
        name: string;
        type: 'journal' | 'space';
    } | null>(null);
    const [showClearStorageConfirm, setShowClearStorageConfirm] = useState(false);
    const { notebooks, createNotebook, currentNotebookId } = useNotebooks();
    const { entries, deleteEntry, createEntry } = useJournal();
    const { spaces, switchSpace, deleteSpace, currentSpaceId, createSpace } = useSpaces();
    const router = useRouter();
    const pathname = usePathname();


    // Extract IDs directly from pathname - more reliable than using context
    const currentPageType = pathname.startsWith('/journal/')
        ? 'journal'
        : pathname.startsWith('/space/')
            ? 'space'
            : '';

    const currentPageId =
        currentPageType === 'journal'
            ? pathname.split('/journal/')[1]?.split(/[/?#]/)[0] || ''
            : currentPageType === 'space'
                ? pathname.split('/space/')[1]?.split(/[/?#]/)[0] || ''
                : '';

    // Only expand sections on initial page load, not when manually collapsed
    useEffect(() => {
        if (!initialExpansionDone) {
            setInitialExpansionDone(true);
        }
    }, [currentPageType, initialExpansionDone]);

    // Add a state to track newly created items
    const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
    const [editingJournalTitle, setEditingJournalTitle] = useState('');
    const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);

    // Add useEffect for keyboard shortcut near the other useEffect hooks
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearchModal(true);
            }

            // Also close modal with Escape key
            if (e.key === 'Escape' && showSearchModal) {
                setShowSearchModal(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showSearchModal]);

    // Update handleCreateNotebook
    const handleCreateNotebook = () => {
        createNotebook();
    };

    const [showCreateMenu, setShowCreateMenu] = useState(false);

    const handleCreateJournal = () => {
        const defaultTitle = 'Untitled';
        // Use current notebook or fall back to the first one (usually Default)
        let targetNotebookId = currentNotebookId || (notebooks.length > 0 ? notebooks[0].id : undefined);

        // If no notebooks exist, try to create a default one first
        if (!targetNotebookId) {
            targetNotebookId = createNotebook() || undefined; // createNotebook returns string | null
            if (!targetNotebookId) {
                console.error('[Sidebar] Failed to create notebook for new journal');
                return;
            }
        }

        const newEntry = createEntry(defaultTitle, targetNotebookId);

        if (newEntry) {
            setEditingJournalId(newEntry.id);
            setEditingJournalTitle(defaultTitle);
            router.push(`/journal/${newEntry.id}`);
        } else {
            console.error('[Sidebar] Failed to create journal entry');
        }
    };

    const handleCreateSpace = () => {
        const defaultTitle = 'Untitled';
        // Use current notebook or fall back to the first one (usually Default)
        let targetNotebookId = currentNotebookId || (notebooks.length > 0 ? notebooks[0].id : undefined);

        // If no notebooks exist, try to create a default one first
        if (!targetNotebookId) {
            targetNotebookId = createNotebook() || undefined;
            if (!targetNotebookId) {
                console.error('[Sidebar] Failed to create notebook for new space');
                return;
            }
        }

        const newSpaceId = createSpace(defaultTitle, targetNotebookId);

        if (newSpaceId) {
            setEditingSpaceId(newSpaceId);
            // We don't have a space name state at this level to set easily like journal title, 
            // but the space will be created with default title "Untitled"
            router.push(`/space/${newSpaceId}`);
        } else {
            console.error('[Sidebar] Failed to create space');
        }
    };

    // Update clearLocalStorage function to use the custom modal
    const clearLocalStorage = () => {
        setShowClearStorageConfirm(true);
    };

    return (
        <>

            {/* Toggle button that always stays visible */}
            <button
                className={cn(
                    'fixed top-24 left-0 z-50 bg-white dark:bg-neutral-900',
                    'rounded-r-md p-2 shadow-sm transition-transform duration-200 ease-out',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                )}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                style={{
                    transform: isOpen ? 'translateX(256px)' : 'translateX(0)',
                }}
            >
                {isOpen ? (
                    <ChevronLeft className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                ) : (
                    <ChevronRight className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                )}
            </button>

            <aside
                className={cn(
                    'fixed top-0 left-0 h-screen transition-[width] duration-200 ease-out flex flex-col z-50',
                    'bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800',
                    isOpen ? 'w-64 pointer-events-auto' : 'w-0 pointer-events-none',
                )}
            >
                {/* Hide content when closed for accessibility and performance */}
                <div
                    className={cn(
                        'flex flex-col h-full flex-1 transition-opacity duration-200 ease-out',
                        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
                    )}
                >
                    <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 relative">
                        {/* Brand row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative h-6 w-6">
                                    <Image
                                        src="/logo.svg"
                                        alt="OpenBook Logo"
                                        fill
                                        className="object-contain dark:invert"
                                    />
                                </div>
                                <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                                    OpenBook
                                </span>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowCreateMenu(!showCreateMenu)}
                                    aria-label="Create new..."
                                    className={cn(
                                        "h-7 w-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors",
                                        showCreateMenu && "bg-neutral-100 dark:bg-neutral-800"
                                    )}
                                >
                                    <Plus className="h-4 w-4 text-emerald-500" />
                                </button>

                                {showCreateMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowCreateMenu(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                            <button
                                                onClick={() => {
                                                    handleCreateJournal();
                                                    setShowCreateMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                                            >
                                                <PenLine className="h-4 w-4" />
                                                <span>New Journal</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleCreateSpace();
                                                    setShowCreateMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                <span>New Space</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Search button styled like the original input */}
                        <div className="relative px-4 mt-4 mb-2">
                            <button
                                className="w-full flex items-center justify-between px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 text-sm cursor-text hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
                                onClick={() => setShowSearchModal(true)}
                            >
                                <div className="flex items-center">
                                    <Search className="h-3.5 w-3.5 mr-2" />
                                    <span>Search...</span>
                                </div>
                                <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono">⌘K</span>
                            </button>
                        </div>
                    </div>

                    {/* Content area with notebooks */}
                    <div className="flex-1 overflow-y-auto py-2">
                        {/* Notebooks section */}
                        <div className="mb-2">
                            <AnimatePresence mode="wait">
                                {/* Check if any notebook is expanded */}
                                {notebooks.some((notebook) => notebook.isExpanded) ? (
                                    // Show only the expanded notebook with animation
                                    <motion.div
                                        key="expanded"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        {notebooks
                                            .filter((notebook) => notebook.isExpanded)
                                            .map((notebook) => (
                                                <SidebarNotebook
                                                    key={notebook.id}
                                                    notebook={notebook}
                                                    currentPageType={currentPageType}
                                                    currentPageId={currentPageId}
                                                />
                                            ))}
                                    </motion.div>
                                ) : (
                                    // Show all notebooks when none are expanded with animation
                                    <motion.div
                                        key="collapsed"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-4 py-1.5 flex items-center justify-between">
                                            <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tracking-wider">
                                                NOTEBOOKS
                                            </h3>
                                        </div>

                                        {/* Notebooks list */}
                                        <div className="space-y-0.5">
                                            {notebooks.map((notebook, index) => (
                                                <motion.div
                                                    key={notebook.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        delay: index * 0.05,
                                                        ease: 'easeOut',
                                                    }}
                                                >
                                                    <SidebarNotebook
                                                        notebook={notebook}
                                                        currentPageType={currentPageType}
                                                        currentPageId={currentPageId}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* New Notebook button */}
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: notebooks.length * 0.05 + 0.1 }}
                                            onClick={handleCreateNotebook}
                                            className="w-full flex items-center gap-2 text-left px-4 py-1.5 mt-1 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                                        >
                                            <BookOpen className="h-3.5 w-3.5 text-neutral-400" />
                                            <span>New Notebook</span>
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-neutral-100 dark:border-neutral-800 py-3 px-4">
                        <div className="space-y-1">
                            <a
                                href="https://x.com/GoOpenBook"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                            >
                                <MessageSquare className="h-4 w-4 text-neutral-400" />
                                <span>Follow on X</span>
                            </a>
                            <a
                                href="https://openbook.featurebase.app/roadmap"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                            >
                                <AppWindowMac className="h-4 w-4 text-neutral-400" />
                                <span>Feedback</span>
                            </a>
                            {/* Add Clear Storage button */}
                            <button
                                onClick={clearLocalStorage}
                                className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                            >
                                <Trash2 className="h-4 w-4 text-neutral-400" />
                                <span>Clear Storage</span>
                            </button>
                            {/* Settings Button (Wraps the button with the SettingsPanel Trigger) */}
                            <SettingsPanel>
                                <button className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                                    <Settings className="h-4 w-4 text-neutral-400" />
                                    <span>Settings</span>
                                </button>
                            </SettingsPanel>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Search Modal */}
            <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
            />

            {/* Add the clear storage confirmation dialog */}
            {showClearStorageConfirm && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
                    onClick={() => setShowClearStorageConfirm(false)}
                    style={{ animation: 'overlayShow 0.15s ease-out' }}
                >
                    <div
                        className="bg-white dark:bg-neutral-900 rounded-md shadow-md max-w-xs w-full transform transition-all ease-out duration-300 scale-100 opacity-100 border border-neutral-100 dark:border-neutral-800"
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center">
                            <Trash2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400 mr-2" />
                            <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                Clear Storage
                            </h3>
                        </div>

                        <div className="p-4">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                This will permanently delete all your data including:
                            </p>
                            <ul className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 list-disc list-inside space-y-1">
                                <li>All spaces and conversations</li>
                                <li>All journal entries</li>
                                <li>All notebooks</li>
                                <li>User preferences and settings</li>
                            </ul>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-medium">
                                This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700"
                                    onClick={() => setShowClearStorageConfirm(false)}
                                    autoFocus
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                    onClick={() => {
                                        // Clear all application data using centralized function
                                        clearAllStorageData(true);

                                        // Use router navigation instead of reload
                                        router.push('/');
                                        setShowClearStorageConfirm(false);
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add the delete confirmation dialog */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{ animation: 'overlayShow 0.15s ease-out' }}
                >
                    <div
                        className="bg-white dark:bg-neutral-900 rounded-md shadow-md max-w-xs w-full transform transition-all ease-out duration-300 scale-100 opacity-100 border border-neutral-100 dark:border-neutral-800"
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
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
                                    autoFocus
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
        </>
    );
}
