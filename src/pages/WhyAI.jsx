import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Rocket, Brain, Target, Zap, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { usePersonalizedPresentation } from '@/hooks/use-personalized-presentation';
import TouchFeedback from '@/components/TouchFeedback';
import ScrollReveal from '@/components/ScrollReveal';

/**
 * Why AI? Why Now? Page
 * Establishes AI as THE solution and creates FOMO
 *
 * Content Strategy:
 * - Timeline showing AI adoption curve
 * - ROI statistics from real case studies
 * - Competitive intelligence insights
 * - Quick self-assessment (3 questions)
 */

const TimelinePoint = ({ year, title, description, icon: Icon, delay = 0 }) => (
  <ScrollReveal animation="slideLeft" delay={delay}>
    <div className="flex gap-6 items-start group">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#9B30FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="w-1 h-full bg-gradient-to-b from-[#FF6A00]/50 to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div className="text-sm text-[#FF6A00] font-semibold mb-1">{year}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 leading-relaxed">{description}</p>
      </div>
    </div>
  </ScrollReveal>
);

const ROIStatCard = ({ value, label, description, delay = 0 }) => (
  <ScrollReveal animation="scale" delay={delay}>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6A00] to-[#9B30FF] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" />

      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-[#FF6A00]/50 transition-all duration-300 text-center">
        <div className="text-5xl font-bold mb-3 gradient-text">
          {value}
        </div>
        <div className="text-xl font-semibold text-white mb-2">
          {label}
        </div>
        <p className="text-sm text-white/60">
          {description}
        </p>
      </div>
    </div>
  </ScrollReveal>
);

const AssessmentQuestion = ({ question, options, onSelect, selected }) => (
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-white mb-4">{question}</h4>
    <div className="grid gap-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option.value)}
          className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${
            selected === option.value
              ? 'border-[#FF6A00] bg-[#FF6A00]/10'
              : 'border-white/20 bg-white/5 hover:border-white/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === option.value ? 'border-[#FF6A00]' : 'border-white/40'
            }`}>
              {selected === option.value && (
                <div className="w-3 h-3 rounded-full bg-[#FF6A00]" />
              )}
            </div>
            <span className="text-white/90">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default function WhyAI() {
  const navigate = useNavigate();
  const { client, personalization } = usePersonalizedPresentation();
  const [mounted, setMounted] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const industry = client?.industry || 'your industry';
  const competitors = client?.potential_competitors || [];

  const assessmentQuestions = [
    {
      id: 'ai_usage',
      question: '1. How much AI are you currently using in your marketing?',
      options: [
        { value: 'none', label: 'Not at all - everything is manual' },
        { value: 'some', label: 'Some basic tools (ChatGPT, Canva)' },
        { value: 'advanced', label: 'Advanced AI automation and systems' },
      ],
    },
    {
      id: 'competition',
      question: '2. Are your competitors using AI-powered marketing?',
      options: [
        { value: 'no', label: 'I don\'t think so' },
        { value: 'maybe', label: 'Probably, but I\'m not sure' },
        { value: 'yes', label: 'Yes, definitely' },
      ],
    },
    {
      id: 'urgency',
      question: '3. How urgent is it to upgrade your marketing systems?',
      options: [
        { value: 'low', label: 'Not urgent - exploring options' },
        { value: 'medium', label: 'Moderately urgent - within 3-6 months' },
        { value: 'high', label: 'Very urgent - need to act now' },
      ],
    },
  ];

  const handleAssessmentSelect = (questionId, value) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateMaturityScore = () => {
    const answers = assessmentAnswers;
    let score = 0;

    if (answers.ai_usage === 'none') score += 0;
    else if (answers.ai_usage === 'some') score += 1;
    else score += 2;

    if (answers.competition === 'yes') score += 2;
    else if (answers.competition === 'maybe') score += 1;

    if (answers.urgency === 'high') score += 2;
    else if (answers.urgency === 'medium') score += 1;

    return score;
  };

  const getMaturityMessage = () => {
    const score = calculateMaturityScore();

    if (score <= 2) {
      return {
        level: 'Early Stage',
        message: 'You\'re in the early stages of AI adoption. The good news? You have massive opportunity to leapfrog competitors who are also struggling.',
        urgency: 'Now is the perfect time to build a competitive advantage.',
      };
    } else if (score <= 4) {
      return {
        level: 'Transitioning',
        message: 'You\'re using some AI, but likely not integrated systematically. You\'re at risk of being outpaced by competitors with fully automated systems.',
        urgency: 'The gap is widening. Time to accelerate your AI adoption.',
      };
    } else {
      return {
        level: 'Urgent Action Needed',
        message: 'Your competitors are likely already using AI, and you need to act fast. Every day of delay means lost market share and revenue.',
        urgency: 'This is a critical moment. Let\'s talk immediately.',
      };
    }
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const allQuestionsAnswered = Object.keys(assessmentAnswers).length === assessmentQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0E0E] via-[#1a0a0a] to-[#0E0E0E] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF6A00]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#9B30FF]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#FF6A00]" />
              <span className="text-sm text-[#FF6A00]">The AI Revolution</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Why <span className="gradient-text">AI</span>?
              <br />
              Why <span className="gradient-text">Now</span>?
            </h1>

            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              The marketing landscape is transforming faster than ever.
              Companies embracing AI are leaving competitors behind.
            </p>
          </motion.div>

          {/* ROI Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <ROIStatCard
              value="3.5×"
              label="Average ROI"
              description="Companies using AI marketing vs traditional methods"
              delay={0.1}
            />
            <ROIStatCard
              value="+187%"
              label="Traffic Growth"
              description="Average increase in 6 months with AI-optimized SEO"
              delay={0.2}
            />
            <ROIStatCard
              value="68%"
              label="Time Saved"
              description="Of repetitive marketing tasks automated by AI"
              delay={0.3}
            />
          </div>

          {/* Timeline */}
          <ScrollReveal animation="fade" delay={0.2}>
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The AI Marketing Evolution
              </h2>
              <p className="text-xl text-white/70">
                From experimental to essential in just 24 months
              </p>
            </div>
          </ScrollReveal>

          <div className="mb-24">
            <TimelinePoint
              year="2023"
              title="The Experiment Phase"
              description="Early adopters begin testing ChatGPT and AI tools for content creation. Most companies are skeptical."
              icon={Brain}
              delay={0.1}
            />
            <TimelinePoint
              year="2024"
              title="The Integration Phase"
              description="Smart companies build AI into workflows. Automation platforms emerge. The ROI becomes undeniable."
              icon={Zap}
              delay={0.2}
            />
            <TimelinePoint
              year="2025"
              title="The Dominance Phase"
              description="AI-powered companies are capturing market share. Manual marketing can't compete. The divide is irreversible."
              icon={Rocket}
              delay={0.3}
            />
          </div>

          {/* Competitive Intelligence */}
          {competitors.length > 0 && (
            <ScrollReveal animation="scale" delay={0.3}>
              <div className="relative mb-24">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-[#FF6A00] rounded-3xl blur-xl opacity-20" />

                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20">
                  <div className="text-center mb-8">
                    <Target className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                    <h3 className="text-3xl font-bold mb-3">
                      Your Competitive Landscape
                    </h3>
                    <p className="text-white/70 text-lg">
                      These companies are likely investing heavily in AI marketing right now:
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {competitors.slice(0, 5).map((competitor, index) => (
                      <div
                        key={index}
                        className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-full text-lg font-semibold"
                      >
                        {competitor}
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-white/60">
                    Don't let them gain an unrecoverable advantage
                  </p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* AI Maturity Assessment */}
          <ScrollReveal animation="fade" delay={0.2}>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/20 mb-16">
              <div className="text-center mb-10">
                <CheckCircle className="w-12 h-12 text-[#FF6A00] mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-3">
                  Where Do You Stand?
                </h3>
                <p className="text-white/70 text-lg">
                  Quick 3-question assessment (30 seconds)
                </p>
              </div>

              {!showResults ? (
                <>
                  {assessmentQuestions.map((q, index) => (
                    <AssessmentQuestion
                      key={q.id}
                      question={q.question}
                      options={q.options}
                      selected={assessmentAnswers[q.id]}
                      onSelect={(value) => handleAssessmentSelect(q.id, value)}
                    />
                  ))}

                  <div className="text-center mt-8">
                    <TouchFeedback variant="button">
                      <Button
                        onClick={handleShowResults}
                        disabled={!allQuestionsAnswered}
                        className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-6 rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        See My Results
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </TouchFeedback>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {(() => {
                    const result = getMaturityMessage();
                    return (
                      <>
                        <div className="inline-block px-6 py-3 bg-[#FF6A00]/20 border border-[#FF6A00]/40 rounded-full mb-6">
                          <span className="text-2xl font-bold text-[#FF6A00]">
                            AI Maturity: {result.level}
                          </span>
                        </div>

                        <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                          {result.message}
                        </p>

                        <div className="p-6 bg-[#FF6A00]/10 rounded-2xl border border-[#FF6A00]/30 mb-8">
                          <p className="text-lg font-semibold text-[#FF6A00]">
                            {result.urgency}
                          </p>
                        </div>

                        <TouchFeedback variant="button">
                          <Button
                            onClick={() => navigate(createPageUrl("Introduction"))}
                            className="gradient-accent hover-glow text-white font-bold text-lg px-10 py-6 rounded-xl shadow-2xl"
                          >
                            See How We Can Help
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </TouchFeedback>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
