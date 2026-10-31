'use client';

import { useRef, useEffect } from 'react';
import { Search, X, PenLine } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { useSpaces } from '@/contexts/SpacesContext';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const { searchQuery, setSearchQuery, searchResults, clearSearch } = useSearch();
    const { switchSpace } = useSpaces();
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Handle search item click
    const handleSearchItemClick = (result: SearchResult) => {
        if (result.type === 'journal') {
            router.push(`/journal/${result.id}`);
        } else {
            switchSpace(result.id);
            router.push(`/space/${result.id}`);
        }
        clearSearch();
        onClose();
    };

    const handleClose = () => {
        clearSearch();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <Input
                        ref={searchInputRef}
                        placeholder="Search..."
                        className="pl-9 h-9 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 rounded-md focus-visible:ring-emerald-500/30 focus-visible:ring-offset-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            className="absolute right-2 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Search Results */}
                <div className="mt-3 max-h-64 overflow-y-auto">
                    {searchQuery.trim().length > 0 ? (
                        <>
                            {searchResults.journals.length === 0 && searchResults.spaces.length === 0 ? (
                                <div className="p-3 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                                    No results found
                                </div>
                            ) : (
                                <>
                                    {searchResults.journals.length > 0 && (
                                        <div className="mb-3">
                                            <div className="px-1 py-1 text-xs font-medium text-emerald-500/70 dark:text-emerald-400/70 tracking-wider">
                                                Journals
                                            </div>
                                            <div className="space-y-1">
                                                {searchResults.journals.map((journal) => (
                                                    <button
                                                        key={journal.id}
                                                        className="flex flex-col w-full text-left px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                                                        onClick={() => handleSearchItemClick(journal)}
                                                    >
                                                        <div className="flex items-center">
                                                            <PenLine className="h-3.5 w-3.5 text-neutral-400 mr-2 flex-shrink-0" />
                                                            <span className="font-medium truncate">
                                                                {journal.title}
                                                            </span>
                                                        </div>
                                                        {journal.preview && (
                                                            <div className="ml-5 mt-1 text-xs text-neutral-500 dark:text-neutral-500 line-clamp-1">
                                                                {journal.preview}
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {searchResults.spaces.length > 0 && (
                                        <div>
                                            <div className="px-1 py-1 text-xs font-medium text-emerald-500/70 dark:text-emerald-400/70 tracking-wider">
                                                Spaces
                                            </div>
                                            <div className="space-y-1">
                                                {searchResults.spaces.map((space) => (
                                                    <button
                                                        key={space.id}
                                                        className="flex flex-col w-full text-left px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                                                        onClick={() => handleSearchItemClick(space)}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="w-3 h-3 rounded-sm bg-neutral-200 dark:bg-neutral-700 mr-2 flex-shrink-0"></span>
                                                            <span className="font-medium truncate">{space.name}</span>
                                                        </div>
                                                        {space.preview && (
                                                            <div className="ml-5 mt-1 text-xs text-neutral-500 dark:text-neutral-500 line-clamp-1">
                                                                {space.preview}
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="py-8 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                            Type to search journals and spaces
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 p-2 flex justify-end">
                <button
                    className="px-2 py-1 text-xs rounded text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                    onClick={handleClose}
                >
                    ESC
                </button>
            </div>
        </Modal>
    );
}
