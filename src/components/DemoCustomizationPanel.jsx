import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Palette,
  Type,
  Zap,
  Image,
  Settings,
  Download,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

/**
 * DEMO CUSTOMIZATION PANEL
 *
 * Live controls panel for customizing demo presentations in real-time.
 * Allows modification of colors, typography, animations, and content.
 *
 * Features:
 * - Real-time preview updates
 * - Collapsible sections
 * - Export customizations
 * - Reset to defaults
 * - Copy configuration
 */

export default function DemoCustomizationPanel({
  isOpen,
  onClose,
  demoConfig = {},
  onConfigChange,
  demoName = "Demo",
}) {
  const [activeSection, setActiveSection] = useState("colors");
  const [config, setConfig] = useState({
    // Color scheme
    primaryColor: demoConfig.primaryColor || "#FF6A00",
    secondaryColor: demoConfig.secondaryColor || "#FFD700",
    backgroundColor: demoConfig.backgroundColor || "#000000",
    textColor: demoConfig.textColor || "#FFFFFF",
    accentColor: demoConfig.accentColor || "#00FFFF",

    // Typography
    headingFont: demoConfig.headingFont || "Inter",
    bodyFont: demoConfig.bodyFont || "Inter",
    fontSize: demoConfig.fontSize || 16,
    fontWeight: demoConfig.fontWeight || "normal",
    letterSpacing: demoConfig.letterSpacing || 0,

    // Animations
    animationSpeed: demoConfig.animationSpeed || 1,
    animationStyle: demoConfig.animationStyle || "smooth",
    enableParallax: demoConfig.enableParallax !== false,
    enable3D: demoConfig.enable3D !== false,
    particleDensity: demoConfig.particleDensity || 50,

    // Layout
    spacing: demoConfig.spacing || "normal",
    borderRadius: demoConfig.borderRadius || 16,
    glassEffect: demoConfig.glassEffect !== false,
    shadowIntensity: demoConfig.shadowIntensity || 50,

    // Content
    companyName: demoConfig.companyName || "Disruptors",
    tagline: demoConfig.tagline || "Transform Your Business",
    heroImage: demoConfig.heroImage || "",
  });

  const [expandedSections, setExpandedSections] = useState({
    colors: true,
    typography: false,
    animations: false,
    layout: false,
    content: false,
  });

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetConfig = () => {
    const defaultConfig = {
      primaryColor: "#FF6A00",
      secondaryColor: "#FFD700",
      backgroundColor: "#000000",
      textColor: "#FFFFFF",
      accentColor: "#00FFFF",
      headingFont: "Inter",
      bodyFont: "Inter",
      fontSize: 16,
      fontWeight: "normal",
      letterSpacing: 0,
      animationSpeed: 1,
      animationStyle: "smooth",
      enableParallax: true,
      enable3D: true,
      particleDensity: 50,
      spacing: "normal",
      borderRadius: 16,
      glassEffect: true,
      shadowIntensity: 50,
      companyName: "Disruptors",
      tagline: "Transform Your Business",
      heroImage: "",
    };
    setConfig(defaultConfig);
    onConfigChange?.(defaultConfig);
  };

  const exportConfig = () => {
    const configJSON = JSON.stringify(config, null, 2);
    const blob = new Blob([configJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${demoName.toLowerCase().replace(/\s+/g, "-")}-config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    // Show toast notification (would need toast component)
    alert("Configuration copied to clipboard!");
  };

  const Section = ({ title, icon: Icon, section, children }) => (
    <div className="border-b border-white/10">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#FF6A00]" />
          <span className="text-white font-medium">{title}</span>
        </div>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-white/60" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/60" />
        )}
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const ColorInput = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <Label className="text-white/80 text-sm">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer bg-transparent border border-white/20"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white/10 border-white/20 text-white"
        />
      </div>
    </div>
  );

  const SliderInput = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = "" }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-white/80 text-sm">{label}</Label>
        <span className="text-white/60 text-sm">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );

  const ToggleInput = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
      <Label className="text-white/80 text-sm">{label}</Label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? "bg-[#FF6A00]" : "bg-white/20"
        }`}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full"
        />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-l border-white/10 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-[#FF6A00]" />
              <div>
                <h2 className="text-xl font-bold text-white">Customize Demo</h2>
                <p className="text-white/60 text-sm">{demoName}</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex-1 overflow-y-auto">
            <TooltipProvider>
              {/* Colors Section */}
              <Section title="Colors" icon={Palette} section="colors">
                <ColorInput
                  label="Primary Color"
                  value={config.primaryColor}
                  onChange={(val) => updateConfig("primaryColor", val)}
                />
                <ColorInput
                  label="Secondary Color"
                  value={config.secondaryColor}
                  onChange={(val) => updateConfig("secondaryColor", val)}
                />
                <ColorInput
                  label="Background Color"
                  value={config.backgroundColor}
                  onChange={(val) => updateConfig("backgroundColor", val)}
                />
                <ColorInput
                  label="Text Color"
                  value={config.textColor}
                  onChange={(val) => updateConfig("textColor", val)}
                />
                <ColorInput
                  label="Accent Color"
                  value={config.accentColor}
                  onChange={(val) => updateConfig("accentColor", val)}
                />
              </Section>

              {/* Typography Section */}
              <Section title="Typography" icon={Type} section="typography">
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Heading Font</Label>
                  <Select
                    value={config.headingFont}
                    onValueChange={(val) => updateConfig("headingFont", val)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="Inter" className="text-white">Inter</SelectItem>
                      <SelectItem value="Poppins" className="text-white">Poppins</SelectItem>
                      <SelectItem value="Montserrat" className="text-white">Montserrat</SelectItem>
                      <SelectItem value="Playfair Display" className="text-white">Playfair Display</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <SliderInput
                  label="Font Size"
                  value={config.fontSize}
                  onChange={(val) => updateConfig("fontSize", val)}
                  min={12}
                  max={24}
                  unit="px"
                />
                <SliderInput
                  label="Letter Spacing"
                  value={config.letterSpacing}
                  onChange={(val) => updateConfig("letterSpacing", val)}
                  min={-2}
                  max={4}
                  step={0.1}
                  unit="px"
                />
              </Section>

              {/* Animations Section */}
              <Section title="Animations" icon={Zap} section="animations">
                <SliderInput
                  label="Animation Speed"
                  value={config.animationSpeed}
                  onChange={(val) => updateConfig("animationSpeed", val)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  unit="x"
                />
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Animation Style</Label>
                  <Select
                    value={config.animationStyle}
                    onValueChange={(val) => updateConfig("animationStyle", val)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="smooth" className="text-white">Smooth</SelectItem>
                      <SelectItem value="bouncy" className="text-white">Bouncy</SelectItem>
                      <SelectItem value="linear" className="text-white">Linear</SelectItem>
                      <SelectItem value="elastic" className="text-white">Elastic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ToggleInput
                  label="Enable Parallax"
                  value={config.enableParallax}
                  onChange={(val) => updateConfig("enableParallax", val)}
                />
                <ToggleInput
                  label="Enable 3D Effects"
                  value={config.enable3D}
                  onChange={(val) => updateConfig("enable3D", val)}
                />
                <SliderInput
                  label="Particle Density"
                  value={config.particleDensity}
                  onChange={(val) => updateConfig("particleDensity", val)}
                  min={0}
                  max={100}
                  unit="%"
                />
              </Section>

              {/* Layout Section */}
              <Section title="Layout" icon={Settings} section="layout">
                <SliderInput
                  label="Border Radius"
                  value={config.borderRadius}
                  onChange={(val) => updateConfig("borderRadius", val)}
                  min={0}
                  max={32}
                  unit="px"
                />
                <SliderInput
                  label="Shadow Intensity"
                  value={config.shadowIntensity}
                  onChange={(val) => updateConfig("shadowIntensity", val)}
                  min={0}
                  max={100}
                  unit="%"
                />
                <ToggleInput
                  label="Glass Effect"
                  value={config.glassEffect}
                  onChange={(val) => updateConfig("glassEffect", val)}
                />
              </Section>

              {/* Content Section */}
              <Section title="Content" icon={Type} section="content">
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Company Name</Label>
                  <Input
                    value={config.companyName}
                    onChange={(e) => updateConfig("companyName", e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Tagline</Label>
                  <Input
                    value={config.tagline}
                    onChange={(e) => updateConfig("tagline", e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Hero Image URL</Label>
                  <Input
                    value={config.heroImage}
                    onChange={(e) => updateConfig("heroImage", e.target.value)}
                    placeholder="https://..."
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </Section>
            </TooltipProvider>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/10 bg-white/5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={exportConfig}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download configuration JSON</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={copyConfig}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy configuration to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Button
              onClick={resetConfig}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
