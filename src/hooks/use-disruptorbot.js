/**
 * useDisruptorBot Hook
 *
 * Manages voice conversation state, audio levels, and message history
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { sdk, adminSDK } from '@/lib/ai-presenter-sdk';
import { contextToSystemPrompt } from '@/lib/context-builder';

export function use3DConversation() {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceSessionId, setVoiceSessionId] = useState(null);
  const [context, setContext] = useState(null);

  const messageCounterRef = useRef(0);
  const sessionIdRef = useRef(null);

  // Get or create browser session ID
  useEffect(() => {
    let sessionId = sessionStorage.getItem('disruptorbot_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('disruptorbot_session_id', sessionId);
    }
    sessionIdRef.current = sessionId;
  }, []);

  /**
   * Start a new conversation session
   */
  const startConversation = useCallback(async (aiContext) => {
    try {
      setContext(aiContext);

      // Create voice session in database
      const session = await adminSDK.createVoiceSession({
        clientId: aiContext.client.id,
        sessionId: sessionIdRef.current,
        interactionMode: 'hybrid', // Support both voice and text
        currentSlideSlug: aiContext.presentation.currentSlide?.slug,
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID || 'demo'
      });

      setVoiceSessionId(session?.id);

      // Check if ElevenLabs is configured
      const hasElevenLabs = Boolean(import.meta.env.VITE_ELEVENLABS_API_KEY);

      if (hasElevenLabs) {
        // TODO: Initialize ElevenLabs connection here
        console.log('ElevenLabs integration ready (implement in Phase 2)');
        // This is where we would initialize the ElevenLabs React SDK
        // and establish the WebSocket connection
      }

      setIsConnected(true);

      // Add welcome message
      const welcomeMessage = {
        role: 'assistant',
        content: `Hi! I'm DisruptorBot, your AI assistant for ${aiContext.client.name}. I can answer questions about our services, explain your competitive analysis, discuss pricing, and help you understand how Disruptors Media can transform your marketing. What would you like to know?`,
        timestamp: new Date().toISOString()
      };

      setMessages([welcomeMessage]);

      // Store welcome message in database
      if (session?.id) {
        await adminSDK.addVoiceMessage({
          voiceSessionId: session.id,
          role: 'assistant',
          content: welcomeMessage.content,
          sequenceNumber: messageCounterRef.current++,
          currentSlideSlug: aiContext.presentation.currentSlide?.slug
        });
      }

    } catch (error) {
      console.error('Failed to start conversation:', error);
      setIsConnected(false);
    }
  }, []);

  /**
   * Stop the conversation session
   */
  const stopConversation = useCallback(async () => {
    try {
      if (voiceSessionId) {
        const startTime = messages[0]?.timestamp;
        const duration = startTime
          ? Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)
          : 0;

        await adminSDK.endVoiceSession(voiceSessionId, duration);
      }

      // TODO: Disconnect ElevenLabs here

      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      setAudioLevel(0);
    } catch (error) {
      console.error('Failed to stop conversation:', error);
    }
  }, [voiceSessionId, messages]);

  /**
   * Send a text message
   */
  const sendMessage = useCallback(async (content) => {
    if (!isConnected || !content.trim()) return;

    try {
      // Add user message to UI
      const userMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMessage]);

      // Store in database
      if (voiceSessionId) {
        await adminSDK.addVoiceMessage({
          voiceSessionId,
          role: 'user',
          content: userMessage.content,
          sequenceNumber: messageCounterRef.current++,
          currentSlideSlug: context?.presentation.currentSlide?.slug,
          intent: detectIntent(content)
        });
      }

      // Get AI response
      setIsSpeaking(true);
      const aiResponse = await getAIResponse(content, context, messages);
      setIsSpeaking(false);

      // Add AI message to UI
      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Store in database
      if (voiceSessionId) {
        await adminSDK.addVoiceMessage({
          voiceSessionId,
          role: 'assistant',
          content: aiMessage.content,
          sequenceNumber: messageCounterRef.current++,
          currentSlideSlug: context?.presentation.currentSlide?.slug
        });
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      setIsSpeaking(false);
    }
  }, [isConnected, voiceSessionId, context, messages]);

  /**
   * Toggle microphone on/off
   */
  const toggleMicrophone = useCallback(() => {
    if (!isConnected) return;

    setIsListening((prev) => {
      const newState = !prev;

      // TODO: Start/stop audio capture with ElevenLabs or Web Speech API

      if (newState) {
        console.log('Started listening (implement Web Speech API or ElevenLabs)');
        // Simulate audio level changes
        const interval = setInterval(() => {
          setAudioLevel(Math.random() * 0.5 + 0.5);
        }, 100);

        // Store interval for cleanup
        window._audioLevelInterval = interval;
      } else {
        console.log('Stopped listening');
        if (window._audioLevelInterval) {
          clearInterval(window._audioLevelInterval);
        }
        setAudioLevel(0);
      }

      return newState;
    });
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window._audioLevelInterval) {
        clearInterval(window._audioLevelInterval);
      }
    };
  }, []);

  return {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    audioLevel,
    startConversation,
    stopConversation,
    sendMessage,
    toggleMicrophone
  };
}

/**
 * Get AI response (placeholder - integrate with Claude via ElevenLabs or direct API)
 */
async function getAIResponse(userMessage, context, conversationHistory) {
  // TODO: Replace this with actual Claude API call or ElevenLabs agent
  // For now, provide contextual responses

  const message = userMessage.toLowerCase();

  // Simple pattern matching for demo
  if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
    return `Great question! We have four pricing tiers:\n\n${context?.pricing.map(p => `• **${p.name}** - ${p.price}: ${p.features.slice(0, 2).join(', ')}`).join('\n')}\n\nWhich tier interests you most, or would you like me to recommend one based on your needs?`;
  }

  if (message.includes('service') || message.includes('what do you do')) {
    return `We specialize in AI-powered marketing across ${context?.services.length} core areas:\n\n${context?.services.slice(0, 5).map(s => `• **${s.title}**: ${s.description.substring(0, 80)}...`).join('\n')}\n\nWhat specific area interests you most?`;
  }

  if (message.includes('competitor') || message.includes('different') || message.includes('better')) {
    if (context?.client.competitiveAnalysis) {
      return `Based on our competitive analysis for ${context.client.name}, we identified ${context.client.competitiveAnalysis.opportunities.length} key opportunities:\n\n${context.client.competitiveAnalysis.opportunities.slice(0, 3).map(o => `• ${o}`).join('\n')}\n\nWe leverage AI to outperform traditional agencies by 3-5x in speed and efficiency. Want to see specific examples?`;
    }
  }

  if (message.includes('case stud') || message.includes('example') || message.includes('results')) {
    if (context?.caseStudies.length > 0) {
      const cs = context.caseStudies[0];
      return `Here's a recent success story:\n\n**${cs.clientName}** (${cs.industry})\n• Challenge: ${cs.challenge}\n• Solution: ${cs.solution}\n• Results: ${cs.results.slice(0, 2).join(', ')}\n\nWant to see more case studies?`;
    }
  }

  // Default response
  return `I can help you with:\n• Our services and capabilities\n• Pricing and packages\n• Case studies and results\n• How we compare to competitors\n• Scheduling a consultation\n\nWhat would you like to know more about?`;
}

/**
 * Detect user intent from message
 */
function detectIntent(message) {
  const msg = message.toLowerCase();

  if (msg.includes('?')) return 'question';
  if (msg.includes('price') || msg.includes('cost')) return 'pricing_inquiry';
  if (msg.includes('service') || msg.includes('help')) return 'service_inquiry';
  if (msg.includes('case') || msg.includes('example')) return 'case_study_request';
  if (msg.includes('schedule') || msg.includes('call') || msg.includes('meeting')) return 'booking_request';

  return 'general';
}
