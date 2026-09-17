import React, { useState } from 'react';
import { PimeResponse } from '../types.ts';
import { Copy, Check, ArrowRight, Shield, ShieldCheck, Box, Code, AlertTriangle } from 'lucide-react';

interface DiffTransformerProps {
  response: PimeResponse | null;
  rawInput: string;
}

export const DiffTransformer: React.FC<DiffTransformerProps> = ({ response, rawInput }) => {
  const [viewMode, setViewMode] = useState<'split' | 'raw' | 'sanitized' | 'enclosed'>('split');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (section: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 1800);
  };

  if (!response) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center text-slate-500 font-mono text-xs">
        No active interception payload. Submit a prompt to view structural diff.
      </div>
    );
  }

  const isBlocked = response.verdict === 'BLOCKED';
  const sanitized = response.sanitized_payload || '';
  const enclosed = response.downstream_payload || '';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Header & View Mode Switcher */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            Multi-Stage Payload Transformation Diff
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded transition ${
              viewMode === 'split'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3-Way Split Diff
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 rounded transition ${
              viewMode === 'raw'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Raw Ingress
          </button>
          <button
            onClick={() => setViewMode('sanitized')}
            className={`px-2.5 py-1 rounded transition ${
              viewMode === 'sanitized'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Sanitized
          </button>
          <button
            onClick={() => setViewMode('enclosed')}
            className={`px-2.5 py-1 rounded transition ${
              viewMode === 'enclosed'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Enclosure
          </button>
        </div>
      </div>

      {/* Main Diff Content */}
      <div className="p-4">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Panel 1: Untrusted Ingress */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-mono text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Stage 1: Raw Ingress
                  </span>
                  <button
                    onClick={() => copyText('raw', rawInput)}
                    className="text-slate-400 hover:text-white text-[10px] flex items-center gap-1 font-mono"
                  >
                    {copiedSection === 'raw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'raw' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80 whitespace-pre-wrap break-all max-h-56 overflow-auto">
                  {rawInput || '(Empty payload)'}
                </pre>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-2">
                Untrusted User Origin • {rawInput.length} chars
              </div>
            </div>

            {/* Panel 2: Entity Sanitization */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-mono text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Stage 3: Entity Escaped
                  </span>
                  {sanitized && (
                    <button
                      onClick={() => copyText('sanitized', sanitized)}
                      className="text-slate-400 hover:text-white text-[10px] flex items-center gap-1 font-mono"
                    >
                      {copiedSection === 'sanitized' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'sanitized' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {isBlocked ? (
                  <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded text-rose-300 text-xs font-mono text-center">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                    Suppressed: Ingress marked for immediate drop.
                  </div>
                ) : (
                  <pre className="font-mono text-[11px] text-amber-200 bg-slate-950 p-2.5 rounded border border-slate-800/80 whitespace-pre-wrap break-all max-h-56 overflow-auto">
                    {sanitized.replace(/<\/?escaped_prompt>/g, '') || '(Empty)'}
                  </pre>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-2">
                Escaped &lt;, &gt;, &amp;, &quot;, &#x27;
              </div>
            </div>

            {/* Panel 3: Structural XML Enclosure */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-mono text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Stage 4: Structural Enclosure
                  </span>
                  {enclosed && (
                    <button
                      onClick={() => copyText('enclosed', enclosed)}
                      className="text-slate-400 hover:text-white text-[10px] flex items-center gap-1 font-mono"
                    >
                      {copiedSection === 'enclosed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'enclosed' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {isBlocked ? (
                  <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded text-rose-300 text-xs font-mono text-center">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                    Suppressed: 0 Tokens Forwarded
                  </div>
                ) : (
                  <pre className="font-mono text-[11px] text-emerald-300 bg-slate-950 p-2.5 rounded border border-slate-800/80 whitespace-pre-wrap break-all max-h-56 overflow-auto font-semibold">
                    {enclosed}
                  </pre>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-2">
                Rigid Context Enclosure Container
              </div>
            </div>
          </div>
        ) : (
          /* Single Panel Expanded View */
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs">
            {viewMode === 'raw' && (
              <div>
                <span className="text-slate-500 text-[11px] block mb-2 font-bold">RAW UNTRUSTED INGRESS:</span>
                <pre className="text-slate-200 whitespace-pre-wrap break-all select-all">{rawInput}</pre>
              </div>
            )}
            {viewMode === 'sanitized' && (
              <div>
                <span className="text-amber-400 text-[11px] block mb-2 font-bold">STAGE 3 SANITIZED (XML/HTML ESCAPED):</span>
                <pre className="text-amber-200 whitespace-pre-wrap break-all select-all">
                  {isBlocked ? 'Suppressed (Threat Detected)' : sanitized}
                </pre>
              </div>
            )}
            {viewMode === 'enclosed' && (
              <div>
                <span className="text-emerald-400 text-[11px] block mb-2 font-bold">STAGE 4 &lt;escaped_prompt&gt; RIGID STRUCTURAL CONTAINER:</span>
                <pre className="text-emerald-200 whitespace-pre-wrap break-all select-all font-bold">
                  {isBlocked ? 'null (Zero Tokens Sent to LLM)' : enclosed}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
