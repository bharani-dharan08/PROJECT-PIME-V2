import React, { useState } from 'react';
import { FirewallStats, PimeResponse } from '../types.ts';
import { Shield, ShieldAlert, ShieldCheck, Activity, DollarSign, Database, Clock, RefreshCw, Cpu, Layers } from 'lucide-react';

interface SocAnalyticsProps {
  stats: FirewallStats;
  auditLogs: { id: string; timestamp: string; input: string; response: PimeResponse }[];
  onRefresh: () => void;
  onSelectAuditLog: (log: { id: string; timestamp: string; input: string; response: PimeResponse }) => void;
}

export const SocAnalytics: React.FC<SocAnalyticsProps> = ({
  stats,
  auditLogs,
  onRefresh,
  onSelectAuditLog,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'BLOCKED' | 'SANITIZED' | 'PASSED'>('ALL');

  const total = stats.total_inspections || 1;
  const blockedPct = Math.round((stats.blocked_count / total) * 100);
  const sanitizedPct = Math.round((stats.sanitized_count / total) * 100);
  const passedPct = Math.round((stats.passed_count / total) * 100);

  // Compute saved tokens estimate (average malicious prompt is ~180 tokens + 450 tokens response suppressed)
  const savedTokensEst = stats.blocked_count * 630;
  const savedCostEst = (savedTokensEst / 1000) * 0.003; // ~$0.003 per 1k tokens

  const filteredLogs = auditLogs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.response.verdict === filter;
  });

  const categories: Record<string, number> = stats.threat_category_breakdown || {};
  const catValues = Object.values(categories) as number[];
  const maxCatCount = catValues.length > 0 ? Math.max(...catValues, 1) : 1;

  return (
    <div className="space-y-6">
      {/* Top Banner with Refresh */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-base text-slate-100">
              Security Operations Center (SOC) Telemetry
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Real-time inline mitigation metrics, threat vector breakdown, and compute suppression metrics.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-mono transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>TOTAL SCANNED</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">{stats.total_inspections}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">100% Inline Inspected</div>
        </div>

        <div className="bg-slate-950 border border-rose-900/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-rose-300 text-xs font-mono mb-2">
            <span>ATTACKS BLOCKED</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-200">{stats.blocked_count}</div>
          <div className="text-[11px] font-mono text-rose-400 mt-1">{blockedPct}% Intercept Rate</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>TOKENS SAVED</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-300">
            ~{savedTokensEst.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">
            Zero-Token Suppressed
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>MEDIAN LATENCY</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300">{stats.avg_latency_ms} ms</div>
          <div className="text-[11px] font-mono text-cyan-400 mt-1">Sub-millisecond Heuristics</div>
        </div>
      </div>

      {/* Analytics Grid: Threat Category Breakdown & Verdict Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              OWASP LLM01 Threat Category Distribution
            </h4>
          </div>

          <div className="space-y-4">
            {Object.entries(categories).length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-slate-500">
                No threat categories recorded yet. Run tests or benchmark suite.
              </div>
            ) : (
              Object.entries(categories).map(([cat, rawCount]) => {
                const count = Number(rawCount);
                const pct = Math.round((count / maxCatCount) * 100);
                return (
                  <div key={cat} className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>{cat}</span>
                      <span className="text-slate-400 font-bold">{count} detections</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Verdict Distribution Meter */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Firewall Traffic Filter Breakdown
            </h4>

            {/* Visual Bar */}
            <div className="w-full h-5 rounded-lg overflow-hidden flex bg-slate-900 border border-slate-800 mb-4">
              <div
                style={{ width: `${blockedPct}%` }}
                title={`Blocked: ${stats.blocked_count} (${blockedPct}%)`}
                className="bg-rose-500 h-full transition-all"
              />
              <div
                style={{ width: `${sanitizedPct}%` }}
                title={`Sanitized: ${stats.sanitized_count} (${sanitizedPct}%)`}
                className="bg-amber-500 h-full transition-all"
              />
              <div
                style={{ width: `${passedPct}%` }}
                title={`Passed: ${stats.passed_count} (${passedPct}%)`}
                className="bg-emerald-500 h-full transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-lg">
                <div className="text-rose-400 font-bold">{stats.blocked_count}</div>
                <div className="text-[10px] text-slate-400">BLOCKED ({blockedPct}%)</div>
              </div>
              <div className="p-3 bg-amber-950/30 border border-amber-900/60 rounded-lg">
                <div className="text-amber-400 font-bold">{stats.sanitized_count}</div>
                <div className="text-[10px] text-slate-400">SANITIZED ({sanitizedPct}%)</div>
              </div>
              <div className="p-3 bg-emerald-950/30 border border-emerald-900/60 rounded-lg">
                <div className="text-emerald-400 font-bold">{stats.passed_count}</div>
                <div className="text-[10px] text-slate-400">PASSED ({passedPct}%)</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 leading-relaxed">
            <span className="text-cyan-300 font-bold">Policy Enforcement:</span> All inputs flagged as <code className="text-rose-400">BLOCKED</code> terminate downstream dispatch immediately with 0 tokens consumed. Safe inputs are bound within <code className="text-emerald-400">&lt;escaped_prompt&gt;</code> context tags.
          </div>
        </div>
      </div>

      {/* Event Audit Log Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            Live Interception Audit Log ({filteredLogs.length} events)
          </h4>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            {(['ALL', 'BLOCKED', 'SANITIZED', 'PASSED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2.5 py-1 rounded border transition ${
                  filter === mode
                    ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800 sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-4">Verdict</th>
                <th className="py-2.5 px-4">Threat Level</th>
                <th className="py-2.5 px-4">Ingress Payload Preview</th>
                <th className="py-2.5 px-4">Action Taken</th>
                <th className="py-2.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.response.verdict === 'BLOCKED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : log.response.verdict === 'SANITIZED'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {log.response.verdict}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-slate-400">
                      {log.response.threat_level}
                    </td>
                    <td className="py-2.5 px-4 max-w-xs truncate text-slate-200">
                      {log.input}
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-slate-400 max-w-xs truncate">
                      {log.response.action_log}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => onSelectAuditLog(log)}
                        className="text-cyan-400 hover:text-cyan-300 text-[11px] underline"
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
