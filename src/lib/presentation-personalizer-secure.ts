/**
 * Presentation Personalizer V3 - Secure Server-Side AI Personalization
 *
 * Calls Netlify Functions for AI personalization instead of exposing API keys client-side
 * All Anthropic API calls happen server-side for security
 */

import type { Client } from './types';

// Netlify Function endpoint
const PERSONALIZER_ENDPOINT = '/.netlify/functions/presentation-personalizer';

/**
 * Call Netlify Function with personalization action
 */
async function callPersonalizer(action: string, payload: any): Promise<any> {
  const response = await fetch(PERSONALIZER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.message || error.error || 'Personalization request failed');
  }

  return response.json();
}

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  backgroundStyle: string;
}

export interface BlueprintContent {
  selectedServices: Array<{
    name: string;
    reason: string;
    priority: number;
  }>;
  strategyRationale: string;
  implementationTimeline: Array<{
    phase: string;
    duration: string;
    activities: string[];
  }>;
  expectedOutcomes: string[];
}

export interface DiagnosticContent {
  competitorComparison: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    ourAdvantage: string;
  }>;
  marketGaps: string[];
  opportunityScore: number;
  recommendations: string[];
}

export interface IntroductionContent {
  opening: string;
  industryContext: string;
  valueProposition: string;
  credibilityBuilders: string[];
}

export interface CapabilitiesContent {
  capabilities: Array<{
    title: string;
    description: string;
    examples: string[];
  }>;
  whyNow: string;
  competitiveEdge: string;
}

export interface CaseStudiesContent {
  selectedCaseStudies: Array<{
    id: string;
    relevanceExplanation: string;
    keyTakeaway: string;
  }>;
  overviewText: string;
  callToAction: string;
}

export interface TheProblemContent {
  problemStatement: string;
  painPoints: Array<{
    title: string;
    description: string;
    costOfInaction: string;
  }>;
  urgency: string;
  industryStats: string[];
}

export interface WhyAIContent {
  mainReason: string;
  benefits: Array<{
    title: string;
    description: string;
    example: string;
  }>;
  competitiveImperative: string;
  roiPreview: string;
}

// =====================================================
// PERSONALIZATION FUNCTIONS
// =====================================================

/**
 * Personalize Hero slide content
 */
export async function personalizeHero(
  clientData: Client,
  companyIntelligence: any
): Promise<HeroContent> {
  try {
    const result = await callPersonalizer('personalizeHero', {
      clientData,
      companyIntelligence,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize hero:', error);
    throw error;
  }
}

/**
 * Personalize Blueprint slide content
 */
export async function personalizeBlueprint(
  clientData: Client,
  companyIntelligence: any,
  services: any[]
): Promise<BlueprintContent> {
  try {
    const result = await callPersonalizer('personalizeBlueprint', {
      clientData,
      companyIntelligence,
      services,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize blueprint:', error);
    throw error;
  }
}

/**
 * Personalize Diagnostic slide content
 */
export async function personalizeDiagnostic(
  clientData: Client,
  companyIntelligence: any,
  competitiveAnalysis: any
): Promise<DiagnosticContent> {
  try {
    const result = await callPersonalizer('personalizeDiagnostic', {
      clientData,
      companyIntelligence,
      competitiveAnalysis,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize diagnostic:', error);
    throw error;
  }
}

/**
 * Personalize Introduction slide content
 */
export async function personalizeIntroduction(
  clientData: Client,
  companyIntelligence: any
): Promise<IntroductionContent> {
  try {
    const result = await callPersonalizer('personalizeIntroduction', {
      clientData,
      companyIntelligence,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize introduction:', error);
    throw error;
  }
}

/**
 * Personalize Capabilities slide content
 */
export async function personalizeCapabilities(
  clientData: Client,
  companyIntelligence: any
): Promise<CapabilitiesContent> {
  try {
    const result = await callPersonalizer('personalizeCapabilities', {
      clientData,
      companyIntelligence,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize capabilities:', error);
    throw error;
  }
}

/**
 * Personalize Case Studies slide content
 */
export async function personalizeCaseStudies(
  clientData: Client,
  companyIntelligence: any,
  caseStudies: any[]
): Promise<CaseStudiesContent> {
  try {
    const result = await callPersonalizer('personalizeCaseStudies', {
      clientData,
      companyIntelligence,
      caseStudies,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize case studies:', error);
    throw error;
  }
}

/**
 * Personalize The Problem slide content
 */
export async function personalizeTheProblem(
  clientData: Client,
  companyIntelligence: any
): Promise<TheProblemContent> {
  try {
    const result = await callPersonalizer('personalizeTheProblem', {
      clientData,
      companyIntelligence,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize the problem:', error);
    throw error;
  }
}

/**
 * Personalize Why AI slide content
 */
export async function personalizeWhyAI(
  clientData: Client,
  companyIntelligence: any
): Promise<WhyAIContent> {
  try {
    const result = await callPersonalizer('personalizeWhyAI', {
      clientData,
      companyIntelligence,
    });
    return result;
  } catch (error) {
    console.error('Failed to personalize why AI:', error);
    throw error;
  }
}

/**
 * Check if personalization service is available
 */
export function isPersonalizationAvailable(): boolean {
  // In production, Netlify Functions are always available
  // In dev, check if running with Netlify CLI
  return true;
}
