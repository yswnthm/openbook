// Exa Academic Search Service
// Encapsulates all Exa API interactions

import Exa from 'exa-js';
import { serverEnv } from '@/lib/env/server';
import type { ExaResult, AcademicSearchOptions } from '../ai/types';

export class ExaService {
    private client: Exa;

    constructor() {
        if (!serverEnv.EXA_API_KEY) {
            throw new Error('EXA_API_KEY is missing. Please set the EXA_API_KEY environment variable.');
        }
        this.client = new Exa(serverEnv.EXA_API_KEY);
    }

    /**
     * Search academic papers and research
     */
    async searchAcademic(query: string, options: AcademicSearchOptions = {}): Promise<ExaResult[]> {
        const { numResults = 20, summary = true } = options;

        const result = await this.client.searchAndContents(query, {
            type: 'auto',
            numResults,
            category: 'research paper',
            ...(summary
                ? {
                      summary: {
                          query: 'Abstract of the Paper',
                      },
                  }
                : {}),
        });

        return this.processAcademicResults(result.results);
    }

    /**
     * Search social media (X/Twitter) content
     */
    async searchSocial(query: string, options: { numResults?: number } = {}): Promise<ExaResult[]> {
        const { numResults = 5 } = options;

        const result = await this.client.searchAndContents(query, {
            type: 'neural',
            useAutoprompt: true,
            numResults,
            text: true,
            highlights: true,
            includeDomains: ['twitter.com', 'x.com'],
        });

        return this.processSocialResults(result.results);
    }

    /**
     * General search with custom options
     */
    async search(
        query: string,
        options: {
            type?: 'auto' | 'neural' | 'keyword';
            numResults?: number;
            category?:
                | 'company'
                | 'research paper'
                | 'news'
                | 'pdf'
                | 'github'
                | 'tweet'
                | 'personal site'
                | 'linkedin profile'
                | 'financial report';
            includeDomains?: string[];
            text?: boolean;
            highlights?: boolean;
            summary?: boolean;
        } = {},
    ): Promise<ExaResult[]> {
        const result = await this.client.searchAndContents(query, {
            type: options.type || 'auto',
            numResults: options.numResults || 10,
            ...(options.category ? { category: options.category } : {}),
            ...(options.includeDomains ? { includeDomains: options.includeDomains } : {}),
            ...(options.text ? { text: options.text } : {}),
            ...(options.highlights ? { highlights: options.highlights } : {}),
            ...(options.summary ? { summary: true } : {}),
        });

        return this.processGeneralResults(result.results);
    }

    /**
     * Extract tweet ID from Twitter/X URL
     */
    private extractTweetId(url: string): string | null {
        const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
        return match ? match[1] : null;
    }

    /**
     * Process academic search results
     */
    private processAcademicResults(results: any[]): ExaResult[] {
        return results.reduce<ExaResult[]>((acc, paper) => {
            // Skip if URL already exists or if no summary available (when required)
            if (acc.some((p) => p.url === paper.url)) return acc;

            // Clean up summary (remove "Summary:" prefix if exists)
            const cleanSummary = paper.summary?.replace(/^Summary:\s*/i, '') || '';

            // Clean up title (remove [...] suffixes)
            const cleanTitle = paper.title?.replace(/\s\[.*?\]$/, '') || '';

            acc.push({
                id: paper.id || '',
                title: cleanTitle,
                url: paper.url || '',
                publishedDate: paper.publishedDate,
                author: paper.author,
                score: paper.score,
                image: paper.image,
                favicon: paper.favicon,
                text: paper.text || '',
                highlights: paper.highlights || [],
                highlightScores: paper.highlightScores || [],
                summary: cleanSummary,
                subpages: paper.subpages || [],
                extras: paper.extras || { links: [] },
            });

            return acc;
        }, []);
    }

    /**
     * Process social media search results
     */
    private processSocialResults(results: any[]): ExaResult[] {
        return results
            .map((result) => {
                const tweetId = this.extractTweetId(result.url);
                if (!tweetId) return null;

                return {
                    id: result.id || tweetId,
                    title: result.title || result.author || 'Tweet',
                    url: result.url || '',
                    publishedDate: result.publishedDate,
                    author: result.author,
                    score: result.score,
                    image: result.image,
                    favicon: result.favicon,
                    text: result.text || '',
                    highlights: result.highlights || [],
                    highlightScores: result.highlightScores || [],
                    summary: result.summary,
                    subpages: result.subpages || [],
                    extras: {
                        ...result.extras,
                        tweetId,
                        links: result.extras?.links || [],
                    },
                } as ExaResult;
            })
            .filter((result): result is ExaResult => result !== null);
    }

    /**
     * Process general search results
     */
    private processGeneralResults(results: any[]): ExaResult[] {
        return results.map((result) => ({
            id: result.id || '',
            title: result.title || '',
            url: result.url || '',
            publishedDate: result.publishedDate,
            author: result.author,
            score: result.score,
            image: result.image,
            favicon: result.favicon,
            text: result.text || '',
            highlights: result.highlights || [],
            highlightScores: result.highlightScores || [],
            summary: result.summary,
            subpages: result.subpages || [],
            extras: result.extras || { links: [] },
        }));
    }
}
