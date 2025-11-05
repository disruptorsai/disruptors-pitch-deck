import React, { createContext, useContext, useEffect, useState } from 'react';
import AIAssistant from './AIAssistant';
import { useVoiceCommands } from '@/hooks/use-voice-commands';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * AIProvider - Global AI Features Provider
 *
 * Wraps the entire application and provides:
 * - Floating AI Assistant (accessible anywhere)
 * - Global voice commands
 * - Voice navigation control
 * - Context management for AI features
 *
 * Usage:
 * Wrap your app with <AIProvider> in App.jsx or index.jsx
 */

const AIContext = createContext({
  isAssistantOpen: false,
  openAssistant: () => {},
  closeAssistant: () => {},
  toggleAssistant: () => {},
  isVoiceEnabled: false,
  toggleVoice: () => {},
});

export const useAI = () => useContext(AIContext);

export default function AIProvider({ children }) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showVoiceControl, setShowVoiceControl] = useState(true);

  // Voice commands hook
  const { isListening, toggleListening } = useVoiceCommands({
    autoStart: false, // Don't auto-start, let user enable
    continuous: true,
    onCommand: (command) => {
      console.log('Voice command received:', command);
    },
  });

  // Listen for global events
  useEffect(() => {
    const handleOpenAssistant = () => setIsAssistantOpen(true);

    window.addEventListener('openAIAssistant', handleOpenAssistant);

    return () => {
      window.removeEventListener('openAIAssistant', handleOpenAssistant);
    };
  }, []);

  const contextValue = {
    isAssistantOpen,
    openAssistant: () => setIsAssistantOpen(true),
    closeAssistant: () => setIsAssistantOpen(false),
    toggleAssistant: () => setIsAssistantOpen(prev => !prev),
    isVoiceEnabled: isListening,
    toggleVoice: toggleListening,
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}

      {/* Global AI Assistant */}
      <AIAssistant />

      {/* Voice Control Toggle - Bottom Left */}
      {showVoiceControl && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-8 left-8 z-40"
        >
          <Button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50'
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-7 h-7 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-red-500"
                />
              </>
            ) : (
              <Mic className="w-7 h-7 text-white" />
            )}
          </Button>

          {/* Status indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 whitespace-nowrap"
              >
                <div className="flex items-center gap-2 text-white text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Voice Commands Active
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AIContext.Provider>
  );
}
