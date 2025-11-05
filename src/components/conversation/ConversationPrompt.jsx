import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

/**
 * ConversationPrompt Component
 *
 * Generic conversation dialog that appears between page transitions
 * Supports different prompt types: question, objection-handler, insight
 * Stores user responses in session/analytics
 */
export default function ConversationPrompt({
  isOpen,
  onClose,
  onSubmit,
  questionId,
  questionType = 'question', // 'question', 'objection', 'insight'
  title,
  description,
  fields = [],
  showSkip = false,
  submitButtonText = 'Continue',
}) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        questionId,
        questionType,
        response: formData,
        timestamp: new Date().toISOString(),
      });
      onClose();
    } catch (error) {
      console.error('Error submitting conversation response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSubmit({
      questionId,
      questionType,
      response: { skipped: true },
      timestamp: new Date().toISOString(),
    });
    onClose();
  };

  const renderField = (field) => {
    const { id, type, label, placeholder, options, required } = field;

    switch (type) {
      case 'text':
      case 'email':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="text-white">
              {label} {required && <span className="text-[#FF6A00]">*</span>}
            </Label>
            <Input
              id={id}
              type={type}
              value={formData[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              placeholder={placeholder}
              required={required}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF6A00]"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="text-white">
              {label} {required && <span className="text-[#FF6A00]">*</span>}
            </Label>
            <Textarea
              id={id}
              value={formData[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              placeholder={placeholder}
              required={required}
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF6A00] resize-none"
            />
          </div>
        );

      case 'radio':
        return (
          <div key={id} className="space-y-3">
            <Label className="text-white">
              {label} {required && <span className="text-[#FF6A00]">*</span>}
            </Label>
            <RadioGroup
              value={formData[id] || ''}
              onValueChange={(value) => handleFieldChange(id, value)}
              className="space-y-2"
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${id}-${option.value}`}
                    className="border-white/30 text-[#FF6A00]"
                  />
                  <Label
                    htmlFor={`${id}-${option.value}`}
                    className="text-white/80 cursor-pointer hover:text-white transition-colors"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'select':
        return (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="text-white">
              {label} {required && <span className="text-[#FF6A00]">*</span>}
            </Label>
            <select
              id={id}
              value={formData[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              required={required}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-[#FF6A00] focus:outline-none"
            >
              <option value="" className="bg-[#1a1a1a]">Select...</option>
              {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#1a1a1a]">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-white/20 max-w-md">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-xs font-semibold text-[#FFD700] uppercase tracking-wider">
                    {questionType === 'objection' ? 'Let\'s Address This' : 'Quick Question'}
                  </span>
                </div>
                <DialogTitle className="text-2xl text-white font-bold">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-white/70 text-base leading-relaxed mt-2">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {fields.map(renderField)}

                <div className="flex gap-3 pt-4">
                  {showSkip && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSkip}
                      className="flex-1 border-white/20 hover:bg-white/10 text-white"
                    >
                      Skip for Now
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 gradient-accent hover-glow text-white font-semibold"
                  >
                    {isSubmitting ? (
                      <>Saving...</>
                    ) : (
                      <>
                        {submitButtonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
