'use client';

import React, { useState, useMemo } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { JournalEntry } from '@/lib/types';
import { format } from 'date-fns';
import { PlusCircle, Search, ChevronDown, Clock, Calendar, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalSidebarProps {
    selectedEntryId?: string;
    onSelect: (id: string) => void;
}

export const JournalSidebar: React.FC<JournalSidebarProps> = ({ selectedEntryId, onSelect }) => {
    const { entries, createEntry, searchEntries } = useJournal();
    const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('updatedAt');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSortOptions, setShowSortOptions] = useState(false);

    // Filter entries by search query
    const filtered = searchQuery ? searchEntries(searchQuery) : entries;

    // Sort filtered entries
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
        });
    }, [filtered, sortBy]);

    // Create a new entry with the date-based naming convention
    const handleNew = () => {
        const defaultTitle = 'Untitled';
        const title = window.prompt('New entry title', defaultTitle)?.trim() || defaultTitle;
        const newEntry = createEntry(title);
        if (newEntry) {
            onSelect(newEntry.id);
        }
    };

    // Get sort icon based on sortBy value
    const getSortIcon = () => {
        switch (sortBy) {
            case 'updatedAt':
                return <Clock className="w-3.5 h-3.5" />;
            case 'createdAt':
                return <Calendar className="w-3.5 h-3.5" />;
            case 'title':
                return <AlignLeft className="w-3.5 h-3.5" />;
            default:
                return <Clock className="w-3.5 h-3.5" />;
        }
    };

    return (
        <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
            <div className="px-3 py-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">Journal</h3>
                </div>

                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 py-1.5 px-3 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 mb-4 transition-colors"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>New entry</span>
                </button>

                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search entries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-1.5 pl-9 pr-3 text-sm placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:outline-none"
                    />
                </div>

                <div className="relative mb-4">
                    <button
                        onClick={() => setShowSortOptions(!showSortOptions)}
                        className="flex items-center justify-between w-full text-sm px-3 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            {getSortIcon()}
                            <span className="text-neutral-700 dark:text-neutral-300">
                                {sortBy === 'updatedAt'
                                    ? 'Last edited'
                                    : sortBy === 'createdAt'
                                        ? 'Date created'
                                        : 'Title'}
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                    </button>

                    {showSortOptions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 z-10">
                            <button
                                onClick={() => {
                                    setSortBy('updatedAt');
                                    setShowSortOptions(false);
                                }}
                                className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 ${sortBy === 'updatedAt' ? 'bg-neutral-100 dark:bg-neutral-700' : ''}`}
                            >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Last edited</span>
                            </button>
                            <button
                                onClick={() => {
                                    setSortBy('createdAt');
                                    setShowSortOptions(false);
                                }}
                                className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 ${sortBy === 'createdAt' ? 'bg-neutral-100 dark:bg-neutral-700' : ''}`}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Date created</span>
                            </button>
                            <button
                                onClick={() => {
                                    setSortBy('title');
                                    setShowSortOptions(false);
                                }}
                                className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 ${sortBy === 'title' ? 'bg-neutral-100 dark:bg-neutral-700' : ''}`}
                            >
                                <AlignLeft className="w-3.5 h-3.5" />
                                <span>Title</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto px-2">
                <ul className="space-y-0.5">
                    {sorted.map((entry: JournalEntry) => (
                        <li
                            key={entry.id}
                            onClick={() => onSelect(entry.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onSelect(entry.id);
                                }
                            }}
                            tabIndex={0}
                            className={cn(
                                'group relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500',
                                entry.id === selectedEntryId ? 'bg-emerald-50 dark:bg-emerald-900/20' : '',
                            )}
                        >
                            <div className="flex w-full items-center py-1.5 px-4">
                                <span
                                    className="font-medium text-sm truncate pl-5"
                                    style={{
                                        color:
                                            entry.id === selectedEntryId
                                                ? 'var(--tw-color-emerald-600)'
                                                : 'var(--tw-color-neutral-600)',
                                    }}
                                >
                                    {entry.title}
                                </span>
                            </div>


                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};
