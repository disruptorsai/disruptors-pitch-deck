import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  X,
  DollarSign,
  TrendingUp,
  Calendar,
  Sparkles,
  Info,
  CheckCircle,
  Award,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import {
  pricingTiers,
  recommendPricingTiers,
  calculateTierROI,
  generateTierMessage
} from "@/data/pricingTiers";
import ScrollReveal from "@/components/ScrollReveal";
import TouchFeedback from "@/components/TouchFeedback";

/**
 * Pricing Page - AI-Powered Tier Recommendations
 *
 * Features:
 * - AI-recommended 1-2 tiers based on company size and industry
 * - Custom ROI calculations per tier
 * - Feature mapping to client needs
 * - "Companies like yours invest..." messaging
 * - Investment breakdown and profit projections
 */

// Pricing Tier Card Component
const PricingTierCard = ({ tier, isRecommended, client, index }) => {
  const Icon = tier.icon;
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const roi = calculateTierROI(tier, client);
  const message = generateTierMessage(tier, client);

  return (
    <ScrollReveal animation="slideUp" delay={index * 0.15}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`relative h-full ${isRecommended ? 'md:-mt-6 md:mb-6' : ''}`}
      >
        {/* Glow effect for recommended */}
        {isRecommended && (
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-40 animate-pulse" />
        )}

        <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border ${
          isRecommended ? 'border-[#FF6A00] border-2' : 'border-white/20'
        } overflow-hidden h-full flex flex-col`}>
          {/* Badge */}
          {(tier.badge || isRecommended) && (
            <div className="absolute top-4 right-4 z-10">
              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 ${
                isRecommended ? 'bg-[#FF6A00]' : 'bg-[#9B30FF]'
              }`}>
                <Sparkles className="w-3 h-3" />
                {isRecommended ? 'Recommended for You' : tier.badge}
              </div>
            </div>
          )}

          <div className="p-8 flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FF6A00]/20 blur-xl" />
                  <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Icon className="w-8 h-8 text-[#FF6A00]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-white/60">
                    {tier.subtitle}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold gradient-text">
                    {tier.priceLabel}
                  </span>
                  {tier.billingCycle !== 'custom' && (
                    <span className="text-white/60 text-sm">
                      per {tier.billingCycle}
                    </span>
                  )}
                </div>
                {tier.setupFee && (
                  <p className="text-sm text-white/50">
                    + ${tier.setupFee.toLocaleString()} setup fee
                  </p>
                )}
                {tier.minimumCommitment && (
                  <p className="text-xs text-white/50 mt-1">
                    {tier.minimumCommitment} minimum commitment
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-white/70 leading-relaxed text-sm mb-4">
                {tier.description}
              </p>

              {/* Personalized Message */}
              {client && isRecommended && (
                <div className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-xl p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#FF6A00] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/90 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ROI Projection */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                Expected Investment & Returns:
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-sm text-white/60 mb-1">Total Investment</div>
                  <div className="text-xl font-bold text-white">
                    ${roi.totalInvestment.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/50">
                    {roi.minimumMonths} months + setup
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Expected Return</div>
                  <div className="text-xl font-bold gradient-text">
                    ${roi.conservativeReturn.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/50">
                    Conservative estimate
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-white/60">ROI Range:</span>
                <span className="text-sm font-bold text-[#00FF88]">
                  {roi.conservativeROI}% - {roi.optimisticROI}%
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-white/60">Breakeven:</span>
                <span className="text-sm font-bold text-[#FFD700]">
                  ~{roi.breakeven} days
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 mb-6">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                What's Included:
              </h4>
              <ul className="space-y-2">
                {(showAllFeatures ? tier.features : tier.features.slice(0, 6)).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[#00FF88] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.features.length > 6 && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-3 text-xs text-[#FF6A00] hover:text-[#FF6A00]/80 font-semibold transition-colors"
                >
                  {showAllFeatures ? 'Show Less' : `+ ${tier.features.length - 6} More Features`}
                </button>
              )}
            </div>

            {/* Ideal For */}
            <div className="bg-white/5 rounded-xl p-3 mb-6">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Ideal For:
              </h4>
              <div className="space-y-1 text-xs text-white/70">
                <p>• Company Size: {tier.idealFor.companySize.join(', ')} employees</p>
                <p>• Marketing Budget: {tier.idealFor.marketingSpend}</p>
                <p>• Team: {tier.idealFor.teamSize}</p>
              </div>
            </div>

            {/* CTA Button */}
            <TouchFeedback variant="button">
              <Button
                onClick={() => navigate(createPageUrl("CallToAction"))}
                className={`w-full font-bold text-base px-6 py-6 rounded-xl shadow-lg ${
                  isRecommended
                    ? 'gradient-accent hover-glow'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white'
                }`}
                size="lg"
              >
                {tier.price ? 'Choose This Tier' : 'Contact for Custom Quote'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </TouchFeedback>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

export default function Pricing() {
  const navigate = useNavigate();
  const { client } = usePersonalizedPresentation();

  // Get AI-recommended tiers
  const recommendedTiers = useMemo(() => {
    return recommendPricingTiers(client);
  }, [client]);

  const recommendedTierIds = recommendedTiers.map(t => t.id);

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
                  Pricing Tailored for {client.name}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Investment <span className="gradient-text">That Pays for Itself</span>
            </h1>

            <p className="text-xl md:text-2xl font-light text-white/80 max-w-4xl mx-auto leading-relaxed">
              {client
                ? `Based on ${client.name}'s size and industry, we've recommended the tiers most likely to deliver exceptional ROI.`
                : 'Choose the partnership level that aligns with your growth goals and budget.'
              }
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#00FF88]" />
                <span className="text-sm text-white/70">
                  <span className="font-bold text-white">No Lock-In</span> Contracts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF6A00]" />
                <span className="text-sm text-white/70">
                  <span className="font-bold text-white">327%</span> Average ROI
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#9B30FF]" />
                <span className="text-sm text-white/70">
                  <span className="font-bold text-white">30-60 Days</span> to Breakeven
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommended Tiers Section */}
      {client && recommendedTiers.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade" delay={0.1}>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A00]/20 border border-[#FF6A00]/40 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-sm font-semibold text-white">
                    AI-Recommended for {client.name}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Best Fit for <span className="gradient-text">{client.industry}</span> Companies
                </h2>
                <p className="text-lg text-white/70 max-w-3xl mx-auto">
                  Based on your company size ({client.company_size} employees) and industry benchmarks, these tiers offer the optimal balance of investment and return.
                </p>
              </div>
            </ScrollReveal>

            <div className={`grid gap-8 mb-12 ${
              recommendedTiers.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-2'
            }`}>
              {recommendedTiers.map((tier, index) => (
                <PricingTierCard
                  key={tier.id}
                  tier={tier}
                  isRecommended={true}
                  client={client}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Tiers Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade" delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {client && recommendedTiers.length > 0 ? 'All ' : ''}
                <span className="gradient-text">Investment Tiers</span>
              </h2>
              <p className="text-xl text-white/70">
                {client && recommendedTiers.length > 0
                  ? 'Explore all options to find your perfect fit'
                  : 'Four partnership levels designed for businesses at every growth stage'
                }
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <PricingTierCard
                key={tier.id}
                tier={tier}
                isRecommended={recommendedTierIds.includes(tier.id)}
                client={client}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade" delay={0.2}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                Investment <span className="gradient-text">Comparison</span>
              </h2>
              <p className="text-white/70">
                Understand what you get at each tier
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={0.3}>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-sm font-semibold text-white/60 uppercase tracking-wider">
                        Feature
                      </th>
                      {pricingTiers.map(tier => (
                        <th key={tier.id} className="p-4 text-center">
                          <div className="text-sm font-bold text-white">{tier.name}</div>
                          <div className="text-xs text-white/60 mt-1">{tier.priceLabel}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-sm text-white/80">Marketing Mechanisms</td>
                      <td className="p-4 text-center text-sm text-white">1</td>
                      <td className="p-4 text-center text-sm text-white">2-3</td>
                      <td className="p-4 text-center text-sm text-white">4-5</td>
                      <td className="p-4 text-center text-sm text-white">Unlimited</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-sm text-white/80">Social Platforms</td>
                      <td className="p-4 text-center text-sm text-white">2</td>
                      <td className="p-4 text-center text-sm text-white">4+</td>
                      <td className="p-4 text-center text-sm text-white">All</td>
                      <td className="p-4 text-center text-sm text-white">All + Custom</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-sm text-white/80">Paid Advertising</td>
                      <td className="p-4 text-center"><X className="w-4 h-4 text-white/30 mx-auto" /></td>
                      <td className="p-4 text-center"><Check className="w-4 h-4 text-[#00FF88] mx-auto" /></td>
                      <td className="p-4 text-center"><Check className="w-4 h-4 text-[#00FF88] mx-auto" /></td>
                      <td className="p-4 text-center"><Check className="w-4 h-4 text-[#00FF88] mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-sm text-white/80">Dedicated Team</td>
                      <td className="p-4 text-center"><X className="w-4 h-4 text-white/30 mx-auto" /></td>
                      <td className="p-4 text-center"><X className="w-4 h-4 text-white/30 mx-auto" /></td>
                      <td className="p-4 text-center text-sm text-white">Account Manager</td>
                      <td className="p-4 text-center text-sm text-white">Full Team (3-5)</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-sm text-white/80">Support Level</td>
                      <td className="p-4 text-center text-sm text-white">Email</td>
                      <td className="p-4 text-center text-sm text-white">Email + Slack</td>
                      <td className="p-4 text-center text-sm text-white">Phone + Email</td>
                      <td className="p-4 text-center text-sm text-white">24/7 Priority</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm text-white/80">Expected ROI</td>
                      <td className="p-4 text-center text-sm font-bold text-[#00FF88]">200-350%</td>
                      <td className="p-4 text-center text-sm font-bold text-[#00FF88]">280-450%</td>
                      <td className="p-4 text-center text-sm font-bold text-[#00FF88]">350-600%</td>
                      <td className="p-4 text-center text-sm font-bold text-[#00FF88]">400-800%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ / Trust Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#9B30FF] to-[#FF6A00] rounded-3xl blur-xl opacity-20" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <Award className="w-12 h-12 mx-auto mb-4 text-[#FFD700]" />
                  <h3 className="text-2xl font-bold mb-3">
                    Why Invest in AI Marketing?
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-white/80 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-white mb-2">ROI That Speaks for Itself</h4>
                    <p className="text-sm">
                      Our average client sees 327% ROI within the first year. Unlike traditional marketing agencies that bill hourly, we build systems that compound over time. Every dollar invested creates lasting leverage.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">No Hidden Fees</h4>
                    <p className="text-sm">
                      What you see is what you pay. Setup fees are one-time. Monthly retainers are all-inclusive. No surprise charges, no nickel-and-diming for campaign adjustments or strategy sessions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Flexible Commitments</h4>
                    <p className="text-sm">
                      We believe in earning your business every month. While minimum commitments ensure we have time to deliver results, we don't trap you in multi-year contracts. Prove ROI first, then scale.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Transparent Reporting</h4>
                    <p className="text-sm">
                      You'll know exactly what you're getting. Weekly or monthly reports show leads generated, campaigns optimized, and ROI tracked. No black-box marketing—just measurable results.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-xl p-4 mt-8">
                  <p className="text-sm text-white/90 text-center">
                    <span className="font-bold text-[#FF6A00]">Money-Back Guarantee:</span> If we don't hit our agreed KPIs within 90 days, you get month 4 free. We eat our own cooking.
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
                <Zap className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />

                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to {client ? `Transform ${client.name}` : 'Get Started'}?
                </h3>

                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  {client
                    ? `You've seen the strategy, the proof, and the investment. Now let's book a strategy session to map out your first 90 days and start building your AI marketing engine.`
                    : 'Schedule a strategy session to discuss your goals, review your fit, and map out your first 90 days.'
                  }
                </p>

                <TouchFeedback variant="button">
                  <Button
                    onClick={() => navigate(createPageUrl("CallToAction"))}
                    className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl"
                    size="lg"
                  >
                    Book Your Strategy Session
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </TouchFeedback>

                <p className="text-xs text-white/50 mt-4">
                  30-minute call • No pressure • Strategic roadmap included
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
