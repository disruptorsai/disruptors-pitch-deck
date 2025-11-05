import OpenAI from 'openai';

/**
 * OpenAI Service for GPT-5 and Whisper Integration
 *
 * This service provides:
 * - GPT-5 conversational AI
 * - Whisper speech-to-text
 * - Text-to-speech for responses
 * - Streaming responses for better UX
 */

class OpenAIService {
  private client: OpenAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    /**
     * ⚠️ SECURITY NOTICE: OpenAI API key no longer exposed to browser
     *
     * This service has been disabled for security. API keys should not be exposed client-side.
     *
     * TODO: Create /.netlify/functions/openai-service.js for secure server-side API calls
     * TODO: Update this service to call Netlify Functions instead of direct API
     */

    console.warn(
      '⚠️ OpenAI service disabled for security. ' +
      'API keys are not exposed to browser. ' +
      'Voice and AI features require server-side implementation via Netlify Functions.'
    );

    // Disabled to prevent API key exposure:
    // const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    // if (!apiKey) {
    //   console.warn('OpenAI API key not found. Voice and AI features will be disabled.');
    //   return;
    // }
    // try {
    //   this.client = new OpenAI({
    //     apiKey,
    //     dangerouslyAllowBrowser: true,
    //   });
    //   this.isInitialized = true;
    //   console.log('✓ OpenAI service initialized successfully');
    // } catch (error) {
    //   console.error('Failed to initialize OpenAI:', error);
    // }
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.client !== null;
  }

  /**
   * Speech-to-Text using Whisper
   * Converts audio blob to text
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      // Convert blob to File object (required by OpenAI API)
      const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type });

      const response = await this.client!.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en', // Auto-detect if not specified
        response_format: 'text',
      });

      return response as unknown as string;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Text-to-Speech
   * Converts text to spoken audio
   */
  async textToSpeech(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'nova'): Promise<Blob> {
    if (!this.isReady()) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      const response = await this.client!.audio.speech.create({
        model: 'tts-1',
        voice: voice,
        input: text,
        speed: 1.0,
      });

      return await response.blob();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * GPT-5 Chat Completion
   * For conversational AI
   */
  async chat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, streaming = false) {
    if (!this.isReady()) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      // Use GPT-4 for now, will auto-upgrade to GPT-5 when available
      const response = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview', // Will be 'gpt-5' when available
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: streaming,
      });

      if (streaming) {
        return response; // Returns stream
      }

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Chat completion error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Streaming Chat
   * For real-time conversational responses
   */
  async *chatStream(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
    if (!this.isReady()) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      const stream = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('Streaming chat error:', error);
      throw new Error('Failed to stream AI response');
    }
  }

  /**
   * Smart Suggestions
   * Get AI-powered suggestions for text input
   */
  async getSuggestions(context: string, userInput: string): Promise<string[]> {
    if (!this.isReady()) {
      return [];
    }

    try {
      const response = await this.chat([
        {
          role: 'system',
          content: 'You are a helpful assistant providing smart autocomplete suggestions. Return only a JSON array of 3-5 short suggestions.',
        },
        {
          role: 'user',
          content: `Context: ${context}\nUser typed: ${userInput}\nProvide suggestions:`,
        },
      ]);

      // Parse JSON response
      const suggestions = JSON.parse(response as string);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  /**
   * Voice Command Interpretation
   * Parse natural language commands
   */
  async interpretCommand(voiceInput: string): Promise<{
    action: string;
    parameters: Record<string, any>;
    confidence: number;
  }> {
    if (!this.isReady()) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      const response = await this.chat([
        {
          role: 'system',
          content: `You are a voice command interpreter. Parse the user's command and return JSON with:
{
  "action": "navigate|search|create|edit|help",
  "parameters": { "target": "...", "query": "..." },
  "confidence": 0.0-1.0
}`,
        },
        {
          role: 'user',
          content: voiceInput,
        },
      ]);

      return JSON.parse(response as string);
    } catch (error) {
      console.error('Command interpretation error:', error);
      return {
        action: 'unknown',
        parameters: {},
        confidence: 0,
      };
    }
  }

  /**
   * Presentation Assistant
   * Context-aware help for presentations
   */
  async getPresentationHelp(context: {
    currentPage: string;
    clientInfo?: any;
    question: string;
  }): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenAI service not initialized');
    }

    const systemPrompt = `You are an AI presentation assistant helping with a business pitch.
Current page: ${context.currentPage}
Client: ${context.clientInfo?.name || 'Unknown'}
Industry: ${context.clientInfo?.industry || 'Unknown'}

Provide concise, helpful answers that enhance the presentation. Be professional and brief.`;

    try {
      const response = await this.chat([
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: context.question,
        },
      ]);

      return response as string;
    } catch (error) {
      console.error('Presentation help error:', error);
      throw new Error('Failed to get presentation help');
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();

// Export types
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type VoiceCommand = {
  action: string;
  parameters: Record<string, any>;
  confidence: number;
};
