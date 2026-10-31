// Academic Search Tool
// Extracted from app/api/chat/route.ts

import { tool } from 'ai';
import { z } from 'zod';
import { ExaService } from '../../services/exa';
import { serverEnv } from '@/lib/env/server';
import type { AcademicSearchResult } from '../types';

export const academicSearchTool = tool({
    description: 'Search academic papers and research.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }: { query: string }): Promise<AcademicSearchResult> => {
        try {
            // Check if EXA API key is available
            if (!serverEnv.EXA_API_KEY) {
                console.warn('EXA_API_KEY not found - academic search unavailable');
                return {
                    results: [],
                    error: 'Academic search is currently unavailable. Please ensure EXA_API_KEY is configured.',
                    query: query,
                };
            }

            const exaService = new ExaService();

            // Search academic papers with content summary
            const results = await exaService.searchAcademic(query, {
                numResults: 20,
                summary: true,
            });

            // Filter out results without summary and process
            const processedResults = results.filter((paper) => paper.summary);

            console.log(`Academic search for "${query}" returned ${processedResults.length} results with summaries`);

            return {
                results: processedResults,
                query: query,
                totalResults: results.length,
                filteredResults: processedResults.length,
            };
        } catch (error) {
            console.error('Academic search error:', error);

            // Return a structured error response instead of throwing
            return {
                results: [],
                error: `Academic search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                query: query,
            };
        }
    },
});
