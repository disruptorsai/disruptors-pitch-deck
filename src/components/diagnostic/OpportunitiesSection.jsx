import React from "react";
import { Sparkles } from "lucide-react";

export default function OpportunitiesSection({ opportunities }) {
  return (
    <div className="space-y-4">
      {opportunities?.map((opportunity, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[#FF6A00]/10 to-[#9B30FF]/10 border border-white/10"
        >
          <Sparkles className="w-6 h-6 text-[#FF6A00] flex-shrink-0 mt-1" />
          <p className="font-light text-white/90 leading-relaxed">{opportunity}</p>
        </div>
      ))}
    </div>
  );
}