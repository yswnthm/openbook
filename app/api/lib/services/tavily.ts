// Tavily Web Search Service
// Encapsulates all Tavily API interactions

import { tavily } from '@tavily/core';
import { serverEnv } from '@/lib/env/server';

interface TavilySearchOptions {
  searchDepth?: 'basic' | 'advanced';
  includeAnswer?: boolean;
  maxResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  publishedDate?: string;
}

interface TavilyResponse {
  results: TavilyResult[];
  answer?: string;
  query: string;
  responseTime: number;
}

export class TavilyService {
  private client: any;

  constructor() {
    if (!serverEnv.TAVILY_API_KEY) {
      throw new Error('TAVILY_API_KEY is missing. Please set the TAVILY_API_KEY environment variable.');
    }
    this.client = tavily({ apiKey: serverEnv.TAVILY_API_KEY });
  }

  /**
   * Perform a web search with Tavily
   */
  async search(
    query: string,
    options: TavilySearchOptions = {}
  ): Promise<TavilyResponse> {
    const {
      searchDepth = 'basic',
      includeAnswer = true,
      maxResults = 6,
      includeDomains,
      excludeDomains,
    } = options;

    const startTime = Date.now();

    let result;
    try {
      result = await this.client.search(query, {
        searchDepth,
        includeAnswer,
        maxResults,
        ...(includeDomains ? { includeDomains } : {}),
        ...(excludeDomains ? { excludeDomains } : {}),
      });
    } catch (error) {
      throw new Error(
        `Tavily API search failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const responseTime = Date.now() - startTime;

    return {
      query,
      results: this.processResults(result.results || []),
      answer: result.answer,
      responseTime,
    };
  }

  /**
   * Quick search for basic results
   */
  async quickSearch(query: string, maxResults = 3): Promise<TavilyResult[]> {
    const response = await this.search(query, {
      searchDepth: 'basic',
      includeAnswer: false,
      maxResults,
    });

    return response.results;
  }

  /**
   * Deep search for comprehensive results
   */
  async deepSearch(query: string, maxResults = 10): Promise<TavilyResponse> {
    return this.search(query, {
      searchDepth: 'advanced',
      includeAnswer: true,
      maxResults,
    });
  }

  /**
   * Search with domain filtering
   */
  async searchWithDomains(
    query: string,
    options: {
      includeDomains?: string[];
      excludeDomains?: string[];
      maxResults?: number;
    } = {}
  ): Promise<TavilyResult[]> {
    const response = await this.search(query, {
      searchDepth: 'basic',
      includeAnswer: false,
      maxResults: options.maxResults || 5,
      includeDomains: options.includeDomains,
      excludeDomains: options.excludeDomains,
    });

    return response.results;
  }

  /**
   * Process and clean search results
   */
  private processResults(results: any[]): TavilyResult[] {
    return results.map((result) => ({
      title: result.title || '',
      url: result.url || '',
      content: result.content || '',
      score: result.score,
      publishedDate: result.published_date || result.publishedDate,
    }));
  }

  /**
   * Get search statistics
   */
  getLastSearchStats() {
    // This could be expanded to include more detailed analytics
    return {
      lastQuery: '',
      resultCount: 0,
      responseTime: 0,
    };
  }
} 