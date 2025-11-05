import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openAIService } from '@/lib/openai-service';

/**
 * useVoiceCommands Hook
 *
 * Global voice command system for hands-free navigation
 * Perfect for tablet presentations!
 *
 * Commands supported:
 * - "Go to [page name]" - Navigate to any page
 * - "Next slide" - Move to next page
 * - "Previous slide" - Go back
 * - "Show dashboard" - Open dashboard
 * - "Open AI assistant" - Launch assistant
 * - "Search for [query]" - Search content
 * - Custom commands via callback
 *
 * Usage:
 * const { isListening, startListening, stopListening } = useVoiceCommands({
 *   onCommand: (command) => console.log('Command:', command),
 *   autoStart: true
 * });
 */

export function useVoiceCommands(options = {}) {
  const {
    onCommand,
    autoStart = false,
    continuous = true,
    language = 'en-US',
  } = options;

  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Page mapping for navigation
  const pageMap = {
    home: '/Home',
    dashboard: '/Dashboard',
    introduction: '/Introduction',
    intro: '/Introduction',
    diagnostic: '/Diagnostic',
    'case studies': '/CaseStudies',
    cases: '/CaseStudies',
    capabilities: '/Capabilities',
    blueprint: '/Blueprint',
    'call to action': '/CallToAction',
    cta: '/CallToAction',
    pricing: '/Pricing',
    preview: '/preview',
  };

  // Initialize speech recognition (browser API) as fallback
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      handleVoiceCommand(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      if (continuous && isListening) {
        // Restart if continuous mode
        recognitionRef.current.start();
      } else {
        setIsListening(false);
      }
    };

    if (autoStart) {
      startListening();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle voice command
  const handleVoiceCommand = async (transcript) => {
    console.log('Voice command:', transcript);
    setLastCommand(transcript);

    // Try to interpret command using OpenAI for better accuracy
    try {
      const interpretation = await openAIService.interpretCommand(transcript);

      if (interpretation.confidence > 0.6) {
        executeCommand(interpretation);
      } else {
        // Fallback to simple pattern matching
        executeSimpleCommand(transcript);
      }
    } catch (error) {
      console.error('Command interpretation error:', error);
      // Fallback to simple commands
      executeSimpleCommand(transcript);
    }

    // Call custom callback
    if (onCommand) {
      onCommand(transcript);
    }
  };

  // Execute AI-interpreted command
  const executeCommand = (interpretation) => {
    const { action, parameters } = interpretation;

    switch (action) {
      case 'navigate':
        if (parameters.target) {
          const page = pageMap[parameters.target.toLowerCase()];
          if (page) {
            navigate(page);
          }
        }
        break;

      case 'search':
        if (parameters.query) {
          // Implement search functionality
          console.log('Search:', parameters.query);
        }
        break;

      case 'help':
        // Open AI assistant
        window.dispatchEvent(new CustomEvent('openAIAssistant'));
        break;

      default:
        console.log('Unknown command action:', action);
    }
  };

  // Simple pattern matching fallback
  const executeSimpleCommand = (transcript) => {
    const command = transcript.toLowerCase();

    // Navigation commands
    if (command.includes('go to') || command.includes('navigate to') || command.includes('open')) {
      const targetPage = Object.keys(pageMap).find(page => command.includes(page));
      if (targetPage) {
        navigate(pageMap[targetPage]);
        return;
      }
    }

    // Next/Previous
    if (command.includes('next') || command.includes('forward')) {
      window.dispatchEvent(new CustomEvent('navigateNext'));
      return;
    }

    if (command.includes('previous') || command.includes('back') || command.includes('last')) {
      window.dispatchEvent(new CustomEvent('navigatePrevious'));
      return;
    }

    // AI Assistant
    if (command.includes('assistant') || command.includes('help') || command.includes('ai')) {
      window.dispatchEvent(new CustomEvent('openAIAssistant'));
      return;
    }

    // Dashboard
    if (command.includes('dashboard') || command.includes('menu')) {
      navigate('/Dashboard');
      return;
    }

    console.log('Command not recognized:', transcript);
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setError(error.message);
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    lastCommand,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
