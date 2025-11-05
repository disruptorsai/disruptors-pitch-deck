import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

import CompetitorCard from "../components/diagnostic/CompetitorCard";
import StrengthWeaknessGrid from "../components/diagnostic/StrengthWeaknessGrid";
import OpportunitiesSection from "../components/diagnostic/OpportunitiesSection";

export default function Diagnostic() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
    initialData: [],
  });

  const activeClient = clients.find(c => c.is_active) || null;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            {activeClient?.business_name || "Your Business"} -{" "}
            <span className="gradient-text">Strengths & Weaknesses</span>
          </h1>
          <p className="text-xl font-light text-white/80 max-w-3xl mx-auto">
            Our automation has analyzed the competitive landscape
            and identified AI-driven opportunities.
          </p>
        </motion.div>

        {activeClient?.competitor_analysis ? (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                className="bg-[#1E1E1E] border-white/10 cursor-pointer hover:border-white/30 transition-all"
                onClick={() => setExpandedSection(expandedSection === 'competitors' ? null : 'competitors')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold gradient-text">
                      Successful Competitors
                    </h2>
                    {expandedSection === 'competitors' ? (
                      <ChevronUp className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  {expandedSection === 'competitors' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      {activeClient.competitor_analysis.competitors?.map((competitor, index) => (
                        <CompetitorCard key={index} competitor={competitor} />
                      ))}
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                className="bg-[#1E1E1E] border-white/10 cursor-pointer hover:border-white/30 transition-all"
                onClick={() => setExpandedSection(expandedSection === 'analysis' ? null : 'analysis')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold gradient-text">
                      Your Strengths & Weaknesses
                    </h2>
                    {expandedSection === 'analysis' ? (
                      <ChevronUp className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  {expandedSection === 'analysis' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <StrengthWeaknessGrid
                        strengths={activeClient.competitor_analysis.client_strengths}
                        weaknesses={activeClient.competitor_analysis.client_weaknesses}
                      />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className="bg-[#1E1E1E] border-white/10 cursor-pointer hover:border-white/30 transition-all"
                onClick={() => setExpandedSection(expandedSection === 'opportunities' ? null : 'opportunities')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold gradient-text">
                      Opportunities with AI
                    </h2>
                    {expandedSection === 'opportunities' ? (
                      <ChevronUp className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  {expandedSection === 'opportunities' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <OpportunitiesSection
                        opportunities={activeClient.competitor_analysis.opportunities}
                      />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex justify-center"
            >
              <Button
                onClick={() => navigate(createPageUrl("CaseStudies"))}
                className="gradient-accent hover-glow text-white font-bold text-lg px-8 py-6 rounded-xl"
                size="lg"
              >
                See Our Proven Results
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        ) : (
          <Card className="bg-[#1E1E1E] border-white/10 p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-[#FF6A00] animate-spin" />
            <h3 className="text-2xl font-bold mb-4 text-white">Awaiting Analysis</h3>
            <p className="text-lg text-white/80">
              Our external automation is analyzing the client's information.
              The data will populate automatically once the analysis is complete.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}