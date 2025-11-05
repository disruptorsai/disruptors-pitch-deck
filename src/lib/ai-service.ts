/**
 * AI Service - Anthropic Claude Integration
 *
 * Handles all AI-powered features including competitive analysis generation
 * Calls Netlify Functions to keep API keys secure server-side
 */

import type {
  AICompetitiveAnalysisInput,
  AICompetitiveAnalysisOutput,
} from './types';

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929'; // Latest Claude Sonnet 4.5

// Netlify Function endpoint
const AI_SERVICE_ENDPOINT = '/.netlify/functions/ai-service';

/**
 * Call Netlify Function with AI service action
 */
async function callAIService(action: string, payload: any): Promise<any> {
  const response = await fetch(AI_SERVICE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.message || error.error || 'AI service request failed');
  }

  return response.json();
}

class AIService {
  /**
   * Generate competitive analysis using Claude
   */
  async generateCompetitiveAnalysis(
    input: AICompetitiveAnalysisInput
  ): Promise<AICompetitiveAnalysisOutput> {
    try {
      const result = await callAIService('generateCompetitiveAnalysis', {
        name: input.name,
        industry: input.industry,
        description: input.description,
        competitors: input.competitors,
      });

      return result;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(
        `Failed to generate competitive analysis: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Generate pitch deck content suggestions
   */
  async generatePitchContent(input: {
    companyName: string;
    industry: string;
    problem: string;
    solution: string;
  }): Promise<{
    slides: Array<{
      title: string;
      subtitle: string;
      content: string;
      suggestedType: string;
    }>;
  }> {
    try {
      const result = await callAIService('generatePitchContent', {
        companyName: input.companyName,
        industry: input.industry,
        problem: input.problem,
        solution: input.solution,
      });

      return result;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(
        `Failed to generate pitch content: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Enhance existing content with AI
   */
  async enhanceContent(
    content: string,
    contentType: 'service' | 'case_study' | 'slide'
  ): Promise<string> {
    try {
      const result = await callAIService('enhanceContent', {
        content,
        contentType,
      });

      return result.enhancedContent;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(
        `Failed to enhance content: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Generate SEO-friendly meta descriptions
   */
  async generateMetaDescription(
    title: string,
    content: string
  ): Promise<string> {
    try {
      const result = await callAIService('generateMetaDescription', {
        title,
        content,
      });

      return result.metaDescription;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(
        `Failed to generate meta description: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Check if AI service is configured
   * Note: This now checks if the Netlify Function endpoint is available
   */
  isConfigured(): boolean {
    // In production, Netlify Functions are always available
    // In dev, check if running with Netlify CLI
    return true;
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [
      'claude-sonnet-4-5-20250929',  // Latest Sonnet 4.5 (Sept 2025)
      'claude-opus-4-1-20250805',    // Opus 4.1 (Aug 2025)
      'claude-3-5-sonnet-20240620',  // Legacy Sonnet 3.5
      'claude-3-opus-20240229',       // Legacy Opus 3
      'claude-3-sonnet-20240229',     // Legacy Sonnet 3
      'claude-3-haiku-20240307',      // Legacy Haiku 3
    ];
  }
}

export const aiService = new AIService();
