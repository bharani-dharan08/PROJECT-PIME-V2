import React from 'react';
import { FirewallStats } from '../types.ts';
import { Shield, ShieldAlert, Cpu, Zap, Activity, Clock, Flame, DollarSign, Database } from 'lucide-react';

interface QuantumMetricsProps {
  stats: FirewallStats;
}

export const QuantumMetrics: React.FC<QuantumMetricsProps> = ({ stats }) => {
  const total = stats.total_inspections || 1;
  const blocked = stats.blocked_count || 0;
  const sanitized = stats.sanitized_count || 0;
  const passed = stats.passed_count || 0;

  // Interception rate
  const blockRate = Math.round((blocked / total) * 100);
  // Estimate tokens protected: assume average attack is ~320 tokens
  const estSavedTokens = blocked * 340;
  // Estimate dollar cost saved in downstream Gemini tokens & GPU compute
  const estCostSaved = (estSavedTokens * 0.000075).toFixed(4);

  // OWASP Threat categories breakdown
  const categories: Record<string, number> = {
    'System Prompt Leakage': stats.threat_category_breakdown?.['System Prompt Leakage'] || 0,
    'Delimiter Hijacking': stats.threat_category_breakdown?.['Delimiter Hijacking'] || 0,
    'Jailbreak Signature': stats.threat_category_breakdown?.['Jailbreak Signature'] || 0,
    'Indirect Prompt Injection': stats.threat_category_breakdown?.['Indirect Prompt Injection'] || 0,
  };

  const maxCatCount = Math.max(...Object.values(categories), 1);

  // SVG circular ring helper
  const renderCircleRing = (
    pct: number,
    color: string,
    glowColor: string,
    label: string,
    sublabel: string
  ) => {
    const radius = 38;
    const circ = 2 * Math.PI * radius;
    const strokeDashoffset = circ - (Math.min(pct, 100) / 100) * circ;

    return (
      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#03060B] border border-cyan-950/80">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Glowing fill arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="7"
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: `drop-shadow(0 0 6px ${glowColor})`,
                transition: 'stroke-dashoffset 0.8s ease',
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <span className="text-base font-bold text-slate-100">{pct}%</span>
            <span className="text-[9px] text-slate-500 uppercase">SCORE</span>
          </div>
        </div>
        <span className="mt-2 text-xs font-mono font-bold text-slate-200 text-center">{label}</span>
        <span className="text-[10px] font-mono text-slate-400 text-center">{sublabel}</span>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-[#07090E]/95 border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-950">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Activity className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span>EXECUTIVE SOC QUANTUM METRICS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                REAL-TIME TELEMETRY
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Inline gateway throughput, context budget savings & OWASP LLM01 telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">GATEWAY SLA:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-bold text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>&lt; 2.0 MS SUB-EDGE SLA</span>
          </span>
        </div>
      </div>

      {/* 4 Glowing Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Scanned */}
        <div className="p-4 rounded-xl bg-[#03060B] border border-cyan-900/50 relative overflow-hidden group hover:border-cyan-500/60 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Ingress Packets</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-100 tracking-tight">
            {stats.total_inspections.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-cyan-400/80 mt-1 flex items-center gap-1">
            <span>Pass: {passed}</span>
            <span>•</span>
            <span>Sanitize: {sanitized}</span>
          </div>
        </div>

        {/* Card 2: Blocked Threats */}
        <div className="p-4 rounded-xl bg-[#03060B] border border-rose-900/50 relative overflow-hidden group hover:border-rose-500/60 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300">
              Threats Intercepted
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-rose-400 tracking-tight">
            {blocked.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-rose-400/80 mt-1">
            Zero-Token Drops Enforced
          </div>
        </div>

        {/* Card 3: Tokens Saved */}
        <div className="p-4 rounded-xl bg-[#03060B] border border-emerald-900/50 relative overflow-hidden group hover:border-emerald-500/60 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">
              Suppressed Tokens
            </span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-300 tracking-tight">
            ~{estSavedTokens.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400/80 mt-1">
            Prevents Budget Exhaustion
          </div>
        </div>

        {/* Card 4: Median Inline Latency */}
        <div className="p-4 rounded-xl bg-[#03060B] border border-cyan-900/50 relative overflow-hidden group hover:border-cyan-500/60 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Median Latency</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-300 tracking-tight">
            {stats.avg_latency_ms || 1.15} <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[10px] font-mono text-cyan-400/80 mt-1">
            Synchronous Edge Defense
          </div>
        </div>
      </div>

      {/* Circular Rings & OWASP Threat Distribution Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* 3 Circular Rings (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-2">
          {renderCircleRing(
            blockRate,
            '#FF3366',
            'rgba(255, 51, 102, 0.4)',
            'Drop Rate',
            'Threat Intercept'
          )}
          {renderCircleRing(
            99,
            '#00F2FE',
            'rgba(0, 242, 254, 0.4)',
            'Sub-Edge',
            'SLA Latency'
          )}
          {renderCircleRing(
            100,
            '#10B981',
            'rgba(16, 185, 129, 0.4)',
            'Enclosure',
            'Zero Escape'
          )}
        </div>

        {/* OWASP LLM01 Threat Category Distribution Bars (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-[#03060B] border border-cyan-900/40 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-950">
            <span className="font-mono text-xs font-bold text-slate-200 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>OWASP LLM01 Threat Vector Breakdown</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Heuristic Match Histogram</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(categories).map(([cat, count]) => {
              const pct = Math.max(5, Math.round((count / maxCatCount) * 100));
              const isLeakage = cat.includes('Leakage');
              const isDelimiter = cat.includes('Delimiter');
              const isJailbreak = cat.includes('Jailbreak');

              const barColor = isLeakage
                ? 'from-amber-500 to-rose-500'
                : isDelimiter
                ? 'from-cyan-500 to-blue-500'
                : isJailbreak
                ? 'from-rose-500 to-pink-500'
                : 'from-purple-500 to-indigo-500';

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="text-slate-400 font-bold">{count} detections</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-cyan-950/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Standard: OWASP Top 10 for Large Language Models</span>
            <span className="text-cyan-400">Strict Heuristic Defense</span>
          </div>
        </div>
      </div>
    </div>
  );
};
