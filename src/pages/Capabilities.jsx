import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Info,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import { services, getRecommendedServices, generateServiceRationale } from "@/data/services";
import ScrollReveal from "@/components/ScrollReveal";
import TouchFeedback from "@/components/TouchFeedback";

/**
 * Capabilities Page - AI-Powered Service Recommendations
 *
 * Features:
 * - Shows top 4-6 services based on client intelligence
 * - Each service includes performance metrics
 * - "Why This Matters" section personalized per client
 * - Expandable details with benefits and ideal customers
 */

const ServiceCard = ({ service, client, index, onExpand, isExpanded }) => {
  const Icon = service.icon;
  const rationale = generateServiceRationale(service, client || {});

  return (
    <ScrollReveal animation="scale" delay={index * 0.1}>
      <motion.div
        layout
        className="relative group"
      >
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300" />

        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 hover:border-[#FF6A00]/50 transition-all duration-300 overflow-hidden">
          {/* Relevance badge */}
          {service.relevanceScore && service.relevanceScore > 70 && (
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1 bg-[#FF6A00]/90 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                High Match
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#FF6A00]/20 blur-xl" />
                <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <Icon className="w-10 h-10 text-[#FF6A00]" />
                </div>
              </div>
            </div>

            {/* Title & Hook */}
            <h3 className="text-2xl font-bold text-white mb-3">
              {service.title}
            </h3>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              {service.hook}
            </p>

            {/* Metrics Grid */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                {service.metrics.slice(0, 2).map((metric, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold gradient-text mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-white/60 leading-tight">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why This Matters - Personalized */}
            {client && (
              <div className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-[#FF6A00] flex-shrink-0 mt-0.5" />
                  <h4 className="text-sm font-semibold text-[#FF6A00]">
                    Why This Matters for {client.name}
                  </h4>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {rationale}
                </p>
              </div>
            )}

            {/* Expand Button */}
            <TouchFeedback variant="button">
              <button
                onClick={() => onExpand(service.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300"
              >
                <span className="text-sm font-semibold text-white">
                  {isExpanded ? 'Show Less' : 'Learn More'}
                </span>
                <ArrowRight className={`w-4 h-4 text-white transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            </TouchFeedback>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {/* Full Description */}
                    <p className="text-white/80 mb-6 leading-relaxed">
                      {service.fullDescription}
                    </p>

                    {/* All Metrics */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                        Performance Metrics
                      </h4>
                      <div className="space-y-3">
                        {service.metrics.map((metric, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-[#FF6A00] flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-[#FF6A00]">
                                  {metric.value}
                                </span>
                                <span className="text-sm text-white/80">
                                  {metric.label}
                                </span>
                              </div>
                              <p className="text-xs text-white/60 mt-1">
                                {metric.timeframe}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                        What's Included
                      </h4>
                      <div className="space-y-2">
                        {service.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-white/80">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ideal For */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                        Ideal For
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.idealFor.map((category, i) => (
                          <div
                            key={i}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80"
                          >
                            {category}
                          </div>
                        ))}
                      </div>
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

export default function Capabilities() {
  const navigate = useNavigate();
  const { client } = usePersonalizedPresentation();
  const [expandedService, setExpandedService] = useState(null);

  // Get AI-recommended services based on client intelligence
  const recommendedServices = useMemo(() => {
    if (client) {
      return getRecommendedServices(client, 6);
    }
    // Fallback: show top 6 services by default order
    return services.slice(0, 6);
  }, [client]);

  const handleExpand = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

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
                  AI-Selected for {client.name}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Our <span className="gradient-text">Capabilities</span>
            </h1>

            {client ? (
              <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
                Based on our analysis of {client.name}, we've identified the {recommendedServices.length} services
                most likely to drive measurable results for your business.
              </p>
            ) : (
              <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
                Battle-tested AI-powered marketing services that deliver measurable ROI
              </p>
            )}

            <div className="mt-8 inline-block">
              <div className="px-6 py-3 bg-gradient-to-r from-[#FF6A00]/20 to-[#9B30FF]/20 border border-white/20 rounded-full">
                <p className="text-sm text-white/70">
                  <span className="gradient-text font-semibold">We live and die by our systems.</span>
                  {" "}Everything we build creates maximum leverage.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                client={client}
                index={index}
                onExpand={handleExpand}
                isExpanded={expandedService === service.id}
              />
            ))}
          </div>

          {/* See All Services Note */}
          {client && recommendedServices.length < services.length && (
            <ScrollReveal animation="fade" delay={0.5}>
              <div className="mt-12 text-center">
                <div className="inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                  <p className="text-sm text-white/60">
                    Showing {recommendedServices.length} of {services.length} services most relevant to {client.industry || 'your industry'}
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
                  See How These Services Work Together
                </h3>

                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  {client
                    ? `Next, we'll show you real results from companies in ${client.industry || 'your industry'} and reveal
                      our proven case studies that demonstrate these capabilities in action.`
                    : 'Next, explore our proven case studies and see these capabilities delivering real results.'
                  }
                </p>

                <TouchFeedback variant="button">
                  <Button
                    onClick={() => navigate(createPageUrl("CaseStudies"))}
                    className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl"
                    size="lg"
                  >
                    View Success Stories
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
