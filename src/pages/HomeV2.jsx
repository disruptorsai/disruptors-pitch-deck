import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 2: LIQUID MORPHING HERO
 *
 * Features:
 * - Animated liquid/blob morphing shapes
 * - Organic, fluid animations
 * - Touch-reactive blob movement
 * - Modern gradient overlays
 * - Smooth organic transitions
 */

const LiquidBlob = ({ delay = 0, size = 'large', color = 'orange' }) => {
  const blobRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      if (!blobRef.current) return;
      const rect = blobRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = (e.clientX - centerX) / 50;
      const y = (e.clientY - centerY) / 50;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const sizes = {
    small: 'w-64 h-64',
    medium: 'w-96 h-96',
    large: 'w-[600px] h-[600px]',
  };

  const colors = {
    orange: 'from-[#FF6A00] to-orange-600',
    golden: 'from-[#FFD700] to-yellow-500',
    blue: 'from-blue-500 to-cyan-500',
  };

  return (
    <motion.div
      ref={blobRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: position.x,
        y: position.y,
      }}
      transition={{
        scale: { duration: 1, delay },
        opacity: { duration: 1, delay },
        x: { type: "spring", stiffness: 50, damping: 20 },
        y: { type: "spring", stiffness: 50, damping: 20 },
      }}
      className={`absolute ${sizes[size]} bg-gradient-to-br ${colors[color]} rounded-full blur-3xl opacity-30`}
      style={{
        animation: `morph ${8 + delay * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

export default function HomeV2() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { client, personalization } = usePersonalizedPresentation();
  const titleRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // Add morphing animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes morph {
        0%, 100% {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        25% {
          border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
        }
        50% {
          border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
        }
        75% {
          border-radius: 60% 40% 60% 40% / 70% 30% 50% 60%;
        }
      }
      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 40px rgba(255, 106, 0, 0.4);
        }
        50% {
          box-shadow: 0 0 80px rgba(255, 106, 0, 0.6);
        }
      }
      .text-liquid-gradient {
        background: linear-gradient(45deg, #FF6A00, #FF8C00, #FFA500, #FF6A00);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient-shift 3s ease infinite;
      }
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  const hero = personalization?.hero;
  const headline = hero?.headline || "The Future";
  const subheadline = hero?.subheadline || "Is Liquid";

  // Split text into words for staggered animation
  const words = headline.split(" ");

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Liquid blob background */}
      <div className="absolute inset-0 overflow-hidden">
        <LiquidBlob delay={0} size="large" color="orange" />
        <LiquidBlob delay={0.5} size="medium" color="golden" />
        <LiquidBlob delay={1} size="medium" color="blue" />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }} />

      {/* Top badge */}
      {client && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-8 right-8 z-10"
        >
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <span className="text-base text-white font-medium">
              Custom for {client.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
        {/* Animated headline */}
        <div ref={titleRef} className="mb-8 overflow-hidden">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 100 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
              }}
              className="inline-block text-7xl md:text-8xl lg:text-9xl font-black mr-6"
            >
              <span className="text-white">{word}</span>
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-liquid-gradient mb-8">
            {subheadline}
          </h2>
          <p className="text-2xl md:text-3xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience presentations that flow, adapt, and transform
          </p>
        </motion.div>

        {/* CTA Buttons with liquid effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            onClick={() => navigate(createPageUrl("Introduction"))}
            className="group relative overflow-hidden bg-gradient-to-r from-[#FF6A00] to-orange-600 hover:from-[#FF6A00] hover:to-orange-700 text-white font-bold text-xl px-12 py-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
            size="lg"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          >
            <span className="relative z-10 flex items-center">
              <Play className="w-6 h-6 mr-3" />
              Dive In
            </span>

            {/* Liquid ripple effect on hover */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Button>

          <Button
            onClick={() => navigate(createPageUrl("Dashboard"))}
            variant="outline"
            className="group relative overflow-hidden border-2 border-white/40 hover:border-white/80 bg-white/5 hover:bg-white/10 text-white font-semibold text-xl px-12 py-8 rounded-full backdrop-blur-xl transition-all duration-300"
            size="lg"
          >
            <span className="relative z-10 flex items-center">
              Explore More
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-20"
        >
          <div className="inline-flex flex-col items-center">
            <span className="text-white/60 text-sm mb-3 uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
    </div>
  );
}
