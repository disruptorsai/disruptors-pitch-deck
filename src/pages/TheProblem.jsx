import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, TrendingDown, DollarSign, Clock, Target, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { usePersonalizedPresentation } from '@/hooks/use-personalized-presentation';
import TouchFeedback from '@/components/TouchFeedback';
import ScrollReveal from '@/components/ScrollReveal';

/**
 * The Problem Page
 * Establishes pain points and creates urgency before presenting AI as the solution
 *
 * Content Strategy:
 * - Industry-specific crisis messaging
 * - Shocking stats with animated counters
 * - Split-screen "Old Way" vs "New Way" visual
 * - Competitive urgency based on client intelligence
 */

const AnimatedCounter = ({ value, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^\d]/g, ''));
  const isNegative = value.includes('-');
  const prefix = value.match(/[+\-]/)?.[0] || '';

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * numericValue);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [numericValue, duration]);

  return (
    <span className={isNegative ? 'text-red-400' : 'text-[#FF6A00]'}>
      {prefix}{count}{suffix}
    </span>
  );
};

const StatCard = ({ icon: Icon, stat, description, delay = 0 }) => (
  <ScrollReveal animation="scale" delay={delay}>
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />

      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Icon className="w-8 h-8 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-4xl font-bold mb-2">
              {stat}
            </div>
            <p className="text-white/70 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

const ComparisonCard = ({ title, items, type = 'old' }) => {
  const bgColor = type === 'old' ? 'from-red-500/10 to-red-500/5' : 'from-green-500/10 to-green-500/5';
  const borderColor = type === 'old' ? 'border-red-500/30' : 'border-green-500/30';
  const iconColor = type === 'old' ? 'text-red-400' : 'text-green-400';

  return (
    <div className={`bg-gradient-to-br ${bgColor} backdrop-blur-md rounded-2xl p-8 border ${borderColor} h-full`}>
      <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: type === 'old' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start gap-3"
          >
            <div className={`mt-1 ${iconColor}`}>
              {type === 'old' ? '×' : '✓'}
            </div>
            <span className="text-white/80">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default function TheProblem() {
  const navigate = useNavigate();
  const { client, personalization } = usePersonalizedPresentation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Personalized content based on client intelligence
  const industry = client?.industry || 'Marketing';
  const competitors = client?.potential_competitors || [];
  const topCompetitor = competitors[0] || 'your competitors';

  // Industry-specific stats (fallback to generic if not personalized)
  const industryStats = {
    'Healthcare': [
      { icon: DollarSign, stat: <><AnimatedCounter value="87" />%</>, description: "of healthcare marketing budgets are wasted on ineffective campaigns" },
      { icon: Clock, stat: <><AnimatedCounter value="23" /> hrs</>, description: "wasted per week on manual marketing tasks" },
      { icon: TrendingDown, stat: <><AnimatedCounter value="-45" />%</>, description: "lower ROI from traditional marketing approaches" },
    ],
    'default': [
      { icon: DollarSign, stat: <><AnimatedCounter value="63" />%</>, description: "of marketing budgets are wasted on unqualified leads" },
      { icon: Clock, stat: <><AnimatedCounter value="15" /> hrs</>, description: "wasted per week on manual, repetitive marketing tasks" },
      { icon: TrendingDown, stat: <><AnimatedCounter value="-52" />%</>, description: "lower conversion rates compared to AI-optimized campaigns" },
    ],
  };

  const stats = industryStats[industry] || industryStats.default;

  const oldWayItems = [
    "Manual content creation taking 10+ hours per week",
    "Guessing which marketing channels will work",
    "Wasting ad spend on unqualified audiences",
    "Slow response times losing hot leads",
    "Inconsistent follow-up killing conversions",
    "No data-driven decision making"
  ];

  const newWayItems = [
    "AI generates optimized content in minutes",
    "Data reveals exactly where to invest",
    "Precision targeting captures ideal customers",
    "Instant automated responses never miss a lead",
    "Systematic nurture sequences close more deals",
    "Real-time analytics guide every decision"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0E0E] via-[#1a0a0a] to-[#0E0E0E] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300">Industry Alert</span>
            </div>

            {/* Headline - Personalized if client data available */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              The <span className="gradient-text">{industry}</span>
              <br />
              Marketing Crisis
            </h1>

            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              While you're reading this, <span className="text-[#FF6A00] font-semibold">{topCompetitor}</span> is deploying AI
              to capture your market share. Here's what's broken in traditional marketing...
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} delay={index * 0.2} />
            ))}
          </div>

          {/* The Old vs New Comparison */}
          <ScrollReveal animation="fade" delay={0.3}>
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Marketing Divide
              </h2>
              <p className="text-xl text-white/70">
                Two paths. One future. Which side are you on?
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <ComparisonCard
              title="❌ The Old Way (Manual)"
              items={oldWayItems}
              type="old"
            />
            <ComparisonCard
              title="✅ The AI Way (Automated)"
              items={newWayItems}
              type="new"
            />
          </div>

          {/* Urgency Section */}
          <ScrollReveal animation="scale" delay={0.2}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-30" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-[#FFD700]" />
                  <h3 className="text-3xl font-bold">The Competitive Reality</h3>
                </div>

                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Companies using AI-powered marketing are seeing <span className="text-[#FF6A00] font-bold">3.5× ROI</span> compared
                  to traditional methods. Every day you wait, {topCompetitor} gains ground.
                </p>

                {client && competitors.length > 0 && (
                  <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-sm text-white/60 mb-2">Your competitive landscape:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {competitors.slice(0, 3).map((competitor, index) => (
                        <div key={index} className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-sm">
                          {competitor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <TouchFeedback variant="button">
                  <Button
                    onClick={() => navigate(createPageUrl("WhyAI"))}
                    className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl"
                    size="lg"
                  >
                    See the AI Solution
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </TouchFeedback>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0E0E0E] to-transparent pointer-events-none" />
    </div>
  );
}
