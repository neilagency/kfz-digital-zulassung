'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, Gauge, Zap, Clock, Globe, RefreshCw, Server, Layers3, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui';

interface Metric {
  label: string;
  value: string;
  status: 'good' | 'okay' | 'bad';
  icon: typeof Activity;
}

interface ApiTest {
  endpoint: string;
  label: string;
  latency: number | null;
  status: 'idle' | 'testing' | 'done' | 'error';
}

interface SeoAuditSummary {
  totalCities: number;
  weakNodeCount: number;
  weakNodePercent: number;
  indexableCityCount: number;
  nearbyGraphFailures: number;
  lowLocalInsightCount: number;
  highReusableShareThreshold: number;
  highReusableShareCount: number;
  averageReusableShare: number;
  maxReusableShare: number;
  contentBlockPatternCount: number;
  generatedAt: string;
}

interface SeoAuditNode {
  slug: string;
  name: string;
  reasons: string[];
  reusableSentenceShare: number;
  contentBlockSignature: string;
}

interface SeoAuditLocalSignalUsage {
  trafficLevel: Record<'low' | 'medium' | 'high', number>;
  officeLoad: Record<'fast' | 'moderate' | 'busy', number>;
  digitalAdoption: Record<'low' | 'medium' | 'high', number>;
  nearbyDensity: Record<'low' | 'medium' | 'high', number>;
}

interface SeoAuditSnapshot {
  summary: SeoAuditSummary;
  contentBlockUsage: Record<string, number>;
  contentBlockPatterns: Array<{ signature: string; count: number }>;
  archetypeUsage: Record<string, number>;
  localSignalUsage: SeoAuditLocalSignalUsage;
  weakNodes: SeoAuditNode[];
}

const SIGNAL_GROUP_ORDER: Array<{
  label: string;
  valuesKey: keyof SeoAuditLocalSignalUsage;
  order: string[];
}> = [
  { label: 'Traffic Level', valuesKey: 'trafficLevel', order: ['low', 'medium', 'high'] },
  { label: 'Office Load', valuesKey: 'officeLoad', order: ['fast', 'moderate', 'busy'] },
  { label: 'Digital Adoption', valuesKey: 'digitalAdoption', order: ['low', 'medium', 'high'] },
  { label: 'Nearby Density', valuesKey: 'nearbyDensity', order: ['low', 'medium', 'high'] },
];

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const API_ENDPOINTS = [
  { endpoint: '/api/admin/dashboard', label: 'Dashboard' },
  { endpoint: '/api/admin/orders?limit=10', label: 'Orders' },
  { endpoint: '/api/admin/customers?limit=10', label: 'Customers' },
  { endpoint: '/api/admin/blog?limit=10', label: 'Blog' },
  { endpoint: '/api/admin/invoices?limit=10', label: 'Invoices' },
  { endpoint: '/api/admin/products?limit=10', label: 'Products' },
  { endpoint: '/api/admin/media?limit=10', label: 'Media' },
];

function StatusDot({ status }: { status: 'good' | 'okay' | 'bad' }) {
  const color = status === 'good' ? 'bg-green-400' : status === 'okay' ? 'bg-yellow-400' : 'bg-red-400';
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100/80">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{metric.label}</span>
        </div>
        <StatusDot status={metric.status} />
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{metric.value}</p>
    </div>
  );
}

function getWebVitals() {
  const metrics: Metric[] = [];

  // Navigation timing
  if (typeof window !== 'undefined' && window.performance) {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav) {
      const pageLoad = Math.round(nav.loadEventEnd - nav.fetchStart);
      metrics.push({
        label: 'Page Load',
        value: `${pageLoad}ms`,
        status: pageLoad < 1500 ? 'good' : pageLoad < 3000 ? 'okay' : 'bad',
        icon: Clock,
      });

      const ttfb = Math.round(nav.responseStart - nav.requestStart);
      metrics.push({
        label: 'TTFB',
        value: `${ttfb}ms`,
        status: ttfb < 200 ? 'good' : ttfb < 500 ? 'okay' : 'bad',
        icon: Server,
      });

      const domReady = Math.round(nav.domContentLoadedEventEnd - nav.fetchStart);
      metrics.push({
        label: 'DOM Ready',
        value: `${domReady}ms`,
        status: domReady < 1000 ? 'good' : domReady < 2000 ? 'okay' : 'bad',
        icon: Globe,
      });
    }
  }

  // Memory (Chrome only)
  if (typeof window !== 'undefined' && (performance as any).memory) {
    const mem = (performance as any).memory;
    const usedMB = Math.round(mem.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(mem.jsHeapSizeLimit / 1024 / 1024);
    metrics.push({
      label: 'JS Heap',
      value: `${usedMB}/${totalMB} MB`,
      status: usedMB / totalMB < 0.5 ? 'good' : usedMB / totalMB < 0.8 ? 'okay' : 'bad',
      icon: Gauge,
    });
  }

  return metrics;
}

export default function PerformancePage() {
  const [webVitals, setWebVitals] = useState<Metric[]>([]);
  const [apiTests, setApiTests] = useState<ApiTest[]>(
    API_ENDPOINTS.map((e) => ({ ...e, latency: null, status: 'idle' as const })),
  );
  const [seoAudit, setSeoAudit] = useState<SeoAuditSnapshot | null>(null);
  const [seoAuditStatus, setSeoAuditStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [testing, setTesting] = useState(false);
  const [lcpValue, setLcpValue] = useState<string | null>(null);
  const [lcpStatus, setLcpStatus] = useState<'good' | 'okay' | 'bad'>('good');
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Collect web vitals after page load
    const timer = setTimeout(() => setWebVitals(getWebVitals()), 1000);

    // LCP observer
    try {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          const val = Math.round(last.startTime);
          setLcpValue(`${val}ms`);
          setLcpStatus(val < 2500 ? 'good' : val < 4000 ? 'okay' : 'bad');
        }
      });
      observerRef.current.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // LCP not supported
    }

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  const loadSeoAudit = useCallback(async () => {
    setSeoAuditStatus('loading');
    try {
      const res = await fetch('/api/admin/seo-audit', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'SEO audit failed');
      setSeoAudit(data);
      setSeoAuditStatus('ready');
    } catch {
      setSeoAuditStatus('error');
    }
  }, []);

  useEffect(() => {
    void loadSeoAudit();
  }, [loadSeoAudit]);

  const runApiTests = useCallback(async () => {
    setTesting(true);
    const initial: ApiTest[] = API_ENDPOINTS.map((e) => ({ ...e, latency: null, status: 'testing' as const }));
    setApiTests(initial);

    // Measure endpoints sequentially to avoid self-inflicted queueing on shared hosting.
    const results: ApiTest[] = [];

    for (const ep of initial) {
      const start = performance.now();
      try {
        const res = await fetch(ep.endpoint, { cache: 'no-store' });
        await res.text();
        const latency = Math.round(performance.now() - start);
        results.push({ ...ep, latency, status: res.ok ? 'done' as const : 'error' as const });
      } catch {
        results.push({ ...ep, latency: Math.round(performance.now() - start), status: 'error' as const });
      }

      setApiTests((current) => current.map((test) => {
        const updated = results.find((result) => result.endpoint === test.endpoint);
        return updated ?? test;
      }));
    }

    setApiTests(results);
    setTesting(false);
  }, []);

  const avgLatency = apiTests.filter((t) => t.latency != null).length > 0
    ? Math.round(apiTests.filter((t) => t.latency != null).reduce((s, t) => s + (t.latency || 0), 0) / apiTests.filter((t) => t.latency != null).length)
    : null;

  const seoAuditMetrics: Metric[] = seoAudit ? [
    {
      label: 'Indexierbar',
      value: `${seoAudit.summary.indexableCityCount}/${seoAudit.summary.totalCities}`,
      status: seoAudit.summary.weakNodeCount === 0 ? 'good' : seoAudit.summary.weakNodePercent < 2 ? 'okay' : 'bad',
      icon: Globe,
    },
    {
      label: 'Weak Nodes',
      value: `${seoAudit.summary.weakNodeCount} (${seoAudit.summary.weakNodePercent}%)`,
      status: seoAudit.summary.weakNodeCount === 0 ? 'good' : seoAudit.summary.weakNodePercent < 2 ? 'okay' : 'bad',
      icon: ShieldAlert,
    },
    {
      label: 'Ø Reuse',
      value: `${Math.round(seoAudit.summary.averageReusableShare * 100)}%`,
      status: seoAudit.summary.averageReusableShare <= 0.15 ? 'good' : seoAudit.summary.averageReusableShare <= 0.3 ? 'okay' : 'bad',
      icon: Gauge,
    },
    {
      label: 'Content Patterns',
      value: String(seoAudit.summary.contentBlockPatternCount),
      status: seoAudit.summary.contentBlockPatternCount >= 4 ? 'good' : seoAudit.summary.contentBlockPatternCount >= 2 ? 'okay' : 'bad',
      icon: Layers3,
    },
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Monitor"
        actions={
          <button
            onClick={() => setWebVitals(getWebVitals())}
            className="px-3 py-2.5 text-sm font-medium bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50 rounded-xl transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Aktualisieren
          </button>
        }
      />

      {/* Web Vitals */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Web Vitals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {webVitals.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
          {lcpValue && (
            <MetricCard metric={{ label: 'LCP', value: lcpValue, status: lcpStatus, icon: Zap }} />
          )}
          {webVitals.length === 0 && !lcpValue && (
            <div className="col-span-full text-sm text-gray-400 bg-white rounded-xl p-8 border text-center">
              Lade Metriken...
            </div>
          )}
        </div>
      </div>

      {/* Performance Targets */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100/80">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Ziele & Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'First Load', target: '< 1.5s', actual: webVitals.find((m) => m.label === 'Page Load')?.value || '-' },
            { label: 'Navigation', target: '< 500ms', actual: webVitals.find((m) => m.label === 'DOM Ready')?.value || '-' },
            { label: 'API Response', target: '< 300ms', actual: avgLatency != null ? `${avgLatency}ms` : '-' },
            { label: 'TTFB', target: '< 200ms', actual: webVitals.find((m) => m.label === 'TTFB')?.value || '-' },
          ].map((t) => (
            <div key={t.label} className="border border-gray-100/80 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">{t.label}</div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-gray-900">{t.actual}</span>
                <span className="text-xs text-gray-400">Ziel: {t.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Audit Monitor */}
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">SEO Architecture Monitor</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live snapshot of weak nodes, reuse share, and content-block diversity</p>
          </div>
          <button
            onClick={() => void loadSeoAudit()}
            disabled={seoAuditStatus === 'loading'}
            className="px-4 py-2.5 bg-white border border-gray-200/80 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${seoAuditStatus === 'loading' ? 'animate-spin' : ''}`} />
            Aktualisieren
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {seoAuditMetrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
            {seoAuditStatus === 'loading' && seoAuditMetrics.length === 0 && (
              <div className="col-span-full text-sm text-gray-400 bg-gray-50 rounded-xl p-8 border text-center">
                Lade SEO-Audit...
              </div>
            )}
            {seoAuditStatus === 'error' && (
              <div className="col-span-full text-sm text-red-500 bg-red-50 rounded-xl p-8 border border-red-100 text-center">
                SEO-Audit konnte nicht geladen werden.
              </div>
            )}
          </div>

          {seoAudit && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-gray-100/80 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Content Block Usage</h3>
                    <span className="text-xs text-gray-400">Aktualisiert: {new Date(seoAudit.summary.generatedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(seoAudit.contentBlockUsage)
                      .sort((left, right) => right[1] - left[1])
                      .map(([block, count]) => {
                        const width = seoAudit.summary.totalCities > 0 ? Math.max(6, Math.round((count / seoAudit.summary.totalCities) * 100)) : 0;
                        return (
                          <div key={block} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{block}</span>
                              <span>{count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100/80 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Content Patterns</h3>
                  <div className="space-y-3">
                    {seoAudit.contentBlockPatterns.slice(0, 5).map((pattern) => (
                      <div key={pattern.signature} className="rounded-xl bg-gray-50 p-3 border border-gray-100/80">
                        <div className="text-xs text-gray-400 mb-1">{pattern.count} Seiten</div>
                        <div className="text-sm font-medium text-gray-700">{pattern.signature}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-gray-100/80 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Archetype Mix</h3>
                  <div className="space-y-3">
                    {Object.entries(seoAudit.archetypeUsage)
                      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
                      .map(([archetype, count]) => {
                        const width = seoAudit.summary.totalCities > 0 ? Math.max(6, Math.round((count / seoAudit.summary.totalCities) * 100)) : 0;
                        return (
                          <div key={archetype} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{formatEnumLabel(archetype)}</span>
                              <span>{count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full bg-accent" style={{ width: `${width}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100/80 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Local Signals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SIGNAL_GROUP_ORDER.map((group) => {
                      const values = seoAudit.localSignalUsage[group.valuesKey];
                      return (
                        <div key={group.valuesKey} className="rounded-xl bg-gray-50 p-3 border border-gray-100/80">
                          <div className="text-xs text-gray-400 mb-2">{group.label}</div>
                          <div className="space-y-2">
                            {group.order.map((key) => {
                              const count = values[key as keyof typeof values] ?? 0;
                              const width = seoAudit.summary.totalCities > 0 ? Math.max(6, Math.round((count / seoAudit.summary.totalCities) * 100)) : 0;
                              return (
                                <div key={key} className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                                    <span className="font-medium text-gray-700">{formatEnumLabel(key)}</span>
                                    <span>{count}</span>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-white overflow-hidden border border-gray-100">
                                    <div className="h-full rounded-full bg-primary/80" style={{ width: `${width}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-gray-100/80 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Offene Weak Nodes</h3>
                  <div className="space-y-3">
                    {seoAudit.weakNodes.length > 0 ? seoAudit.weakNodes.slice(0, 5).map((node) => (
                      <div key={node.slug} className="rounded-xl bg-gray-50 p-3 border border-gray-100/80">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-gray-800">{node.name}</div>
                            <div className="text-xs text-gray-400">/{node.slug}</div>
                          </div>
                          <div className="text-xs font-mono text-gray-500">{Math.round(node.reusableSentenceShare * 100)}%</div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">{node.reasons.join(' • ')}</div>
                        <div className="mt-2 text-xs text-primary/80">{node.contentBlockSignature}</div>
                      </div>
                    )) : (
                      <div className="rounded-xl bg-green-50 text-green-700 p-4 border border-green-100 text-sm">
                        Keine weak nodes im aktuellen Snapshot.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100/80 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO Thresholds</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: 'High Reuse',
                        value: `${seoAudit.summary.highReusableShareCount}`,
                        note: `> ${Math.round(seoAudit.summary.highReusableShareThreshold * 100)}%`,
                      },
                      {
                        label: 'Nearby Failures',
                        value: `${seoAudit.summary.nearbyGraphFailures}`,
                        note: 'Graph invalid',
                      },
                      {
                        label: 'Max Reuse',
                        value: `${Math.round(seoAudit.summary.maxReusableShare * 100)}%`,
                        note: 'schlechtester Fall',
                      },
                      {
                        label: 'Low Insights',
                        value: `${seoAudit.summary.lowLocalInsightCount}`,
                        note: '< 2 Insights',
                      },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-gray-100/80 p-3 bg-gray-50">
                        <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                        <div className="text-lg font-bold text-gray-900">{item.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Latency Tests */}
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">API Latenz-Test</h2>
            <p className="text-xs text-gray-400 mt-0.5">Misst Antwortzeiten aller Admin-API-Endpunkte</p>
          </div>
          <button
            onClick={runApiTests}
            disabled={testing}
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2"
          >
            {testing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Teste...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Test starten
              </>
            )}
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {apiTests.map((test) => (
            <div key={test.endpoint} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  test.status === 'idle' ? 'bg-gray-200' :
                  test.status === 'testing' ? 'bg-yellow-400 animate-pulse' :
                  test.status === 'error' ? 'bg-red-400' :
                  (test.latency || 0) < 300 ? 'bg-green-400' :
                  (test.latency || 0) < 500 ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-sm font-medium text-gray-700">{test.label}</span>
                <span className="text-xs text-gray-400">{test.endpoint}</span>
              </div>
              <span className={`text-sm font-mono ${
                test.latency == null ? 'text-gray-300' :
                test.latency < 300 ? 'text-green-600' :
                test.latency < 500 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {test.status === 'testing' ? '...' : test.latency != null ? `${test.latency}ms` : '—'}
              </span>
            </div>
          ))}
        </div>
        {avgLatency != null && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Durchschnitt</span>
            <span className={`text-sm font-mono font-bold ${
              avgLatency < 300 ? 'text-green-600' : avgLatency < 500 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {avgLatency}ms
            </span>
          </div>
        )}
      </div>

      {/* Optimization Checklist */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100/80">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Optimierungen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { label: 'react-window Virtualisierung', done: true },
            { label: 'Cursor-basierte Pagination', done: true },
            { label: 'SWR Cache Persistenz', done: true },
            { label: 'Cache-Control Headers', done: true },
            { label: 'Code Splitting (dynamic imports)', done: true },
            { label: 'Memoized Rows', done: true },
            { label: 'DB Indexes optimiert', done: true },
            { label: 'API Select Fields', done: true },
          ].map((opt) => (
            <div key={opt.label} className="flex items-center gap-2 py-1.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                opt.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {opt.done ? '✓' : '○'}
              </span>
              <span className={`text-sm ${opt.done ? 'text-gray-700' : 'text-gray-400'}`}>{opt.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
