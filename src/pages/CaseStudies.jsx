import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  X,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Target,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import { caseStudies, filterByIndustry } from "@/data/caseStudies";
import ScrollReveal from "@/components/ScrollReveal";
import TouchFeedback from "@/components/TouchFeedback";

/**
 * Case Studies Page - Industry-Filtered Success Stories
 *
 * Features:
 * - Shows 3-6 most relevant case studies based on client industry
 * - "Why This Matters" section personalized per case
 * - Expandable modal with full details
 * - Metrics visualization
 * - Services used display
 */

const CaseStudyCard = ({ caseStudy, client, index, onClick, relevanceNote }) => {
  return (
    <ScrollReveal animation="scale" delay={index * 0.1}>
      <TouchFeedback variant="card">
        <Card
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 hover:border-[#FF6A00]/50 transition-all duration-300 cursor-pointer overflow-hidden h-full group"
          onClick={onClick}
        >
          {/* Relevance badge */}
          {relevanceNote && (
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1 bg-[#FF6A00]/90 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                <Target className="w-3 h-3" />
                {relevanceNote}
              </div>
            </div>
          )}

          {/* Hero Image */}
          {caseStudy.heroImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={caseStudy.heroImage}
                alt={caseStudy.client}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] to-transparent" />

              {/* Logo overlay */}
              {caseStudy.logo && (
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <img
                    src={caseStudy.logo}
                    alt={`${caseStudy.client} logo`}
                    className="h-8 w-auto"
                  />
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            {/* Industry badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#FF6A00]" />
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                {caseStudy.industry}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all text-white">
              {caseStudy.client}
            </h3>

            {/* Overview */}
            <p className="text-sm text-white/80 leading-relaxed mb-4 line-clamp-2">
              {caseStudy.overview}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {caseStudy.results.slice(0, 4).map((result, i) => {
                const Icon = result.icon;
                return (
                  <div key={i} className="bg-white/5 rounded-xl p-3">
                    <Icon className="w-4 h-4 text-[#FF6A00] mb-1" />
                    <div className="text-lg font-bold text-white">
                      {result.value}
                    </div>
                    <div className="text-xs text-white/60">
                      {result.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "Why This Matters" - Personalized */}
            {client && (
              <div className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-[#FF6A00] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-white/90 leading-relaxed">
                    <span className="font-semibold text-[#FF6A00]">Why this matters: </span>
                    {caseStudy.industry === client.industry
                      ? `Direct industry match - similar challenges and solutions apply to ${client.name}.`
                      : `Transferable strategies that work across industries, including ${client.industry}.`
                    }
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#FF6A00] font-semibold">
                View Full Story
              </span>
              <ArrowRight className="w-4 h-4 text-[#FF6A00] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </TouchFeedback>
    </ScrollReveal>
  );
};

const CaseStudyModal = ({ caseStudy, onClose }) => {
  if (!caseStudy) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1E1E1E] to-[#0E0E0E] rounded-3xl border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Hero Image */}
          {caseStudy.heroImage && (
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img
                src={caseStudy.heroImage}
                alt={caseStudy.client}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/50 to-transparent" />

              {/* Logo */}
              {caseStudy.logo && (
                <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-2xl p-4">
                  <img
                    src={caseStudy.logo}
                    alt={`${caseStudy.client} logo`}
                    className="h-12 w-auto"
                  />
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                  {caseStudy.industry}
                </span>
              </div>

              <h2 className="text-4xl font-bold mb-4 gradient-text">
                {caseStudy.client}
              </h2>

              <p className="text-xl text-white/80 leading-relaxed">
                {caseStudy.overview}
              </p>
            </div>

            {/* Challenge */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF6A00]" />
                The Challenge
              </h3>
              <p className="text-white/80 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>

            {/* Approach */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FF6A00]" />
                Our Approach
              </h3>
              <p className="text-white/80 leading-relaxed">
                {caseStudy.approach}
              </p>
            </div>

            {/* Services Used */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Services Deployed
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {caseStudy.services.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3"
                    >
                      <div className="p-2 bg-[#FF6A00]/20 rounded-xl">
                        <Icon className="w-5 h-5 text-[#FF6A00]" />
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {service.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00FF00]" />
                The Results
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {caseStudy.results.map((result, i) => {
                  const Icon = result.icon;
                  return (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6"
                    >
                      <Icon className="w-8 h-8 text-[#FF6A00] mb-3" />
                      <div className="text-4xl font-bold gradient-text mb-2">
                        {result.value}
                      </div>
                      <div className="text-sm text-white/70">
                        {result.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial */}
            {caseStudy.testimonial && (
              <div className="bg-gradient-to-r from-[#FF6A00]/10 to-[#9B30FF]/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-6xl text-[#FF6A00]/30 leading-none">"</div>
                  <div>
                    <p className="text-lg text-white/90 italic leading-relaxed mb-3">
                      {caseStudy.testimonial}
                    </p>
                    <div className="text-sm text-white/60">
                      — {caseStudy.client}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function CaseStudies() {
  const navigate = useNavigate();
  const { client } = usePersonalizedPresentation();
  const [selectedCase, setSelectedCase] = useState(null);

  // Filter case studies by industry if client data available
  const relevantCaseStudies = useMemo(() => {
    if (client?.industry) {
      const filtered = filterByIndustry(client.industry, 6);
      // Add relevance notes
      return filtered.map((cs, idx) => ({
        ...cs,
        relevanceNote: idx === 0 && cs.industry === client.industry ? 'Industry Match' : null
      }));
    }
    // Fallback: show top 6 case studies
    return caseStudies.slice(0, 6);
  }, [client]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0E0E] via-[#1a0a0a] to-[#0E0E0E] text-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {client && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#FFD700]" />
                <span className="text-sm font-light text-white/60 uppercase tracking-wider">
                  {client.industry ? `Filtered for ${client.industry}` : `Curated for ${client.name}`}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Proven <span className="gradient-text">Results</span>
            </h1>

            {client ? (
              <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
                Real companies{client.industry && ` in ${client.industry}`} achieving extraordinary growth
                with our AI-powered systems. Here's what's possible for {client.name}.
              </p>
            ) : (
              <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
                Real companies achieving extraordinary growth with our AI-powered systems
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relevantCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard
                key={caseStudy.name}
                caseStudy={caseStudy}
                client={client}
                index={index}
                onClick={() => setSelectedCase(caseStudy)}
                relevanceNote={caseStudy.relevanceNote}
              />
            ))}
          </div>

          {/* See More Note */}
          {client && relevantCaseStudies.length < caseStudies.length && (
            <ScrollReveal animation="fade" delay={0.5}>
              <div className="mt-12 text-center">
                <div className="inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                  <p className="text-sm text-white/60">
                    Showing {relevantCaseStudies.length} of {caseStudies.length} case studies most relevant to {client.industry || 'your business'}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.3}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-30" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                <CheckCircle className="w-16 h-16 text-[#00FF00] mx-auto mb-6" />

                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to See Your Custom Strategy?
                </h3>

                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  {client
                    ? `Now that you've seen what's possible, let's build a custom 90-day blueprint
                      specifically for ${client.name} that combines these proven strategies.`
                    : 'Now that you\'ve seen what\'s possible, let\'s build your custom 90-day blueprint.'
                  }
                </p>

                <TouchFeedback variant="button">
                  <Button
                    onClick={() => navigate(createPageUrl("Blueprint"))}
                    className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl"
                    size="lg"
                  >
                    {client ? `Build ${client.name}'s Blueprint` : 'Build Your Blueprint'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </TouchFeedback>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Case Study Modal */}
      <CaseStudyModal
        caseStudy={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
}
