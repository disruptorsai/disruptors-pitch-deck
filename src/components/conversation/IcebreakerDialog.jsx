import React from 'react';
import ConversationPrompt from './ConversationPrompt';

/**
 * IcebreakerDialog Component
 *
 * First conversation checkpoint - appears after Home page, before Introduction
 * Collects: Company name, industry, main challenge
 * Purpose: Warm introduction and initial context gathering
 */
export default function IcebreakerDialog({ isOpen, onClose, onSubmit }) {
  const fields = [
    {
      id: 'company_name',
      type: 'text',
      label: 'What\'s your company name?',
      placeholder: 'e.g., Acme Healthcare',
      required: true,
    },
    {
      id: 'industry',
      type: 'select',
      label: 'Which industry are you in?',
      required: true,
      options: [
        { value: 'healthcare', label: 'Healthcare & Medical Services' },
        { value: 'ecommerce', label: 'E-Commerce & Retail' },
        { value: 'saas', label: 'SaaS & Technology' },
        { value: 'professional-services', label: 'Professional Services' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'finance', label: 'Finance & Insurance' },
        { value: 'education', label: 'Education & Training' },
        { value: 'hospitality', label: 'Hospitality & Travel' },
        { value: 'manufacturing', label: 'Manufacturing & Industrial' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'main_challenge',
      type: 'textarea',
      label: 'What\'s your biggest marketing challenge right now?',
      placeholder: 'e.g., We\'re struggling to generate qualified leads consistently...',
      required: false,
    },
  ];

  return (
    <ConversationPrompt
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      questionId="icebreaker"
      questionType="icebreaker"
      title="Let's Get to Know Each Other"
      description="Help us personalize this presentation for your business. This will take just 30 seconds."
      fields={fields}
      showSkip={true}
      submitButtonText="Let's Get Started"
    />
  );
}
