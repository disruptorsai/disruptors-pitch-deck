import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSDK } from '@/lib/ai-presenter-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Database, Zap, Globe, Code, BarChart3, Target, DollarSign, Clock, Activity } from 'lucide-react';

/**
 * Business Intelligence Admin Page
 *
 * Full-featured UI for:
 * - Analyzing new businesses
 * - Viewing cached analyses
 * - Managing opportunities
 * - Monitoring API costs
 * - System health
 */
export default function BusinessIntelligence() {
  const queryClient = useQueryClient();

  // State for analysis form
  const [domain, setDomain] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('none');
  const [skipCache, setSkipCache] = useState(false);

  // State for tabs
  const [activeTab, setActiveTab] = useState('analyze');

  // Fetch clients for dropdown
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await adminSDK.supabase
        .from('ai_presenter_clients')
        .select('id, name, slug, domain')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Fetch cached analyses
  const { data: cachedAnalyses, isLoading: loadingCache } = useQuery({
    queryKey: ['cached-analyses'],
    queryFn: async () => {
      const { data, error } = await adminSDK.supabase
        .from('business_intelligence_cache')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  // Fetch all opportunities
  const { data: opportunities, isLoading: loadingOpportunities } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const { data, error } = await adminSDK.supabase
        .from('detected_opportunities')
        .select(`
          *,
          client:ai_presenter_clients(id, name, slug)
        `)
        .eq('is_active', true)
        .order('total_score', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  // Analyze business mutation
  const analyzeMutation = useMutation({
    mutationFn: async ({ domain, clientId, skipCache }) => {
      const response = await fetch('/.netlify/functions/business-intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze',
          domain,
          clientId,
          skipCache,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cached-analyses']);
      queryClient.invalidateQueries(['opportunities']);
    },
  });

  // Handle analyze button
  const handleAnalyze = () => {
    if (!domain.trim()) return;

    analyzeMutation.mutate({
      domain: domain.trim(),
      clientId: selectedClientId === 'none' ? null : selectedClientId,
      skipCache,
    });
  };

  // Calculate statistics
  const stats = {
    totalCached: cachedAnalyses?.length || 0,
    totalOpportunities: opportunities?.length || 0,
    criticalOpportunities: opportunities?.filter(o => o.priority === 'critical').length || 0,
    quickWins: opportunities?.filter(o => o.quick_win).length || 0,
    avgDataQuality: cachedAnalyses?.length > 0
      ? Math.round(cachedAnalyses.reduce((sum, c) => sum + (c.data_quality_score || 0), 0) / cachedAnalyses.length)
      : 0,
    totalCost: cachedAnalyses?.reduce((sum, c) => sum + parseFloat(c.total_api_cost || 0), 0).toFixed(2) || '0.00',
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Business Intelligence</h1>
        <p className="text-muted-foreground">
          Analyze businesses, detect opportunities, and leverage comprehensive market intelligence
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cached Analyses</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCached}</div>
            <p className="text-xs text-muted-foreground">24-hour cache</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              {stats.criticalOpportunities} critical · {stats.quickWins} quick wins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDataQuality}%</div>
            <p className="text-xs text-muted-foreground">Average quality score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost}</div>
            <p className="text-xs text-muted-foreground">All time spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analyze">Analyze Business</TabsTrigger>
          <TabsTrigger value="cache">Cached Data</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyze New Business</CardTitle>
              <CardDescription>
                Run comprehensive business intelligence analysis using Apollo.io, DataForSEO, and Wappalyzer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Company Domain</Label>
                  <Input
                    id="domain"
                    placeholder="anthropic.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Link to Client (Optional)</Label>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select client (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No client (exploration only)</SelectItem>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="skip-cache"
                  checked={skipCache}
                  onCheckedChange={setSkipCache}
                />
                <Label htmlFor="skip-cache" className="cursor-pointer">
                  Skip cache (force fresh API calls - costs more)
                </Label>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!domain.trim() || analyzeMutation.isPending}
                className="w-full"
                size="lg"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing... (15-30 seconds)
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Business
                  </>
                )}
              </Button>

              {analyzeMutation.error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Analysis Failed</p>
                    <p className="text-sm">{analyzeMutation.error.message}</p>
                  </div>
                </div>
              )}

              {analyzeMutation.isSuccess && analyzeMutation.data && (
                <AnalysisResults data={analyzeMutation.data} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cache Tab */}
        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cached Analyses</CardTitle>
              <CardDescription>
                Recently analyzed businesses (cached for 24 hours to reduce API costs)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCache ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : cachedAnalyses?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No cached analyses yet. Run your first analysis!
                </div>
              ) : (
                <div className="space-y-4">
                  {cachedAnalyses?.map((cache) => (
                    <CachedAnalysisCard key={cache.id} cache={cache} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detected Opportunities</CardTitle>
              <CardDescription>
                AI-detected opportunities across all analyzed businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOpportunities ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : opportunities?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No opportunities detected yet. Analyze businesses with a linked client to detect opportunities.
                </div>
              ) : (
                <div className="space-y-4">
                  {opportunities?.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <SystemHealth cachedAnalyses={cachedAnalyses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Analysis Results Component
 */
function AnalysisResults({ data }) {
  const { apollo, dataforseo, wappalyzer, metadata, opportunities } = data;

  return (
    <div className="space-y-4 mt-6">
      {/* Success Header */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-green-900 dark:text-green-100">Analysis Complete!</p>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
            <p>Duration: {metadata.totalDuration}ms • Cost: ${metadata.totalCost.toFixed(4)} • APIs: {metadata.successCount}/{metadata.successCount + metadata.failureCount} succeeded</p>
            {metadata.cacheHit && (
              <p className="font-semibold">✓ Data retrieved from cache (no API cost)</p>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Apollo Results */}
        {apollo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Apollo.io
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Company:</span> {apollo.name}
              </div>
              <div>
                <span className="font-semibold">Industry:</span> {apollo.industry}
              </div>
              <div>
                <span className="font-semibold">Employees:</span> {apollo.employeeCount || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {[apollo.city, apollo.state, apollo.country].filter(Boolean).join(', ')}
              </div>
            </CardContent>
          </Card>
        )}

        {/* DataForSEO Results */}
        {dataforseo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                DataForSEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Keywords:</span> {dataforseo.organicKeywords?.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Traffic Value:</span> ${dataforseo.estimatedTrafficValue?.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Backlinks:</span> {dataforseo.totalBacklinks?.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Referring Domains:</span> {dataforseo.referringDomains?.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wappalyzer Results */}
        {wappalyzer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Wappalyzer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Technologies:</span> {wappalyzer.technologies?.length}
              </div>
              <div>
                <span className="font-semibold">CMS:</span> {wappalyzer.summary?.cms?.join(', ') || 'None'}
              </div>
              <div>
                <span className="font-semibold">Marketing Automation:</span> {wappalyzer.insights?.hasMarketingAutomation ? '✓' : '✗'}
              </div>
              <div>
                <span className="font-semibold">CRM:</span> {wappalyzer.insights?.hasCRM ? '✓' : '✗'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Opportunities Summary */}
      {opportunities && opportunities.count > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Opportunities Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">Critical: {opportunities.critical}</Badge>
              <Badge variant="default">High: {opportunities.high}</Badge>
              <Badge variant="secondary">Quick Wins: {opportunities.quickWins}</Badge>
              <Badge variant="outline">Total: {opportunities.count}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              View detailed opportunities in the "Opportunities" tab
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Cached Analysis Card
 */
function CachedAnalysisCard({ cache }) {
  const expiresIn = new Date(cache.cache_expires_at) - new Date();
  const hoursLeft = Math.max(0, Math.round(expiresIn / (1000 * 60 * 60)));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{cache.company_domain}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={cache.data_quality_score >= 90 ? 'default' : cache.data_quality_score >= 70 ? 'secondary' : 'destructive'}>
                Quality: {cache.data_quality_score}%
              </Badge>
              <Badge variant="outline">Cost: ${parseFloat(cache.total_api_cost || 0).toFixed(4)}</Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Expires in {hoursLeft}h
              </Badge>
            </div>
            <div className="flex gap-2 mt-3">
              {cache.data_sources_complete?.map((source) => (
                <Badge key={source} variant="secondary" className="text-xs">
                  ✓ {source}
                </Badge>
              ))}
              {cache.data_sources_failed?.map((source) => (
                <Badge key={source} variant="destructive" className="text-xs">
                  ✗ {source}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {new Date(cache.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Opportunity Card
 */
function OpportunityCard({ opportunity }) {
  const priorityColors = {
    critical: 'destructive',
    high: 'default',
    medium: 'secondary',
    low: 'outline',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{opportunity.title}</h3>
              {opportunity.quick_win && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  Quick Win
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={priorityColors[opportunity.priority]}>
              {opportunity.priority}
            </Badge>
            <div className="text-2xl font-bold">{opportunity.total_score?.toFixed(1)}</div>
          </div>
        </div>

        {opportunity.client && (
          <div className="text-sm mb-3">
            <span className="font-semibold">Client:</span> {opportunity.client.name}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Current State:</span>
            <p className="text-muted-foreground">{opportunity.current_state_metric}</p>
          </div>
          <div>
            <span className="font-semibold">Potential:</span>
            <p className="text-muted-foreground">{opportunity.potential_improvement_metric}</p>
          </div>
          <div>
            <span className="font-semibold">Timeline:</span>
            <p className="text-muted-foreground">{opportunity.timeline_estimate}</p>
          </div>
          <div>
            <span className="font-semibold">Budget:</span>
            <p className="text-muted-foreground">{opportunity.budget_range}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <p className="text-sm">
            <span className="font-semibold">ROI Potential:</span> {opportunity.roi_potential}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * System Health Component
 */
function SystemHealth({ cachedAnalyses }) {
  const last24Hours = cachedAnalyses?.filter(c => {
    const created = new Date(c.created_at);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return created > dayAgo;
  }) || [];

  const apiSuccessRate = cachedAnalyses?.length > 0
    ? Math.round((cachedAnalyses.filter(c => c.data_quality_score >= 90).length / cachedAnalyses.length) * 100)
    : 0;

  const avgCost = cachedAnalyses?.length > 0
    ? (cachedAnalyses.reduce((sum, c) => sum + parseFloat(c.total_api_cost || 0), 0) / cachedAnalyses.length).toFixed(4)
    : '0.0000';

  const cacheHitRate = cachedAnalyses?.length > 1
    ? Math.round((cachedAnalyses.filter(c => c.created_at !== c.updated_at).length / cachedAnalyses.length) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>Last 24 hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{last24Hours.length}</div>
              <div className="text-sm text-muted-foreground">Analyses</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{apiSuccessRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${avgCost}</div>
              <div className="text-sm text-muted-foreground">Avg Cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{cacheHitRate}%</div>
              <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <APIStatusRow name="Apollo.io" status="operational" />
          <APIStatusRow name="DataForSEO" status="operational" />
          <APIStatusRow name="Wappalyzer" status="operational" />
        </CardContent>
      </Card>
    </div>
  );
}

function APIStatusRow({ name, status }) {
  const isOperational = status === 'operational';

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <span className="font-medium">{name}</span>
      <div className="flex items-center gap-2">
        {isOperational ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">Operational</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600">Degraded</span>
          </>
        )}
      </div>
    </div>
  );
}
