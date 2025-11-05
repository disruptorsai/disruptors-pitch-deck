import { Rocket, TrendingUp, Award, Zap } from 'lucide-react';

/**
 * Pricing Tiers Data
 * Structured pricing packages with feature breakdowns
 */

export const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'Perfect for Testing the Waters',
    icon: Rocket,
    price: 3500,
    priceLabel: '$3,500/mo',
    billingCycle: 'month',
    minimumCommitment: '3 months',
    setupFee: 1500,
    description: 'Ideal for small businesses ready to leverage AI marketing without massive upfront investment.',
    features: [
      'AI-Powered Social Media Management (2 platforms)',
      'Basic Lead Generation Setup (email campaigns)',
      'Monthly Performance Reports',
      'CRM Integration & Setup',
      '1 Marketing Mechanism',
      'Email Support',
      'Quarterly Strategy Reviews',
    ],
    limitations: [
      'Limited to 2 social platforms',
      '1 active marketing mechanism',
      'Email-only support',
    ],
    idealFor: {
      companySize: ['1-10', '10-50'],
      industries: ['Professional Services', 'Healthcare', 'E-commerce'],
      marketingSpend: 'Under $5k/month',
      teamSize: 'Small or no marketing team',
    },
    metrics: {
      expectedROI: { low: 200, high: 350 },
      breakeven: 60,
      avgLeadIncrease: '+80%',
      timeToValue: '30-45 days',
    },
    badge: null,
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    subtitle: 'Accelerate Your Market Presence',
    icon: TrendingUp,
    price: 7500,
    priceLabel: '$7,500/mo',
    billingCycle: 'month',
    minimumCommitment: '6 months',
    setupFee: 2500,
    description: 'For growing companies ready to dominate their local market with multi-channel AI marketing.',
    features: [
      'Everything in Starter, plus:',
      'AI-Powered Social Media (4+ platforms)',
      'Advanced Lead Generation (multi-channel)',
      'SEO & Local Search Optimization',
      'Paid Advertising Management (Google + Meta)',
      'CRM Automation & Workflows',
      '2-3 Marketing Mechanisms',
      'Bi-weekly Performance Reports',
      'Priority Email + Slack Support',
      'Monthly Strategy Sessions',
    ],
    limitations: [
      '2-3 active mechanisms',
      'Email + Slack support only',
    ],
    idealFor: {
      companySize: ['10-50', '50-200'],
      industries: ['All Industries', 'Healthcare', 'Financial Services', 'Construction'],
      marketingSpend: '$5k-$15k/month',
      teamSize: 'Small marketing team or fractional CMO',
    },
    metrics: {
      expectedROI: { low: 280, high: 450 },
      breakeven: 45,
      avgLeadIncrease: '+150%',
      timeToValue: '30-60 days',
    },
    badge: 'Most Popular',
    highlighted: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    subtitle: 'Dominate Your Market',
    icon: Award,
    price: 15000,
    priceLabel: '$15,000/mo',
    billingCycle: 'month',
    minimumCommitment: '6 months',
    setupFee: 5000,
    description: 'Enterprise-grade AI marketing for companies serious about market leadership and exponential growth.',
    features: [
      'Everything in Growth, plus:',
      'Full AI Marketing Automation Suite',
      'Advanced Paid Advertising (Multi-Platform)',
      'Content Production & Distribution at Scale',
      'Fractional CMO Services',
      'Custom AI Models & Workflows',
      'Conversion Rate Optimization (CRO)',
      'Marketing Attribution & Analytics Dashboard',
      '4-5 Marketing Mechanisms',
      'Weekly Performance Reports',
      'Dedicated Account Manager',
      'Phone + Email + Slack Support',
      'Bi-weekly Strategy Sessions',
    ],
    limitations: [],
    idealFor: {
      companySize: ['50-200', '200-500', '500+'],
      industries: ['All Industries', 'Financial Services', 'Technology', 'Healthcare'],
      marketingSpend: '$15k-$50k/month',
      teamSize: 'Established marketing team needing AI amplification',
    },
    metrics: {
      expectedROI: { low: 350, high: 600 },
      breakeven: 30,
      avgLeadIncrease: '+250%',
      timeToValue: '45-90 days',
    },
    badge: 'Best Value',
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Custom AI Marketing Ecosystem',
    icon: Zap,
    price: null, // Custom pricing
    priceLabel: 'Custom',
    billingCycle: 'custom',
    minimumCommitment: '12 months',
    setupFee: null, // Custom
    description: 'Fully custom AI marketing infrastructure for enterprises requiring white-glove service and market dominance.',
    features: [
      'Everything in Scale, plus:',
      'Unlimited Marketing Mechanisms',
      'Custom AI Model Development',
      'Full-Service Creative Production',
      'Multi-Location Campaign Management',
      'Enterprise Analytics & BI Integration',
      'Dedicated Marketing Team (3-5 specialists)',
      'Executive-Level Strategic Planning',
      'White-Label Solutions Available',
      'Custom SLAs & Performance Guarantees',
      '24/7 Priority Support',
      'Weekly Executive Reviews',
    ],
    limitations: [],
    idealFor: {
      companySize: ['200-500', '500+'],
      industries: ['All Industries', 'Healthcare Systems', 'Financial Institutions', 'Multi-Location Enterprises'],
      marketingSpend: '$50k+/month',
      teamSize: 'Large marketing department or multiple locations',
    },
    metrics: {
      expectedROI: { low: 400, high: 800 },
      breakeven: 20,
      avgLeadIncrease: '+400%',
      timeToValue: '60-120 days',
    },
    badge: 'Enterprise',
    highlighted: false,
  },
];

/**
 * Recommend pricing tiers based on client intelligence
 * @param {Object} client - Client intelligence data
 * @returns {Array} Recommended tiers (1-2 tiers)
 */
export function recommendPricingTiers(client) {
  if (!client) {
    return [pricingTiers[1]]; // Default to Growth tier
  }

  const recommended = [];

  // Company size scoring
  const companySizeMap = {
    '1-10': ['starter'],
    '10-50': ['starter', 'growth'],
    '50-200': ['growth', 'scale'],
    '200-500': ['scale', 'enterprise'],
    '500+': ['enterprise'],
  };

  // Get tiers by company size
  const sizeBasedTiers = companySizeMap[client.company_size] || ['growth'];

  // Score each tier
  const scoredTiers = pricingTiers.map(tier => {
    let score = 0;

    // Company size match (40 points)
    if (tier.idealFor.companySize.includes(client.company_size)) {
      score += 40;
    }

    // Industry match (30 points)
    if (tier.idealFor.industries.includes('All Industries') ||
        tier.idealFor.industries.includes(client.industry)) {
      score += 30;
    }

    // Budget indicators (30 points)
    // If client has high website traffic or multiple competitors, they likely have budget
    if (client.website_traffic > 10000 && tier.id !== 'starter') {
      score += 15;
    }
    if (client.potential_competitors && client.potential_competitors.length > 3 && tier.id !== 'starter') {
      score += 15;
    }

    return { ...tier, score };
  });

  // Sort by score
  scoredTiers.sort((a, b) => b.score - a.score);

  // Return top 2 tiers
  recommended.push(scoredTiers[0]);
  if (scoredTiers[1] && scoredTiers[1].score > 30) {
    recommended.push(scoredTiers[1]);
  }

  return recommended;
}

/**
 * Calculate tier-specific ROI for client
 * @param {Object} tier - Pricing tier
 * @param {Object} client - Client data
 * @returns {Object} ROI projection with investment breakdown
 */
export function calculateTierROI(tier, client) {
  const monthlyInvestment = tier.price || 15000; // Default for custom
  const setupCost = tier.setupFee || 0;
  const minimumMonths = parseInt(tier.minimumCommitment) || 6;

  const totalInvestment = (monthlyInvestment * minimumMonths) + setupCost;

  // Industry multipliers
  const industryMultipliers = {
    'Healthcare': 1.3,
    'Financial Services': 1.4,
    'Technology': 1.5,
    'E-commerce': 1.6,
    'Professional Services': 1.2,
    'Construction': 1.1,
    'default': 1.2,
  };

  const multiplier = industryMultipliers[client?.industry] || industryMultipliers['default'];

  // Base ROI from tier metrics
  const baseROI = tier.metrics.expectedROI;

  // Calculate returns
  const conservativeReturn = Math.round(totalInvestment * (baseROI.low / 100) * multiplier);
  const optimisticReturn = Math.round(totalInvestment * (baseROI.high / 100) * multiplier);

  return {
    monthlyInvestment,
    setupCost,
    minimumMonths,
    totalInvestment,
    conservativeReturn,
    optimisticReturn,
    conservativeROI: Math.round((baseROI.low * multiplier)),
    optimisticROI: Math.round((baseROI.high * multiplier)),
    breakeven: tier.metrics.breakeven,
    netProfit: {
      conservative: conservativeReturn - totalInvestment,
      optimistic: optimisticReturn - totalInvestment,
    },
  };
}

/**
 * Generate personalized messaging for tier
 * @param {Object} tier - Pricing tier
 * @param {Object} client - Client data
 * @returns {String} Personalized message
 */
export function generateTierMessage(tier, client) {
  if (!client) {
    return `The ${tier.name} tier is designed for ${tier.idealFor.teamSize.toLowerCase()} looking to ${tier.description.toLowerCase()}`;
  }

  const messages = {
    starter: `${client.name}, the Starter tier is perfect for ${client.industry} companies like yours testing AI marketing with minimal risk. Start small, prove ROI, then scale.`,
    growth: `Based on ${client.name}'s market position in ${client.industry}, the Growth tier offers the perfect balance of comprehensive marketing coverage and cost-efficiency. Most ${client.industry} companies see breakeven in ${tier.metrics.breakeven} days.`,
    scale: `For ${client.industry} leaders like ${client.name}, the Scale tier provides enterprise-grade AI marketing at a fraction of the cost of building in-house. Expect ${tier.metrics.avgLeadIncrease} lead growth within 90 days.`,
    enterprise: `${client.name} operates at a level that demands custom solutions. The Enterprise tier gives you a dedicated marketing team, custom AI models, and white-glove service tailored to ${client.industry} market dynamics.`,
  };

  return messages[tier.id] || `The ${tier.name} tier is ideal for companies like ${client.name} in the ${client.industry} industry.`;
}
