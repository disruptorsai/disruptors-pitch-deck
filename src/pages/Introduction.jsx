import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Loader2,
  Users,
  TrendingUp,
  Target,
  Award,
  Play,
  CheckCircle
} from "lucide-react";
import { generateIntroContent } from "@/lib/presentation-personalizer";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import { ClientLogo } from "@/components/branding/ClientLogo";
import GoogleReviewsSection from "@/components/shared/GoogleReviewsSection";
import ScrollReveal from "@/components/ScrollReveal";
import TouchFeedback from "@/components/TouchFeedback";

const StatCard = ({ icon: Icon, value, label, delay = 0 }) => (
  <ScrollReveal animation="scale" delay={delay}>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" />

      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-[#FF6A00]/50 transition-all duration-300 text-center">
        <Icon className="w-10 h-10 mx-auto mb-3 text-[#FF6A00]" />
        <div className="text-3xl font-bold mb-1 gradient-text">
          {value}
        </div>
        <div className="text-sm text-white/60">
          {label}
        </div>
      </div>
    </div>
  </ScrollReveal>
);

const ValueCard = ({ title, description, icon: Icon, delay = 0 }) => (
  <ScrollReveal animation="slideUp" delay={delay}>
    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#FF6A00]/20 rounded-xl flex-shrink-0">
          <Icon className="w-6 h-6 text-[#FF6A00]" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
          <p className="text-white/70 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

export default function Introduction() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Use personalized presentation hook
  const { client: activeClient, personalization, isLoading: isPersonalizing } = usePersonalizedPresentation();

  // Generate personalized content when client loads
  useEffect(() => {
    if (activeClient && !personalizedContent && !isGenerating) {
      setIsGenerating(true);
      generateIntroContent(activeClient)
        .then((content) => {
          setPersonalizedContent(content);
          setIsGenerating(false);
        })
        .catch((error) => {
          console.error('Failed to generate personalized content:', error);
          setIsGenerating(false);
        });
    }
  }, [activeClient, personalizedContent, isGenerating]);

  // Show button after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Default sections (fallback if no personalization)
  const defaultSections = [
    {
      title: "Our Story",
      content: "Disruptors Media began as a marketing company built on creativity and strategy. As AI reshaped marketing in 2023, we evolved - merging human intuition with machine precision to design systems that amplify performance and scalability. We don't just adapt to change; we architect it."
    },
    {
      title: "Our Philosophy",
      content: "AI isn't here to replace people - it's here to amplify them. Our mission is to scale human connection by freeing businesses from repetitive work while increasing profit and productivity. Leverage is the ultimate goal: achieving greater output with less effort, time, and cost. When you work with us, you're not just hiring an agency - you're partnering with architects of intelligent systems."
    },
    {
      title: "Our Mission",
      content: "We empower businesses with AI leverage - building systems that multiply efficiency, profitability, and creativity. From automated workflows to predictive analytics, every solution we create is designed to give you an unfair advantage. When human creativity meets machine precision, disruption becomes inevitable."
    }
  ];

  // Personalized sections based on client intelligence
  const getPersonalizedSections = () => {
    if (!activeClient || !personalizedContent) return defaultSections;

    return [
      {
        title: `Why ${activeClient.name}?`,
        content: personalizedContent.openingStatement,
        personalized: true
      },
      {
        title: "Our Philosophy",
        content: `AI isn't here to replace people - it's here to amplify them. In the ${activeClient.industry || 'business'} industry, this means freeing your team from repetitive tasks while increasing profit and productivity. We partner with ${activeClient.industry || 'industry'} leaders like ${activeClient.name} to architect intelligent systems that deliver measurable results.`,
        personalized: true
      },
      {
        title: "What We'll Cover",
        content: `In this presentation, we'll show you how AI automation can transform ${activeClient.name}'s operations. We've analyzed your competitive landscape${activeClient.potential_competitors && activeClient.potential_competitors.length > 0 ? ` (including ${activeClient.potential_competitors.slice(0, 2).join(' and ')})` : ''} and identified specific opportunities where AI can give you an unfair advantage. From automated workflows to predictive analytics, every solution is tailored to your business.`,
        personalized: true
      }
    ];
  };

  const sections = getPersonalizedSections();

  // Company stats
  const stats = [
    { icon: Users, value: "150+", label: "Clients Served" },
    { icon: TrendingUp, value: "327%", label: "Average ROI" },
    { icon: Target, value: "98%", label: "Client Satisfaction" },
    { icon: Award, value: "5+ Years", label: "Experience" },
  ];

  // Core values
  const values = [
    {
      icon: Sparkles,
      title: "AI-First Approach",
      description: "We don't just use AI tools - we architect complete intelligent systems that transform your entire marketing operation."
    },
    {
      icon: Target,
      title: "Data-Driven Results",
      description: "Every decision backed by data. Every campaign optimized for measurable ROI. No guesswork, just proven performance."
    },
    {
      icon: Users,
      title: "True Partnership",
      description: "We're not just vendors - we're your growth partners. Your success is our success, and we're invested in your long-term growth."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0E0E] via-[#1a0a0a] to-[#0E0E0E] text-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF6A00]" />
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  Personalizing Your Presentation...
                </h1>
              </div>
            ) : personalizedContent ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-[#FFD700]" />
                  <span className="text-sm font-light text-white/60 uppercase tracking-wider">
                    AI-Personalized for {activeClient?.name}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                  <span className="gradient-text">{personalizedContent.headline}</span>
                </h1>
                <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
                  {personalizedContent.subheadline}
                </p>
                {activeClient?.industry && (
                  <div className="mt-6 inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-sm text-white/70">
                      {activeClient.industry}
                      {activeClient.sub_industry && ` • ${activeClient.sub_industry}`}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                  Meet <span className="gradient-text">Disruptors Media</span>
                </h1>
                <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto">
                  Your Partners in AI-Powered Marketing Excellence
                </p>
              </>
            )}
          </motion.div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} delay={index * 0.1} />
            ))}
          </div>

          {/* Technology Stack Section (NEW) */}
          {activeClient?.technologies_detected?.length > 0 && (
            <ScrollReveal animation="slideUp" delay={0.2}>
              <div className="mb-12 p-6 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  Your Current Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeClient.technologies_detected.slice(0, 8).map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#9B30FF]/20 border border-[#9B30FF]/30 rounded-lg text-sm text-white hover:bg-[#9B30FF]/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {activeClient.cms && (
                    <span className="px-3 py-1.5 bg-[#FF6A00]/30 border border-[#FF6A00]/40 rounded-lg text-sm text-white font-semibold">
                      CMS: {activeClient.cms}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/50 mt-3">
                  We've identified your tech stack to ensure seamless integration with our AI solutions
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* Target Market Section (NEW) */}
          {activeClient?.target_market && (
            <ScrollReveal animation="slideUp" delay={0.3}>
              <div className="mb-12 p-6 bg-gradient-to-br from-[#FF6A00]/10 to-[#9B30FF]/10 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#FF6A00]" />
                  Your Target Market
                </h4>
                <p className="text-white/80 leading-relaxed">
                  {activeClient.target_market}
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.2}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-20" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-4 border border-white/20 overflow-hidden">
                <div className="aspect-video relative bg-black/50 rounded-2xl overflow-hidden">
                  {!videoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <TouchFeedback variant="button">
                          <button
                            onClick={() => setVideoPlaying(true)}
                            className="group relative"
                          >
                            <div className="absolute -inset-4 bg-[#FF6A00]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
                            <div className="relative w-20 h-20 bg-gradient-to-br from-[#FF6A00] to-[#9B30FF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Play className="w-10 h-10 text-white ml-1" fill="white" />
                            </div>
                          </button>
                        </TouchFeedback>
                        <p className="mt-6 text-white/70 text-lg">
                          Watch our 2-minute introduction
                        </p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Disruptors Media Introduction"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <p className="text-center text-sm text-white/50 mt-4 font-light">
                  Meet the team behind your AI transformation
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade" delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Companies Choose Disruptors
              </h2>
              <p className="text-xl text-white/70">
                We're different from traditional agencies. Here's how.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} delay={index * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* Expandable Sections */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4 mb-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              >
                <TouchFeedback variant="card">
                  <Card
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => setExpandedSection(expandedSection === index ? -1 : index)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold gradient-text">
                            {section.title}
                          </h3>
                          {section.personalized && (
                            <Sparkles className="w-4 h-4 text-[#FFD700]" />
                          )}
                        </div>
                        {expandedSection === index ? (
                          <ChevronUp className="w-6 h-6 text-white" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {expandedSection === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <p className="text-lg font-light leading-relaxed text-white/90">
                            {section.content}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </TouchFeedback>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-12">
        <GoogleReviewsSection />
      </section>

      {/* CTA Button */}
      {showButton && (
        <section className="py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-30" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                <CheckCircle className="w-16 h-16 text-[#00FF00] mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Ready to See How This Applies to {activeClient?.name || 'Your Business'}?
                </h3>
                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                  Next, we'll show you our competitive intelligence analysis and reveal specific opportunities we've identified for your market.
                </p>

                <TouchFeedback variant="button">
                  <Button
                    onClick={() => navigate(createPageUrl("Diagnostic"))}
                    className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl"
                    size="lg"
                  >
                    {activeClient?.name
                      ? `See ${activeClient.name}'s Competitive Analysis`
                      : "See Your Competitive Analysis"
                    }
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </TouchFeedback>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
