import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Sparkles, Zap, TrendingUp, Target, Shield, Rocket, Award } from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";

/**
 * VERSION 6: 3D SPIRAL SHOWCASE
 *
 * Features:
 * - 3D carousel in spiral formation
 * - Touch/drag to rotate the spiral
 * - Cards with 3D transforms and depth
 * - Auto-rotate with pause on interaction
 * - Premium showcase effect
 */

const ServiceCard = ({ icon: Icon, title, description, index, rotation, isActive }) => {
  const rotateY = rotation + (index * 45); // 8 cards = 360/8 = 45deg each
  const translateZ = 400;

  return (
    <div
      className="absolute w-80 h-96 left-1/2 top-1/2"
      style={{
        transform: `translate(-50%, -50%) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`relative w-full h-full rounded-3xl backdrop-blur-xl p-8 border transition-all duration-500 ${
        isActive
          ? 'bg-gradient-to-br from-[#FF6A00]/20 to-[#FFD700]/20 border-[#FF6A00] shadow-2xl shadow-[#FF6A00]/30 scale-110'
          : 'bg-white/5 border-white/10 scale-90 opacity-70'
      }`}>
        <div className="flex flex-col h-full">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
            isActive
              ? 'bg-gradient-to-br from-[#FF6A00] to-[#FFD700] scale-110'
              : 'bg-white/10'
          }`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
          <p className="text-white/70 text-lg leading-relaxed">{description}</p>
        </div>

        {/* Corner accent */}
        {isActive && (
          <div className="absolute top-4 right-4">
            <Sparkles className="w-6 h-6 text-[#FFD700]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default function HomeV6() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const dragStartRef = useRef(null);
  const { client, personalization } = usePersonalizedPresentation();

  const services = [
    { icon: Zap, title: "Speed", description: "Lightning-fast implementation and deployment" },
    { icon: Brain, title: "Intelligence", description: "AI-powered insights and automation" },
    { icon: Target, title: "Precision", description: "Laser-focused on your business goals" },
    { icon: Shield, title: "Security", description: "Enterprise-grade security and compliance" },
    { icon: Rocket, title: "Scale", description: "Built to grow with your business" },
    { icon: Award, title: "Excellence", description: "Award-winning design and execution" },
    { icon: TrendingUp, title: "Growth", description: "Proven strategies for rapid expansion" },
    { icon: Sparkles, title: "Innovation", description: "Cutting-edge technology solutions" },
  ];

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    dragStartRef.current = e.clientX || e.touches?.[0]?.clientX;
  };

  const handleDragMove = (e) => {
    if (!isDragging || !dragStartRef.current) return;

    const currentX = e.clientX || e.touches?.[0]?.clientX;
    const diff = currentX - dragStartRef.current;
    setRotation(prev => prev + diff * 0.5);
    dragStartRef.current = currentX;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setTimeout(() => setAutoRotate(true), 2000);
  };

  const hero = personalization?.hero;
  const headline = hero?.headline || "360° Solutions";
  const subheadline = hero?.subheadline || "Comprehensive services that surround your success";

  // Calculate active card (closest to center)
  const activeIndex = Math.floor(((rotation % 360) + 360) / 45) % 8;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6A00]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

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

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -50 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-[#FF6A00] to-[#FFD700] bg-clip-text text-transparent">
              {headline}
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/70 max-w-4xl mx-auto">
            {subheadline}
          </p>
        </motion.div>

        {/* 3D Spiral Carousel */}
        <div className="relative w-full max-w-7xl mx-auto mb-12" style={{ perspective: '1500px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[600px] cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                index={index}
                rotation={-rotation}
                isActive={index === (7 - activeIndex)}
              />
            ))}
          </motion.div>
        </div>

        {/* Interaction hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 0.7 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-white/60 text-lg mb-12 text-center"
        >
          Drag to rotate • {services[(7 - activeIndex)].title} selected
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            onClick={() => navigate(createPageUrl("Introduction"))}
            className="bg-gradient-to-r from-[#FF6A00] to-[#FFD700] hover:from-[#FF6A00]/90 hover:to-[#FFD700]/90 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-[#FF6A00]/30 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            Explore All Solutions
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

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}

// Import missing Brain icon
import { Brain } from "lucide-react";
