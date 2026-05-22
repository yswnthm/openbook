// AI and Search Related Types
// Extracted from app/api/chat/route.ts

// Academic search result type
export interface AcademicSearchResult {
  results: ExaResult[];
  query?: string;
  error?: string;
  totalResults?: number;
  filteredResults?: number;
}

// Research plan types
export interface ResearchPlan {
  search_queries: Array<{
    query: string;
    rationale: string;
    source: 'web' | 'academic' | 'x' | 'all';
    priority: number;
  }>;
  required_analyses: Array<{
    type: string;
    description: string;
    importance: number;
  }>;
}

// Search result types for reason search
export interface ProcessedResult {
  source: 'web' | 'academic' | 'x';
  title: string;
  url: string;
  content: string;
  tweetId?: string;
}

export interface SearchResult {
  type: 'web' | 'academic' | 'x';
  query: SearchQuery;
  results: ProcessedResult[];
}

// Final synthesis type
interface FinalSynthesis {
  key_findings: KeyFinding[];
  remaining_uncertainties: string[];
}

interface KeyFinding {
  finding: string;
  confidence: number;
  supporting_evidence: string[];
}

// Reason search result type
export interface ReasonSearchResult {
  plan: ResearchPlan;
  results: SearchResult[];
  synthesis: FinalSynthesis;
}

// Interface for Exa search results (academic papers)
export interface ExaResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score?: number;
  id: string;
  image?: string;
  favicon?: string;
  text: string;
  highlights?: string[];
  highlightScores?: number[];
  summary?: string;
  subpages?: ExaResult[];
  extras?: {
    links: any[];
    tweetId?: string;
  };
}

// Research plan structure for reason_search tool
// export interface ResearchPlan {
//   search_queries: SearchQuery[];
//   required_analyses: RequiredAnalysis[];
// }

interface SearchQuery {
  query: string;
  rationale: string;
  source: 'web' | 'academic' | 'x' | 'all';
  priority: number;
}

// Academic search specific types
export interface AcademicSearchOptions {
  numResults?: number;
  summary?: boolean;
}

// export interface ReasonSearchResult {
//   plan: ResearchPlan;
//   results: SearchResult[];
//   synthesis: FinalSynthesis;
// } 