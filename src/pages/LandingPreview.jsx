import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTouchGestures from "@/hooks/use-touch-gestures";
import { X, ChevronLeft, ChevronRight, Layout, Sparkles, Grid3x3, Maximize2, Play, Pause, RotateCcw, Info, Columns2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DemoCustomizationPanel from "@/components/DemoCustomizationPanel";

// Import all versions
import HomeV1 from "./HomeV1";
import HomeV2 from "./HomeV2";
import HomeV3 from "./HomeV3";
import HomeV4 from "./HomeV4";
import HomeV5 from "./HomeV5";
import HomeV6 from "./HomeV6";
import HomeV7 from "./HomeV7";
import HomeV8 from "./HomeV8";

/**
 * LANDING PAGE PREVIEW SELECTOR
 *
 * This component allows you to preview and switch between all 8 landing page versions.
 * Perfect for client presentations on your tablet!
 *
 * Features:
 * - Easy navigation between versions
 * - Preview cards with descriptions
 * - Touch-optimized controls
 * - Fullscreen preview mode
 */

const versions = [
  {
    id: 1,
    name: "Holographic Cards",
    description: "3D floating cards with tilt effects and holographic shimmer",
    component: HomeV1,
    color: "from-#FFD700 to-pink-500",
    category: "Interactive",
    tags: ["3D", "Touch", "Premium", "Tech"],
    performance: "High",
    bestFor: "Tech companies, SaaS platforms",
  },
  {
    id: 2,
    name: "Liquid Morphing",
    description: "Organic liquid blobs that morph and flow with animations",
    component: HomeV2,
    color: "from-orange-500 to-red-500",
    category: "Animated",
    tags: ["Organic", "Creative", "Bold", "Modern"],
    performance: "Medium",
    bestFor: "Creative agencies, design studios",
  },
  {
    id: 3,
    name: "Particle Network",
    description: "Touch-reactive particle system forming dynamic connections",
    component: HomeV3,
    color: "from-blue-500 to-cyan-500",
    category: "Interactive",
    tags: ["Particles", "Network", "Tech", "Dynamic"],
    performance: "Medium",
    bestFor: "Tech startups, networking platforms",
  },
  {
    id: 4,
    name: "Glassmorphism",
    description: "Multi-layer frosted glass with depth and parallax effects",
    component: HomeV4,
    color: "from-indigo-500 to-#FFD700",
    category: "Modern",
    tags: ["Glass", "Elegant", "Layered", "Premium"],
    performance: "High",
    bestFor: "Enterprise, financial services",
  },
  {
    id: 5,
    name: "Cinematic Video",
    description: "Cinema-quality presentation with film grain and letterbox",
    component: HomeV5,
    color: "from-gray-700 to-gray-900",
    category: "Media",
    tags: ["Video", "Cinematic", "Dramatic", "Storytelling"],
    performance: "Low",
    bestFor: "Production companies, media agencies",
  },
  {
    id: 6,
    name: "3D Spiral",
    description: "Rotating 3D carousel showcase with touch drag controls",
    component: HomeV6,
    color: "from-orange-500 to-#FFD700",
    category: "3D",
    tags: ["3D", "Carousel", "Interactive", "Bold"],
    performance: "Medium",
    bestFor: "Product showcases, portfolios",
  },
  {
    id: 7,
    name: "Mesh Gradient",
    description: "Apple-style animated mesh gradient with minimal design",
    component: HomeV7,
    color: "from-pink-500 to-yellow-500",
    category: "Minimal",
    tags: ["Minimal", "Apple", "Clean", "Modern"],
    performance: "High",
    bestFor: "Consumer tech, lifestyle brands",
  },
  {
    id: 8,
    name: "Split Parallax",
    description: "Dramatic split-screen with opposing parallax movements",
    component: HomeV8,
    color: "from-red-500 to-orange-500",
    category: "Dynamic",
    tags: ["Parallax", "Split", "Bold", "Dramatic"],
    performance: "High",
    bestFor: "Marketing agencies, consultancies",
  },
];

export default function LandingPreview() {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showSelector, setShowSelector] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonVersions, setComparisonVersions] = useState([]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [demoConfig, setDemoConfig] = useState({});
  const [showTouchHint, setShowTouchHint] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedVersion && !showSelector) {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevious();
            break;
          case 'ArrowRight':
            handleNext();
            break;
          case 'Escape':
            if (showCustomization) {
              setShowCustomization(false);
            } else if (showInfo) {
              setShowInfo(false);
            } else {
              handleBack();
            }
            break;
          case 'f':
          case 'F':
            toggleFullscreen();
            break;
          case 'i':
          case 'I':
            setShowInfo(prev => !prev);
            break;
          case 'c':
          case 'C':
            setShowCustomization(prev => !prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedVersion, showSelector, showCustomization, showInfo]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && selectedVersion && !showSelector) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, selectedVersion, showSelector]);

  // Touch gesture support for mobile/tablet
  useTouchGestures(
    {
      onSwipeLeft: () => {
        if (selectedVersion && !showSelector) {
          handleNext();
          setShowTouchHint(false); // Hide hint after first gesture
        }
      },
      onSwipeRight: () => {
        if (selectedVersion && !showSelector) {
          handlePrevious();
          setShowTouchHint(false);
        }
      },
      onSwipeDown: () => {
        if (selectedVersion && !showSelector && !showInfo && !showCustomization) {
          handleBack();
          setShowTouchHint(false);
        }
      },
      onDoubleTap: () => {
        if (selectedVersion && !showSelector) {
          toggleFullscreen();
          setShowTouchHint(false);
        }
      },
    },
    {
      swipeThreshold: 75, // Require a bit more distance to avoid accidental swipes
      doubleTapDelay: 300,
    }
  );

  // Show touch hint on mobile when entering preview mode
  useEffect(() => {
    if (selectedVersion && !showSelector && 'ontouchstart' in window) {
      setShowTouchHint(true);
      const timer = setTimeout(() => {
        setShowTouchHint(false);
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [selectedVersion, showSelector]);

  // Filter versions based on search and filters
  const filteredVersions = versions.filter(version => {
    const matchesSearch = version.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         version.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         version.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || version.category === categoryFilter;
    const matchesPerformance = performanceFilter === "all" || version.performance === performanceFilter;

    return matchesSearch && matchesCategory && matchesPerformance;
  });

  const handlePreview = (version) => {
    setSelectedVersion(version);
    setShowSelector(false);
  };

  const handleNext = () => {
    const currentIndex = versions.findIndex(v => v.id === selectedVersion.id);
    const nextIndex = (currentIndex + 1) % versions.length;
    setSelectedVersion(versions[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = versions.findIndex(v => v.id === selectedVersion.id);
    const previousIndex = (currentIndex - 1 + versions.length) % versions.length;
    setSelectedVersion(versions[previousIndex]);
  };

  const handleBack = () => {
    setSelectedVersion(null);
    setShowSelector(true);
    setIsAutoPlay(false);
    setShowInfo(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleComparison = (version) => {
    if (comparisonVersions.find(v => v.id === version.id)) {
      setComparisonVersions(comparisonVersions.filter(v => v.id !== version.id));
    } else if (comparisonVersions.length < 2) {
      setComparisonVersions([...comparisonVersions, version]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setPerformanceFilter("all");
  };

  const categories = ["all", ...new Set(versions.map(v => v.category))];
  const performances = ["all", "High", "Medium", "Low"];

  // Render selected version
  if (selectedVersion && !showSelector) {
    const VersionComponent = selectedVersion.component;

    return (
      <TooltipProvider>
        <div className="relative min-h-screen">
          {/* Version content */}
          <VersionComponent />

          {/* Touch Gesture Hint for Mobile */}
          <AnimatePresence>
            {showTouchHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center"
              >
                <div className="bg-black/60 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 max-w-sm mx-4">
                  <div className="text-center space-y-3">
                    <div className="text-white/90 font-medium text-lg">Touch Gestures</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col items-center gap-1 text-white/70">
                        <span>←</span>
                        <span>Swipe Right</span>
                        <span className="text-xs">Previous</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/70">
                        <span>→</span>
                        <span>Swipe Left</span>
                        <span className="text-xs">Next</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/70">
                        <span>↓</span>
                        <span>Swipe Down</span>
                        <span className="text-xs">Exit</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/70">
                        <span>✌️</span>
                        <span>Double Tap</span>
                        <span className="text-xs">Fullscreen</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, x: 400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 400 }}
                className="fixed right-0 top-0 bottom-0 w-96 bg-black/95 backdrop-blur-xl border-l border-white/20 z-[99] p-8 overflow-y-auto"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Demo Info</h2>
                    <Button
                      onClick={() => setShowInfo(false)}
                      size="sm"
                      variant="ghost"
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedVersion.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{selectedVersion.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70 text-sm">Category</span>
                      <span className="text-white font-medium">{selectedVersion.category}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70 text-sm">Performance</span>
                      <span className={`font-medium ${
                        selectedVersion.performance === 'High' ? 'text-green-400' :
                        selectedVersion.performance === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
                      }`}>
                        {selectedVersion.performance}
                      </span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70 text-sm block mb-2">Best For</span>
                      <span className="text-white text-sm">{selectedVersion.bestFor}</span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70 text-sm block mb-2">Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedVersion.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-white/10 rounded-full text-white text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-white font-medium mb-3">Keyboard Shortcuts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-white/70">
                        <span>Previous/Next</span>
                        <span className="px-2 py-1 bg-white/10 rounded text-xs">← →</span>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span>Back to Grid</span>
                        <span className="px-2 py-1 bg-white/10 rounded text-xs">Esc</span>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span>Fullscreen</span>
                        <span className="px-2 py-1 bg-white/10 rounded text-xs">F</span>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span>Toggle Info</span>
                        <span className="px-2 py-1 bg-white/10 rounded text-xs">I</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation overlay */}
          <div className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[100] max-w-[95vw]">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-x-auto"
            >
              {/* Previous Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePrevious}
                    size="sm"
                    className="w-12 h-12 md:w-11 md:h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border-0 p-0 transition-all touch-manipulation"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous (←)</p>
                </TooltipContent>
              </Tooltip>

              {/* Auto-play Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    size="sm"
                    className={`w-11 h-11 rounded-xl border-0 p-0 transition-all ${
                      isAutoPlay ? 'bg-[#FF6A00] hover:bg-[#FF6A00]/80' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {isAutoPlay ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isAutoPlay ? 'Pause' : 'Auto-play'}</p>
                </TooltipContent>
              </Tooltip>

              {/* Version Info */}
              <div className="text-center px-6 min-w-[280px]">
                <div className="text-white font-bold text-base flex items-center justify-center gap-2">
                  <span className="text-white/50">#{selectedVersion.id}</span>
                  {selectedVersion.name}
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {selectedVersion.category} • {selectedVersion.performance} Performance
                </div>
              </div>

              {/* Next Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="w-12 h-12 md:w-11 md:h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border-0 p-0 transition-all touch-manipulation"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next (→)</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-8 bg-white/20" />

              {/* Info Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowInfo(!showInfo)}
                    size="sm"
                    className={`w-12 h-12 md:w-11 md:h-11 rounded-xl border-0 p-0 transition-all touch-manipulation ${
                      showInfo ? 'bg-[#FF6A00] hover:bg-[#FF6A00]/80 active:bg-[#FF6A00]/90' : 'bg-white/10 hover:bg-white/20 active:bg-white/30'
                    }`}
                  >
                    <Info className="w-5 h-5 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Info (I)</p>
                </TooltipContent>
              </Tooltip>

              {/* Customization Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowCustomization(!showCustomization)}
                    size="sm"
                    className={`w-12 h-12 md:w-11 md:h-11 rounded-xl border-0 p-0 transition-all touch-manipulation ${
                      showCustomization ? 'bg-[#FF6A00] hover:bg-[#FF6A00]/80 active:bg-[#FF6A00]/90' : 'bg-white/10 hover:bg-white/20 active:bg-white/30'
                    }`}
                  >
                    <Settings className="w-5 h-5 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customize (C)</p>
                </TooltipContent>
              </Tooltip>

              {/* Fullscreen Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    className="w-12 h-12 md:w-11 md:h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border-0 p-0 transition-all touch-manipulation"
                  >
                    <Maximize2 className="w-5 h-5 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fullscreen (F)</p>
                </TooltipContent>
              </Tooltip>

              {/* Back to Grid */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleBack}
                    size="sm"
                    className="w-12 h-12 md:w-11 md:h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border-0 p-0 transition-all touch-manipulation"
                  >
                    <Grid3x3 className="w-5 h-5 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Grid (Esc)</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </div>

          {/* Customization Panel */}
          <DemoCustomizationPanel
            isOpen={showCustomization}
            onClose={() => setShowCustomization(false)}
            demoConfig={demoConfig}
            onConfigChange={setDemoConfig}
            demoName={selectedVersion.name}
          />
        </div>
      </TooltipProvider>
    );
  }

  // Render version selector
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <span className="text-white/80 text-sm uppercase tracking-wider">Landing Page Gallery</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Choose Your Style
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {filteredVersions.length} cutting-edge landing page design{filteredVersions.length !== 1 ? 's' : ''} optimized for presentations
            </p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              {/* Search */}
              <div className="flex-1 w-full md:max-w-sm">
                <Input
                  type="text"
                  placeholder="Search demos by name, tag, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF6A00] h-11"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Performance Filter */}
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white h-11">
                  <SelectValue placeholder="Performance" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {performances.map(perf => (
                    <SelectItem key={perf} value={perf} className="text-white hover:bg-white/10">
                      {perf.charAt(0).toUpperCase() + perf.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Reset Filters */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10 text-white h-11 px-4"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset filters</p>
                </TooltipContent>
              </Tooltip>

              {/* Comparison Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setComparisonMode(!comparisonMode);
                      if (!comparisonMode) setComparisonVersions([]);
                    }}
                    className={`h-11 px-4 transition-all ${
                      comparisonMode
                        ? 'bg-[#FF6A00] hover:bg-[#FF6A00]/80 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white border-0'
                    }`}
                  >
                    <Columns2 className="w-4 h-4 mr-2" />
                    Compare
                    {comparisonVersions.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-black/30 rounded-full text-xs">
                        {comparisonVersions.length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compare up to 2 demos side-by-side</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || categoryFilter !== "all" || performanceFilter !== "all") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {searchQuery && (
                  <span className="px-3 py-1 bg-white/10 rounded-full text-white text-sm flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-[#FF6A00]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {categoryFilter !== "all" && (
                  <span className="px-3 py-1 bg-white/10 rounded-full text-white text-sm flex items-center gap-2">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter("all")} className="hover:text-[#FF6A00]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {performanceFilter !== "all" && (
                  <span className="px-3 py-1 bg-white/10 rounded-full text-white text-sm flex items-center gap-2">
                    Performance: {performanceFilter}
                    <button onClick={() => setPerformanceFilter("all")} className="hover:text-[#FF6A00]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </motion.div>
            )}

            {/* Comparison Mode Notice */}
            {comparisonMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-xl"
              >
                <p className="text-white text-sm">
                  Select up to 2 demos to compare side-by-side.
                  {comparisonVersions.length === 2 && (
                    <Button
                      onClick={() => {
                        // Open comparison view (to be implemented)
                        alert("Comparison view feature coming soon!");
                      }}
                      size="sm"
                      className="ml-3 bg-[#FF6A00] hover:bg-[#FF6A00]/80 text-white"
                    >
                      Compare Now
                    </Button>
                  )}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Version grid */}
          {filteredVersions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVersions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <div className="relative">
                    {/* Comparison Mode Checkbox */}
                    {comparisonMode && (
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => toggleComparison(version)}
                          disabled={!comparisonVersions.find(v => v.id === version.id) && comparisonVersions.length >= 2}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            comparisonVersions.find(v => v.id === version.id)
                              ? 'bg-[#FF6A00] border-[#FF6A00]'
                              : 'bg-white/10 border-white/30 hover:border-white/60'
                          }`}
                        >
                          {comparisonVersions.find(v => v.id === version.id) && (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => !comparisonMode && handlePreview(version)}
                      disabled={comparisonMode}
                      className="group relative w-full h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 disabled:cursor-default"
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${version.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

                      {/* Noise texture */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                      {/* Category badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/20">
                          {version.category}
                        </span>
                      </div>

                      {/* Performance indicator */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          version.performance === 'High' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          version.performance === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        }`}>
                          {version.performance} Performance
                        </span>
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-6xl font-black text-white/20 mb-4">
                          0{version.id}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">
                          {version.name}
                        </h3>

                        <p className="text-white/70 text-sm leading-relaxed mb-4">
                          {version.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 justify-center mb-6">
                          {version.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/10 rounded text-white/60 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {!comparisonMode && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium group-hover:bg-white/20 transition-colors duration-300">
                            <Play className="w-4 h-4" />
                            Preview
                          </div>
                        )}
                      </div>

                      {/* Hover gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No demos found</h3>
              <p className="text-white/60 mb-6">Try adjusting your filters or search terms</p>
              <Button
                onClick={resetFilters}
                className="bg-[#FF6A00] hover:bg-[#FF6A00]/80 text-white"
              >
                Reset Filters
              </Button>
            </motion.div>
          )}

          {/* Footer hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center mt-16 space-y-2"
          >
            <p className="text-white/50 text-sm">
              Click any design to preview in fullscreen • Use keyboard shortcuts for navigation
            </p>
            <div className="flex justify-center gap-4 text-white/40 text-xs">
              <span>← → Navigate</span>
              <span>Esc Exit</span>
              <span>F Fullscreen</span>
              <span>I Info</span>
              <span>C Customize</span>
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
