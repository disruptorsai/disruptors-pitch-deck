import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

export default function PricingTiers({ tiers }) {
  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Investment <span className="gradient-text">Tiers</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[800px] overflow-y-auto pr-2">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          >
            <Card
              className={`bg-[#1E1E1E] border-white/10 p-6 h-full flex flex-col ${
                tier.recommended
                  ? 'ring-2 ring-[#FF6A00] border-[#FF6A00]/50'
                  : 'hover:border-white/30'
              } transition-all`}
            >
              {tier.recommended && (
                <div className="flex items-center gap-2 mb-4 gradient-accent text-white px-3 py-1 rounded-full text-sm font-semibold self-start">
                  <Star className="w-4 h-4" />
                  Recommended
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2 text-white">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  {tier.name === "Agency Plan" && (
                    <span className="text-sm text-white/70 mr-1">Starting at</span>
                  )}
                  <span className="text-4xl font-bold gradient-text">
                    ${tier.price.toLocaleString()}
                    {tier.name === "Enterprise Plan" && "+"}
                  </span>
                  <span className="text-sm text-white/70">/month</span>
                </div>
                <p className="text-sm font-light italic text-white/80">
                  {tier.description}
                </p>
              </div>

              {tier.features && tier.features.length > 0 && (
                <ul className="space-y-3 mb-6 flex-grow">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-light text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Button
                className={`w-full ${
                  tier.recommended
                    ? 'gradient-accent hover-glow'
                    : 'bg-white/10 hover:bg-white/20'
                } text-white font-semibold`}
                onClick={() => window.open('https://link.disruptorsmedia.com/widget/bookings/meeting-with-the-disruptors', '_blank')}
              >
                Get Started
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}