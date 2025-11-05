import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Database, Target, Search, MessageSquare, Mic, BarChart3, Layers } from "lucide-react";

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

export default function RecommendedMechanisms({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {recommendations.map((capability, index) => {
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
          <motion.div
            key={capability.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-[#1E1E1E] border-white/10 hover:border-white/30 transition-all p-6 h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text mb-2">
                    {capability.name}
                  </h3>
                  {capability.category && (
                    <span className={`text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
                      {capability.category}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-light text-white/90 leading-relaxed">
                {capability.description}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}