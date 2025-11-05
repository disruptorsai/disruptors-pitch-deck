import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Globe, Linkedin, Instagram, Play, Loader2, Sparkles } from "lucide-react";
import ScrambleText from "@/components/effects/ScrambleText";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import { ClientLogo } from "@/components/branding/ClientLogo";
import AnimatedHero from "@/components/AnimatedHero";
import TouchFeedback from "@/components/TouchFeedback";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerChildren, fadeInUp } from "@/lib/animation-config";
import IcebreakerDialog from "@/components/conversation/IcebreakerDialog";

export default function Home() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { client, personalization, isLoading, isGenerating } = usePersonalizedPresentation();

  // Icebreaker dialog state
  const [showIcebreaker, setShowIcebreaker] = useState(false);

  // Easter egg states
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const clickTimestamps = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Easter egg: Handle clicks on logo (5 clicks within 2 seconds)
  const handleDisruptClick = () => {
    const now = Date.now();
    const timestamps = clickTimestamps.current;

    // Add current timestamp
    timestamps.push(now);

    // Remove timestamps older than 2 seconds
    const twoSecondsAgo = now - 2000;
    clickTimestamps.current = timestamps.filter(ts => ts > twoSecondsAgo);

    // Check if we have 5 clicks within 2 seconds
    if (clickTimestamps.current.length >= 5) {
      setShowSecretDialog(true);
      clickTimestamps.current = []; // Reset after triggering
    }
  };

  // Handle secret navigation
  const handleSecretSubmit = (e) => {
    e.preventDefault();
    const input = secretInput.toLowerCase().trim();

    if (input === "admin") {
      navigate("/admin");
    } else if (input === "demos") {
      navigate("/preview");
    }

    // Close dialog and reset
    setShowSecretDialog(false);
    setSecretInput("");
  };

  // Handle icebreaker submission
  const handleIcebreakerSubmit = async (data) => {
    // Store conversation response in session
    const sessionId = sessionStorage.getItem('presentation_session_id') || Date.now().toString();
    sessionStorage.setItem('presentation_session_id', sessionId);

    // Store icebreaker data
    const conversationData = JSON.parse(sessionStorage.getItem('conversation_data') || '{}');
    conversationData.icebreaker = data.response;
    sessionStorage.setItem('conversation_data', JSON.stringify(conversationData));

    // Navigate to Introduction
    navigate(createPageUrl("Introduction"));
  };

  // Handle START button click
  const handleStartClick = () => {
    setShowIcebreaker(true);
  };

  // Show loading state while generating personalization
  if (isGenerating) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0E0E0E]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-[#FF6A00] animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Personalizing Your Presentation...
          </h2>
          <p className="text-white/60">
            AI is analyzing your business and creating custom content
          </p>
        </div>
      </div>
    );
  }

  // Use personalized content if available, fallback to default
  const hero = personalization?.hero;
  const headline = hero?.headline || "Let's Disrupt Your Industry";
  const subheadline = hero?.subheadline || "Interactive Proposal by Disruptors Media - Your Partner in AI";
  const ctaText = hero?.ctaText || "See Interactive Proposal";

  // Dynamic background gradient based on client brand colors
  const backgroundStyle = client?.primary_color && client?.secondary_color
    ? {
        background: `linear-gradient(135deg, ${client.primary_color}15, ${client.secondary_color}15)`,
      }
    : {};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0E0E0E]" style={backgroundStyle}>
      {/* Logo - Show client logo if available, otherwise Disruptors logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: mounted ? 0.15 : 0, scale: mounted ? 1 : 0.8 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute top-8 left-8 z-10 cursor-pointer"
        onClick={handleDisruptClick}
      >
        {client?.logo_url ? (
          <ClientLogo size="large" className="opacity-60" />
        ) : (
          <img
            src="/assets/logo-emboss.png"
            alt="Disruptors Media"
            className="h-16 md:h-20 w-auto opacity-60"
          />
        )}
      </motion.div>

      {/* Personalization Badge */}
      {client && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-8 right-8 z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm text-white/80">
              Personalized for {client.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {hero ? (
            // Personalized headline
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              <span className="gradient-text">
                {headline}
              </span>
            </h1>
          ) : (
            // Default headline with scramble effect
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white">
              <ScrambleText text="Let's" delay={500} autoScramble={true} scrambleInterval={25000} />{' '}
              <span className="gradient-text">
                <ScrambleText text="Disrupt" delay={800} autoScramble={true} scrambleInterval={22000} />
              </span>{' '}
              <ScrambleText text="Your Industry" delay={1100} autoScramble={true} scrambleInterval={28000} />
            </h1>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl font-light mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            {subheadline}
          </p>

          {/* Industry badge if available */}
          {client?.industry && (
            <div className="mb-8 inline-block px-6 py-2 bg-white/5 border border-white/10 rounded-full">
              <span className="text-sm text-white/70">
                {client.industry}
                {client.sub_industry && ` • ${client.sub_industry}`}
              </span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <TouchFeedback variant="button">
            <Button
              onClick={handleStartClick}
              className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl"
              size="lg"
            >
              <Play className="w-6 h-6 mr-2" />
              START
            </Button>
          </TouchFeedback>

          <TouchFeedback variant="button">
            <Button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              variant="outline"
              className="border-2 border-white/20 hover:border-white/40 bg-white/5 text-white font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
              size="lg"
            >
              Dashboard
            </Button>
          </TouchFeedback>
        </motion.div>

        <ScrollReveal animation="fade" delay={0.3}>
          <div className="flex justify-center gap-6">
            <TouchFeedback variant="subtle">
              <a
                href="https://disruptorsmedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              >
                <Globe className="w-5 h-5 text-white" />
              </a>
            </TouchFeedback>
            <TouchFeedback variant="subtle">
              <a
                href="https://linkedin.com/company/disruptorsmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </TouchFeedback>
            <TouchFeedback variant="subtle">
              <a
                href="https://instagram.com/disruptorsmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </TouchFeedback>
          </div>
        </ScrollReveal>
      </div>

      {/* Icebreaker Dialog */}
      <IcebreakerDialog
        isOpen={showIcebreaker}
        onClose={() => setShowIcebreaker(false)}
        onSubmit={handleIcebreakerSubmit}
      />

      {/* Secret Easter Egg Dialog */}
      <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">
              Secret Access 🔓
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Nice find! Enter the magic word to unlock special areas:
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSecretSubmit} className="space-y-4">
            <Input
              type="text"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="Enter 'admin' or 'demos'"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF6A00]"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowSecretDialog(false);
                  setSecretInput("");
                }}
                className="border-white/20 hover:bg-white/10 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-accent hover-glow text-white"
              >
                Go
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
