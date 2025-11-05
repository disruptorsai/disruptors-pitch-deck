import React from 'react';
import ConversationPrompt from './ConversationPrompt';

/**
 * ObjectionHandler Component
 *
 * Final conversation checkpoint - appears after Pricing, before CTA
 * Addresses: Past failures, guarantees, timeline concerns
 * Purpose: Overcome final objections and build confidence
 */
export default function ObjectionHandler({ isOpen, onClose, onSubmit }) {
  const fields = [
    {
      id: 'biggest_concern',
      type: 'radio',
      label: 'What\'s your biggest concern about working with a marketing agency?',
      required: true,
      options: [
        {
          value: 'been-burned',
          label: 'I\'ve been burned by agencies before - how is this different?',
        },
        {
          value: 'too-expensive',
          label: 'The investment seems high - what guarantees do you offer?',
        },
        {
          value: 'too-long',
          label: 'I need results fast - how long until I see ROI?',
        },
        {
          value: 'works-for-me',
          label: 'Will your systems really work for MY specific business?',
        },
        {
          value: 'no-concerns',
          label: 'No major concerns - I\'m ready to discuss next steps',
        },
      ],
    },
    {
      id: 'additional_questions',
      type: 'textarea',
      label: 'Any other questions or concerns before we schedule a call?',
      placeholder: 'e.g., How do you handle contract terms? Can I see examples specific to my industry?',
      required: false,
    },
  ];

  // Customize response messaging based on the concern
  const getResponseMessage = (concern) => {
    const messages = {
      'been-burned': 'We hear this a lot. Let\'s discuss how our AI-powered systems and transparent reporting create accountability that traditional agencies can\'t match.',
      'too-expensive': 'Great question. We don\'t offer "guarantees" - we offer proof. Every case study you saw is real. Let\'s discuss how we track and optimize ROI from day one.',
      'too-long': 'Fair concern. Most clients see measurable improvements within 30-60 days. Let\'s build a timeline that works for your specific goals.',
      'works-for-me': 'That\'s exactly why we customize everything. No two businesses are the same, and neither are our strategies. Let\'s discuss your unique situation.',
      'no-concerns': 'Excellent! Let\'s schedule a strategy call to create your custom roadmap.',
    };
    return messages[concern] || '';
  };

  const handleSubmit = async (data) => {
    // Add the appropriate response message based on the concern
    const concern = data.response.biggest_concern;
    const enhancedData = {
      ...data,
      response: {
        ...data.response,
        agent_response: getResponseMessage(concern),
      },
    };
    await onSubmit(enhancedData);
  };

  return (
    <ConversationPrompt
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      questionId="objection_handling"
      questionType="objection"
      title="Let's Address Any Concerns"
      description="We want to make sure you feel confident moving forward. What's on your mind?"
      fields={fields}
      showSkip={false}
      submitButtonText="Continue to Booking"
    />
  );
}
