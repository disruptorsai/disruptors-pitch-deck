import React from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function CompetitorCard({ competitor }) {
  return (
    <Card className="bg-[#0D0D0D] border-white/10 p-4 hover:border-white/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{competitor.name}</h3>
        {competitor.website && (
          <a
            href={competitor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6A00] hover:text-[#9B30FF] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      <p className="text-sm font-light text-white/80 leading-relaxed">
        {competitor.strengths}
      </p>
    </Card>
  );
}