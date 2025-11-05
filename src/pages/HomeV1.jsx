import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Play, Sparkles, Zap, TrendingUp, Target } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 1: 3D HOLOGRAPHIC FLOATING CARDS
 *
 * Features:
 * - 3D tilt effect on cards that follows touch/mouse
 * - Holographic shimmer gradient overlay
 * - Floating animation with parallax depth
 * - Touch-optimized for tablet (60px+ touch targets)
 * - Premium glassmorphism styling
 */

const HolographicCard = ({ children, icon: Icon, title, description, delay = 0 }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handleMove({ clientX: touch.clientX, clientY: touch.clientY });
      }}
      onTouchEnd={handleLeave}
      onMouseEnter={() => setIsHovering(true)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovering ? 'none' : 'transform 0.5s ease-out',
      }}
      className="relative group cursor-pointer"
    >
      {/* Card container */}
      <div className="relative w-full h-full p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden">
        {/* Holographic shimmer overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s infinite',
          }}
        />

        {/* Gradient orb background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#FF6A00]/30 to-[#FFD700]/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6A00] to-[#FFD700] flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/70 text-lg leading-relaxed">{description}</p>
        </div>

        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent" />
      </div>
    </motion.div>
  );
};

export default function HomeV1() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { client, personalization } = usePersonalizedPresentation();

  useEffect(() => {
    setMounted(true);

    // Add shimmer animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shimmer {
        0% { background-position: -200% -200%; }
        100% { background-position: 200% 200%; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  const hero = personalization?.hero;
  const headline = hero?.headline || "Transform Your Business";
  const subheadline = hero?.subheadline || "AI-Powered Solutions That Deliver Results";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#1A0A2E] to-[#0A0A0A]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6A00]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px',
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
              Personalized for {client.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                {headline}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl text-white/70 mb-12 max-w-4xl mx-auto"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <Button
              onClick={() => navigate(createPageUrl("Introduction"))}
              className="bg-gradient-to-r from-[#FF6A00] to-[#FFD700] hover:from-[#FF6A00]/90 hover:to-[#FFD700]/90 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-[#FF6A00]/25 hover:shadow-[#FF6A00]/40 transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Play className="w-6 h-6 mr-3" />
              Start Experience
            </Button>

            <Button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              variant="outline"
              className="border-2 border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white font-semibold text-xl px-12 py-8 rounded-2xl backdrop-blur-xl transition-all duration-300"
              size="lg"
            >
              View Dashboard
            </Button>
          </motion.div>
        </div>

        {/* Floating holographic cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <HolographicCard
            icon={Zap}
            title="Lightning Fast"
            description="Deploy AI solutions in days, not months. See results immediately."
            delay={0.2}
          />

          <HolographicCard
            icon={TrendingUp}
            title="Data-Driven"
            description="Real-time analytics and insights that drive business growth."
            delay={0.4}
          />

          <HolographicCard
            icon={Target}
            title="Laser Focused"
            description="Precision-targeted strategies built specifically for your industry."
            delay={0.6}
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
