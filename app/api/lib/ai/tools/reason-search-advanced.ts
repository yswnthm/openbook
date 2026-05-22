// Advanced Reason Search Tool with Streaming Support
// Full implementation extracted from app/api/chat/route.ts

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { ExaService } from '../../services/exa';
import { TavilyService } from '../../services/tavily';
import type { 
  ReasonSearchResult, 
  ResearchPlan, 
  SearchResult, 
  ProcessedResult
} from '../types';

export async function executeReasonSearch(
  topic: string,
  depth: 'basic' | 'advanced',
  dataStream: any // DataStream type from AI SDK
): Promise<ReasonSearchResult> {
  
  const exaService = new ExaService();
  const tavilyService = new TavilyService();

  // Send initial plan status update
  dataStream.writeMessageAnnotation({
    type: 'research_update',
    data: {
      id: 'research-plan-initial',
      type: 'plan',
      status: 'running',
      title: 'Research Plan',
      message: 'Creating research plan...',
      timestamp: Date.now(),
      overwrite: true,
    },
  });

  // Generate the research plan
  const { object: researchPlan } = await generateObject({
    model: openai('gpt-o4-mini'),
    temperature: 0,
    schema: z.object({
      search_queries: z
        .array(
          z.object({
            query: z.string(),
            rationale: z.string(),
            source: z.enum(['web', 'academic', 'x', 'all']),
            priority: z.number().min(1).max(5),
          }),
        )
        .max(12),
      required_analyses: z
        .array(
          z.object({
            type: z.string(),
            description: z.string(),
            importance: z.number().min(1).max(5),
          }),
        )
        .max(8),
    }),
    prompt: `Create a focused research plan for the topic: "${topic}".
            Today's date and day of the week: ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}

            Keep the plan concise but comprehensive, with:
            - 4-12 targeted search queries (each can use web, academic, x (Twitter), or all sources)
            - 2-8 key analyses to perform
            - Prioritize the most important aspects to investigate

            Available sources:
            - "web": General web search
            - "academic": Academic papers and research
            - "x": X/Twitter posts and discussions
            - "all": Use all source types (web, academic, and X/Twitter)

            Do not use floating numbers, use whole numbers only in the priority field!!
            Do not keep the numbers too low or high, make them reasonable in between.
            Do not use 0 or 1 in the priority field, use numbers between 2 and 4.

            Consider different angles and potential controversies, but maintain focus on the core aspects.
            Ensure the total number of steps (searches + analyses) does not exceed 20.`,
  });

  // Generate step IDs based on the plan
  const generateStepIds = (plan: ResearchPlan) => {
    const searchSteps = plan.search_queries.flatMap((query, index) => {
      if (query.source === 'all') {
        return [
          { id: `search-web-${index}`, type: 'web', query },
          { id: `search-academic-${index}`, type: 'academic', query },
          { id: `search-x-${index}`, type: 'x', query },
        ];
      }
      if (query.source === 'x') {
        return [{ id: `search-x-${index}`, type: 'x', query }];
      }
      const searchType = query.source === 'academic' ? 'academic' : 'web';
      return [{ id: `search-${searchType}-${index}`, type: searchType, query }];
    });

    const analysisSteps = plan.required_analyses.map((analysis, index) => ({
      id: `analysis-${index}`,
      type: 'analysis',
      analysis,
    }));

    return {
      planId: 'research-plan',
      searchSteps,
      analysisSteps,
    };
  };

  const stepIds = generateStepIds(researchPlan);
  let completedSteps = 0;
  const totalSteps = stepIds.searchSteps.length + stepIds.analysisSteps.length;

  // Complete plan status
  dataStream.writeMessageAnnotation({
    type: 'research_update',
    data: {
      id: stepIds.planId,
      type: 'plan',
      status: 'completed',
      title: 'Research Plan',
      plan: researchPlan,
      totalSteps: totalSteps,
      message: 'Research plan created',
      timestamp: Date.now(),
      overwrite: true,
    },
  });

  // Execute searches
  const searchResults: SearchResult[] = [];

  for (const step of stepIds.searchSteps) {
    // Send running annotation for this search step
    dataStream.writeMessageAnnotation({
      type: 'research_update',
      data: {
        id: step.id,
        type: step.type,
        status: 'running',
        title: step.type === 'web'
          ? `Searching the web for "${step.query.query}"`
          : step.type === 'academic'
            ? `Searching academic papers for "${step.query.query}"`
            : step.type === 'x'
              ? `Searching X/Twitter for "${step.query.query}"`
              : `Analyzing ${step.query.query}`,
        query: step.query.query,
        message: `Searching ${step.query.source} sources...`,
        timestamp: Date.now(),
      },
    });

    let stepResults: ProcessedResult[] = [];

    if (step.type === 'web') {
      const webResponse = await tavilyService.search(step.query.query, {
        searchDepth: depth,
        includeAnswer: true,
        maxResults: Math.min(6 - step.query.priority, 10),
      });

      stepResults = webResponse.results.map((r) => ({
        source: 'web',
        title: r.title,
        url: r.url,
        content: r.content,
      }));
    } else if (step.type === 'academic') {
      const academicResults = await exaService.searchAcademic(step.query.query, {
        numResults: Math.min(6 - step.query.priority, 5),
        summary: true,
      });

      stepResults = academicResults.map((r) => ({
        source: 'academic',
        title: r.title || '',
        url: r.url || '',
        content: r.summary || '',
      }));
    } else if (step.type === 'x') {
      const xResults = await exaService.searchSocial(step.query.query, {
        numResults: step.query.priority,
      });

      stepResults = xResults
        .filter(result => result.extras?.tweetId)
        .map((result) => ({
          source: 'x',
          title: result.title || result.author || 'Tweet',
          url: result.url,
          content: result.text || '',
          tweetId: result.extras?.tweetId || '',
        }));
    }

    searchResults.push({
      type: step.type as 'web' | 'academic' | 'x',
      query: step.query,
      results: stepResults,
    });

    completedSteps++;

    // Send completed annotation for the search step
    dataStream.writeMessageAnnotation({
      type: 'research_update',
      data: {
        id: step.id,
        type: step.type,
        status: 'completed',
        title: step.type === 'web'
          ? `Searched the web for "${step.query.query}"`
          : step.type === 'academic'
            ? `Searched academic papers for "${step.query.query}"`
            : step.type === 'x'
              ? `Searched X/Twitter for "${step.query.query}"`
              : `Analysis of ${step.query.query} complete`,
        query: step.query.query,
        results: stepResults,
        message: `Found ${stepResults.length} results`,
        timestamp: Date.now(),
        overwrite: true,
      },
    });
  }

  // Perform analyses
  for (const step of stepIds.analysisSteps) {
    dataStream.writeMessageAnnotation({
      type: 'research_update',
      data: {
        id: step.id,
        type: 'analysis',
        status: 'running',
        title: `Analyzing ${step.analysis.type}`,
        analysisType: step.analysis.type,
        message: `Analyzing ${step.analysis.type}...`,
        timestamp: Date.now(),
      },
    });

    const { object: analysisResult } = await generateObject({
      model: openai('gpt-o4-mini'),
      temperature: 0.5,
      schema: z.object({
        findings: z.array(
          z.object({
            insight: z.string(),
            evidence: z.array(z.string()),
            confidence: z.number().min(0).max(1),
          }),
        ),
        implications: z.array(z.string()),
        limitations: z.array(z.string()),
      }),
      prompt: `Perform a ${step.analysis.type} analysis on the search results. ${step.analysis.description}
              Consider all sources and their reliability.
              Search results: ${JSON.stringify(searchResults)}`,
    });

    dataStream.writeMessageAnnotation({
      type: 'research_update',
      data: {
        id: step.id,
        type: 'analysis',
        status: 'completed',
        title: `Analysis of ${step.analysis.type} complete`,
        analysisType: step.analysis.type,
        findings: analysisResult.findings,
        message: `Analysis complete`,
        timestamp: Date.now(),
        overwrite: true,
      },
    });
    
    completedSteps++;
  }

  // Gap analysis
  dataStream.writeMessageAnnotation({
    type: 'research_update',
    data: {
      id: 'gap-analysis',
      type: 'analysis',
      status: 'running',
      title: 'Research Gaps and Limitations',
      analysisType: 'gaps',
      message: 'Analyzing research gaps and limitations...',
      timestamp: Date.now(),
    },
  });

  const { object: gapAnalysis } = await generateObject({
    model: openai('gpt-o4-mini'),
    temperature: 0,
    schema: z.object({
      limitations: z.array(
        z.object({
          type: z.string(),
          description: z.string(),
          severity: z.number().min(2).max(10),
          potential_solutions: z.array(z.string()),
        }),
      ),
      knowledge_gaps: z.array(
        z.object({
          topic: z.string(),
          reason: z.string(),
          additional_queries: z.array(z.string()),
        }),
      ),
      recommended_followup: z.array(
        z.object({
          action: z.string(),
          rationale: z.string(),
          priority: z.number().min(2).max(10),
        }),
      ),
    }),
    prompt: `Analyze the research results and identify limitations, knowledge gaps, and recommended follow-up actions.
            Consider:
            - Quality and reliability of sources
            - Missing perspectives or data
            - Areas needing deeper investigation
            - Potential biases or conflicts

            Research results: ${JSON.stringify(searchResults)}
            Analysis findings: ${JSON.stringify(stepIds.analysisSteps.map((step) => ({
              type: step.analysis.type,
              description: step.analysis.description,
              importance: step.analysis.importance,
            })))}`,
  });

  completedSteps++;

  // Send gap analysis completion
  dataStream.writeMessageAnnotation({
    type: 'research_update',
    data: {
      id: 'gap-analysis',
      type: 'analysis',
      status: 'completed',
      title: 'Research Gaps and Limitations',
      analysisType: 'gaps',
      findings: gapAnalysis.limitations.map((l) => ({
        insight: l.description,
        evidence: l.potential_solutions,
        confidence: (10 - l.severity) / 8,
      })),
      gaps: gapAnalysis.knowledge_gaps,
      recommendations: gapAnalysis.recommended_followup,
      message: `Identified ${gapAnalysis.limitations.length} limitations and ${gapAnalysis.knowledge_gaps.length} knowledge gaps`,
      timestamp: Date.now(),
      overwrite: true,
      completedSteps: completedSteps,
      totalSteps: totalSteps + 2,
    },
  });

  // Final synthesis
  dataStream.writeMessageAnnotation({
    type: 'research_update',
    data: {
      id: 'final-synthesis',
      type: 'analysis',
      status: 'running',
      title: 'Final Research Synthesis',
      analysisType: 'synthesis',
      message: 'Synthesizing research findings...',
      timestamp: Date.now(),
      completedSteps: completedSteps,
      totalSteps: totalSteps + 2,
    },
  });

  const { object: finalSynthesis } = await generateObject({
    model: openai('gpt-o4-mini'),
    temperature: 0,
    schema: z.object({
      key_findings: z.array(
        z.object({
          finding: z.string(),
          confidence: z.number().min(0).max(1),
          supporting_evidence: z.array(z.string()),
        }),
      ),
      remaining_uncertainties: z.array(z.string()),
    }),
    prompt: `Synthesize the research findings and gap analysis.
             Highlight key conclusions and remaining uncertainties.

             Search Results: ${JSON.stringify(searchResults)}
             Gap Analysis: ${JSON.stringify(gapAnalysis)}`,
  });

  completedSteps++;

  // Send final synthesis completion
  dataStream.writeMessageAnnotation({
    type: 'research_update',
    data: {
      id: 'final-synthesis',
      type: 'analysis',
      status: 'completed',
      title: 'Final Research Synthesis',
      analysisType: 'synthesis',
      findings: finalSynthesis.key_findings.map((f) => ({
        insight: f.finding,
        evidence: f.supporting_evidence,
        confidence: f.confidence,
      })),
      uncertainties: finalSynthesis.remaining_uncertainties,
      message: `Synthesized ${finalSynthesis.key_findings.length} key findings`,
      timestamp: Date.now(),
      overwrite: true,
      completedSteps: completedSteps,
      totalSteps: totalSteps + 2,
    },
  });

  // Final progress update
  dataStream.writeMessageAnnotation({
    type: 'research_update',
    data: {
      id: 'research-progress',
      type: 'progress',
      status: 'completed',
      message: 'Research complete',
      completedSteps: completedSteps,
      totalSteps: totalSteps + 2,
      isComplete: true,
      timestamp: Date.now(),
      overwrite: true,
    },
  });

  return {
    plan: researchPlan,
    results: searchResults,
    synthesis: finalSynthesis,
  };
} 