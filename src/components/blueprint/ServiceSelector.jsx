import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Check, Star, Sparkles } from 'lucide-react';

/**
 * ServiceSelector Component
 *
 * Interactive "Choose Your Warriors" service selection interface
 * Features:
 * - Clickable service cards with checkboxes
 * - Real-time price calculation based on selections
 * - Highlights recommended services based on ICP data
 * - Shows which pricing tier matches selections
 */
export default function ServiceSelector({
  services = [],
  pricingTiers = [],
  onSelectionChange,
  recommendedServices = [],
}) {
  const [selectedServices, setSelectedServices] = useState([]);

  // Handle service toggle
  const handleServiceToggle = (serviceSlug) => {
    setSelectedServices(prev => {
      const isSelected = prev.includes(serviceSlug);
      const newSelection = isSelected
        ? prev.filter(s => s !== serviceSlug)
        : [...prev, serviceSlug];

      // Notify parent component
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }

      return newSelection;
    });
  };

  // Calculate recommended tier based on selections
  const getRecommendedTier = () => {
    const count = selectedServices.length;
    if (count >= 8) return pricingTiers.find(t => t.slug === 'enterprise');
    if (count >= 5) return pricingTiers.find(t => t.slug === 'executive');
    if (count >= 3) return pricingTiers.find(t => t.slug === 'growth');
    return pricingTiers.find(t => t.slug === 'agency');
  };

  const recommendedTier = getRecommendedTier();

  // Check if service is recommended
  const isRecommended = (serviceSlug) => {
    return recommendedServices.includes(serviceSlug);
  };

  // Get service color
  const getServiceColor = (service) => {
    if (service.is_featured) return '#FF6A00';
    return '#9B30FF';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Choose Your <span className="gradient-text">Warriors</span>
        </h2>
        <p className="text-lg text-white/70">
          Select the services that match your goals. We'll recommend the perfect pricing tier.
        </p>
      </div>

      {/* Selection Counter & Recommended Tier */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FF6A00]/20 to-[#9B30FF]/20 border border-white/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <div>
                <p className="text-white font-semibold">
                  {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                </p>
                {recommendedTier && (
                  <p className="text-sm text-white/60">
                    Recommended tier: <span className="text-[#FF6A00] font-semibold">{recommendedTier.name}</span>
                  </p>
                )}
              </div>
            </div>
            {recommendedTier && (
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text">
                  {recommendedTier.price_label || `$${recommendedTier.price}/month`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Service Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const isSelected = selectedServices.includes(service.slug);
          const recommended = isRecommended(service.slug);

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                onClick={() => handleServiceToggle(service.slug)}
                className={`
                  relative cursor-pointer overflow-hidden transition-all duration-300 h-full
                  ${isSelected
                    ? 'bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] border-2'
                    : 'bg-[#1E1E1E] border border-white/10 hover:border-white/30'
                  }
                  group
                `}
                style={{
                  borderColor: isSelected ? getServiceColor(service) : undefined
                }}
              >
                {/* Recommended Badge */}
                {recommended && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#FFD700]/20 border border-[#FFD700]/50 rounded-full">
                      <Sparkles className="w-3 h-3 text-[#FFD700]" />
                      <span className="text-xs font-semibold text-[#FFD700]">Recommended</span>
                    </div>
                  </div>
                )}

                {/* Featured Badge */}
                {service.is_featured && !recommended && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#FF6A00]/20 border border-[#FF6A00]/50 rounded-full">
                      <Star className="w-3 h-3 text-[#FF6A00] fill-[#FF6A00]" />
                      <span className="text-xs font-semibold text-[#FF6A00]">Popular</span>
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                <div className={`
                  absolute top-3 left-3 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected
                    ? 'bg-[#00FF88] border-[#00FF88]'
                    : 'bg-transparent border-white/30 group-hover:border-white/50'
                  }
                `}>
                  {isSelected && <Check className="w-4 h-4 text-black" />}
                </div>

                {/* Gradient overlay */}
                <div
                  className={`
                    absolute inset-0 transition-opacity
                    ${isSelected ? 'opacity-10' : 'opacity-0 group-hover:opacity-10'}
                  `}
                  style={{
                    background: `linear-gradient(135deg, ${getServiceColor(service)} 0%, transparent 100%)`
                  }}
                />

                {/* Content */}
                <div className="relative p-6 pt-12">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all">
                    {service.name}
                  </h3>

                  {service.tagline && (
                    <p className="text-sm text-[#FFD700] mb-3 italic font-medium">
                      "{service.tagline}"
                    </p>
                  )}

                  <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Top Metric Preview */}
                  {service.features && service.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs text-white/60 mb-1">Top Metric:</div>
                      <div className="text-sm">
                        <span className="font-semibold text-white">
                          {service.features[0].metric}:
                        </span>
                        <span className="text-[#00FF88] ml-1 font-bold">
                          {service.features[0].value}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* No Selection Message */}
      {selectedServices.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <p>Click on services above to build your custom package</p>
        </div>
      )}
    </div>
  );
}
