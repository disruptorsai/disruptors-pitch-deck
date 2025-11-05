
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CaseStudyModal({ caseStudy, onClose }) {
  if (!caseStudy) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1E1E1E] border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-[#1E1E1E] border-b border-white/10 p-6 flex items-center justify-between z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: caseStudy.accent_color || '#FF6A00' }}
                />
                <span className="text-sm font-light text-white/70">
                  {caseStudy.industry}
                </span>
              </div>
              <h2 className="text-3xl font-bold gradient-text">
                {caseStudy.title}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/10 text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold text-white">The Challenge</h3>
              </div>
              <p className="font-light text-white/90 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold text-white">Our Strategy</h3>
              </div>
              <p className="font-light text-white/90 leading-relaxed">
                {caseStudy.strategy}
              </p>
            </section>

            {caseStudy.results && (
              <section>
                <h3 className="text-xl font-bold mb-4 text-white">The Results</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {caseStudy.results.roi_percentage && (
                    <div className="bg-gradient-to-br from-[#FF6A00]/20 to-[#9B30FF]/20 border border-white/10 rounded-lg p-6">
                      <div className="text-sm text-white/70 mb-2">Return on Investment</div>
                      <div className="text-4xl font-bold gradient-text">
                        {caseStudy.results.roi_percentage}%
                      </div>
                    </div>
                  )}

                  {caseStudy.results.revenue_lift && (
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-6">
                      <div className="text-sm text-white/70 mb-2">Revenue Lift</div>
                      <div className="text-2xl font-bold text-white">
                        {caseStudy.results.revenue_lift}
                      </div>
                    </div>
                  )}

                  {caseStudy.results.lead_volume_increase && (
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-6">
                      <div className="text-sm text-white/70 mb-2">Lead Volume Increase</div>
                      <div className="text-2xl font-bold text-white">
                        {caseStudy.results.lead_volume_increase}
                      </div>
                    </div>
                  )}

                  {caseStudy.results.engagement_metrics && (
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-6">
                      <div className="text-sm text-white/70 mb-2">Engagement Metrics</div>
                      <div className="text-lg font-bold text-white">
                        {caseStudy.results.engagement_metrics}
                      </div>
                    </div>
                  )}
                </div>

                {caseStudy.results.additional_metrics && (
                  <p className="mt-4 font-light text-white/80">
                    {caseStudy.results.additional_metrics}
                  </p>
                )}
              </section>
            )}

            {caseStudy.timeline && (
              <section className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                <Clock className="w-5 h-5 text-[#FF6A00]" />
                <div>
                  <div className="text-sm text-white/70">Timeline to Results</div>
                  <div className="font-semibold text-white">{caseStudy.timeline}</div>
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
