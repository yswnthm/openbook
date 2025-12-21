// Conversation Utilities for OpenBook
// Handles conversation metadata and automatic naming

import { ChatMessage, Space } from '@/contexts/SpacesContext';

interface ConversationMetadata {
    topics: string[];
    summary: string;
    sentiment: 'neutral' | 'positive' | 'negative';
    lastActivity: number;
    wordCount: number;
    messageCount: number;
    keyTerms: string[];
}

// -----------------------------------------------------------------------------
// Helper utilities
// -----------------------------------------------------------------------------

/**
 * Utility to get the default name regex (case-insensitive)
 */
function getDefaultNameRegex(): RegExp {
    // Conversation time: hours 1-12, minutes 00-59, AM/PM (case-insensitive)
    return /^(Untitled(?: \d+)?|Conversation (1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)|Space - \d+)$/i;
}

/**
 * Determine whether a given space name is one of the auto-generated defaults.
 */
export function isDefaultAutoName(name: string): boolean {
    return getDefaultNameRegex().test(name.trim());
}

/**
 * Extract key terms from conversation content
 */
function extractKeyTerms(messages: ChatMessage[]): string[] {
    // Simple implementation that extracts capitalized terms and frequently used words
    const text = messages.map((m) => m.content).join(' ');
    const words = text.split(/\s+/);

    // Count word frequency
    const wordFrequency: Record<string, number> = {};
    words.forEach((word) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/gi, '');
        if (cleanWord.length > 3) {
            // Only consider words longer than 3 chars
            wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
    });

    // Get potential key terms (capitalized words or frequent words)
    const capitalizedTerms = words
        .filter((word) => /^[A-Z][a-z]{2,}/.test(word))
        .map((word) => word.replace(/[^a-zA-Z0-9]/g, ''));

    // Get frequently used words (appear more than 3 times)
    const frequentWords = Object.entries(wordFrequency)
        .filter(([_, count]) => count > 3)
        .map(([word]) => word);

    // Combine and filter duplicates
    const allTerms = [...new Set([...capitalizedTerms, ...frequentWords])];

    // Return top 5 terms
    return allTerms.slice(0, 5);
}

/**
 * Generate a conversation name based on the content of the messages
 */
export function generateConversationName(space: Space): string {
    if (!space.messages.length) return space.name;

    // If the current name is not one of the default/auto-generated ones, keep it
    if (!isDefaultAutoName(space.name)) {
        return space.name;
    }

    const firstUserMessage = space.messages.find((m) => m.role === 'user');
    if (!firstUserMessage) return space.name;

    // Extract first sentence or first 50 characters
    let title = firstUserMessage.content.split(/[.!?]/)[0].trim();

    // If title is too long, truncate it
    if (title.length > 40) {
        title = title.substring(0, 40) + '...';
    }

    // If title is too short, try using key terms
    if (title.length < 15 && space.messages.length > 2) {
        const keyTerms = extractKeyTerms(space.messages);
        if (keyTerms.length > 0) {
            return `Chat about ${keyTerms.slice(0, 2).join(', ')}`;
        }
    }

    return title;
}

/**
 * Calculate basic conversation metadata
 */
export function calculateConversationMetadata(space: Space): ConversationMetadata {
    const topics = extractKeyTerms(space.messages);

    // Count words in all messages
    const wordCount = space.messages.reduce((count, message) => {
        return count + message.content.split(/\s+/).length;
    }, 0);

    // Determine sentiment (very simplified implementation)
    const text = space.messages
        .map((m) => m.content)
        .join(' ')
        .toLowerCase();
    const positiveWords = ['thank', 'good', 'great', 'excellent', 'amazing', 'helpful', 'appreciate'];
    const negativeWords = ['bad', 'wrong', 'error', 'issue', 'problem', 'fail', 'difficult'];

    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) positiveScore += matches.length;
    });

    negativeWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) negativeScore += matches.length;
    });

    let sentiment: 'neutral' | 'positive' | 'negative' = 'neutral';
    if (positiveScore > negativeScore + 2) sentiment = 'positive';
    if (negativeScore > positiveScore + 2) sentiment = 'negative';

    // Create a simple summary (first user message)
    const firstUserMessage = space.messages.find((m) => m.role === 'user');
    const summary = firstUserMessage
        ? firstUserMessage.content.substring(0, 100) + (firstUserMessage.content.length > 100 ? '...' : '')
        : '';

    return {
        topics,
        summary,
        sentiment,
        lastActivity: space.updatedAt,
        wordCount,
        messageCount: space.messages.length,
        keyTerms: topics,
    };
}

/**
 * Determine if a conversation name should be auto-updated
 */
export function shouldUpdateConversationName(space: Space): boolean {
    // Skip updating if the name is NOT one of our default names
    if (!isDefaultAutoName(space.name)) {
        return false;
    }

    // Determine if there's enough new content to justify a name update
    // Update if the conversation has at least 3 messages and name hasn't been manually changed
    return space.messages.length >= 3;
}
