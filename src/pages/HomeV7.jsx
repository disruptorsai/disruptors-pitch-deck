import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 7: ANIMATED MESH GRADIENT (APPLE-STYLE)
 *
 * Features:
 * - Beautiful animated mesh gradient background
 * - Apple-inspired minimal design
 * - Smooth color transitions
 * - Clean, modern aesthetic
 * - Premium brand feel
 */

export default function HomeV7() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { client, personalization } = usePersonalizedPresentation();
  const canvasRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  useEffect(() => {
    setMounted(true);

    // Animated mesh gradient canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    const drawMeshGradient = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);

      // Animate colors
      const hue1 = (time * 0.5) % 360;
      const hue2 = (time * 0.5 + 120) % 360;
      const hue3 = (time * 0.5 + 240) % 360;

      gradient.addColorStop(0, `hsl(${hue1}, 70%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${hue2}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue3}, 70%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add noise/grain effect
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
      }

      ctx.putImageData(imageData, 0, 0);

      time += 0.2;
      requestAnimationFrame(drawMeshGradient);
    };

    drawMeshGradient();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const hero = personalization?.hero;
  const headline = hero?.headline || "Think Different";
  const subheadline = hero?.subheadline || "Innovation at every pixel";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated mesh gradient canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ filter: 'blur(60px) opacity(0.8)' }}
      />

      {/* Solid color overlay for better readability */}
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* Top badge */}
      {client && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-8 right-8 z-50"
        >
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <span className="text-base text-white font-medium">
              {client.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center max-w-6xl mx-auto">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight">
              <span className="text-white drop-shadow-2xl">
                {headline.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.2 }}
                    className="inline-block mr-6"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-3xl md:text-4xl text-white/90 mb-16 font-light max-w-4xl mx-auto"
          >
            {subheadline}
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            {['AI-Powered', 'Cloud-Native', 'Enterprise-Ready', 'Real-time'].map((feature, i) => (
              <div
                key={i}
                className="px-8 py-4 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 text-white text-lg font-medium"
              >
                {feature}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <Button
              onClick={() => navigate(createPageUrl("Introduction"))}
              className="group bg-white hover:bg-white/90 text-black font-semibold text-xl px-12 py-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Play className="w-6 h-6 mr-3" />
              Get Started
            </Button>

            <Button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              variant="outline"
              className="group border-2 border-white/40 hover:border-white/80 bg-white/5 hover:bg-white/10 text-white font-semibold text-xl px-12 py-8 rounded-full backdrop-blur-2xl transition-all duration-300"
              size="lg"
            >
              <span>Learn More</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-6xl font-black text-white mb-3">10X</div>
              <div className="text-white/70 text-lg">Faster Implementation</div>
            </div>

            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-6xl font-black text-white mb-3">500+</div>
              <div className="text-white/70 text-lg">Happy Clients</div>
            </div>

            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="text-6xl font-black text-white mb-3">99.9%</div>
              <div className="text-white/70 text-lg">Uptime SLA</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}
