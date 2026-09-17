import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, Shield, FileSearch, ShieldCheck, Box, Send, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { PimeResponse } from '../types.ts';

interface PipelineStepperProps {
  response: PimeResponse | null;
  isInspecting: boolean;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({ response, isInspecting }) => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const stageDetails = response?.stage_details;
  const isBlocked = response?.verdict === 'BLOCKED';
  const isSanitized = response?.verdict === 'SANITIZED';
  const isPassed = response?.verdict === 'PASSED';

  const stages = [
    {
      num: 1,
      title: 'INTERCEPT',
      subtitle: 'Capture untrusted ingress',
      icon: Shield,
      status: response ? 'complete' : isInspecting ? 'active' : 'idle',
      badge: response ? `${stageDetails?.stage1_intercept.raw_length ?? 0} chars` : null,
      description: 'Intercepts raw input string prior to context injection.',
      telemetry: stageDetails ? {
        'Raw Length': `${stageDetails.stage1_intercept.raw_length} characters`,
        'Encoding': stageDetails.stage1_intercept.char_encoding,
        'Ingress Status': 'Captured at API Gateway Layer'
      } : null,
    },
    {
      num: 2,
      title: 'INSPECT',
      subtitle: 'Heuristic & signature scan',
      icon: FileSearch,
      status: response
        ? isBlocked
          ? 'danger'
          : 'complete'
        : isInspecting
        ? 'active'
        : 'idle',
      badge: response
        ? isBlocked
          ? `${response.detected_vectors.length} threats flagged`
          : 'Clean signatures'
        : null,
      description: 'Scans for OWASP LLM01 jailbreaks, delimiters & leaks.',
      telemetry: stageDetails ? {
        'Rules Scanned': `${stageDetails.stage2_inspect.scanned_rules_count} Heuristic Rules`,
        'Triggers Fired': `${stageDetails.stage2_inspect.heuristics_triggered} Patterns Matched`,
        'Matched Categories': stageDetails.stage2_inspect.matched_categories.join(', ') || 'None',
      } : null,
    },
    {
      num: 3,
      title: 'SANITIZE',
      subtitle: 'Escape XML/HTML entities',
      icon: ShieldCheck,
      status: response
        ? isBlocked
          ? 'suppressed'
          : isSanitized
          ? 'warning'
          : 'complete'
        : isInspecting
        ? 'active'
        : 'idle',
      badge: response
        ? isBlocked
          ? 'Aborted'
          : `${stageDetails?.stage3_sanitize.tags_escaped ?? 0} escaped`
        : null,
      description: 'Replaces <, >, &, ", \' with entity codes.',
      telemetry: stageDetails ? {
        'Tags Replaced': `${stageDetails.stage3_sanitize.tags_escaped} characters`,
        'Entity Conversions': JSON.stringify(stageDetails.stage3_sanitize.entities_converted),
        'Sanitized Preview': stageDetails.stage3_sanitize.sanitized_preview || 'None',
      } : null,
    },
    {
      num: 4,
      title: 'STRUCTURAL ENCLOSURE',
      subtitle: 'Rigid boundary encapsulation',
      icon: Box,
      status: response
        ? isBlocked
          ? 'suppressed'
          : 'complete'
        : isInspecting
        ? 'active'
        : 'idle',
      badge: response
        ? isBlocked
          ? 'Suppressed'
          : '<escaped_prompt>'
        : null,
      description: 'Wraps payload in strict structural boundary tags.',
      telemetry: stageDetails ? {
        'Boundary Tag': stageDetails.stage4_enclosure.boundary_tag,
        'Enclosure State': stageDetails.stage4_enclosure.enclosure_status,
        'Target Scope': 'Direct LLM context injection wrapper',
      } : null,
    },
    {
      num: 5,
      title: 'DECISION',
      subtitle: 'Forward or drop zero tokens',
      icon: Send,
      status: response
        ? isBlocked
          ? 'danger'
          : isSanitized
          ? 'warning'
          : 'complete'
        : isInspecting
        ? 'active'
        : 'idle',
      badge: response
        ? isBlocked
          ? '0 TOKENS (BLOCKED)'
          : isSanitized
          ? 'FORWARDED (SANITIZED)'
          : 'FORWARDED (PASSED)'
        : null,
      description: isBlocked
        ? 'Drop ingress! Zero tokens forwarded to downstream model.'
        : 'Safe to forward wrapped boundary payload to target LLM.',
      telemetry: stageDetails ? {
        'Forwarded Downstream': stageDetails.stage5_decision.downstream_forwarded ? 'TRUE (Safe)' : 'FALSE (Suppressed)',
        'Tokens Allowed': `${stageDetails.stage5_decision.tokens_allowed} tokens to LLM`,
        'Block Reason': stageDetails.stage5_decision.block_reason || 'N/A (Clean or Neutralized)',
      } : null,
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-xs font-mono text-slate-200 uppercase tracking-wider">
            Core Inline Pipeline (5 Stages)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
            Click Stage for Telemetry
          </span>
        </div>
        {response && (
          <div className="text-xs font-mono flex items-center gap-3">
            <span className="text-slate-400">
              Pipeline Latency: <strong className="text-cyan-400">{response.execution_time_ms} ms</strong>
            </span>
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase text-[11px] ${
                isBlocked
                  ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                  : isSanitized
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
              }`}
            >
              {response.verdict}
            </span>
          </div>
        )}
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stage) => {
          const Icon = stage.icon;
          let borderClass = 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700';
          let iconBg = 'bg-slate-800 text-slate-400';
          let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

          if (stage.status === 'complete') {
            borderClass = 'border-emerald-800/50 bg-emerald-950/20 text-slate-200 hover:border-emerald-700';
            iconBg = 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50';
            badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-800/50';
          } else if (stage.status === 'warning') {
            borderClass = 'border-amber-800/50 bg-amber-950/20 text-slate-200 hover:border-amber-700';
            iconBg = 'bg-amber-900/60 text-amber-400 border border-amber-700/50';
            badgeColor = 'bg-amber-950 text-amber-300 border-amber-800/50';
          } else if (stage.status === 'danger') {
            borderClass = 'border-rose-800/60 bg-rose-950/30 text-rose-200 ring-1 ring-rose-500/30 hover:border-rose-600';
            iconBg = 'bg-rose-900/80 text-rose-300 border border-rose-600';
            badgeColor = 'bg-rose-950 text-rose-300 border-rose-800';
          } else if (stage.status === 'suppressed') {
            borderClass = 'border-slate-800/40 bg-slate-950/40 text-slate-600 opacity-60';
            iconBg = 'bg-slate-900 text-slate-600';
            badgeColor = 'bg-slate-900 text-slate-600 border-slate-800';
          } else if (stage.status === 'active') {
            borderClass = 'border-cyan-500/80 bg-cyan-950/30 text-cyan-200 animate-pulse';
            iconBg = 'bg-cyan-600 text-white';
          }

          const isSelected = selectedStage === stage.num;

          return (
            <button
              key={stage.num}
              type="button"
              onClick={() => setSelectedStage(isSelected ? null : stage.num)}
              className={`relative rounded-xl border p-3.5 flex flex-col justify-between text-left transition-all cursor-pointer ${borderClass} ${
                isSelected ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-lg' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500">STAGE {stage.num}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="font-mono font-bold text-xs tracking-wide text-slate-100">
                  {stage.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {stage.subtitle}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between w-full">
                {stage.badge ? (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeColor}`}>
                    {stage.badge}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 italic">Standby</span>
                )}
                {stage.status === 'complete' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {stage.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {stage.status === 'danger' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expandable Stage Telemetry Drawer */}
      {selectedStage !== null && response && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-800/60 shadow-inner font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">
                STAGE {selectedStage} TELEMETRY: {stages[selectedStage - 1].title}
              </span>
              <span className="text-[10px] text-slate-400">
                ({stages[selectedStage - 1].subtitle})
              </span>
            </div>
            <button
              onClick={() => setSelectedStage(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Close ✕
            </button>
          </div>

          <p className="text-slate-300 font-sans text-xs mb-3">
            {stages[selectedStage - 1].description}
          </p>

          {stages[selectedStage - 1].telemetry && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(stages[selectedStage - 1].telemetry!).map(([key, val]) => (
                <div key={key} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">{key}</div>
                  <div className="text-slate-200 font-semibold mt-0.5 break-all">{val}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

