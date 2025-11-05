import { Cpu, Share2, Search, Filter, DollarSign, Mic, AppWindow, Users, Briefcase } from 'lucide-react';

/**
 * Marketing services data with performance metrics
 * Data sourced from project docs: "Data_Proof for EACH Service.md"
 */

export const services = [
  {
    id: 'social-media-marketing',
    title: "Social Media Marketing",
    hook: "Build and engage your community",
    icon: Share2,
    description: "Stop the guess-work with content marketing. We find the top performing content in your niche, and we create YOUR unique spin on it.",
    fullDescription: "Our AI-powered social media strategy analyzes top-performing content in your industry and creates unique, engaging content that resonates with your audience. We manage your presence across all major platforms with data-driven optimization.",
    metrics: [
      { label: "Average Follower Growth", value: "+127%", timeframe: "within 6 months" },
      { label: "Engagement Rate Increase", value: "+82%", timeframe: "compared to prior campaigns" },
      { label: "Cost per Lead (CPL) Reduction", value: "-41%", timeframe: "through optimized targeting" },
    ],
    benefits: [
      "AI-powered content discovery and creation",
      "Multi-platform management and scheduling",
      "Audience growth and engagement optimization",
      "Performance analytics and reporting",
    ],
    idealFor: ["B2C companies", "E-commerce brands", "Healthcare providers", "Professional services"],
    industries: ["Healthcare", "E-commerce", "Professional Services", "Consumer Brands"],
  },
  {
    id: 'ai-automation',
    title: "AI Automation",
    hook: "Automate repetitive tasks and workflows",
    icon: Cpu,
    description: "We free up you and your team from robotic work so you can focus on what ONLY you can do, which is connect on a human level with your clients.",
    fullDescription: "Transform your business operations with intelligent automation that handles repetitive tasks, allowing your team to focus on high-value client interactions and strategic initiatives.",
    metrics: [
      { label: "Average Task Automation Rate", value: "68%", timeframe: "of robotic actions replaced within a year" },
      { label: "Time Saved per Team Member", value: "9 hours", timeframe: "per week" },
      { label: "Response Time Improvement", value: "+210%", timeframe: "faster than manual workflows" },
    ],
    benefits: [
      "Workflow automation across all business functions",
      "AI-powered decision making and routing",
      "Integration with existing tools and systems",
      "Continuous optimization and learning",
    ],
    idealFor: ["Service businesses", "Agencies", "Professional services", "Growing companies"],
    industries: ["All Industries", "Service-Based Business", "Healthcare", "Professional Services"],
  },
  {
    id: 'lead-generation',
    title: "Lead Generation",
    hook: "Fill your pipeline with qualified prospects",
    icon: Filter,
    description: "Our systems don't just bring leads. They bring the *right* ones at the *right* time with the *right* messaging.",
    fullDescription: "AI-driven lead generation that identifies, targets, and nurtures your ideal customers with personalized messaging at scale. We handle everything from cold outreach to warm handoff.",
    metrics: [
      { label: "Average Qualified Lead Increase", value: "+162%", timeframe: "over baseline" },
      { label: "Cold Outbound Volume", value: "400,000", timeframe: "messages per week across all campaigns" },
      { label: "Lead-to-Appointment Conversion", value: "7.3%", timeframe: "vs 1% industry average" },
    ],
    benefits: [
      "Multi-channel outreach (email, LinkedIn, phone)",
      "AI-powered targeting and personalization",
      "Automated follow-up sequences",
      "Real-time lead scoring and qualification",
    ],
    idealFor: ["B2B companies", "SaaS businesses", "Professional services", "High-ticket sales"],
    industries: ["B2B", "SaaS", "Professional Services", "Financial Services"],
  },
  {
    id: 'crm-management',
    title: "CRM Management",
    hook: "Organize and nurture your relationships",
    icon: Users,
    description: "We turn your CRM from a contact list into a closing/retention machine.",
    fullDescription: "Transform your CRM into a revenue-generating engine with automated workflows, intelligent data management, and AI-powered insights that help you close more deals and retain customers longer.",
    metrics: [
      { label: "Client Retention Rate Increase", value: "+31%", timeframe: "after 60 days" },
      { label: "Pipeline Efficiency Improvement", value: "+47%", timeframe: "via AI data cleaning and journey optimization" },
      { label: "Time-to-Follow-Up Reduction", value: "-130%", timeframe: "average response time" },
    ],
    benefits: [
      "CRM setup and migration",
      "Automated customer journeys",
      "AI-powered data cleaning and enrichment",
      "Pipeline optimization and forecasting",
    ],
    idealFor: ["Sales teams", "Service businesses", "B2B companies", "Enterprises"],
    industries: ["All Industries", "B2B", "SaaS", "Professional Services"],
  },
  {
    id: 'paid-advertising',
    title: "Paid Advertising",
    hook: "Maximize ROI across all channels",
    icon: DollarSign,
    description: "We leverage testing, competitor data, and creative expertise to eliminate the guesswork and funnel sales into your business.",
    fullDescription: "Data-driven paid advertising across Google, Meta, LinkedIn, and more. We combine AI optimization with expert creative to maximize your return on ad spend.",
    metrics: [
      { label: "Average Return on Ad Spend (ROAS)", value: "5.6×", timeframe: "across all clients" },
      { label: "Click-Through Rate Improvement", value: "+133%", timeframe: "after AI creative testing" },
      { label: "Customer Acquisition Cost Reduction", value: "-29%", timeframe: "through optimization" },
    ],
    benefits: [
      "Multi-platform campaign management",
      "AI-powered ad creative testing",
      "Advanced audience targeting",
      "Real-time budget optimization",
    ],
    idealFor: ["E-commerce", "SaaS", "Local businesses", "Healthcare providers"],
    industries: ["E-commerce", "Healthcare", "Professional Services", "Local Services"],
  },
  {
    id: 'seo-geo',
    title: "SEO & GEO",
    hook: "Get found by your ideal customers",
    icon: Search,
    description: "We build visibility engines that dominate both Google and AI platforms, even as AI transforms the way people search for solutions.",
    fullDescription: "Future-proof SEO strategy that optimizes for both traditional search engines and emerging AI platforms like ChatGPT, Claude, and Perplexity. Get found wherever your customers are searching.",
    metrics: [
      { label: "Average Website Traffic Increase", value: "+187%", timeframe: "in 6 months" },
      { label: "AI-Generated References/Month", value: "340+", timeframe: "indexed mentions" },
      { label: "Inbound Call Volume Growth", value: "+52%", timeframe: "across optimized service areas" },
    ],
    benefits: [
      "Traditional SEO + GEO (Generative Engine Optimization)",
      "AI platform optimization (ChatGPT, Claude, etc.)",
      "Local SEO and Google Business Profile management",
      "Content strategy and implementation",
    ],
    idealFor: ["Local businesses", "Service providers", "Healthcare", "Professional services"],
    industries: ["Healthcare", "Legal", "Home Services", "Professional Services"],
  },
  {
    id: 'custom-apps',
    title: "Custom Apps",
    hook: "Tailored solutions for your needs",
    icon: AppWindow,
    description: "We build and optimize AI employees in the form of software that reduce your workload and integrate with other tools.",
    fullDescription: "Custom software solutions that act as AI employees for your business. From internal tools to customer-facing applications, we build scalable systems that solve your unique challenges.",
    metrics: [
      { label: "Average Process Time Reduction", value: "-60%", timeframe: "with internal automations" },
      { label: "Client Adoption Rate", value: "95%", timeframe: "user engagement within 30 days" },
      { label: "System ROI Timeline", value: "45 days", timeframe: "from concept to working app" },
    ],
    benefits: [
      "Custom software development",
      "AI integration and automation",
      "System integrations and APIs",
      "Ongoing support and optimization",
    ],
    idealFor: ["Enterprises", "SaaS companies", "Agencies", "Service businesses"],
    industries: ["All Industries", "SaaS", "Enterprise", "Agencies"],
  },
  {
    id: 'podcasting',
    title: "Podcasting",
    hook: "Build authority through audio content",
    icon: Mic,
    description: "Nothing scales better than authentic conversation. We ensure that your podcast is seen and heard.",
    fullDescription: "End-to-end podcast production and promotion. From recording to distribution and promotion, we help you build authority and reach through long-form audio content.",
    metrics: [
      { label: "Audience Growth Rate", value: "+142%", timeframe: "in first 60 days post-launch" },
      { label: "Average Speed to Monetization", value: "4 months", timeframe: "from brand new to revenue streams" },
      { label: "Average Engagement Time Increase", value: "300%", timeframe: "in viewing time" },
    ],
    benefits: [
      "Full podcast production services",
      "Multi-platform distribution",
      "Social media promotion and clips",
      "Monetization strategy",
    ],
    idealFor: ["Thought leaders", "B2B companies", "Professional services", "Brands"],
    industries: ["Professional Services", "Healthcare", "Business Services", "Media"],
  },
  {
    id: 'fractional-cmo',
    title: "Fractional CMO",
    hook: "Strategic marketing leadership",
    icon: Briefcase,
    description: "When we plug in, you gain a C-suite team that scales strategy and execution in sync.",
    fullDescription: "Executive-level marketing leadership without the full-time cost. We integrate with your team to develop strategy, oversee execution, and drive measurable growth.",
    metrics: [
      { label: "Revenue Growth Among Retainers", value: "+48%", timeframe: "within first 120 days" },
      { label: "Average Marketing ROI Increase", value: "+92%", timeframe: "after full strategy alignment" },
      { label: "System Efficiency Improvement", value: "+61%", timeframe: "via integrated automation tracking" },
    ],
    benefits: [
      "Strategic marketing planning",
      "Team leadership and coordination",
      "Budget allocation and optimization",
      "Performance tracking and reporting",
    ],
    idealFor: ["Growing companies", "Enterprises", "Companies without CMO", "Organizations in transition"],
    industries: ["All Industries", "Enterprise", "SaaS", "Professional Services"],
  },
];

/**
 * Calculate service relevance score based on client intelligence
 */
export function scoreServiceRelevance(service, clientIntelligence) {
  let score = 0;
  const { industry, opportunities = [], technologies_detected = [], website_quality = 5, has_blog = false } = clientIntelligence;

  // Industry match (30 points)
  if (service.industries.includes(industry)) {
    score += 30;
  } else if (service.industries.includes('All Industries')) {
    score += 15;
  }

  // Opportunity alignment (25 points)
  const opportunityKeywords = opportunities.join(' ').toLowerCase();
  if (service.id === 'seo-geo' && (opportunityKeywords.includes('seo') || opportunityKeywords.includes('visibility') || opportunityKeywords.includes('search'))) {
    score += 25;
  } else if (service.id === 'ai-automation' && (opportunityKeywords.includes('automat') || opportunityKeywords.includes('efficiency') || opportunityKeywords.includes('workflow'))) {
    score += 25;
  } else if (service.id === 'lead-generation' && (opportunityKeywords.includes('lead') || opportunityKeywords.includes('pipeline') || opportunityKeywords.includes('acquisition'))) {
    score += 25;
  } else if (service.id === 'paid-advertising' && (opportunityKeywords.includes('paid') || opportunityKeywords.includes('ads') || opportunityKeywords.includes('ppc'))) {
    score += 25;
  } else if (service.id === 'social-media-marketing' && (opportunityKeywords.includes('social') || opportunityKeywords.includes('engagement') || opportunityKeywords.includes('content'))) {
    score += 25;
  }

  // Tech stack gaps (25 points)
  if (service.id === 'custom-apps' && technologies_detected.length === 0) {
    score += 25;
  } else if (service.id === 'crm-management' && !technologies_detected.some(tech => tech.toLowerCase().includes('crm'))) {
    score += 20;
  }

  // Website quality indicators (20 points)
  if (service.id === 'seo-geo' && website_quality < 6) {
    score += 20;
  } else if (service.id === 'custom-apps' && website_quality < 5) {
    score += 15;
  }

  // Content indicators
  if (service.id === 'social-media-marketing' && !has_blog) {
    score += 10;
  } else if (service.id === 'podcasting' && !has_blog) {
    score += 5;
  }

  return score;
}

/**
 * Get recommended services based on client intelligence
 */
export function getRecommendedServices(clientIntelligence, maxResults = 6) {
  const scoredServices = services.map(service => ({
    ...service,
    relevanceScore: scoreServiceRelevance(service, clientIntelligence),
  }));

  // Sort by relevance score
  scoredServices.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scoredServices.slice(0, maxResults);
}

/**
 * Generate rationale for why a service is recommended
 */
export function generateServiceRationale(service, clientIntelligence) {
  const { industry, opportunities = [], company_size } = clientIntelligence;

  const rationales = {
    'seo-geo': `Based on your ${industry} business, SEO & GEO will help you dominate local search results and emerging AI platforms. This is critical for ${industry} companies to capture high-intent customers.`,
    'ai-automation': `With ${company_size} employees, AI automation can free up approximately ${Math.floor(parseInt(company_size.split('-')[0]) * 9)} hours per week across your team, allowing focus on revenue-generating activities.`,
    'lead-generation': `Our lead generation system is particularly effective for ${industry} companies, with a 7.3% lead-to-appointment conversion rate vs the 1% industry average.`,
    'paid-advertising': `${industry} businesses using our paid advertising services achieve an average 5.6× ROAS. We'll eliminate wasteful ad spend and maximize your customer acquisition.`,
    'social-media-marketing': `For ${industry} companies, our AI-powered social media strategy typically achieves +127% follower growth and +82% engagement increases within 6 months.`,
    'crm-management': `A properly optimized CRM can increase your client retention by 31% and reduce follow-up time by 130%, critical for scaling ${industry} operations.`,
    'custom-apps': `Custom software solutions reduce process time by an average of 60%, with most clients seeing ROI within 45 days of deployment.`,
    'podcasting': `Podcasting builds authority in the ${industry} space, with our clients averaging 142% audience growth in the first 60 days and monetization within 4 months.`,
    'fractional-cmo': `Companies at the ${company_size} employee range benefit significantly from fractional CMO services, averaging 48% revenue growth within 120 days.`,
  };

  // Check for opportunity-specific rationales
  const opportunityText = opportunities.join(' ').toLowerCase();
  if (opportunityText.includes('seo') && service.id === 'seo-geo') {
    return `You've identified SEO improvement as a key opportunity. Our SEO & GEO service has delivered +187% traffic growth for ${industry} clients within 6 months.`;
  }

  return rationales[service.id] || service.description;
}
