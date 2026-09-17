import React, { useState } from 'react';
import { DetectedVector } from '../types.ts';
import { AlertOctagon, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface VectorHighlighterProps {
  text: string;
  vectors: DetectedVector[];
  verdict: string;
}

export const VectorHighlighter: React.FC<VectorHighlighterProps> = ({ text, vectors, verdict }) => {
  const [activeVector, setActiveVector] = useState<DetectedVector | null>(null);

  if (!text) {
    return (
      <div className="p-4 text-xs font-mono text-slate-500 italic bg-slate-950/60 rounded-lg border border-slate-800/80">
        Enter or select a prompt to inspect token segments.
      </div>
    );
  }

  // If no vectors found, display clean text
  if (vectors.length === 0) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/90 font-mono text-xs text-slate-200 whitespace-pre-wrap break-all leading-relaxed">
          {text}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>No malicious injection tokens flagged in payload stream.</span>
        </div>
      </div>
    );
  }

  // Segment the text into highlighted slices based on vector match positions
  const renderHighlightedText = () => {
    // Collect all match spans
    interface Span {
      start: number;
      end: number;
      vector: DetectedVector;
    }

    const spans: Span[] = [];

    vectors.forEach((vec) => {
      let idx = text.indexOf(vec.matched_text);
      if (idx !== -1) {
        spans.push({
          start: idx,
          end: idx + vec.matched_text.length,
          vector: vec,
        });
      } else if (vec.index !== undefined && vec.index >= 0 && vec.index < text.length) {
        spans.push({
          start: vec.index,
          end: Math.min(text.length, vec.index + (vec.matched_text?.length || 10)),
          vector: vec,
        });
      }
    });

    if (spans.length === 0) {
      return <span>{text}</span>;
    }

    // Sort spans by start
    spans.sort((a, b) => a.start - b.start);

    const elements: React.ReactNode[] = [];
    let currentPos = 0;

    spans.forEach((span, i) => {
      if (span.start > currentPos) {
        elements.push(
          <span key={`text-${currentPos}`} className="text-slate-300">
            {text.substring(currentPos, span.start)}
          </span>
        );
      }

      const matchSegment = text.substring(
        Math.max(currentPos, span.start),
        Math.min(text.length, span.end)
      );

      const isSelected = activeVector?.id === span.vector.id;

      elements.push(
        <mark
          key={`highlight-${i}`}
          onClick={() => setActiveVector(span.vector)}
          title={`Click to inspect trigger: ${span.vector.rule_name} (${span.vector.id})`}
          className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-mono font-semibold ${
            span.vector.severity === 'CRITICAL'
              ? isSelected
                ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                : 'bg-rose-950 text-rose-200 border border-rose-600/80 hover:bg-rose-900'
              : isSelected
              ? 'bg-amber-500 text-black ring-2 ring-amber-300'
              : 'bg-amber-950 text-amber-200 border border-amber-600/80 hover:bg-amber-900'
          }`}
        >
          {matchSegment}
        </mark>
      );

      currentPos = Math.max(currentPos, span.end);
    });

    if (currentPos < text.length) {
      elements.push(
        <span key={`text-tail`} className="text-slate-300">
          {text.substring(currentPos)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-3">
      {/* Annotated Ingress View */}
      <div className="p-3 bg-slate-950 rounded-lg border border-rose-900/40 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed select-text">
        {renderHighlightedText()}
      </div>

      {/* Vector quick selection row */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className="text-slate-500 flex items-center gap-1">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Detected Triggers:
        </span>
        {vectors.map((vec, i) => (
          <button
            key={`${vec.id}-${i}`}
            onClick={() => setActiveVector(activeVector?.id === vec.id ? null : vec)}
            className={`px-2 py-0.5 rounded border transition flex items-center gap-1.5 ${
              activeVector?.id === vec.id
                ? 'bg-rose-900 text-rose-100 border-rose-500 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                vec.severity === 'CRITICAL' ? 'bg-rose-400' : 'bg-amber-400'
              }`}
            />
            <span>{vec.id}: {vec.rule_name}</span>
          </button>
        ))}
      </div>

      {/* Vector Drill-down Popup */}
      {activeVector && (
        <div className="p-3 bg-slate-900/95 border border-rose-800/80 rounded-lg text-xs font-mono space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-300">{activeVector.rule_name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 uppercase font-bold">
              {activeVector.severity} • {activeVector.owasp_ref}
            </span>
          </div>
          <p className="text-slate-300 font-sans text-xs">{activeVector.description}</p>
          <div className="text-slate-400 text-[11px] pt-1">
            Trigger Substring: <code className="text-rose-300 bg-slate-950 px-1.5 py-0.5 rounded">"{activeVector.matched_text}"</code>
          </div>
        </div>
      )}
    </div>
  );
};
