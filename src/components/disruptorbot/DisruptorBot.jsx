/**
 * DisruptorBot - AI Voice Assistant Component
 *
 * Main component that provides a floating voice assistant that clients can interact with.
 * Features:
 * - Floating activation button
 * - 3D particle visualization that reacts to audio
 * - Voice and text conversation capabilities
 * - Context-aware AI powered by Claude via ElevenLabs
 */

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DisruptorBotCanvas } from './DisruptorBotCanvas';
import { ConversationPanel } from './ConversationPanel';
import { use3DConversation } from '@/hooks/use-disruptorbot';
import { buildDisruptorBotContext } from '@/lib/context-builder';

export default function DisruptorBot({ clientId, currentSlideSlug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [context, setContext] = useState(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    startConversation,
    stopConversation,
    sendMessage,
    toggleMicrophone,
    audioLevel
  } = use3DConversation();

  // Build AI context when component mounts or slide changes
  useEffect(() => {
    async function loadContext() {
      if (!clientId) return;

      setIsLoadingContext(true);
      try {
        const ctx = await buildDisruptorBotContext(clientId, currentSlideSlug);
        setContext(ctx);
      } catch (error) {
        console.error('Failed to build DisruptorBot context:', error);
      } finally {
        setIsLoadingContext(false);
      }
    }

    loadContext();
  }, [clientId, currentSlideSlug]);

  // Handle opening the assistant
  const handleOpen = async () => {
    setIsOpen(true);
    if (!isConnected && context) {
      await startConversation(context);
    }
  };

  // Handle closing the assistant
  const handleClose = () => {
    setIsOpen(false);
    if (isConnected) {
      stopConversation();
    }
  };

  // Don't render if no client ID
  if (!clientId) {
    return null;
  }

  return (
    <>
      {/* Floating Activation Button */}
      {!isOpen && (
        <Button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-[#FF6A00] p-0 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110"
          aria-label="Open DisruptorBot AI Assistant"
        >
          <div className="relative">
            <MessageCircle className="h-8 w-8 text-white" />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500" />
              </span>
            )}
          </div>
        </Button>
      )}

      {/* Main DisruptorBot Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[600px] p-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-cyan-500/30">
          <DialogHeader className="px-6 py-4 border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-[#FFD700] bg-clip-text text-transparent">
                DisruptorBot AI Assistant
              </DialogTitle>
              <div className="flex items-center gap-2">
                {/* Microphone Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMicrophone}
                  className={isListening ? 'text-cyan-400' : 'text-gray-400'}
                  disabled={!isConnected}
                >
                  {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex h-[calc(600px-80px)]">
            {/* 3D Visualization Panel */}
            <div className="w-1/2 relative bg-black/20">
              <DisruptorBotCanvas
                audioLevel={audioLevel}
                isSpeaking={isSpeaking}
                isListening={isListening}
                isConnected={isConnected}
              />

              {/* Status Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-cyan-500/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {isConnected ? (
                        isSpeaking ? (
                          <span className="flex items-center gap-2 text-cyan-400">
                            <Volume2 className="h-4 w-4 animate-pulse" />
                            Speaking...
                          </span>
                        ) : isListening ? (
                          <span className="flex items-center gap-2 text-cyan-400">
                            <Mic className="h-4 w-4 animate-pulse" />
                            Listening...
                          </span>
                        ) : (
                          <span className="text-gray-400">Ready</span>
                        )
                      ) : (
                        <span className="text-gray-500">Connecting...</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      Powered by Claude & ElevenLabs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Panel */}
            <div className="w-1/2 flex flex-col">
              <ConversationPanel
                messages={messages}
                onSendMessage={sendMessage}
                isConnected={isConnected}
                isLoading={isLoadingContext || !context}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
