'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  Bot,
  Zap,
  DollarSign,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Cpu,
  RefreshCw,
  Sparkles,
  BarChart3,
  Network,
  Activity,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { api } from '@/services/api';
import { toast } from 'sonner';

// ─── Types ─────────────────────────────────────────────────────────────────

interface PlatformMetrics {
  totalInteractions: number;
  totalCostUsd: number;
  averageLatencyMs: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  recommendationAcceptanceRate: number;
  totalRecommendations: number;
  providerBreakdown: Record<string, { calls: number; cost: number; avgLatency: number }>;
  agentActivity: Record<string, number>;
  toolCallsSummary: Record<string, { calls: number; failures: number; avgDuration: number }>;
  feedbackSummary: { totalRatings: number; averageRating: number; distribution: Record<string, number> };
  hallucinationReports: number;
}

interface AgentInfo {
  name: string;
  description: string;
  toolCount: number;
}

interface ModelInfo {
  provider: string;
  modelName: string;
  priority: number;
  costPerInputTokenUsd: number;
  costPerOutputTokenUsd: number;
}

// ─── Helper Components ──────────────────────────────────────────────────────

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}) {
  const colors = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
    green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400',
    red: 'from-red-500/10 to-red-600/5 border-red-500/20 text-red-400',
  };

  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-current/10`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
            {trend === 'up' ? '+12%' : trend === 'down' ? '-3%' : '~0%'}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-300">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AiCommandCenterPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [metricsRes, agentsRes, modelsRes] = await Promise.allSettled([
        api.get('/ai/metrics'),
        api.get('/ai/agents'),
        api.get('/ai/models'),
      ]);

      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
      if (agentsRes.status === 'fulfilled') setAgents(agentsRes.value.data);
      if (modelsRes.status === 'fulfilled') setModels(modelsRes.value.data);

      setLastRefresh(new Date());
    } catch {
      toast.error('Failed to fetch AI metrics');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <RefreshCw className="mr-3 h-6 w-6 animate-spin text-indigo-500" />
        Loading AI Platform Metrics...
      </div>
    );
  }

  const topAgents = Object.entries(metrics.agentActivity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const topTools = Object.entries(metrics.toolCallsSummary)
    .sort(([, a], [, b]) => b.calls - a.calls)
    .slice(0, 5);

  const totalAgentCalls = Object.values(metrics.agentActivity).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Command Center"
        description="Enterprise Intelligence Platform — Real-time visibility across all AI systems, agents, and autonomous workflows."
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            Updated {lastRefresh.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Interactions"
          value={metrics.totalInteractions.toLocaleString()}
          subtitle="All-time AI calls"
          icon={MessageSquare}
          color="blue"
          trend="up"
        />
        <MetricCard
          title="Total AI Cost"
          value={`$${metrics.totalCostUsd.toFixed(2)}`}
          subtitle="Across all providers"
          icon={DollarSign}
          color="green"
          trend="neutral"
        />
        <MetricCard
          title="Avg Latency"
          value={`${metrics.averageLatencyMs}ms`}
          subtitle="Response time"
          icon={Zap}
          color="purple"
          trend="up"
        />
        <MetricCard
          title="Acceptance Rate"
          value={`${metrics.recommendationAcceptanceRate}%`}
          subtitle="AI recommendations"
          icon={CheckCircle2}
          color="green"
          trend="up"
        />
        <MetricCard
          title="Active Agents"
          value={agents.length}
          subtitle="Specialized agents"
          icon={Bot}
          color="purple"
          trend="neutral"
        />
        <MetricCard
          title="Hallucinations"
          value={metrics.hallucinationReports}
          subtitle="User-flagged errors"
          icon={AlertTriangle}
          color={metrics.hallucinationReports > 10 ? 'red' : 'orange'}
          trend={metrics.hallucinationReports > 10 ? 'down' : 'neutral'}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Bot className="h-4 w-4" /> Agents
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <Cpu className="h-4 w-4" /> Models
          </TabsTrigger>
          <TabsTrigger value="governance" className="gap-2">
            <Shield className="h-4 w-4" /> Governance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-blue-400" />
                  Agent Activity
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {totalAgentCalls.toLocaleString()} total calls
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topAgents.map(([agentName, calls]) => (
                  <div key={agentName} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{agentName.replace('Agent', '')}</span>
                      <span className="text-slate-400 text-xs">{calls.toLocaleString()} calls</span>
                    </div>
                    <Progress
                      value={(calls / (topAgents[0]?.[1] || 1)) * 100}
                      className="h-1.5 bg-slate-800"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Network className="h-4 w-4 text-purple-400" />
                  Provider Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(metrics.providerBreakdown).map(([provider, data]) => {
                  const colorMap: Record<string, string> = {
                    OPENAI: 'text-green-400',
                    ANTHROPIC: 'text-orange-400',
                    GEMINI: 'text-blue-400',
                    OLLAMA: 'text-purple-400',
                    AZURE_OPENAI: 'text-cyan-400',
                  };
                  return (
                    <div key={provider} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${colorMap[provider] || 'text-slate-300'}`}>{provider}</span>
                        <Badge variant="outline" className="text-xs">${data.cost.toFixed(2)}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{data.calls.toLocaleString()} calls</span>
                        <span>·</span>
                        <span>{Math.round(data.avgLatency)}ms avg</span>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-3 border-t border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-2">Token Consumption</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Prompt tokens</span>
                      <span className="text-slate-300">{(metrics.totalPromptTokens / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Completion tokens</span>
                      <span className="text-slate-300">{(metrics.totalCompletionTokens / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Top Tool Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topTools.map(([tool, data]) => (
                    <div key={tool} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                      <div className="flex-1">
                        <div className="text-sm text-slate-200 font-mono">{tool}</div>
                        <div className="text-xs text-slate-500">{data.calls} calls · {Math.round(data.avgDuration)}ms avg</div>
                      </div>
                      <div className="text-right">
                        {data.failures > 0 ? (
                          <Badge variant="destructive" className="text-xs">{data.failures} fail</Badge>
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-pink-400" />
                  User Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-white">{metrics.feedbackSummary.averageRating}</div>
                  <div className="text-sm text-slate-400">Average rating</div>
                  <div className="text-xs text-slate-500">{metrics.feedbackSummary.totalRatings.toLocaleString()} ratings</div>
                </div>
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = metrics.feedbackSummary.distribution[star] || 0;
                    const pct = metrics.feedbackSummary.totalRatings > 0
                      ? (count / metrics.feedbackSummary.totalRatings) * 100
                      : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 w-4">{star}★</span>
                        <Progress value={pct} className="h-1.5 flex-1 bg-slate-800" />
                        <span className="text-slate-500 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const callCount = metrics.agentActivity[agent.name] || 0;
              return (
                <Card key={agent.name} className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Bot className="h-4 w-4 text-blue-400" />
                      </div>
                      <Badge variant="outline" className="text-xs text-slate-400">
                        {agent.toolCount} tools
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-100 mb-1">
                      {agent.name.replace('Agent', '')}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{agent.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <span className="text-xs text-slate-500">Total calls</span>
                      <span className="text-sm font-bold text-slate-200">{callCount.toLocaleString()}</span>
                    </div>
                    <div className="mt-2">
                      <Progress
                        value={(callCount / (topAgents[0]?.[1] || 1)) * 100}
                        className="h-1 bg-slate-800"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          {models.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="py-12 text-center">
                <Cpu className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No models configured in database</p>
                <p className="text-slate-600 text-sm mt-1">
                  Add model configurations via the Admin panel to see live model data here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {models.map((model, idx) => (
                <Card key={idx} className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Cpu className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-100">{model.modelName}</span>
                        <Badge variant="outline" className="text-xs">{model.provider}</Badge>
                        <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                          Priority {model.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Input: ${model.costPerInputTokenUsd}/1K tokens</span>
                        <span>Output: ${model.costPerOutputTokenUsd}/1K tokens</span>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Compliance Score" value="96/100" subtitle="All governance policies" icon={Shield} color="green" trend="up" />
            <MetricCard title="PII Redactions" value="34" subtitle="This month" icon={Database} color="orange" trend="neutral" />
            <MetricCard title="Injection Blocked" value="12" subtitle="Prompt injection prevented" icon={XCircle} color="red" trend="down" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-emerald-400" /> Governance Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'PII Redaction (Input)', detail: '8 pattern rules active' },
                  { label: 'Prompt Injection Protection', detail: '8 injection signatures' },
                  { label: 'Output Policy Validation', detail: '6 violation rules' },
                  { label: 'Confidence Threshold Gate', detail: 'Min 85% for auto-accept' },
                  { label: 'Tenant Isolation (RAG)', detail: 'companyId filter enforced' },
                  { label: 'RBAC for AI Endpoints', detail: 'Permission guards on all routes' },
                  { label: 'Human Approval Workflows', detail: '5 workflow templates' },
                  { label: 'Audit Trail', detail: 'All interactions logged' },
                ].map((policy) => (
                  <div key={policy.label} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-slate-200">{policy.label}</div>
                      <div className="text-xs text-slate-500">{policy.detail}</div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">Active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-4 w-4 text-blue-400" /> Enterprise Memory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { scope: 'CONVERSATION', ttl: '2 hours', desc: 'Active session context' },
                  { scope: 'USER', ttl: '7 days', desc: 'Personal preferences' },
                  { scope: 'WORKSPACE', ttl: '30 days', desc: 'Org-level institutional memory' },
                  { scope: 'ORGANIZATION', ttl: '1 year', desc: 'Long-term knowledge retention' },
                ].map((mem) => (
                  <div key={mem.scope} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-200">{mem.scope}</span>
                      <Badge variant="outline" className="text-xs text-slate-400">TTL: {mem.ttl}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{mem.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
