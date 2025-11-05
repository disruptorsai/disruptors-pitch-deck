import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 3: TOUCH-REACTIVE PARTICLE NETWORK
 *
 * Features:
 * - Interactive particle system with touch/mouse response
 * - Particles connect to form dynamic network
 * - Touch creates ripple effects through particles
 * - Particles spell out logo/text on interaction
 * - Responsive to tablet touch gestures
 */

class Particle {
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.baseX = x;
    this.baseY = y;
    this.density = Math.random() * 30 + 1;
    this.vx = Math.random() * 0.5 - 0.25;
    this.vy = Math.random() * 0.5 - 0.25;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse) {
    // Calculate distance from mouse
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = mouse.radius;
    const force = (maxDistance - distance) / maxDistance;

    if (distance < mouse.radius) {
      const directionX = forceDirectionX * force * this.density;
      const directionY = forceDirectionY * force * this.density;
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }

    // Gentle drift
    this.x += this.vx;
    this.y += this.vy;

    // Boundaries
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }
}

export default function HomeV3() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { client, personalization } = usePersonalizedPresentation();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: 150 });
  const animationFrameRef = useRef();

  const hero = personalization?.hero;
  const headline = hero?.headline || "Connected Intelligence";
  const subheadline = hero?.subheadline || "Every interaction creates possibilities";

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
    particlesRef.current = [];

    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesRef.current.push(new Particle(canvas, x, y));
    }
  }, []);

  const connectParticles = useCallback((ctx) => {
    const particles = particlesRef.current;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = 1 - distance / 100;
          ctx.strokeStyle = `rgba(255, 106, 0, ${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      particle.draw(ctx);
      particle.update(mouseRef.current);
    });

    connectParticles(ctx);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [connectParticles]);

  useEffect(() => {
    setMounted(true);
    initParticles();
    animate();

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      mouseRef.current.x = e.touches[0].clientX;
      mouseRef.current.y = e.touches[0].clientY;
    };

    const handleMouseOut = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles, animate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />

      {/* Top badge */}
      {client && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-8 right-8 z-30"
        >
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <span className="text-base text-white font-medium">
              {client.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              {headline}
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="text-2xl md:text-3xl text-white/80 mb-4 max-w-4xl mx-auto leading-relaxed">
            {subheadline}
          </p>

          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-3xl mx-auto italic">
            Touch and explore the network - watch how everything connects
          </p>
        </motion.div>

        {/* Stats display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap gap-8 justify-center mb-16"
        >
          <div className="text-center backdrop-blur-xl bg-white/5 px-8 py-6 rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-[#FF6A00] mb-2">1000+</div>
            <div className="text-sm text-white/70 uppercase tracking-wider">Connections</div>
          </div>
          <div className="text-center backdrop-blur-xl bg-white/5 px-8 py-6 rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-[#FF6A00] mb-2">Real-time</div>
            <div className="text-sm text-white/70 uppercase tracking-wider">Analysis</div>
          </div>
          <div className="text-center backdrop-blur-xl bg-white/5 px-8 py-6 rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-[#FF6A00] mb-2">24/7</div>
            <div className="text-sm text-white/70 uppercase tracking-wider">Intelligence</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            onClick={() => navigate(createPageUrl("Introduction"))}
            className="bg-gradient-to-r from-[#FF6A00] to-orange-600 hover:from-[#FF6A00]/90 hover:to-orange-700 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-[#FF6A00]/30 hover:shadow-[#FF6A00]/50 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            Enter the Network
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

        {/* Interaction hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 0.6 : 0 }}
          transition={{ duration: 2, delay: 2 }}
          className="mt-16 text-white/60 text-sm uppercase tracking-wider"
        >
          Move your finger to interact with particles
        </motion.div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
