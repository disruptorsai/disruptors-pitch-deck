import React from 'react';
import ConversationPrompt from './ConversationPrompt';

/**
 * ICPQuestionnaire Component
 *
 * Second conversation checkpoint - appears after Diagnostic, before Case Studies
 * Collects: Revenue goals, current marketing spend, team size
 * Purpose: Qualify lead and personalize service recommendations
 */
export default function ICPQuestionnaire({ isOpen, onClose, onSubmit }) {
  const fields = [
    {
      id: 'revenue_goal',
      type: 'select',
      label: 'What\'s your primary revenue goal for the next 12 months?',
      required: true,
      options: [
        { value: 'maintain', label: 'Maintain current revenue' },
        { value: 'grow-10-25', label: 'Grow 10-25%' },
        { value: 'grow-25-50', label: 'Grow 25-50%' },
        { value: 'grow-50-100', label: 'Grow 50-100%' },
        { value: 'grow-100plus', label: 'Grow 100%+' },
        { value: 'not-sure', label: 'Not sure yet' },
      ],
    },
    {
      id: 'current_marketing_spend',
      type: 'select',
      label: 'What\'s your current monthly marketing budget?',
      required: true,
      options: [
        { value: 'under-1k', label: 'Under $1,000' },
        { value: '1k-5k', label: '$1,000 - $5,000' },
        { value: '5k-10k', label: '$5,000 - $10,000' },
        { value: '10k-25k', label: '$10,000 - $25,000' },
        { value: '25k-50k', label: '$25,000 - $50,000' },
        { value: 'over-50k', label: 'Over $50,000' },
        { value: 'not-sure', label: 'Not sure / Need guidance' },
      ],
    },
    {
      id: 'team_size',
      type: 'select',
      label: 'How many people are on your marketing team?',
      required: true,
      options: [
        { value: 'just-me', label: 'Just me (solopreneur)' },
        { value: '2-5', label: '2-5 people' },
        { value: '6-10', label: '6-10 people' },
        { value: '11-25', label: '11-25 people' },
        { value: 'over-25', label: 'Over 25 people' },
        { value: 'no-team', label: 'No dedicated marketing team yet' },
      ],
    },
    {
      id: 'timeline',
      type: 'radio',
      label: 'When are you looking to get started?',
      required: false,
      options: [
        { value: 'asap', label: 'As soon as possible (this week)' },
        { value: '1-2-weeks', label: 'Within 1-2 weeks' },
        { value: '1-month', label: 'Within a month' },
        { value: 'exploring', label: 'Just exploring options' },
      ],
    },
  ];

  return (
    <ConversationPrompt
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      questionId="icp_qualification"
      questionType="icp"
      title="Let's Double Down on What's Working"
      description="Based on the diagnostic results, we want to understand your goals so we can show you the most relevant solutions."
      fields={fields}
      showSkip={true}
      submitButtonText="Show Me the Proof"
    />
  );
}
