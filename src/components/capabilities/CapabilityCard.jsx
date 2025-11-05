import React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Database,
  Target,
  Search,
  Layers,
  BarChart3,
  MessageSquare,
  Mic,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const iconMap = {
  TrendingUp,
  Database,
  Target,
  Search,
  Layers,
  BarChart3,
  MessageSquare,
  Mic,
  Sparkles,
};

export default function CapabilityCard({ capability, onClick, isExpanded }) {
  const IconComponent =
    capability.icon_name && iconMap[capability.icon_name]
      ? iconMap[capability.icon_name]
      : Sparkles;

  const categoryColors = {
    automation: "from-[#D4AF37] to-[#FFD700]",
    optimization: "from-[#B8960F] to-[#D4AF37]",
    analytics: "from-[#D4AF37] to-[#E6C66F]",
    content: "from-[#9B7F1F] to-[#D4AF37]",
    conversion: "from-[#FFD700] to-[#F4E5C3]",
  };

  const gradientClass = categoryColors[capability.category] || "from-[#D4AF37] to-[#B8960F]";

  return (
    <Card
      className={`bg-[#1E1E1E] border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden group ${
        isExpanded ? 'ring-2 ring-white/30' : ''
      }`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-white flex-shrink-0" />
          ) : (
            <ChevronDown className="w-6 h-6 text-white flex-shrink-0" />
          )}
        </div>

        <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all text-white">
          {capability.name}
        </h3>

        <p className="text-sm font-light text-white/90 leading-relaxed mb-4">
          {capability.description}
        </p>

        <AnimatePresence>
          {isExpanded && capability.data_points && capability.data_points.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-white/20 space-y-3 overflow-hidden"
            >
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                Performance Data
              </h4>
              {capability.data_points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass} mt-2 flex-shrink-0`} />
                  <p className="text-sm font-light text-white/90 leading-relaxed">{point}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {capability.category && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <span className={`text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
              {capability.category}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}