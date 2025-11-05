import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openAIService } from '@/lib/openai-service';

/**
 * AITextInput Component
 *
 * Enhanced text input with:
 * - Voice input via Whisper
 * - AI-powered smart suggestions
 * - Auto-complete
 * - Context-aware help
 * - Large touch targets for tablet
 *
 * Perfect replacement for standard input fields in forms!
 */

export default function AITextInput({
  value,
  onChange,
  placeholder = "Type or speak...",
  context = "",
  showVoiceButton = true,
  showSuggestions = true,
  multiline = false,
  className = "",
  ...props
}) {
  const [localValue, setLocalValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestionsMenu, setShowSuggestionsMenu] = useState(false);

  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const suggestionsTimeoutRef = useRef(null);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (onChange) {
      onChange(newValue);
    }

    // Debounce suggestions
    if (showSuggestions && newValue.length > 2) {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }

      suggestionsTimeoutRef.current = setTimeout(() => {
        loadSuggestions(newValue);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestionsMenu(false);
    }
  };

  // Load AI suggestions
  const loadSuggestions = async (input) => {
    if (!openAIService.isReady()) return;

    setIsLoadingSuggestions(true);

    try {
      const suggestionsList = await openAIService.getSuggestions(context, input);
      setSuggestions(suggestionsList);
      setShowSuggestionsMenu(suggestionsList.length > 0);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Apply suggestion
  const applySuggestion = (suggestion) => {
    setLocalValue(suggestion);
    if (onChange) {
      onChange(suggestion);
    }
    setShowSuggestionsMenu(false);
    setSuggestions([]);
    inputRef.current?.focus();
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
          setLocalValue(transcript);
          if (onChange) {
            onChange(transcript);
          }
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
      if (isRecording) {
        stopVoiceInput();
      }
    };
  }, []);

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center gap-3">
        {/* Text input */}
        <div className="relative flex-1">
          <InputComponent
            ref={inputRef}
            type={multiline ? undefined : "text"}
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] text-lg ${
              multiline ? 'py-4 min-h-[120px] resize-none' : 'py-4'
            } ${showVoiceButton ? 'pr-16' : ''}`}
            rows={multiline ? 4 : undefined}
            {...props}
          />

          {/* AI indicator */}
          {(isLoadingSuggestions || showSuggestionsMenu) && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {isLoadingSuggestions ? (
                <Loader2 className="w-5 h-5 text-[#FF6A00] animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-[#FF6A00]" />
              )}
            </div>
          )}
        </div>

        {/* Voice button */}
        {showVoiceButton && (
          <Button
            type="button"
            onClick={isRecording ? stopVoiceInput : startVoiceInput}
            className={`w-14 h-14 rounded-full p-0 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/10 hover:bg-white/20 border border-white/20'
            }`}
          >
            <Mic className={`w-6 h-6 text-white ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestionsMenu && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 z-50 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-2">
              <div className="text-xs text-white/60 px-4 py-2 uppercase tracking-wider">
                AI Suggestions
              </div>

              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => applySuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors duration-200 flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4 text-[#FF6A00] flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
