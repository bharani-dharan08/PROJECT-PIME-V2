import React, { useState } from 'react';
import { PimeResponse } from '../types.ts';
import { playCyberSound } from '../utils/cyberAudio.ts';
import {
  Layers,
  Copy,
  Check,
  Download,
  Code,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface TransformDissectorProps {
  response: PimeResponse | null;
  rawInput: string;
}

export const TransformDissector: React.FC<TransformDissectorProps> = ({ response, rawInput }) => {
  const [activeTab, setActiveTab] = useState<'split' | 'stage1' | 'stage3' | 'stage4' | 'json'>('split');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySection = (key: string, content: string) => {
    playCyberSound('click');
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!response) {
    return (
      <div className="rounded-2xl bg-[#07090E]/90 border border-cyan-500/20 p-8 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center min-h-[220px]">
        <Layers className="w-8 h-8 text-cyan-600/40 mb-2 animate-pulse" />
        <p className="text-slate-400 font-semibold">TRANSFORM DISSECTOR STANDBY</p>
        <p className="text-[11px] text-slate-600 mt-1">
          Submit prompt in Threat Arena to dissect multi-stage XML entity escaping and rigid boundary containment.
        </p>
      </div>
    );
  }

  const isBlocked = response.verdict === 'BLOCKED';
  const sanitized = response.sanitized_payload || '';
  const enclosed = response.downstream_payload || '';

  // Canonical RFC / OWASP compliant payload
  const canonicalPayload = {
    pime_version: response.pime_version,
    execution_time_ms: response.execution_time_ms,
    verdict: response.verdict,
    threat_level: response.threat_level,
    detected_vectors: response.detected_vectors,
    sanitized_payload: response.sanitized_payload,
    action_log: response.action_log,
    downstream_payload: response.downstream_payload,
  };

  const jsonString = JSON.stringify(canonicalPayload, null, 2);

  // Syntax highlight JSON
  const renderHighlightedJson = (json: string) => {
    return json.split('\n').map((line, idx) => {
      // Key-value regex parsing
      const keyMatch = line.match(/^(\s*"[^"]+"\s*:)(.*)$/);
      if (keyMatch) {
        const keyPart = keyMatch[1];
        const valPart = keyMatch[2];
        return (
          <div key={idx} className="leading-5">
            <span className="text-cyan-400 font-bold">{keyPart}</span>
            <span
              className={
                valPart.includes('"BLOCKED"')
                  ? 'text-rose-400 font-bold'
                  : valPart.includes('"PASSED"')
                  ? 'text-emerald-400 font-bold'
                  : valPart.includes('"SANITIZED"')
                  ? 'text-amber-300 font-bold'
                  : valPart.includes('true') || valPart.includes('false')
                  ? 'text-purple-400'
                  : valPart.match(/\d+/)
                  ? 'text-amber-400'
                  : 'text-emerald-300'
              }
            >
              {valPart}
            </span>
          </div>
        );
      }
      return (
        <div key={idx} className="text-slate-400 leading-5">
          {line}
        </div>
      );
    });
  };

  return (
    <div className="rounded-2xl bg-[#07090E]/95 border border-cyan-500/30 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Top Header & Dissector Tabs */}
      <div className="px-4 py-3 bg-[#080D1A] border-b border-cyan-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Layers className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span>3-WAY MULTI-STAGE TRANSFORM DISSECTOR</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                PIME ENCLOSURE ENGINE
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Inspect literal entity transforms from raw ingress to rigid &lt;escaped_prompt&gt; boundary
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 bg-[#03060B] p-1 rounded-xl border border-cyan-900/60 font-mono text-xs">
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('split');
            }}
            className={`px-3 py-1 rounded-lg transition ${
              activeTab === 'split'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3-Way Split Diff
          </button>
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('stage1');
            }}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'stage1'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stage 1: Raw
          </button>
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('stage3');
            }}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'stage3'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stage 3: Escaped
          </button>
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('stage4');
            }}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'stage4'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stage 4: Enclosure
          </button>
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('json');
            }}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-cyan-400 hover:text-cyan-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>RFC/OWASP JSON</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5">
        {activeTab === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Panel 1: Stage 1 Raw Ingress */}
            <div className="flex flex-col justify-between rounded-xl bg-[#03060B] border border-cyan-900/40 p-4">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-950">
                  <span className="font-mono text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Stage 1: Raw Ingress</span>
                  </span>
                  <button
                    onClick={() => copySection('stage1', rawInput)}
                    className="text-slate-400 hover:text-cyan-300 text-[10px] font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition"
                  >
                    {copiedKey === 'stage1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'stage1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mb-2">
                  Untrusted Ingress Stream • {rawInput.length} bytes
                </div>
                <pre className="font-mono text-[11px] text-slate-200 bg-[#07090E] p-3 rounded-lg border border-cyan-950 max-h-60 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                  {rawInput || '(Empty payload)'}
                </pre>
              </div>

              <div className="mt-3 pt-2 border-t border-cyan-950/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Threat Vectors: {response.detected_vectors.length}</span>
                <span className="text-cyan-400">UTF-8 Encoded</span>
              </div>
            </div>

            {/* Panel 2: Stage 3 Entity Escaped XML/HTML */}
            <div className="flex flex-col justify-between rounded-xl bg-[#03060B] border border-amber-500/30 p-4">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-950/60">
                  <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Stage 3: Entity Escaped</span>
                  </span>
                  {sanitized && (
                    <button
                      onClick={() => copySection('stage3', sanitized)}
                      className="text-slate-400 hover:text-amber-300 text-[10px] font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition"
                    >
                      {copiedKey === 'stage3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'stage3' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="text-[10px] font-mono text-amber-400/80 mb-2">
                  Neutralizes &amp;, &lt;, &gt;, &quot;, &#x27;
                </div>

                {isBlocked ? (
                  <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-900/60 text-center font-mono text-xs text-rose-300">
                    <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
                    <p className="font-bold">PAYLOAD SUPPRESSED</p>
                    <p className="text-[10px] text-rose-400/80 mt-1">
                      Critical injection vector caught. Content isolated from inference engine.
                    </p>
                  </div>
                ) : (
                  <pre className="font-mono text-[11px] text-amber-200 bg-[#07090E] p-3 rounded-lg border border-amber-950 max-h-60 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                    {sanitized.replace(/<\/?escaped_prompt>/g, '') || '(Empty)'}
                  </pre>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-amber-950/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Entities Escaped: {response.stage_details?.stage3_sanitize.tags_escaped || 0}</span>
                <span className="text-amber-400">Sanitized</span>
              </div>
            </div>

            {/* Panel 3: Stage 4 Rigid Boundary Enclosure */}
            <div className="flex flex-col justify-between rounded-xl bg-[#03060B] border border-emerald-500/30 p-4">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-950/60">
                  <span className="font-mono text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Stage 4: Rigid Boundary</span>
                  </span>
                  {enclosed && (
                    <button
                      onClick={() => copySection('stage4', enclosed)}
                      className="text-slate-400 hover:text-emerald-300 text-[10px] font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition"
                    >
                      {copiedKey === 'stage4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'stage4' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="text-[10px] font-mono text-emerald-400/80 mb-2">
                  Enclosure: &lt;escaped_prompt&gt;...&lt;/escaped_prompt&gt;
                </div>

                {isBlocked ? (
                  <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-900/60 text-center font-mono text-xs text-rose-300">
                    <ShieldAlert className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
                    <p className="font-bold">ZERO-TOKEN SUPPRESSION</p>
                    <p className="text-[10px] text-rose-400/80 mt-1">
                      0 tokens forwarded. Downstream model never receives injection payload.
                    </p>
                  </div>
                ) : (
                  <pre className="font-mono text-[11px] text-emerald-300 bg-[#07090E] p-3 rounded-lg border border-emerald-950 max-h-60 overflow-auto whitespace-pre-wrap break-all leading-relaxed font-semibold">
                    {enclosed}
                  </pre>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-950/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Boundary Sealed: true</span>
                <span className="text-emerald-400">Rigid Enclosure</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Stage 1 Raw Expanded */}
        {activeTab === 'stage1' && (
          <div className="p-4 rounded-xl bg-[#03060B] border border-cyan-900/50 font-mono text-xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="font-bold text-cyan-300">STAGE 1: RAW INGRESS PAYLOAD STREAM</span>
              <button
                onClick={() => copySection('stage1', rawInput)}
                className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
              >
                {copiedKey === 'stage1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'stage1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-[#07090E] text-slate-200 whitespace-pre-wrap break-all border border-cyan-950 text-xs leading-relaxed select-all">
              {rawInput}
            </pre>
          </div>
        )}

        {/* Tab 3: Stage 3 Escaped Expanded */}
        {activeTab === 'stage3' && (
          <div className="p-4 rounded-xl bg-[#03060B] border border-amber-900/50 font-mono text-xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="font-bold text-amber-300">STAGE 3: ENTITY ESCAPED XML/HTML TRANSFORMATION</span>
              {sanitized && (
                <button
                  onClick={() => copySection('stage3', sanitized)}
                  className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
                >
                  {copiedKey === 'stage3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'stage3' ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <pre className="p-4 rounded-lg bg-[#07090E] text-amber-200 whitespace-pre-wrap break-all border border-amber-950 text-xs leading-relaxed select-all">
              {isBlocked ? '// PAYLOAD BLOCKED & SUPPRESSED AT GATEWAY' : sanitized}
            </pre>
          </div>
        )}

        {/* Tab 4: Stage 4 Enclosure Expanded */}
        {activeTab === 'stage4' && (
          <div className="p-4 rounded-xl bg-[#03060B] border border-emerald-900/50 font-mono text-xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="font-bold text-emerald-300">STAGE 4: RIGID &lt;escaped_prompt&gt; CONTAINER ENCLOSURE</span>
              {enclosed && (
                <button
                  onClick={() => copySection('stage4', enclosed)}
                  className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
                >
                  {copiedKey === 'stage4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'stage4' ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <pre className="p-4 rounded-lg bg-[#07090E] text-emerald-300 whitespace-pre-wrap break-all border border-emerald-950 text-xs leading-relaxed font-semibold select-all">
              {isBlocked ? '// NULL: ZERO-TOKEN SUPPRESSION PREVENTS LLM DISPATCH' : enclosed}
            </pre>
          </div>
        )}

        {/* Tab 5: Live RFC/OWASP JSON Response Tree */}
        {activeTab === 'json' && (
          <div className="p-4 rounded-xl bg-[#03060B] border border-cyan-900/50 font-mono text-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200">CANONICAL RFC/OWASP LLM01 JSON RESPONSE TREE</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copySection('json', jsonString)}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
                >
                  {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'json' ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([jsonString], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `pime-telemetry-${response.verdict.toLowerCase()}-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#07090E] border border-cyan-950 overflow-x-auto max-h-[420px] leading-relaxed">
              {renderHighlightedJson(jsonString)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
