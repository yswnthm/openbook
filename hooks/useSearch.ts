import { useState, useEffect } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { useSpaces } from '@/contexts/SpacesContext';

export interface SearchResult {
    id: string;
    title?: string;
    name?: string;
    preview?: string;
    matchType: string;
    type: 'journal' | 'space';
}

interface SearchResults {
    journals: SearchResult[];
    spaces: SearchResult[];
}

export function useSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResults>({
        journals: [],
        spaces: [],
    });
    const [showSearchResults, setShowSearchResults] = useState(false);

    const { entries } = useJournal();
    const { spaces } = useSpaces();

    // Enhanced search functionality
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const query = searchQuery.trim();

            // Search in journals (including content)
            const matchingJournals: SearchResult[] = entries
                .filter(
                    (entry) =>
                        // Search in title
                        entry.title.toLowerCase().includes(query.toLowerCase()) ||
                        // Search in block content
                        entry.blocks.some((block) => block.content.toLowerCase().includes(query.toLowerCase())),
                )
                .map((entry) => {
                    // First try to find a block that matches the query
                    const matchingBlock = entry.blocks.find((block) =>
                        block.content.toLowerCase().includes(query.toLowerCase()),
                    );

                    // Then determine the best preview and match type
                    if (matchingBlock) {
                        return {
                            id: entry.id,
                            title: entry.title,
                            preview: matchingBlock.content,
                            matchType: 'content',
                            type: 'journal' as const,
                        };
                    } else {
                        return {
                            id: entry.id,
                            title: entry.title,
                            matchType: 'title',
                            type: 'journal' as const,
                        };
                    }
                });

            // Search in spaces (including message content)
            const matchingSpaces: SearchResult[] = spaces
                .filter(
                    (space) =>
                        // Search in space name
                        space.name.toLowerCase().includes(query.toLowerCase()) ||
                        // Search in message content
                        space.messages.some((message) => message.content.toLowerCase().includes(query.toLowerCase())),
                )
                .map((space) => {
                    // Try to find a message that matches the query
                    const matchingMessage = space.messages.find((message) =>
                        message.content.toLowerCase().includes(query.toLowerCase()),
                    );

                    if (matchingMessage) {
                        return {
                            id: space.id,
                            name: space.name,
                            preview: matchingMessage.content,
                            matchType: 'message',
                            type: 'space' as const,
                        };
                    } else {
                        return {
                            id: space.id,
                            name: space.name,
                            matchType: 'name',
                            type: 'space' as const,
                        };
                    }
                });

            setSearchResults({
                journals: matchingJournals,
                spaces: matchingSpaces,
            });

            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
        }
    }, [searchQuery, entries, spaces]);

    const clearSearch = () => {
        setSearchQuery('');
        setShowSearchResults(false);
    };

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        showSearchResults,
        setShowSearchResults,
        clearSearch,
    };
} 