import React, { useState } from 'react';
import { Copy, Check, Download, FileCode } from 'lucide-react';
import { PimeResponse } from '../types.ts';

interface JsonViewerProps {
  response: PimeResponse | null;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ response }) => {
  const [copied, setCopied] = useState(false);

  if (!response) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center min-h-[300px]">
        <FileCode className="w-8 h-8 text-slate-700 mb-2" />
        <p>Awaiting untrusted payload ingress.</p>
        <p className="text-[11px] text-slate-600 mt-1">
          Standard PIME JSON response matching specification will render here.
        </p>
      </div>
    );
  }

  // Exact required schema payload extraction
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

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pime-verdict-${response.verdict.toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span className="font-mono text-xs font-semibold text-slate-200">
            PIME Standard JSON Response (RFC / OWASP LLM01)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition border border-slate-700 font-mono"
            title="Copy JSON to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition border border-slate-700 font-mono"
            title="Download JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* JSON Code view */}
      <div className="p-4 overflow-auto max-h-[420px] font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed select-text">
        <pre className="whitespace-pre-wrap break-all">
          {jsonString}
        </pre>
      </div>

      {/* Footer summary bar */}
      <div className="bg-slate-900/50 border-t border-slate-800 px-4 py-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Spec: PIME v1.0.0 Inline Middleware</span>
        <span>Threat: <strong className={response.verdict === 'BLOCKED' ? 'text-rose-400' : 'text-emerald-400'}>{response.threat_level}</strong></span>
      </div>
    </div>
  );
};
