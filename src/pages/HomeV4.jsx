import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Sparkles, Layers, Zap, Brain } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 4: GLASSMORPHISM MULTI-LAYER
 *
 * Features:
 * - Multiple frosted glass layers with depth
 * - Parallax scrolling between layers
 * - Depth-of-field blur effects
 * - Modern iOS-style glassmorphism
 * - Elegant, premium aesthetic
 */

const GlassCard = ({ children, className = "", delay = 0, depth = 1 }) => {
  const blurAmount = depth * 10;
  const translateZ = depth * 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className={`relative group ${className}`}
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-500`}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default function HomeV4() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { client, personalization } = usePersonalizedPresentation();
  const { scrollYProgress } = useScroll();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const layer1Y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hero = personalization?.hero;
  const headline = hero?.headline || "Layered Innovation";
  const subheadline = hero?.subheadline || "Transparent. Powerful. Beautiful.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-#1a1a1a to-pink-900">
      {/* Animated background with parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-#FFD700/20 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </motion.div>

      {/* Top badge */}
      {client && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-8 right-8 z-50"
        >
          <div className="flex items-center gap-2 px-6 py-3 backdrop-blur-xl bg-white/10 rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <span className="text-base text-white font-medium">
              {client.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main content container with parallax layers */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-7xl mx-auto">
          {/* Layer 1 - Hero content */}
          <motion.div
            style={{ y: layer1Y }}
            className="text-center mb-20"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
              transition={{ duration: 1 }}
              className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl">
                {headline}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-3xl md:text-4xl text-white/90 mb-12 font-light"
            >
              {subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                onClick={() => navigate(createPageUrl("Introduction"))}
                className="backdrop-blur-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xl px-12 py-8 rounded-2xl border-2 border-white/30 hover:border-white/50 shadow-2xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Play className="w-6 h-6 mr-3" />
                Experience the Layers
              </Button>

              <Button
                onClick={() => navigate(createPageUrl("Dashboard"))}
                variant="outline"
                className="backdrop-blur-xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 text-white font-semibold text-xl px-12 py-8 rounded-2xl transition-all duration-300"
                size="lg"
              >
                Explore Dashboard
              </Button>
            </motion.div>
          </motion.div>

          {/* Layer 2 - Glass cards grid */}
          <motion.div
            style={{ y: layer2Y }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <GlassCard delay={0.6} depth={1}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Multi-Layered</h3>
              </div>
              <p className="text-white/80 text-lg leading-relaxed">
                Complex solutions broken down into elegant, understandable layers
              </p>
            </GlassCard>

            <GlassCard delay={0.8} depth={2}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-#FFD700 to-pink-500 flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Lightning Fast</h3>
              </div>
              <p className="text-white/80 text-lg leading-relaxed">
                Performance optimized for instant results and smooth interactions
              </p>
            </GlassCard>

            <GlassCard delay={1.0} depth={3}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI-Powered</h3>
              </div>
              <p className="text-white/80 text-lg leading-relaxed">
                Intelligent systems that learn and adapt to your business needs
              </p>
            </GlassCard>
          </motion.div>

          {/* Layer 3 - Feature showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 50 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-20"
          >
            <GlassCard depth={2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div>
                  <div className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    99.9%
                  </div>
                  <div className="text-white/70 text-lg">Uptime Guaranteed</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-#FFD700 to-pink-400 bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-white/70 text-lg">Support Available</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {'< '}100ms
                  </div>
                  <div className="text-white/70 text-lg">Response Time</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );
}
