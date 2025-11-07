import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  Target,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

import CompetitorCard from "../components/diagnostic/CompetitorCard";
import StrengthWeaknessGrid from "../components/diagnostic/StrengthWeaknessGrid";
import OpportunitiesSection from "../components/diagnostic/OpportunitiesSection";
import ScrollReveal from "@/components/ScrollReveal";
import TouchFeedback from "@/components/TouchFeedback";

export default function Diagnostic() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  // Use new personalized presentation hook (Supabase-based)
  const { client: activeClient, personalization, isLoading } = usePersonalizedPresentation();

  // Map new data structure to component expectations
  const diagnosticData = {
    // Map potential_competitors array to competitor objects
    competitors: activeClient?.potential_competitors?.map(name => ({
      name,
      strengths: `Established market presence and brand recognition in the ${activeClient.industry || 'industry'}`,
      website: null, // We don't have competitor websites in our data yet
    })) || [],

    // Use strengths directly, or fallback to competitive_advantages
    strengths: activeClient?.strengths || activeClient?.competitive_advantages || [],

    // Generate weaknesses from opportunities (opportunities indicate gaps)
    weaknesses: activeClient?.opportunities?.map(opp =>
      `Gap identified: ${opp}`
    ) || ['Limited automation', 'Manual processes'],

    // Use opportunities directly
    opportunities: activeClient?.opportunities || [],
  };

  // Check if we have any diagnostic data
  const hasData = diagnosticData.competitors.length > 0 ||
                  diagnosticData.strengths.length > 0 ||
                  diagnosticData.opportunities.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0E0E] via-[#1a0a0a] to-[#0E0E0E] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            {activeClient?.name || "Your Business"} -{" "}
            <span className="gradient-text">Competitive Analysis</span>
          </h1>
          <p className="text-xl font-light text-white/80 max-w-3xl mx-auto">
            Our AI has analyzed your competitive landscape and identified opportunities for growth
          </p>

          {/* Industry Badge */}
          {activeClient?.industry && (
            <div className="mt-6 inline-block px-6 py-2 bg-white/5 border border-white/10 rounded-full">
              <span className="text-sm text-white/70">
                {activeClient.industry}
                {activeClient.sub_industry && ` • ${activeClient.sub_industry}`}
              </span>
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <Card className="bg-[#1E1E1E] border-white/10 p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-[#FF6A00] animate-spin" />
            <h3 className="text-2xl font-bold mb-4 text-white">Loading Analysis...</h3>
            <p className="text-lg text-white/80">
              Fetching your comprehensive business intelligence data
            </p>
          </Card>
        ) : hasData ? (
          <div className="space-y-6">
            {/* Market Position Card (NEW - Phase 3) */}
            {activeClient?.market_position && (
              <ScrollReveal animation="slideUp" delay={0}>
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#FFD700]/20 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold gradient-text mb-3">
                        Market Position
                      </h2>
                      <p className="text-white/80 leading-relaxed">
                        {activeClient.market_position}
                      </p>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            )}

            {/* Website Quality & SEO Card (NEW - Phase 3) */}
            <ScrollReveal animation="slideUp" delay={0.1}>
              <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-[#9B30FF]/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-[#9B30FF]" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text">
                    Digital Presence Analysis
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {/* Website Quality */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl font-bold text-[#FF6A00]">
                        {activeClient?.website_quality || 7}/10
                      </div>
                      <div className="text-sm text-white/60">
                        Website Quality Score
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                      <div
                        className="bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(activeClient?.website_quality || 7) * 10}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Based on automated analysis of design, performance, and content quality
                    </p>
                  </div>

                  {/* SEO Indicators */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-2">
                      SEO Status
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {activeClient?.seo_indicators || 'SEO analysis in progress. Recommend comprehensive audit to identify optimization opportunities.'}
                    </p>
                    {activeClient?.has_blog && (
                      <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active blog detected</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </ScrollReveal>

            {/* Competitive Advantages (NEW - Phase 3) */}
            {activeClient?.competitive_advantages?.length > 0 && (
              <ScrollReveal animation="slideUp" delay={0.15}>
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Target className="w-6 h-6 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold gradient-text">
                      Your Competitive Advantages
                    </h2>
                  </div>
                  <ul className="space-y-3 mt-6">
                    {activeClient.competitive_advantages.map((advantage, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </ScrollReveal>
            )}

            {/* Competitors Section */}
            {diagnosticData.competitors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <TouchFeedback variant="card">
                  <Card
                    className="bg-[#1E1E1E] border-white/10 cursor-pointer hover:border-white/30 transition-all"
                    onClick={() => setExpandedSection(expandedSection === 'competitors' ? null : 'competitors')}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold gradient-text">
                          Key Competitors in {activeClient?.industry || 'Your Market'}
                        </h2>
                        {expandedSection === 'competitors' ? (
                          <ChevronUp className="w-6 h-6 text-white" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {expandedSection === 'competitors' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="grid md:grid-cols-2 gap-4"
                        >
                          {diagnosticData.competitors.map((competitor, index) => (
                            <CompetitorCard key={index} competitor={competitor} />
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </TouchFeedback>
              </motion.div>
            )}

            {/* Strengths & Weaknesses Section */}
            {(diagnosticData.strengths.length > 0 || diagnosticData.weaknesses.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <TouchFeedback variant="card">
                  <Card
                    className="bg-[#1E1E1E] border-white/10 cursor-pointer hover:border-white/30 transition-all"
                    onClick={() => setExpandedSection(expandedSection === 'analysis' ? null : 'analysis')}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold gradient-text">
                          Your Strengths & Areas for Improvement
                        </h2>
                        {expandedSection === 'analysis' ? (
                          <ChevronUp className="w-6 h-6 text-white" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {expandedSection === 'analysis' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <StrengthWeaknessGrid
                            strengths={diagnosticData.strengths}
                            weaknesses={diagnosticData.weaknesses}
                          />
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </TouchFeedback>
              </motion.div>
            )}

            {/* Opportunities Section */}
            {diagnosticData.opportunities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <TouchFeedback variant="card">
                  <Card
                    className="bg-[#1E1E1E] border-white/10 cursor-pointer hover:border-white/30 transition-all"
                    onClick={() => setExpandedSection(expandedSection === 'opportunities' ? null : 'opportunities')}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold gradient-text">
                          AI-Driven Growth Opportunities
                        </h2>
                        {expandedSection === 'opportunities' ? (
                          <ChevronUp className="w-6 h-6 text-white" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {expandedSection === 'opportunities' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <OpportunitiesSection
                            opportunities={diagnosticData.opportunities}
                          />
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </TouchFeedback>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex justify-center"
            >
              <TouchFeedback variant="button">
                <Button
                  onClick={() => navigate(createPageUrl("CaseStudies"))}
                  className="gradient-accent hover-glow text-white font-bold text-lg px-8 py-6 rounded-xl"
                  size="lg"
                >
                  See Our Proven Results
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </TouchFeedback>
            </motion.div>
          </div>
        ) : (
          <Card className="bg-[#1E1E1E] border-white/10 p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-[#FF6A00] animate-spin" />
            <h3 className="text-2xl font-bold mb-4 text-white">Analyzing Your Business...</h3>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Our AI is gathering comprehensive intelligence about your business, competitors, and market position.
              This typically takes 30-60 seconds. The analysis will appear automatically once complete.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
