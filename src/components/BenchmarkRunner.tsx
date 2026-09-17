import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, AlertTriangle, Shield, RefreshCw, Filter } from 'lucide-react';
import { ATTACK_PRESETS } from '../presets.ts';
import { inspectPrompt } from '../pimeEngine.ts';
import { InspectionPreset, PimeResponse } from '../types.ts';

interface BenchmarkRunnerProps {
  onSelectPreset: (preset: InspectionPreset) => void;
}

export const BenchmarkRunner: React.FC<BenchmarkRunnerProps> = ({ onSelectPreset }) => {
  const [results, setResults] = useState<Record<string, PimeResponse>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Leakage', 'Delimiter', 'Jailbreak', 'Indirect', 'Benign'];

  const filteredPresets = filterCategory === 'All'
    ? ATTACK_PRESETS
    : ATTACK_PRESETS.filter(p => p.category === filterCategory);

  const runAllBenchmarks = () => {
    setIsRunning(true);
    const newResults: Record<string, PimeResponse> = {};

    setTimeout(() => {
      ATTACK_PRESETS.forEach(preset => {
        newResults[preset.id] = inspectPrompt(preset.prompt);
      });
      setResults(newResults);
      setIsRunning(false);
    }, 150);
  };

  const completedCount = Object.keys(results).length;
  const passedAssertions = ATTACK_PRESETS.filter(p => {
    const res = results[p.id];
    return res && res.verdict === p.threatExpected;
  }).length;

  return (
    <div className="space-y-6">
      {/* Benchmark summary banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-base text-slate-100">
              Adversarial Ingestion & OWASP LLM01 Suite
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Automated test battery covering System Prompt Leakage, Delimiter Hijacking, Jailbreak Personas, and Indirect Injections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {completedCount > 0 && (
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400">Defense Accuracy: </span>
              <strong className="text-emerald-400 font-bold">
                {Math.round((passedAssertions / ATTACK_PRESETS.length) * 100)}%
              </strong>
              <div className="text-[10px] text-slate-500">
                {passedAssertions}/{ATTACK_PRESETS.length} Passed
              </div>
            </div>
          )}
          <button
            id="run-all-benchmarks-btn"
            onClick={runAllBenchmarks}
            disabled={isRunning}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isRunning ? 'Executing Suite...' : 'Run All Benchmark Tests'}</span>
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-md border transition ${
              filterCategory === cat
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPresets.map(preset => {
          const res = results[preset.id];
          const hasRun = Boolean(res);
          const isAccurate = hasRun && res.verdict === preset.threatExpected;

          return (
            <div
              key={preset.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {preset.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {preset.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-slate-500">Expected:</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        preset.threatExpected === 'BLOCKED'
                          ? 'bg-rose-950 text-rose-300'
                          : preset.threatExpected === 'SANITIZED'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {preset.threatExpected}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded border border-slate-800/80 p-2.5 my-2 font-mono text-xs text-slate-300 line-clamp-3">
                  "{preset.prompt}"
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {preset.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasRun ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      {isAccurate ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PIME: {res.verdict} ({res.execution_time_ms}ms)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>PIME: {res.verdict}</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">Not yet run</span>
                  )}
                </div>

                <button
                  onClick={() => onSelectPreset(preset)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  Load in Firewall &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
