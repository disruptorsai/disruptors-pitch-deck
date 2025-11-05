import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openAIService } from '@/lib/openai-service';

/**
 * VoiceInput Component
 *
 * Touch-optimized voice input using Whisper API
 * Perfect for tablet presentations where keyboard input is awkward
 *
 * Features:
 * - Push-to-talk or continuous recording
 * - Real-time audio visualization
 * - Whisper transcription
 * - Touch-optimized large buttons (80px+)
 * - Auto-submit after transcription
 */

export default function VoiceInput({
  onTranscript,
  placeholder = "Tap to speak...",
  autoSubmit = false,
  showWaveform = true,
  className = "",
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize audio visualization
  const initializeAudioVisualization = (stream) => {
    if (!showWaveform || !canvasRef.current) return;

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;

    drawWaveform();
  };

  // Draw audio waveform
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#FF6A00');
        gradient.addColorStop(1, '#FF8C00');

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
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

      mediaRecorderRef.current.onstop = handleRecordingStop;

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Initialize visualization
      if (showWaveform) {
        initializeAudioVisualization(stream);
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Microphone access denied. Please enable microphone permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

      // Stop visualization
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  // Handle recording stop
  const handleRecordingStop = async () => {
    setIsProcessing(true);

    try {
      // Create blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      // Transcribe using Whisper
      const transcriptText = await openAIService.transcribeAudio(audioBlob);

      setTranscript(transcriptText);
      setIsProcessing(false);

      // Callback with transcript
      if (onTranscript) {
        onTranscript(transcriptText);
      }

      // Auto-submit if enabled
      if (autoSubmit) {
        setTranscript('');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio. Please try again.');
      setIsProcessing(false);
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Voice input container */}
      <div className="relative">
        {/* Transcript display */}
        {transcript && !autoSubmit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-white/60 mb-2">Transcript:</div>
                <div className="text-white text-lg">{transcript}</div>
              </div>
              <Button
                onClick={() => setTranscript('')}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                Clear
              </Button>
            </div>
          </motion.div>
        )}

        {/* Recording interface */}
        <div className="flex items-center gap-4">
          {/* Voice button - LARGE for tablet */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-500/50'
                : 'bg-gradient-to-br from-[#FF6A00] to-orange-600 hover:from-[#FF6A00] hover:to-orange-700 shadow-xl shadow-[#FF6A00]/30'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : isRecording ? (
              <>
                <MicOff className="w-10 h-10 text-white" />
                {/* Pulse animation when recording */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-red-500"
                />
              </>
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </motion.button>

          {/* Waveform visualization */}
          {showWaveform && (
            <div className="flex-1 h-20 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              {isRecording ? (
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={80}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white/40 text-lg">
                  {placeholder}
                </div>
              )}
            </div>
          )}

          {/* Status indicator */}
          <div className="flex flex-col items-center gap-2">
            <AnimatePresence mode="wait">
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center gap-2 text-red-400"
                >
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium">Recording...</span>
                </motion.div>
              )}

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center gap-2 text-[#FF6A00]"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Processing...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20"
          >
            <div className="text-red-400 text-sm">{error}</div>
          </motion.div>
        )}

        {/* Help text */}
        <div className="mt-4 text-center text-white/40 text-sm">
          {isRecording
            ? 'Tap the button again to stop recording'
            : 'Tap and hold to speak, or tap once to start recording'}
        </div>
      </div>
    </div>
  );
}
