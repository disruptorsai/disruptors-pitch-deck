import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 8: SPLIT-SCREEN PARALLAX DUAL-PANE
 *
 * Features:
 * - Dramatic split-screen design
 * - Opposing parallax movements
 * - Reveal animation on scroll
 * - Modern editorial layout
 * - Dynamic content pairing
 */

export default function HomeV8() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { client, personalization } = usePersonalizedPresentation();
  const { scrollYProgress } = useScroll();

  const leftY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const rightY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const splitX = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hero = personalization?.hero;
  const headline = hero?.headline || "Two Worlds";
  const subheadline = hero?.subheadline || "One Vision";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Top badge */}
      {client && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-8 right-8 z-50"
        >
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <span className="text-base text-white font-medium">
              {client.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Split screen container */}
      <div className="relative min-h-screen flex">
        {/* Left pane - PROBLEM/CHALLENGE */}
        <motion.div
          style={{ y: leftY }}
          className="relative w-1/2 min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-gray-900 to-black overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
          }} />

          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 px-12 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -100 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="text-sm uppercase tracking-widest text-red-400 mb-6 font-bold">
                The Challenge
              </div>

              <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
                Traditional<br />
                Methods<br />
                Are Failing
              </h2>

              <p className="text-2xl text-white/70 mb-12 leading-relaxed">
                Legacy systems. Slow processes. Missed opportunities. Your competitors are moving faster.
              </p>

              <div className="space-y-4">
                {['Outdated Technology', 'Inefficient Workflows', 'Lost Revenue'].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -50 }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 text-white/80 text-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent origin-top"
          />
        </motion.div>

        {/* Right pane - SOLUTION */}
        <motion.div
          style={{ y: rightY }}
          className="relative w-1/2 min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF6A00] via-orange-700 to-#1a1a1a overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
          }} />

          {/* Gradient orbs */}
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-#FFD700/30 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 px-12 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 100 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="text-sm uppercase tracking-widest text-orange-200 mb-6 font-bold">
                The Solution
              </div>

              <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
                AI-Powered<br />
                Innovation<br />
                That Delivers
              </h2>

              <p className="text-2xl text-white/90 mb-12 leading-relaxed">
                Cutting-edge technology. Streamlined operations. Explosive growth. We build the future.
              </p>

              <div className="space-y-4 mb-12">
                {['Next-Gen AI Systems', 'Automated Excellence', '10X Revenue Growth'].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 50 }}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-4 text-white text-lg font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                    {item}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex flex-col gap-4"
              >
                <Button
                  onClick={() => navigate(createPageUrl("Introduction"))}
                  className="group bg-white hover:bg-white/90 text-[#FF6A00] font-bold text-xl px-10 py-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 w-full"
                  size="lg"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Transform Your Business
                </Button>

                <Button
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  variant="outline"
                  className="group border-2 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white font-semibold text-xl px-10 py-6 rounded-2xl backdrop-blur-xl transition-all duration-300 w-full"
                  size="lg"
                >
                  <span>See How It Works</span>
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Center title overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
      >
        <div className="text-center">
          <motion.div
            style={{ x: splitX }}
            className="relative"
          >
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none mb-4">
              <span className="bg-gradient-to-r from-red-500 via-white to-[#FF6A00] bg-clip-text text-transparent drop-shadow-2xl">
                {headline}
              </span>
            </h1>
            <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
              {subheadline}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 0.8 : 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
      >
        <span className="text-white/60 text-sm mb-2 uppercase tracking-wider">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </motion.div>
    </div>
  );
}
