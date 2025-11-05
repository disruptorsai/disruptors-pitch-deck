import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function StrengthWeaknessGrid({ strengths, weaknesses }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Strengths
        </h3>
        <ul className="space-y-3">
          {strengths?.map((strength, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
              <span className="font-light text-white/90">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#B8960F] mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Areas for Improvement
        </h3>
        <ul className="space-y-3">
          {weaknesses?.map((weakness, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#B8960F] mt-2 flex-shrink-0" />
              <span className="font-light text-white/90">{weakness}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}