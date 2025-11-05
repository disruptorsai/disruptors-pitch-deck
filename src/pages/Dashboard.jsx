import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Home,
  Video,
  Search,
  TrendingUp,
  Layers,
  Target,
  DollarSign,
  PhoneCall
} from "lucide-react";
import TouchFeedback from "@/components/TouchFeedback";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerChildren } from "@/lib/animation-config";

const pages = [
  {
    order: 1,
    name: "Home",
    path: "Home",
    title: "Home Screen",
    description: "Cinematic introduction",
    icon: Home,
    color: "from-[#D4AF37] to-[#F4E5C3]"
  },
  {
    order: 2,
    name: "Introduction",
    path: "Introduction",
    title: "Introduction",
    description: "Disruptors Media: Your Partners in AI",
    icon: Video,
    color: "from-[#B8960F] to-[#D4AF37]"
  },
  {
    order: 3,
    name: "Diagnostic",
    path: "Diagnostic",
    title: "Diagnostic",
    description: "Competitive Landscape Analysis",
    icon: Search,
    color: "from-[#D4AF37] to-[#E6C66F]"
  },
  {
    order: 4,
    name: "CaseStudies",
    path: "CaseStudies",
    title: "Case Studies",
    description: "Proven Growth: The Data Behind Disruption",
    icon: TrendingUp,
    color: "from-[#9B7F1F] to-[#D4AF37]"
  },
  {
    order: 5,
    name: "Capabilities",
    path: "Capabilities",
    title: "Capabilities",
    description: "Leverage With AI: Our Systems",
    icon: Layers,
    color: "from-[#D4AF37] to-[#FFD700]"
  },
  {
    order: 6,
    name: "Blueprint",
    path: "Blueprint",
    title: "Your Blueprint",
    description: "Custom Strategy for Success",
    icon: Target,
    color: "from-[#B8960F] to-[#E6C66F]"
  },
  {
    order: 7,
    name: "Pricing",
    path: "Pricing",
    title: "Pricing",
    description: "Investment Tiers",
    icon: DollarSign,
    color: "from-[#D4AF37] to-[#B8960F]"
  },
  {
    order: 8,
    name: "CallToAction",
    path: "CallToAction",
    title: "Call to Action",
    description: "Let's Disrupt Together",
    icon: PhoneCall,
    color: "from-[#FFD700] to-[#D4AF37]"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal animation="fade">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Presentation <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl font-light text-white/70">
              Navigate through the interactive proposal
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          {pages.map((page, index) => (
            <motion.div
              key={page.path}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
            >
              <TouchFeedback variant="card">
                <Card
                  className="relative overflow-hidden bg-[#1E1E1E] border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(createPageUrl(page.path))}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${page.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${page.color} flex items-center justify-center`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <page.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="text-2xl font-bold text-white/30">
                        {String(page.order).padStart(2, '0')}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all text-white">
                      {page.title}
                    </h3>
                    <p className="text-sm text-white/70 font-light">
                      {page.description}
                    </p>
                  </div>
                </Card>
              </TouchFeedback>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}