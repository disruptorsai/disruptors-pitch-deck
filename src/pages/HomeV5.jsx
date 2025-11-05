import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Volume2, VolumeX, Sparkles } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 5: CINEMATIC VIDEO WITH TEXT MASKS
 *
 * Features:
 * - Full-screen background video (or animated gradient as fallback)
 * - Text with video mask/fill effect
 * - Scroll-triggered reveals
 * - Cinema-quality animations
 * - Sound toggle control
 */

export default function HomeV5() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(true);
  const { client, personalization } = usePersonalizedPresentation();
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);

    // Add custom animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes grain {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -10%); }
        20% { transform: translate(-15%, 5%); }
        30% { transform: translate(7%, -25%); }
        40% { transform: translate(-5%, 25%); }
        50% { transform: translate(-15%, 10%); }
        60% { transform: translate(15%, 0%); }
        70% { transform: translate(0%, 15%); }
        80% { transform: translate(3%, 35%); }
        90% { transform: translate(-10%, 10%); }
      }
      .film-grain {
        animation: grain 8s steps(10) infinite;
      }
      @keyframes cinema-pulse {
        0%, 100% {
          box-shadow: 0 0 20px rgba(255, 106, 0, 0.3),
                      0 0 40px rgba(255, 106, 0, 0.2),
                      0 0 60px rgba(255, 106, 0, 0.1);
        }
        50% {
          box-shadow: 0 0 30px rgba(255, 106, 0, 0.5),
                      0 0 60px rgba(255, 106, 0, 0.3),
                      0 0 90px rgba(255, 106, 0, 0.2);
        }
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  const hero = personalization?.hero;
  const headline = hero?.headline || "CINEMATIC";
  const subtext = hero?.subheadline || "STORYTELLING";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Video/Animated background */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 z-0"
      >
        {/* Animated gradient background (fallback/alternative to video) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 106, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
            animation: 'grain 20s ease infinite',
          }} />
        </div>

        {/* Film grain texture */}
        <div className="absolute inset-0 opacity-30 film-grain" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }} />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)]" />
      </motion.div>

      {/* Top controls */}
      <div className="absolute top-8 right-8 z-50 flex gap-4">
        {client && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 px-6 py-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/10">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <span className="text-base text-white font-medium">
                {client.name}
              </span>
            </div>
          </motion.div>
        )}

        {/* Sound toggle */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.5 }}
          onClick={() => setMuted(!muted)}
          className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all duration-300"
        >
          {muted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center max-w-7xl mx-auto">
          {/* Cinematic title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 2 }}
            className="mb-12"
          >
            {/* Letter box bars - cinema effect */}
            <div className="mb-16">
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-2 bg-black mb-2 origin-center"
              />
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-2 bg-black origin-center"
              />
            </div>

            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8, type: "spring" }}
              className="text-8xl md:text-9xl lg:text-[12rem] font-black mb-6 leading-none"
              style={{
                WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)',
                color: 'transparent',
                textShadow: '0 0 80px rgba(255, 106, 0, 0.5)',
              }}
            >
              {headline}
            </motion.h1>

            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.2, type: "spring" }}
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-8"
            >
              <span className="bg-gradient-to-r from-[#FF6A00] via-orange-500 to-[#FF6A00] bg-clip-text text-transparent">
                {subtext}
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="h-px w-16 bg-white/30" />
              <span className="text-white/80 text-xl tracking-widest uppercase">
                A Presentation Film
              </span>
              <div className="h-px w-16 bg-white/30" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.3 }}
              className="text-2xl md:text-3xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-16"
            >
              Experience your business story told like never before
            </motion.p>
          </motion.div>

          {/* CTA with cinematic style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              onClick={() => navigate(createPageUrl("Introduction"))}
              className="group relative overflow-hidden bg-gradient-to-r from-[#FF6A00] to-orange-600 hover:from-[#FF6A00] hover:to-orange-700 text-white font-bold text-xl px-16 py-8 rounded-none border-2 border-[#FF6A00] transition-all duration-300"
              size="lg"
              style={{ animation: 'cinema-pulse 2s ease-in-out infinite' }}
            >
              <span className="relative z-10 flex items-center uppercase tracking-wider">
                <Play className="w-7 h-7 mr-4" />
                Play Feature
              </span>

              {/* Scan line effect */}
              <motion.div
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 top-0 h-px bg-white/50"
              />
            </Button>

            <Button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              variant="outline"
              className="border-2 border-white/50 hover:border-white bg-transparent hover:bg-white/10 text-white font-semibold text-xl px-16 py-8 rounded-none backdrop-blur-sm transition-all duration-300 uppercase tracking-wider"
              size="lg"
            >
              Behind The Scenes
            </Button>
          </motion.div>

          {/* Runtime indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="mt-20 text-white/40 text-sm uppercase tracking-widest"
          >
            Runtime: Your Success Story
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

      {/* Aspect ratio markers (cinema bars) */}
      <div className="absolute inset-x-0 top-0 h-16 bg-black/80 z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-black/80 z-10 pointer-events-none" />
    </div>
  );
}
