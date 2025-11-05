/**
 * Conversation Panel
 *
 * Displays conversation history and allows text input
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ConversationPanel({ messages, onSendMessage, isConnected, isLoading }) {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !isConnected) return;

    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900/50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Loading AI context...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900/50">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">👋 Hi! I'm DisruptorBot</p>
              <p className="text-gray-500 text-sm">
                I can answer questions about our services, pricing, and how we can help your business.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Ask me anything or click the microphone to speak!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-[#FF6A00] text-white'
                      : 'bg-slate-800 text-gray-100 border border-cyan-500/30'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.timestamp && (
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 bg-slate-800 border-cyan-500/30 focus:border-cyan-500 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!isConnected || !inputValue.trim()}
            className="bg-gradient-to-r from-cyan-500 to-[#FF6A00] hover:from-cyan-600 hover:to-orange-600"
          >
            {isConnected ? (
              <Send className="h-4 w-4" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {isConnected ? "Press Enter to send" : "Connecting to AI..."}
        </p>
      </div>
    </div>
  );
}
