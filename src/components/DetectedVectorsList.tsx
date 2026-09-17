import React from 'react';
import { ShieldAlert, AlertOctagon, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { DetectedVector, ThreatLevel } from '../types.ts';

interface DetectedVectorsListProps {
  vectors: DetectedVector[];
  verdict: string;
}

export const DetectedVectorsList: React.FC<DetectedVectorsListProps> = ({ vectors, verdict }) => {
  const getSeverityBadge = (severity: ThreatLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800/80';
      case 'HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-800/80';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-800/80';
      case 'LOW':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (vectors.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-200">Zero Adversarial Vectors Flagged</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Passed comprehensive heuristic scans for system leakage, delimiter tampering, jailbreaks, and indirect injection vectors.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-4 sm:p-5 shadow-lg shadow-rose-950/10">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <h4 className="font-mono text-xs font-bold text-rose-300 uppercase tracking-wider">
            Adversarial Threat Interceptions ({vectors.length})
          </h4>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
          OWASP LLM01 TRIGGERED
        </span>
      </div>

      <div className="space-y-3">
        {vectors.map((vector, idx) => (
          <div
            key={`${vector.id}-${idx}`}
            className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 sm:p-4 text-xs font-mono"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-300 text-sm">{vector.rule_name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {vector.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${getSeverityBadge(vector.severity)}`}>
                  {vector.severity}
                </span>
                <span className="text-[10px] text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900">
                  {vector.category}
                </span>
              </div>
            </div>

            {/* Matched excerpt */}
            <div className="mt-2 bg-slate-900/90 border border-slate-800 rounded p-2.5">
              <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1.5 font-sans">
                <Terminal className="w-3 h-3 text-rose-400" />
                <span>Trigger Signature Match:</span>
              </div>
              <div className="text-rose-200 font-mono bg-rose-950/40 p-1.5 rounded border border-rose-900/60 break-all select-all">
                "{vector.matched_text}"
              </div>
            </div>

            <div className="mt-2 text-slate-400 text-[11px] font-sans leading-relaxed">
              {vector.description}
            </div>

            <div className="mt-2 pt-2 border-t border-rose-900/30 flex items-center justify-between text-[10px] text-slate-500 font-sans">
              <span>Compliance: <strong className="text-slate-400">{vector.owasp_ref}</strong></span>
              <span className="text-rose-400 font-mono">Status: DROP INGRESS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
