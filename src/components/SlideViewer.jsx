/**
 * SlideViewer Component
 *
 * Displays presentation slides with navigation controls
 * Features:
 * - Next/Previous navigation
 * - Keyboard controls (arrow keys, F for fullscreen)
 * - Slide counter
 * - Progress bar
 * - Fullscreen mode
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SlideViewer({ slides = [], presentation, onSlideChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Guard against empty slides
  if (!slides || slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">No Slides Available</h2>
          <p className="text-gray-400">This presentation does not have any slides yet.</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const totalSlides = slides.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFullscreen]);

  // Track slide changes
  useEffect(() => {
    if (onSlideChange && currentSlide) {
      onSlideChange(currentIndex, currentSlide);
    }
  }, [currentIndex, currentSlide]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const goToNext = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="slide-viewer relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Slide Content */}
      <div className="slide-content flex items-center justify-center h-full p-8 md:p-12 lg:p-16">
        <div className="max-w-6xl w-full">
          {/* Slide Image */}
          {currentSlide.image_url && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={currentSlide.image_url}
                alt={currentSlide.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Slide Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {currentSlide.title}
          </h1>

          {/* Slide Content */}
          {currentSlide.content && (
            <div className="prose prose-lg prose-invert max-w-none">
              <div
                className="text-xl md:text-2xl text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentSlide.content }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 px-4">
        {/* Previous Button */}
        <Button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          variant="secondary"
          size="lg"
          className="shadow-lg hover:shadow-xl transition-shadow"
          title="Previous slide (←)"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Slide Counter */}
        <div className="bg-gray-800/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg">
          {currentIndex + 1} / {totalSlides}
        </div>

        {/* Next Button */}
        <Button
          onClick={goToNext}
          disabled={currentIndex === totalSlides - 1}
          variant="secondary"
          size="lg"
          className="shadow-lg hover:shadow-xl transition-shadow"
          title="Next slide (→)"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Fullscreen Button */}
        <Button
          onClick={toggleFullscreen}
          variant="ghost"
          size="lg"
          className="ml-4 text-white hover:bg-white/10 shadow-lg"
          title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
        >
          {isFullscreen ? (
            <Minimize className="w-6 h-6" />
          ) : (
            <Maximize className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Keyboard Shortcuts Hint (only show on first slide) */}
      {currentIndex === 0 && !isFullscreen && (
        <div className="absolute top-8 right-8 bg-gray-800/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          <p className="font-semibold mb-1">Keyboard shortcuts:</p>
          <p>← → Navigate • F Fullscreen • ESC Exit</p>
        </div>
      )}
    </div>
  );
}
