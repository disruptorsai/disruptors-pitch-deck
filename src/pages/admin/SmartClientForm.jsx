import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSDK } from '@/lib/ai-presenter-sdk';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { searchBusiness, analyzeWebsite, generateSlug } from '@/lib/business-analyzer';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { TerminalLoader } from '@/components/ui/terminal-loader';

/**
 * Data Source Badge Component
 * Shows whether a data source was active during analysis
 */
function DataSourceBadge({ name, active, quality }) {
  return (
    <div
      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
        active
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}
      title={active ? `Active - ${quality || 'Data collected'}` : `Inactive - API key not configured`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-green-400' : 'bg-red-400'}`} />
      {name}
      {active && quality > 0 && <span className="text-white/50 ml-1">({quality})</span>}
    </div>
  );
}

export default function SmartClientForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Wizard steps: 'input' -> 'verify' -> 'analyze' -> 'edit' -> 'save'
  const [step, setStep] = useState('input');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form data
  const [businessName, setBusinessName] = useState('');
  const [providedUrl, setProvidedUrl] = useState('');

  // URL verification results
  const [urlOptions, setUrlOptions] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [urlConfidence, setUrlConfidence] = useState('');

  // Analyzed data
  const [analyzedData, setAnalyzedData] = useState(null);

  // Final form data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    logo_url: '',
    primary_color: '#FF6A00',
    secondary_color: '#9B30FF',
    status: 'draft',
  });

  // Step 1: Search and verify URL
  const handleSearch = async () => {
    if (!businessName) {
      toast({
        title: 'Missing information',
        description: 'Please enter a business name.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await searchBusiness(businessName, providedUrl);

      if (result.isCorrect !== undefined) {
        // Verifying provided URL
        if (result.isCorrect && result.confidence === 'high') {
          setSelectedUrl(result.confirmedUrl);
          setUrlConfidence('high');
          setStep('analyze');
          analyzeSelectedUrl(result.confirmedUrl);
        } else {
          setUrlOptions([result.confirmedUrl, ...(result.alternatives || [])]);
          setUrlConfidence(result.confidence);
          setStep('verify');
        }
      } else {
        // Finding URL
        setUrlOptions([result.primaryUrl, ...(result.alternatives || [])]);
        setUrlConfidence(result.confidence);

        // Show toast about which search method was used
        if (result.searchMethod === 'serpapi') {
          toast({
            title: 'Real-time search completed',
            description: 'Found results using SerpAPI (Google)',
          });
        } else if (result.searchMethod === 'brave') {
          toast({
            title: 'Search completed',
            description: 'Found results using Brave Search (SerpAPI unavailable)',
          });
        } else if (result.searchMethod === 'ai-only') {
          toast({
            title: 'AI inference mode',
            description: 'Search APIs unavailable - using AI knowledge base',
            variant: 'destructive',
          });
        }

        setStep('verify');
      }
    } catch (error) {
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search for business. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Analyze selected URL
  const analyzeSelectedUrl = async (url) => {
    setIsProcessing(true);
    setStep('analyze');

    try {
      const analysis = await analyzeWebsite(url, businessName);

      setAnalyzedData(analysis);
      setFormData({
        // Basic information
        name: businessName,
        slug: generateSlug(businessName),
        description: analysis.description || '',
        full_description: analysis.fullDescription || analysis.description || '',
        website: url,

        // Contact information
        email: analysis.email || '',
        phone: analysis.phone || '',
        address: analysis.address || null,
        contact_form_url: analysis.contactFormUrl || null,

        // Industry & Company Info
        industry: analysis.industry || null,
        sub_industry: analysis.subIndustry || null,
        founded_year: analysis.foundedYear || null,
        company_size: analysis.companySize || null,

        // Digital Presence
        logo_url: analysis.logoUrl || '',
        social_media: analysis.socialMedia || {},

        // Branding
        primary_color: analysis.primaryColor || '#FF6A00',
        secondary_color: analysis.secondaryColor || '#9B30FF',
        tertiary_color: analysis.tertiaryColor || null,
        brand_tone: analysis.brandTone || 'professional',

        // Services & Features
        services: analysis.services || [],
        key_features: analysis.keyFeatures || [],
        target_market: analysis.targetMarket || null,

        // Technology Stack
        technologies_detected: analysis.technologiesDetected || [],
        cms: analysis.cms || null,

        // Competitive Intelligence
        market_position: analysis.marketPosition || null,
        competitive_advantages: analysis.competitiveAdvantages || [],
        potential_competitors: analysis.potentialCompetitors || [],

        // Business Insights
        strengths: analysis.strengths || [],
        opportunities: analysis.opportunities || [],
        website_quality: analysis.websiteQuality || 7,
        seo_indicators: analysis.seoIndicators || null,

        // Additional Data
        certifications: analysis.certifications || [],
        partnerships: analysis.partnerships || [],
        has_case_studies: analysis.hasCaseStudies || false,
        has_blog: analysis.hasBlog || false,
        has_real_content: analysis.hasRealContent || false,

        // Status
        status: 'draft',
      });

      setStep('edit');
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: error.message || 'Failed to analyze website. You can enter details manually.',
        variant: 'destructive',
      });
      // Still allow manual entry with empty comprehensive fields
      setFormData({
        // Basic information
        name: businessName,
        slug: generateSlug(businessName),
        description: '',
        full_description: '',
        website: url,

        // Contact information
        email: '',
        phone: '',
        address: null,
        contact_form_url: null,

        // Industry & Company Info
        industry: null,
        sub_industry: null,
        founded_year: null,
        company_size: null,

        // Digital Presence
        logo_url: '',
        social_media: {},

        // Branding
        primary_color: '#FF6A00',
        secondary_color: '#9B30FF',
        tertiary_color: null,
        brand_tone: 'professional',

        // Services & Features
        services: [],
        key_features: [],
        target_market: null,

        // Technology Stack
        technologies_detected: [],
        cms: null,

        // Competitive Intelligence
        market_position: null,
        competitive_advantages: [],
        potential_competitors: [],

        // Business Insights
        strengths: [],
        opportunities: [],
        website_quality: 7,
        seo_indicators: null,

        // Additional Data
        certifications: [],
        partnerships: [],
        has_case_studies: false,
        has_blog: false,
        has_real_content: false,

        // Status
        status: 'draft',
      });
      setStep('edit');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save client
  const saveMutation = useMutation({
    mutationFn: async (clientData) => {
      const data = await adminSDK.createClient(clientData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clients']);
      toast({
        title: 'Client created',
        description: `${data.name} has been created successfully with AI-powered insights!`,
      });
      navigate('/admin/clients');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create client',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in the name and slug.',
        variant: 'destructive',
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/clients')}
          className="text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white">Create Client with AI</h1>
            <Sparkles className="w-6 h-6 text-[#FFD700]" />
          </div>
          <p className="text-white/60 mt-1">
            Just enter the business name - AI will do the rest!
          </p>
        </div>
      </div>

      {/* Step 1: Input */}
      {step === 'input' && (
        <Card className="bg-[#1E1E1E] border-white/10 p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 mx-auto text-[#FFD700] mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Let AI Build Your Client Profile
              </h2>
              <p className="text-white/60">
                Enter the business name and we'll automatically find and analyze their website
              </p>
            </div>

            {/* API Configuration Notice */}
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-500">Data Sources Configuration</AlertTitle>
              <AlertDescription className="text-blue-500/80 text-sm">
                For <strong>maximum analysis quality</strong>, configure these API keys in your <code className="bg-black/30 px-1.5 py-0.5 rounded">.env.local</code> file:
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li><strong>XAI_API_KEY</strong> - Grok 4 real-time intelligence ($5/M tokens, <a href="https://x.ai/api" target="_blank" className="underline">x.ai/api</a>)</li>
                  <li><strong>TWITTER_BEARER_TOKEN</strong> - Social sentiment analysis ($100/mo, <a href="https://developer.twitter.com" target="_blank" className="underline">developer.twitter.com</a>)</li>
                  <li><strong>REDDIT_CLIENT_ID/SECRET</strong> - Community insights (Free, <a href="https://www.reddit.com/prefs/apps" target="_blank" className="underline">reddit.com/prefs/apps</a>)</li>
                </ul>
                <p className="mt-2 text-xs">✅ <strong>Already active:</strong> Website scraping (Firecrawl), Web search (SerpAPI), Contact extraction</p>
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="businessName" className="text-white/80 text-lg">
                Business Name *
              </Label>
              <Input
                id="businessName"
                placeholder="e.g., Tesla, Stripe, Notion"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-lg h-12 mt-2"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div>
              <Label htmlFor="providedUrl" className="text-white/80">
                Website URL (optional)
              </Label>
              <Input
                id="providedUrl"
                type="url"
                placeholder="https://example.com (leave empty to auto-find)"
                value={providedUrl}
                onChange={(e) => setProvidedUrl(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 mt-2"
              />
              <p className="text-xs text-white/50 mt-2">
                If you know the website, enter it here. Otherwise, we'll find it for you!
              </p>
            </div>

            <Button
              onClick={handleSearch}
              disabled={isProcessing || !businessName}
              className="w-full gradient-accent hover-glow text-lg h-12"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Verify URL */}
      {step === 'verify' && (
        <Card className="bg-[#1E1E1E] border-white/10 p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Confirm Website URL
              </h2>
              <p className="text-white/60">
                Select the correct website for {businessName}
              </p>
            </div>

            {urlConfidence === 'low' && (
              <Alert className="bg-yellow-500/10 border-yellow-500/20">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-yellow-500">Multiple options found</AlertTitle>
                <AlertDescription className="text-yellow-500/80">
                  Please confirm which is the correct website
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {urlOptions.filter(Boolean).map((url, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedUrl(url);
                    analyzeSelectedUrl(url);
                  }}
                  className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700]/50 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium group-hover:text-[#FFD700] transition-colors">
                        {url}
                      </p>
                      {index === 0 && (
                        <p className="text-xs text-white/50 mt-1">Recommended</p>
                      )}
                    </div>
                    <Check className="w-5 h-5 text-white/20 group-hover:text-[#FFD700] transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setStep('input')}
              className="w-full border-white/20 text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Analyzing */}
      {step === 'analyze' && (
        <TerminalLoader onComplete={() => {
          // This will be called when the animation completes
          // The actual analysis completes independently via the analyzeSelectedUrl function
        }} />
      )}

      {/* Step 4: Edit analyzed data */}
      {step === 'edit' && (
        <Card className="bg-[#1E1E1E] border-white/10 p-6">
          <div className="space-y-6">
            <Alert className="bg-green-500/10 border-green-500/20">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Comprehensive Analysis Complete!</AlertTitle>
              <AlertDescription className="text-green-500/80">
                Review the AI-generated business intelligence report and basic information below, then save.
              </AlertDescription>
            </Alert>

            {/* Comprehensive Business Intelligence Report */}
            {analyzedData && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#FFD700]" />
                    Comprehensive Business Intelligence Report
                  </h3>

                  {/* Data Source Status Indicators */}
                  {analyzedData._metadata?.dataSources && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-black/20 rounded-lg">
                      <span className="text-xs text-white/50 mr-2">Data Sources:</span>
                      <DataSourceBadge
                        name="Website Analysis"
                        active={analyzedData._metadata.dataSources.website}
                        quality={analyzedData._metadata.dataQuality.websiteChars}
                      />
                      <DataSourceBadge
                        name="Grok Real-Time"
                        active={analyzedData._metadata.dataSources.grok}
                        quality={analyzedData._metadata.dataQuality.grokNewsItems}
                      />
                      <DataSourceBadge
                        name="Twitter/X"
                        active={analyzedData._metadata.dataSources.twitter}
                        quality={analyzedData._metadata.dataQuality.tweetsAnalyzed}
                      />
                      <DataSourceBadge
                        name="Reddit"
                        active={analyzedData._metadata.dataSources.reddit}
                        quality={analyzedData._metadata.dataQuality.redditPostsAnalyzed}
                      />
                      <DataSourceBadge
                        name="Contact Extraction"
                        active={analyzedData._metadata.dataSources.contactExtraction}
                      />
                    </div>
                  )}
                </div>

                {/* Full Description */}
                {analyzedData.fullDescription && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-2">Full Business Description</h4>
                    <p className="text-white/90 text-sm leading-relaxed">{analyzedData.fullDescription}</p>
                  </div>
                )}

                {/* Industry & Market */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analyzedData.industry && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Industry</div>
                      <div className="text-white font-medium">{analyzedData.industry}</div>
                    </div>
                  )}
                  {analyzedData.subIndustry && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Sub-Industry</div>
                      <div className="text-white font-medium">{analyzedData.subIndustry}</div>
                    </div>
                  )}
                  {analyzedData.targetMarket && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Target Market</div>
                      <div className="text-white font-medium text-sm">{analyzedData.targetMarket}</div>
                    </div>
                  )}
                  {analyzedData.websiteQuality && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Website Quality</div>
                      <div className="text-white font-medium">{analyzedData.websiteQuality}/10</div>
                    </div>
                  )}
                </div>

                {/* Contact & Digital Presence */}
                <div>
                  <h4 className="text-sm font-semibold text-white/70 mb-3">Contact & Digital Presence</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analyzedData.address && (
                      <div className="text-sm">
                        <span className="text-white/50">Address:</span>
                        <span className="text-white ml-2">{analyzedData.address}</span>
                      </div>
                    )}
                    {analyzedData.contactFormUrl && (
                      <div className="text-sm">
                        <span className="text-white/50">Contact Form:</span>
                        <a href={analyzedData.contactFormUrl} target="_blank" rel="noopener noreferrer" className="text-[#FFD700] ml-2 hover:underline">
                          View Form
                        </a>
                      </div>
                    )}
                    {analyzedData.socialMedia && Object.keys(analyzedData.socialMedia).length > 0 && (
                      <div className="col-span-2">
                        <span className="text-white/50 text-sm">Social Media:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(analyzedData.socialMedia).map(([platform, url]) =>
                            url && (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-white/10 rounded-full text-xs text-white hover:bg-white/20 transition-colors capitalize"
                              >
                                {platform}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services & Features */}
                {analyzedData.services && analyzedData.services.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-2">Services Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {analyzedData.services.map((service, i) => (
                        <span key={i} className="px-3 py-1 bg-[#FF6A00]/20 border border-[#FF6A00]/30 rounded-full text-xs text-white">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analyzedData.keyFeatures && analyzedData.keyFeatures.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-2">Key Features</h4>
                    <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                      {analyzedData.keyFeatures.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technology Stack */}
                {analyzedData.technologiesDetected && analyzedData.technologiesDetected.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-2">Technology Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {analyzedData.technologiesDetected.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-[#9B30FF]/20 border border-[#9B30FF]/30 rounded text-xs text-white">
                          {tech}
                        </span>
                      ))}
                      {analyzedData.cms && (
                        <span className="px-3 py-1 bg-[#9B30FF]/30 border border-[#9B30FF]/40 rounded text-xs text-white font-semibold">
                          CMS: {analyzedData.cms}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Competitive Intelligence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyzedData.competitiveAdvantages && analyzedData.competitiveAdvantages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">Competitive Advantages</h4>
                      <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                        {analyzedData.competitiveAdvantages.map((adv, i) => (
                          <li key={i}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analyzedData.potentialCompetitors && analyzedData.potentialCompetitors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-400 mb-2">Potential Competitors</h4>
                      <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                        {analyzedData.potentialCompetitors.map((comp, i) => (
                          <li key={i}>{comp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Business Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyzedData.strengths && analyzedData.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                        {analyzedData.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analyzedData.opportunities && analyzedData.opportunities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-orange-400 mb-2">Opportunities for Improvement</h4>
                      <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                        {analyzedData.opportunities.map((opp, i) => (
                          <li key={i}>{opp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Additional Insights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {analyzedData.hasCaseStudies !== undefined && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Case Studies</div>
                      <div className="text-white font-medium">{analyzedData.hasCaseStudies ? 'Yes' : 'No'}</div>
                    </div>
                  )}
                  {analyzedData.hasBlog !== undefined && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Blog/Resources</div>
                      <div className="text-white font-medium">{analyzedData.hasBlog ? 'Yes' : 'No'}</div>
                    </div>
                  )}
                  {analyzedData.foundedYear && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Founded</div>
                      <div className="text-white font-medium">{analyzedData.foundedYear}</div>
                    </div>
                  )}
                  {analyzedData.companySize && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-white/50 mb-1">Company Size</div>
                      <div className="text-white font-medium">{analyzedData.companySize}</div>
                    </div>
                  )}
                </div>

                {analyzedData.seoIndicators && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-2">SEO Status</h4>
                    <p className="text-sm text-white/80">{analyzedData.seoIndicators}</p>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-bold text-white mb-4">Basic Information (For Database)</h3>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Business Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/80">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  rows={3}
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white/80">Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
              </div>

              {/* Branding */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white/80">Logo URL</Label>
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white/80">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-16 h-10 p-1 bg-white/5 border-white/10"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-16 h-10 p-1 bg-white/5 border-white/10"
                    />
                    <Input
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="flex-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setStep('input')}
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Button
                  onClick={handleSave}
                  className="gradient-accent hover-glow"
                  disabled={saveMutation.isLoading}
                >
                  {saveMutation.isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Client
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
