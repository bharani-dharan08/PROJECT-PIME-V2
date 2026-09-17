import React, { useState, useEffect } from 'react';
import { PimeResponse } from '../types.ts';
import { Shield, ShieldAlert, ShieldCheck, Zap, AlertTriangle, Cpu, Terminal, Radio, Play } from 'lucide-react';
import { playCyberSound } from '../utils/cyberAudio.ts';

interface NeuralNetworkGraphProps {
  response: PimeResponse | null;
  isInspecting: boolean;
  onRetrigger?: () => void;
}

interface NodeData {
  id: string;
  label: string;
  code: string;
  x: number;
  y: number;
  stageNum: number;
  description: string;
}

export const NeuralNetworkGraph: React.FC<NeuralNetworkGraphProps> = ({
  response,
  isInspecting,
  onRetrigger,
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState<number>(0);

  // Retrigger packet animation whenever inspection runs or response changes
  useEffect(() => {
    setPulseKey((prev) => prev + 1);
  }, [response, isInspecting]);

  const isBlocked = response?.verdict === 'BLOCKED';
  const isSanitized = response?.verdict === 'SANITIZED';
  const isPassed = response?.verdict === 'PASSED';

  const nodes: NodeData[] = [
    {
      id: 'node-ingress',
      label: 'UNTRUSTED INGRESS',
      code: 'STAGE 01',
      x: 80,
      y: 90,
      stageNum: 1,
      description: 'Captures raw payload packet at API edge prior to memory expansion.',
    },
    {
      id: 'node-intercept',
      label: 'GATEWAY SNIFFER',
      code: 'STAGE 02',
      x: 240,
      y: 90,
      stageNum: 2,
      description: 'Synchronous stream interception; measures byte depth and encoding signature.',
    },
    {
      id: 'node-heuristics',
      label: 'OWASP LLM01 MATRIX',
      code: 'STAGE 03',
      x: 420,
      y: 90,
      stageNum: 3,
      description: 'Evaluates 15 adversarial heuristic vectors (DAN, leaks, system delimiter breakouts).',
    },
    {
      id: 'node-sanitizer',
      label: 'ENTITY NEUTRALIZER',
      code: 'STAGE 04',
      x: 600,
      y: 90,
      stageNum: 4,
      description: 'Replaces raw XML/HTML syntax characters with strict entity representations.',
    },
    {
      id: 'node-enclosure',
      label: 'RIGID BOUNDARY BOX',
      code: 'STAGE 05',
      x: 770,
      y: 90,
      stageNum: 5,
      description: 'Locks sanitized tokens inside immutable <escaped_prompt> container.',
    },
    {
      id: 'node-dispatch',
      label: isBlocked ? 'ZERO-TOKEN DROP' : 'LLM DISPATCH BUS',
      code: isBlocked ? 'SUPPRESSED' : 'DISPATCHED',
      x: 940,
      y: 90,
      stageNum: 6,
      description: isBlocked
        ? 'Threat detected! Payload dropped at gateway. Zero tokens billed or processed by downstream LLM.'
        : 'Sanitized contextual boundary safely forwarded to Gemini LLM inference endpoint.',
    },
  ];

  return (
    <div className="relative rounded-2xl bg-[#07090E]/90 border border-cyan-500/25 p-4 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Background Circuit Grid & Radial Flare */}
      <div className="absolute inset-0 bg-grid-cyber opacity-40 pointer-events-none" />
      <div
        className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
          isBlocked
            ? 'bg-rose-500/15'
            : isSanitized
            ? 'bg-amber-500/10'
            : 'bg-cyan-500/10'
        }`}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2 border-b border-cyan-900/40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono font-bold text-xs sm:text-sm text-slate-100 tracking-wider flex items-center gap-2">
                NEURAL VECTOR NETWORK GRAPH
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-400 border border-cyan-600/40 font-mono">
                  QUANTUM FIREWALL BUS
                </span>
              </h2>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Live inline packet propagation visualizer • Click any node to inspect micro-telemetry
            </p>
          </div>
        </div>

        {/* Live Status Pill & Retrigger */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          {response && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider ${
                isBlocked
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(255,51,102,0.3)]'
                  : isSanitized
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBlocked
                    ? 'bg-rose-500 animate-ping'
                    : isSanitized
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span>{response.verdict} • {response.execution_time_ms}ms</span>
            </div>
          )}

          <button
            onClick={() => {
              playCyberSound('inspect');
              setPulseKey((p) => p + 1);
              if (onRetrigger) onRetrigger();
            }}
            title="Re-run packet traversal animation"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono transition"
          >
            <Play className="w-3 h-3 text-cyan-400" />
            <span>Pulse Packets</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Network Graph Stage */}
      <div className="relative z-10 w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 1020 180"
          className="w-full min-w-[760px] h-40 select-none"
          key={pulseKey}
        >
          <defs>
            {/* Linear Gradients for Packet Traces */}
            <linearGradient id="cyberTraceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor={isBlocked ? '#FF3366' : '#10B981'} stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="blockedTraceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#FF3366" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF3366" stopOpacity="0.2" />
            </linearGradient>

            {/* Glowing filter for nodes */}
            <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-crimson" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Neural Connection Curves / Traces */}
          {nodes.slice(0, -1).map((node, i) => {
            const nextNode = nodes[i + 1];
            const isCutoff = isBlocked && i >= 2; // Trace blocked after heuristics
            return (
              <g key={`trace-${node.id}`}>
                {/* Background Shadow Pathway */}
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={nextNode.x}
                  y2={nextNode.y}
                  stroke={isCutoff ? 'rgba(255, 51, 102, 0.2)' : 'rgba(0, 242, 254, 0.15)'}
                  strokeWidth="3"
                  strokeDasharray={isCutoff ? '4 4' : undefined}
                />

                {/* Animated Glowing Packet Flow */}
                {!isCutoff && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={nextNode.x}
                    y2={nextNode.y}
                    stroke="url(#cyberTraceGradient)"
                    strokeWidth="2.5"
                    strokeDasharray="6 8"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="50"
                      to="0"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </line>
                )}

                {/* Traveling Packet Pulse Particle */}
                {!isCutoff && (
                  <circle r="3.5" fill="#00F2FE" filter="url(#glow-cyan)">
                    <animateMotion
                      path={`M ${node.x} ${node.y} L ${nextNode.x} ${nextNode.y}`}
                      dur="1.2s"
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Special Blocked Cutoff Indicator at Node 3/Matrix */}
          {isBlocked && (
            <g transform="translate(510, 90)">
              <circle r="14" fill="none" stroke="#FF3366" strokeWidth="2" opacity="0.6">
                <animate attributeName="r" from="10" to="26" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <line x1="-8" y1="-8" x2="8" y2="8" stroke="#FF3366" strokeWidth="2.5" />
              <line x1="8" y1="-8" x2="-8" y2="8" stroke="#FF3366" strokeWidth="2.5" />
            </g>
          )}

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const isSelected = activeNode === node.id;
            const isAlertNode = isBlocked && (node.id === 'node-heuristics' || node.id === 'node-dispatch');
            const isPassedNode = !isBlocked && node.id === 'node-dispatch';

            return (
              <g
                key={node.id}
                onClick={() => {
                  playCyberSound('click');
                  setActiveNode(isSelected ? null : node.id);
                }}
                className="cursor-pointer group"
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Radiating Warning Ring on Threat Nodes */}
                {isAlertNode && (
                  <circle
                    r="28"
                    fill="none"
                    stroke="#FF3366"
                    strokeWidth="1.5"
                    className="animate-ring-pulse"
                  />
                )}

                {/* Outer Glow Ring on Passed Node */}
                {isPassedNode && (
                  <circle
                    r="26"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.2"
                    opacity="0.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Node Body Hexagon / Circle */}
                <circle
                  r="20"
                  fill={isAlertNode ? '#1E0B13' : isPassedNode ? '#061D15' : '#0B132B'}
                  stroke={
                    isSelected
                      ? '#FFFFFF'
                      : isAlertNode
                      ? '#FF3366'
                      : isPassedNode
                      ? '#10B981'
                      : '#00F2FE'
                  }
                  strokeWidth={isSelected ? '3' : '2'}
                  filter={isAlertNode ? 'url(#glow-crimson)' : 'url(#glow-cyan)'}
                  className="transition-all duration-300 group-hover:scale-110"
                />

                {/* Inner Core Pulse */}
                <circle
                  r="7"
                  fill={
                    isAlertNode
                      ? '#FF3366'
                      : isPassedNode
                      ? '#10B981'
                      : '#00F2FE'
                  }
                  className={isAlertNode ? 'animate-pulse' : ''}
                />

                {/* Stage Code Badge */}
                <text
                  y="-27"
                  textAnchor="middle"
                  fill={isAlertNode ? '#FF3366' : '#94A3B8'}
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  {node.code}
                </text>

                {/* Node Main Title */}
                <text
                  y="34"
                  textAnchor="middle"
                  fill={isSelected ? '#00F2FE' : '#E2E8F0'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="0.04em"
                  className="group-hover:fill-cyan-300"
                >
                  {node.label}
                </text>

                {/* Sub status badge */}
                <text
                  y="45"
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="7.5"
                  fontFamily="monospace"
                >
                  {node.stageNum === 3 && response?.detected_vectors.length
                    ? `${response.detected_vectors.length} MATCH`
                    : node.stageNum === 4 && response?.stage_details?.stage3_sanitize.tags_escaped
                    ? `${response.stage_details.stage3_sanitize.tags_escaped} ESCAPED`
                    : node.stageNum === 6
                    ? isBlocked
                      ? '0 TOKENS'
                      : 'SAFE'
                    : 'ACTIVE'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Micro-Telemetry Inspection Drawer */}
      {activeNode && (
        <div className="relative z-10 mt-2 p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-bold uppercase">
                {nodes.find((n) => n.id === activeNode)?.label} — NODE TELEMETRY
              </span>
            </div>
            <button
              onClick={() => setActiveNode(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
            >
              Close [ESC]
            </button>
          </div>

          <p className="text-slate-300 font-sans text-xs my-2">
            {nodes.find((n) => n.id === activeNode)?.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">STATUS</span>
              <span className="text-cyan-300 font-bold">ACTIVE & INLINE</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">THREAT SHIELD</span>
              <span className={isBlocked ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {isBlocked ? 'THREAT HALTED' : 'PASS THROUGH'}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">LATENCY PENALTY</span>
              <span className="text-cyan-300 font-bold">~0.15 ms</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ENCLOSURE TAG</span>
              <span className="text-emerald-300 font-bold">&lt;escaped_prompt&gt;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
