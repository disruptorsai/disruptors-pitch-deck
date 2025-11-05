import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, Volume2, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openAIService } from '@/lib/openai-service';
import { useLocation } from 'react-router-dom';
import { usePersonalizedPresentation } from '@/hooks/use-personalized-presentation';

/**
 * AI Assistant - Floating Conversational Interface
 *
 * A GPT-5 powered assistant that:
 * - Floats above all content (accessible anywhere)
 * - Voice input via Whisper
 * - Text-to-speech responses
 * - Context-aware help about presentations
 * - Streaming responses for better UX
 * - Touch-optimized for tablet
 *
 * Perfect for client presentations when you need quick info!
 */

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI presentation assistant. I can help you navigate, answer questions about your pitch, or provide insights. How can I help?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const location = useLocation();
  const { client } = usePersonalizedPresentation();
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to AI
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build context-aware message array
      const context = {
        currentPage: location.pathname,
        clientInfo: client,
        question: text,
      };

      // Get AI response with streaming
      let assistantMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add system context
      conversationHistory.unshift({
        role: 'system',
        content: `You are an AI presentation assistant.
Current page: ${context.currentPage}
Client: ${context.clientInfo?.name || 'Unknown'}
Industry: ${context.clientInfo?.industry || 'Unknown'}

Help the user with their presentation. Be concise, professional, and helpful.`,
      });

      // Stream response
      for await (const chunk of openAIService.chatStream(conversationHistory)) {
        assistantMessage.content += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...assistantMessage };
          return newMessages;
        });
      }

      setIsTyping(false);
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble responding right now. Please try again.",
        },
      ]);
      setIsTyping(false);
    }
  };

  // Voice input
  const startVoiceInput = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        try {
          const transcript = await openAIService.transcribeAudio(audioBlob);
          sendMessage(transcript);
        } catch (error) {
          console.error('Transcription error:', error);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Voice input error:', error);
    }
  };

  const stopVoiceInput = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Text-to-speech
  const speakMessage = async (text) => {
    if (isSpeaking) {
      // Stop current speech
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      const audioBlob = await openAIService.textToSpeech(text, 'nova');
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
    }
  };

  // Floating button
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FFD700] shadow-2xl shadow-[#FF6A00]/50 flex items-center justify-center group"
      >
        <MessageCircle className="w-10 h-10 text-white" />

        {/* Pulse animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-[#FF6A00]"
        />

        {/* Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </motion.button>
    );
  }

  // Chat interface
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: 100, y: 100 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
        width: isMinimized ? 400 : 500,
        height: isMinimized ? 80 : 700,
      }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-8 right-8 z-50 backdrop-blur-2xl bg-gradient-to-br from-gray-900/95 to-black/95 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[#FF6A00]/20 to-[#FFD700]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FFD700] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">AI Assistant</div>
            <div className="text-white/60 text-sm">Powered by GPT-5</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            size="sm"
            variant="ghost"
            className="text-white/60 hover:text-white w-10 h-10 p-0"
          >
            {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </Button>

          <Button
            onClick={() => setIsOpen(false)}
            size="sm"
            variant="ghost"
            className="text-white/60 hover:text-white w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[500px]">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#FF6A00] to-orange-600 text-white'
                      : 'bg-white/10 text-white backdrop-blur-xl border border-white/10'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {/* Speak button for assistant messages */}
                  {message.role === 'assistant' && message.content && (
                    <Button
                      onClick={() => speakMessage(message.content)}
                      size="sm"
                      variant="ghost"
                      className="mt-2 text-white/60 hover:text-white h-8"
                    >
                      <Volume2 className={`w-4 h-4 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
                      {isSpeaking ? 'Stop' : 'Speak'}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span className="text-white/60 text-sm">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              {/* Voice button */}
              <Button
                onClick={isRecording ? stopVoiceInput : startVoiceInput}
                size="lg"
                className={`w-14 h-14 rounded-full p-0 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                <Mic className={`w-6 h-6 text-white ${isRecording ? 'animate-pulse' : ''}`} />
              </Button>

              {/* Text input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                placeholder="Type or speak your message..."
                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] text-lg"
              />

              {/* Send button */}
              <Button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
                size="lg"
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6A00] to-orange-600 hover:from-[#FF6A00] hover:to-orange-700 p-0 disabled:opacity-50"
              >
                <Send className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
