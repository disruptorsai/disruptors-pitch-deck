import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Instagram,
  ExternalLink
} from "lucide-react";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import ScrollReveal from "@/components/ScrollReveal";
import TouchFeedback from "@/components/TouchFeedback";

/**
 * CallToAction Page - Personalized Final CTA
 *
 * Features:
 * - Personalized headline with client name
 * - Specific next step based on top opportunity
 * - Calendly booking embed
 * - Pre-filled contact form
 * - Urgency triggers (limited slots, competitor mention)
 * - Presentation summary recap
 */

// Generate personalized CTA based on client intelligence
const generatePersonalizedCTA = (client) => {
  if (!client) {
    return {
      headline: "Let's Build Your AI Marketing Engine",
      subheadline: "You've seen the strategy, the proof, and the investment. Now it's time to transform your marketing into a growth machine.",
      nextStep: "Book a 30-minute strategy session to map out your custom roadmap.",
      urgency: "Limited slots available this month. Don't let your competitors get ahead.",
    };
  }

  const { name, industry, potential_competitors = [], opportunities = [] } = client;
  const topOpportunity = opportunities[0] || 'marketing automation';
  const competitor = potential_competitors[0];

  return {
    headline: `Ready to Transform ${name}?`,
    subheadline: `You've seen how AI can revolutionize ${industry} marketing. Now let's build your custom system to ${topOpportunity}.`,
    nextStep: `Book your strategy session to start building ${name}'s AI marketing engine.`,
    urgency: competitor
      ? `${competitor} is already investing in AI. Don't fall behind - secure your competitive edge now.`
      : `Limited strategy sessions available this month. Secure your spot while calendar slots remain.`,
    topOpportunity,
  };
};

// What client has learned summary
const generatePresentationSummary = (client) => {
  const points = [
    {
      icon: AlertCircle,
      title: "The Problem",
      description: client
        ? `${client.industry} companies waste 63-87% of marketing budgets on ineffective tactics. You're leaving money on the table.`
        : "Traditional marketing wastes 63-87% of budgets. AI changes everything."
    },
    {
      icon: Zap,
      title: "The Solution",
      description: client
        ? `AI-powered marketing tailored to ${client.name}'s specific market position and competitive landscape.`
        : "AI-powered marketing systems that multiply efficiency and ROI."
    },
    {
      icon: Award,
      title: "The Proof",
      description: client
        ? `Real ${client.industry || 'industry'} case studies showing 150-450% growth with our proven methodology.`
        : "Real case studies showing 150-450% growth across industries."
    },
    {
      icon: TrendingUp,
      title: "Your Blueprint",
      description: client
        ? `Custom 30/60/90 day roadmap designed specifically for ${client.name}'s opportunities and budget.`
        : "Custom 30/60/90 day roadmap with AI-selected mechanisms."
    },
  ];

  return points;
};

// Contact Form Component
const ContactForm = ({ client }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      console.log('Form submitted:', formData);
    }, 1500);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-[#00FF88] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-white/70">
          We'll get back to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#FF6A00] transition-colors"
          placeholder="Your Company Name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#FF6A00] transition-colors"
          placeholder="you@company.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#FF6A00] transition-colors"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Message (Optional)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#FF6A00] transition-colors resize-none"
          placeholder="Tell us about your goals..."
          rows={4}
        />
      </div>

      <TouchFeedback variant="button">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full gradient-accent hover-glow text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-3" />
              Send Message
            </>
          )}
        </Button>
      </TouchFeedback>
    </form>
  );
};

export default function CallToAction() {
  const { client } = usePersonalizedPresentation();
  const [showBooking, setShowBooking] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const cta = useMemo(() => generatePersonalizedCTA(client), [client]);
  const summary = useMemo(() => generatePresentationSummary(client), [client]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0E0E] via-[#1a0a0a] to-[#0E0E0E] text-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {client && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#FFD700]" />
                <span className="text-sm font-light text-white/60 uppercase tracking-wider">
                  The Final Step for {client.name}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              {cta.headline}
            </h1>

            <p className="text-xl md:text-2xl font-light text-white/80 max-w-4xl mx-auto leading-relaxed">
              {cta.subheadline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Presentation Summary */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade" delay={0.1}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                What <span className="gradient-text">You've Learned</span>
              </h2>
              <p className="text-white/70">
                In this presentation, you discovered the complete path to AI-powered growth
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {summary.map((point, index) => (
              <ScrollReveal key={index} animation="slideUp" delay={index * 0.1}>
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[#FF6A00]/20 blur-xl" />
                      <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                        <point.icon className="w-6 h-6 text-[#FF6A00]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {point.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-[#FF6A00] rounded-3xl blur-xl opacity-30 animate-pulse" />

              <div className="relative bg-gradient-to-br from-[#FFD700]/10 to-[#FF6A00]/10 backdrop-blur-md rounded-3xl p-8 border border-[#FFD700]/30">
                <div className="flex items-start gap-4">
                  <Clock className="w-12 h-12 text-[#FFD700] flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {client ? `Don't Wait, ${client.name}` : "The Time to Act is Now"}
                    </h3>
                    <p className="text-lg text-white/90 leading-relaxed mb-4">
                      {cta.urgency}
                    </p>
                    {client?.potential_competitors && client.potential_competitors.length > 0 && (
                      <p className="text-sm text-white/70">
                        While you're deciding, competitors like {client.potential_competitors.slice(0, 2).join(' and ')} are already building their AI advantage.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Primary CTA - Calendar Booking */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.3}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-40" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                <Calendar className="w-20 h-20 text-[#FF6A00] mx-auto mb-6" />

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {cta.nextStep}
                </h2>

                <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                  In this 30-minute strategy session, we'll:
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">
                      {client
                        ? `Review ${client.name}'s current marketing setup`
                        : 'Review your current marketing setup'
                      }
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">
                      Map out quick wins for immediate ROI
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">
                      Answer all your questions about implementation
                    </span>
                  </div>
                </div>

                {!showBooking ? (
                  <TouchFeedback variant="button">
                    <Button
                      onClick={() => setShowBooking(true)}
                      className="gradient-accent hover-glow text-white font-bold text-xl px-12 py-8 rounded-xl shadow-2xl"
                      size="lg"
                    >
                      <Calendar className="w-6 h-6 mr-3" />
                      Book Your Strategy Session Now
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </TouchFeedback>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      {/* Calendly Embed */}
                      <div className="aspect-video bg-white/10 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
                          <p className="text-white/60 mb-4">
                            Calendly booking widget would embed here
                          </p>
                          <a
                            href="https://link.disruptorsmedia.com/widget/bookings/meeting-with-the-disruptors"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#FF6A00] hover:text-[#FF6A00]/80 font-semibold transition-colors"
                          >
                            Open in new tab
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <p className="text-xs text-white/50 mt-6">
                  No credit card required • 30-minute session • Free strategic roadmap included
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Alternative - Contact Form */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal animation="fade" delay={0.4}>
            <div className="text-center mb-8">
              <p className="text-white/60">
                Prefer to reach out directly?
              </p>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="text-[#FF6A00] hover:text-[#FF6A00]/80 font-semibold transition-colors mt-2"
              >
                {showContactForm ? 'Hide Contact Form' : 'Send us a message instead'}
              </button>
            </div>
          </ScrollReveal>

          <AnimatePresence>
            {showContactForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <ScrollReveal animation="slideUp" delay={0.1}>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">
                      Send Us a Message
                    </h3>
                    <ContactForm client={client} />
                  </div>
                </ScrollReveal>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Direct Contact Options */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="fade" delay={0.5}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">
                Or <span className="gradient-text">Contact Us Directly</span>
              </h3>
              <p className="text-white/70">
                We're here to answer your questions
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ScrollReveal animation="slideUp" delay={0.1}>
              <a
                href="mailto:hello@disruptorsmedia.com"
                className="block bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 hover:border-[#FF6A00]/50 p-6 text-center transition-all duration-300"
              >
                <Mail className="w-12 h-12 mx-auto mb-3 text-[#FF6A00]" />
                <h4 className="text-lg font-bold text-white mb-2">Email Us</h4>
                <p className="text-sm text-white/70">
                  hello@disruptorsmedia.com
                </p>
              </a>
            </ScrollReveal>

            <ScrollReveal animation="slideUp" delay={0.2}>
              <a
                href="tel:+15551234567"
                className="block bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 hover:border-[#FF6A00]/50 p-6 text-center transition-all duration-300"
              >
                <Phone className="w-12 h-12 mx-auto mb-3 text-[#FF6A00]" />
                <h4 className="text-lg font-bold text-white mb-2">Call Us</h4>
                <p className="text-sm text-white/70">
                  (555) 123-4567
                </p>
              </a>
            </ScrollReveal>

            <ScrollReveal animation="slideUp" delay={0.3}>
              <a
                href="https://disruptorsmedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 hover:border-[#FF6A00]/50 p-6 text-center transition-all duration-300"
              >
                <Globe className="w-12 h-12 mx-auto mb-3 text-[#FF6A00]" />
                <h4 className="text-lg font-bold text-white mb-2">Visit Website</h4>
                <p className="text-sm text-white/70">
                  disruptorsmedia.com
                </p>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social Proof Footer */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="scale" delay={0.6}>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-8 text-center">
              <Award className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Join 150+ Companies Already Growing with AI
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                {client
                  ? `Companies like ${client.name} in ${client.industry} are using our AI systems to outperform competitors and scale faster than ever.`
                  : 'From startups to enterprises, our clients are leveraging AI to dominate their markets and achieve unprecedented growth.'
                }
              </p>

              <div className="flex items-center justify-center gap-8 text-sm text-white/60">
                <div>
                  <div className="text-2xl font-bold gradient-text mb-1">327%</div>
                  <div>Average ROI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text mb-1">98%</div>
                  <div>Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text mb-1">150+</div>
                  <div>Active Clients</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal animation="fade" delay={0.7}>
            <div className="text-center">
              <p className="text-white/60 mb-4">
                Follow us for AI marketing insights and updates
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://linkedin.com/company/disruptorsmedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://instagram.com/disruptorsmedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://disruptorsmedia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Globe className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final Urgency Push */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal animation="scale" delay={0.8}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-3xl blur-xl opacity-40" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-center">
                <Zap className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {client
                    ? `Let's Get Started, ${client.name}`
                    : "Let's Get Started"}
                </h2>

                <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                  {client && cta.topOpportunity
                    ? `Stop losing ground to competitors. Start ${cta.topOpportunity} with AI and watch ${client.name} dominate ${client.industry}.`
                    : 'The AI marketing revolution is here. Will you lead it or follow your competitors?'
                  }
                </p>

                <TouchFeedback variant="button">
                  <Button
                    onClick={() => setShowBooking(true)}
                    className="gradient-accent hover-glow text-white font-bold text-xl px-12 py-8 rounded-xl shadow-2xl"
                    size="lg"
                  >
                    Book Your Strategy Session
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </TouchFeedback>

                <p className="text-xs text-white/50 mt-6">
                  This is a strategic consultation, not a sales call. We'll help you even if you don't work with us.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
