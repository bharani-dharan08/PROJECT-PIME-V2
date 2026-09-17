import React from 'react';
import { Cpu, ShieldCheck, ShieldAlert, CheckCircle, Zap } from 'lucide-react';
import { PimeResponse } from '../types.ts';

interface DownstreamPanelProps {
  response: PimeResponse | null;
  executeDownstream: boolean;
  onToggleExecuteDownstream: (val: boolean) => void;
}

export const DownstreamPanel: React.FC<DownstreamPanelProps> = ({
  response,
  executeDownstream,
  onToggleExecuteDownstream,
}) => {
  if (!response) {
    return null;
  }

  const isBlocked = response.verdict === 'BLOCKED';
  const downstreamResult = response.downstream_result;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h4 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            Downstream LLM Target Pipeline (Gemini)
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={executeDownstream}
              onChange={(e) => onToggleExecuteDownstream(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
            />
            <span>Dispatch to LLM on Safe Verdict</span>
          </label>
        </div>
      </div>

      {isBlocked ? (
        /* BLOCKED STATE: ZERO TOKENS FORWARDED */
        <div className="bg-rose-950/20 border border-rose-900/60 rounded-lg p-4 font-mono">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-rose-900/80 border border-rose-700 flex items-center justify-center text-rose-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-rose-300">ZERO TOKENS FORWARDED</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 uppercase">
                  COMPUTE SAVED
                </span>
              </div>
              <p className="text-xs text-rose-200/70 font-sans mt-0.5">
                Downstream model context was shielded completely. No tokens or context windows were consumed.
              </p>
            </div>
          </div>

          <div className="mt-3 bg-slate-950/80 rounded border border-rose-900/40 p-3 text-xs text-slate-400">
            <div className="flex justify-between items-center text-[11px] text-slate-500 mb-1">
              <span>TARGET INGRESS STATUS:</span>
              <span className="text-rose-400 font-bold">TERMINATED AT EDGE</span>
            </div>
            <p className="text-slate-300">
              Downstream Payload: <code className="text-rose-400">null</code>
            </p>
            <p className="text-slate-400 text-[11px] mt-1 font-sans">
              Action Log: {response.action_log}
            </p>
          </div>
        </div>
      ) : (
        /* SAFE / SANITIZED STATE: STRUCTURAL ENCLOSURE FORWARDED */
        <div className="space-y-3">
          <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-lg p-4 font-mono">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">
                  RIGID CONTEXT BOUNDARY FORWARDED
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                BOUNDARY: &lt;escaped_prompt&gt;
              </span>
            </div>

            <div className="bg-slate-950 rounded border border-slate-800 p-3 text-xs text-slate-300 overflow-x-auto">
              <span className="text-slate-500 text-[10px] block mb-1">PAYLOAD DISPATCHED TO LLM:</span>
              <pre className="text-emerald-300 font-mono whitespace-pre-wrap select-all">
                {response.downstream_payload}
              </pre>
            </div>
          </div>

          {/* Model Response if executed */}
          {downstreamResult && (
            <div className="bg-slate-900/80 border border-cyan-900/40 rounded-lg p-4 font-mono text-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300 font-bold">
                    Downstream Response ({downstreamResult.model})
                  </span>
                </div>
                {downstreamResult.execution_time_ms && (
                  <span className="text-[10px] text-slate-400">
                    Latency: {downstreamResult.execution_time_ms} ms
                  </span>
                )}
              </div>
              <div className="bg-slate-950 rounded border border-slate-800 p-3 text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                {downstreamResult.response_text}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
