import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Target,
  TrendingUp,
  Zap,
  CheckCircle,
  DollarSign,
  Clock,
  Sparkles,
  ChevronRight,
  LineChart,
  Rocket,
  Users,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import { services, scoreServiceRelevance } from "@/data/services";
import ScrollReveal from "@/components/ScrollReveal";
import TouchFeedback from "@/components/TouchFeedback";

/**
 * Blueprint Page - Custom 30/60/90 Day Strategy Roadmap
 *
 * Features:
 * - AI-selected 3-5 marketing mechanisms based on client intelligence
 * - Interactive 30/60/90 day timeline visualization
 * - ROI projections by industry and company size
 * - Custom strategy rationale explaining the approach
 */

// ROI calculation engine based on industry and company size
const calculateROI = (client, selectedMechanisms) => {
  if (!client) return { low: 200, high: 400, breakeven: 60 };

  // Base ROI by industry (percentage)
  const industryROI = {
    'Healthcare': { low: 250, high: 450, breakeven: 45 },
    'Financial': { low: 300, high: 500, breakeven: 30 },
    'Construction': { low: 220, high: 380, breakeven: 60 },
    'Professional Services': { low: 280, high: 420, breakeven: 50 },
    'E-commerce': { low: 350, high: 550, breakeven: 40 },
    'Technology': { low: 400, high: 600, breakeven: 35 },
    'default': { low: 250, high: 400, breakeven: 50 }
  };

  const baseROI = industryROI[client.industry] || industryROI['default'];

  // Boost based on number of mechanisms (synergy effect)
  const mechanismBoost = selectedMechanisms.length * 0.15; // 15% boost per mechanism

  return {
    low: Math.round(baseROI.low * (1 + mechanismBoost)),
    high: Math.round(baseROI.high * (1 + mechanismBoost)),
    breakeven: Math.max(15, Math.round(baseROI.breakeven / (1 + mechanismBoost)))
  };
};

// Select 3-5 mechanisms based on client intelligence
const selectMechanisms = (client) => {
  if (!client) {
    // Fallback: return top 4 default mechanisms
    return services.slice(0, 4);
  }

  // Score all services and get top 4-5
  const scoredServices = services.map(service => ({
    ...service,
    relevanceScore: scoreServiceRelevance(service, client)
  }));

  // Sort by relevance
  scoredServices.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Get top 4-5 based on total score
  const topScore = scoredServices[0]?.relevanceScore || 100;
  const mechanisms = scoredServices.filter(s => s.relevanceScore >= topScore * 0.6).slice(0, 5);

  // Ensure we have at least 3
  return mechanisms.length >= 3 ? mechanisms : scoredServices.slice(0, 4);
};

// Generate strategy rationale
const generateStrategyRationale = (client, mechanisms) => {
  if (!client) {
    return "This custom strategy combines proven marketing mechanisms designed to drive measurable growth. Each component works in synergy to maximize your ROI and accelerate results.";
  }

  const industryContext = client.industry ? `for ${client.industry} companies like ${client.name}` : `for companies like ${client.name}`;
  const mechanismList = mechanisms.map(m => m.title.toLowerCase()).join(', ');

  return `Based on our analysis of ${client.name}, we've designed a custom strategy ${industryContext}. This roadmap combines ${mechanisms.length} high-impact mechanisms (${mechanismList}) that address your specific market opportunities and competitive challenges. Each phase builds on the previous one to create compound growth effects.`;
};

// Timeline data generator
const generateTimeline = (mechanisms, client) => {
  const timeline = {
    30: {
      title: "Foundation Phase",
      subtitle: "Days 1-30",
      icon: Rocket,
      color: "#FF6A00",
      objectives: [],
      deliverables: [],
      kpis: []
    },
    60: {
      title: "Momentum Phase",
      subtitle: "Days 31-60",
      icon: TrendingUp,
      color: "#9B30FF",
      objectives: [],
      deliverables: [],
      kpis: []
    },
    90: {
      title: "Scale Phase",
      subtitle: "Days 61-90",
      icon: Award,
      color: "#00FF88",
      objectives: [],
      deliverables: [],
      kpis: []
    }
  };

  // Populate based on selected mechanisms
  mechanisms.forEach((mechanism, idx) => {
    if (idx === 0 || idx === 1) {
      // First 2 mechanisms start in 30-day phase
      timeline[30].objectives.push(`Launch ${mechanism.title}`);
      timeline[30].deliverables.push(`${mechanism.title} infrastructure and initial campaigns`);
      timeline[60].kpis.push(`${mechanism.title} optimization and scaling`);
    } else if (idx === 2 || idx === 3) {
      // Next mechanisms in 60-day phase
      timeline[60].objectives.push(`Deploy ${mechanism.title}`);
      timeline[60].deliverables.push(`${mechanism.title} integration and activation`);
      timeline[90].kpis.push(`${mechanism.title} performance at scale`);
    } else {
      // Final mechanism in 90-day phase
      timeline[90].objectives.push(`Activate ${mechanism.title}`);
      timeline[90].deliverables.push(`${mechanism.title} full deployment`);
    }
  });

  // Add standard objectives
  timeline[30].objectives.unshift("Complete onboarding and discovery");
  timeline[30].objectives.push("Establish baseline metrics");
  timeline[30].kpis = ["Website traffic baseline", "Lead flow baseline", "Conversion rate baseline"];

  timeline[60].objectives.push("Optimize high-performing campaigns");
  timeline[60].kpis.unshift("50-100% increase in qualified leads");
  timeline[60].kpis.push("15-25% improvement in conversion rates");

  timeline[90].objectives.push("Full system optimization");
  timeline[90].deliverables.push("Complete analytics dashboard");
  timeline[90].deliverables.push("Quarterly strategy review");
  timeline[90].kpis.unshift("150-300% ROI achievement");
  timeline[90].kpis.push("Sustainable growth trajectory established");

  return timeline;
};

// Mechanism Card Component
const MechanismCard = ({ mechanism, index, client }) => {
  const Icon = mechanism.icon;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <ScrollReveal animation="slideUp" delay={index * 0.1}>
      <motion.div layout className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" />

        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 hover:border-[#FF6A00]/50 transition-all duration-300 overflow-hidden">
          {/* Relevance badge */}
          {mechanism.relevanceScore > 70 && (
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1 bg-[#00FF88]/90 rounded-full text-xs font-semibold text-black flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Top Match
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Icon & Title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative inline-block flex-shrink-0">
                <div className="absolute inset-0 bg-[#FF6A00]/20 blur-xl" />
                <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Icon className="w-8 h-8 text-[#FF6A00]" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {mechanism.title}
                </h3>
                <p className="text-sm text-white/60">
                  {mechanism.hook}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white/5 rounded-xl p-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                {mechanism.metrics.slice(0, 2).map((metric, i) => (
                  <div key={i}>
                    <div className="text-lg font-bold gradient-text">
                      {metric.value}
                    </div>
                    <div className="text-xs text-white/60">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle Details */}
            <TouchFeedback variant="button">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300"
              >
                <span className="text-sm font-semibold text-white">
                  {showDetails ? 'Hide Details' : 'Why This Mechanism?'}
                </span>
                <ChevronRight className={`w-4 h-4 text-white transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
              </button>
            </TouchFeedback>

            {/* Expanded Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/80 mb-3 leading-relaxed">
                      {mechanism.fullDescription}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Key Benefits:
                      </h4>
                      {mechanism.benefits.slice(0, 3).map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-[#00FF88] flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-white/70">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

// Timeline Phase Component
const TimelinePhase = ({ phase, data, index }) => {
  const Icon = data.icon;
  const isActive = index === 0;

  return (
    <ScrollReveal animation="slideUp" delay={index * 0.2}>
      <div className="relative">
        {/* Connector line (except for last item) */}
        {index < 2 && (
          <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0" />
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 hover:border-[#FF6A00]/50 transition-all duration-300 p-6 z-10"
        >
          {/* Phase Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 blur-xl opacity-50" style={{ backgroundColor: data.color }} />
              <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Icon className="w-8 h-8" style={{ color: data.color }} />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                {data.title}
              </h3>
              <p className="text-sm text-white/60">
                {data.subtitle}
              </p>
            </div>
          </div>

          {/* Objectives */}
          {data.objectives.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Objectives:
              </h4>
              <ul className="space-y-1.5">
                {data.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <Target className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: data.color }} />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deliverables */}
          {data.deliverables.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Deliverables:
              </h4>
              <ul className="space-y-1.5">
                {data.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* KPIs */}
          {data.kpis.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Success Metrics:
              </h4>
              <ul className="space-y-1.5">
                {data.kpis.map((kpi, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <LineChart className="w-3.5 h-3.5 text-[#9B30FF] flex-shrink-0 mt-0.5" />
                    <span>{kpi}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </ScrollReveal>
  );
};

export default function Blueprint() {
  const navigate = useNavigate();
  const { client } = usePersonalizedPresentation();

  // AI-select mechanisms based on client intelligence
  const selectedMechanisms = useMemo(() => {
    return selectMechanisms(client);
  }, [client]);

  // Generate timeline
  const timeline = useMemo(() => {
    return generateTimeline(selectedMechanisms, client);
  }, [selectedMechanisms, client]);

  // Calculate ROI
  const roi = useMemo(() => {
    return calculateROI(client, selectedMechanisms);
  }, [client, selectedMechanisms]);

  // Strategy rationale
  const rationale = useMemo(() => {
    return generateStrategyRationale(client, selectedMechanisms);
  }, [client, selectedMechanisms]);

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
                  Custom Strategy for {client.name}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Your <span className="gradient-text">90-Day Blueprint</span>
            </h1>

            <p className="text-xl md:text-2xl font-light text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
              {rationale}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFD700]" />
                <span className="text-sm text-white/70">
                  <span className="font-bold text-white">{selectedMechanisms.length}</span> Marketing Mechanisms
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF6A00]" />
                <span className="text-sm text-white/70">
                  <span className="font-bold text-white">90-Day</span> Deployment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00FF88]" />
                <span className="text-sm text-white/70">
                  <span className="font-bold text-white">{roi.low}-{roi.high}%</span> Expected ROI
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI Projection Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="scale" delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-20" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Expected <span className="gradient-text">ROI Projection</span>
                  </h2>
                  <p className="text-white/70 text-lg">
                    Based on {client?.industry || 'industry'} benchmarks and historical performance data
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Breakeven Timeline */}
                  <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-[#FFD700]" />
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {roi.breakeven} Days
                    </div>
                    <div className="text-sm text-white/60">
                      Expected Breakeven
                    </div>
                  </div>

                  {/* Conservative ROI */}
                  <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-[#FF6A00]" />
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {roi.low}%
                    </div>
                    <div className="text-sm text-white/60">
                      Conservative Return
                    </div>
                  </div>

                  {/* Optimistic ROI */}
                  <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-[#00FF88]" />
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {roi.high}%
                    </div>
                    <div className="text-sm text-white/60">
                      Optimistic Return
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-white/50 mt-6">
                  ROI projections based on 150+ client campaigns. Actual results may vary based on execution and market conditions.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Selected Mechanisms Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade" delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your <span className="gradient-text">Marketing Arsenal</span>
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                {selectedMechanisms.length} mechanisms selected based on your industry, opportunities, and competitive landscape
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {selectedMechanisms.map((mechanism, index) => (
              <MechanismCard
                key={mechanism.id}
                mechanism={mechanism}
                index={index}
                client={client}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 30/60/90 Timeline Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade" delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">30/60/90 Day</span> Roadmap
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                A clear, phased approach to deploying your marketing strategy and achieving measurable results
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <TimelinePhase phase={30} data={timeline[30]} index={0} />
            <TimelinePhase phase={60} data={timeline[60]} index={1} />
            <TimelinePhase phase={90} data={timeline[90]} index={2} />
          </div>
        </div>
      </section>

      {/* Why This Strategy Works */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#9B30FF] to-[#FF6A00] rounded-3xl blur-xl opacity-20" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex items-start gap-4 mb-6">
                  <Sparkles className="w-8 h-8 text-[#FFD700] flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      Why This Strategy Works {client ? `for ${client.name}` : ''}
                    </h3>
                    <div className="space-y-3 text-white/80 leading-relaxed">
                      <p>
                        <strong className="text-white">Phased Deployment:</strong> We don't try to do everything at once. Each 30-day phase builds on the previous one, allowing us to optimize as we scale.
                      </p>
                      <p>
                        <strong className="text-white">Synergy Effects:</strong> These {selectedMechanisms.length} mechanisms work together, not in isolation. SEO feeds your paid ads. Lead generation fills your CRM. Social proof amplifies everything.
                      </p>
                      <p>
                        <strong className="text-white">Data-Driven Optimization:</strong> We track every metric from day one. By day 30, we know what's working. By day 60, we're scaling winners. By day 90, you have a repeatable growth system.
                      </p>
                      {client?.industry && (
                        <p>
                          <strong className="text-white">Industry-Specific Expertise:</strong> These mechanisms have been proven in {client.industry} with companies similar to {client.name}. We're not experimenting—we're executing what works.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-xl p-4 mt-6">
                  <p className="text-sm text-white/90">
                    <span className="font-bold text-[#FF6A00]">The Bottom Line:</span> This isn't a generic marketing plan. It's a custom blueprint designed specifically {client ? `for ${client.name}'s` : 'for your'} market position, competitive landscape, and growth goals. Every mechanism, every timeline, every metric is intentional.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.3}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-30" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                <CheckCircle className="w-16 h-16 text-[#00FF88] mx-auto mb-6" />

                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to See Your Investment Options?
                </h3>

                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  {client
                    ? `Now that you've seen your custom 90-day strategy, let's discuss the investment tiers designed for ${client.industry || 'your industry'} companies.`
                    : `Now that you've seen the strategy, let's explore the investment tiers and find the perfect fit for your budget and goals.`
                  }
                </p>

                <TouchFeedback variant="button">
                  <Button
                    onClick={() => navigate(createPageUrl("Pricing"))}
                    className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl"
                    size="lg"
                  >
                    View Pricing & Packages
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </TouchFeedback>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
