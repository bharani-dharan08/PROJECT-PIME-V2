import React from 'react';
import {
  Shield,
  ShieldAlert,
  Zap,
  Terminal,
  BookOpen,
  Activity,
  Bug,
  Radio,
  Tv,
  Volume2,
  VolumeX,
  Download,
  Flame,
} from 'lucide-react';
import { playCyberSound } from '../utils/cyberAudio.ts';

export type AppTab = 'inspector' | 'redteam' | 'benchmark' | 'soc' | 'rules' | 'api';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  stats: {
    total: number;
    blocked: number;
    sanitized: number;
    passed: number;
  };
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onExportAuditBundle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  stats,
  scanlinesEnabled,
  onToggleScanlines,
  audioEnabled,
  onToggleAudio,
  onExportAuditBundle,
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-[#07090E]/95 backdrop-blur-xl text-slate-100 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & System Tag */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.35)] border border-cyan-400/50">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black tracking-wider text-lg text-white">
                  PIME
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold uppercase tracking-wider">
                  QUANTUM FIREWALL
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  OWASP LLM01 SHIELD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
                Prompt Injection Mitigation Engine • Inline AI Interception
              </p>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#03060B] p-1 rounded-xl border border-cyan-900/50 text-xs font-mono">
            <button
              id="tab-inspector-btn"
              onClick={() => {
                playCyberSound('click');
                onTabChange('inspector');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'inspector'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>Threat Arena</span>
            </button>

            <button
              id="tab-redteam-btn"
              onClick={() => {
                playCyberSound('click');
                onTabChange('redteam');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'redteam'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(255,51,102,0.35)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Bug className="w-3.5 h-3.5 text-rose-300" />
              <span>Red Team</span>
            </button>

            <button
              id="tab-benchmark-btn"
              onClick={() => {
                playCyberSound('click');
                onTabChange('benchmark');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'benchmark'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Attack Suite</span>
            </button>

            <button
              id="tab-soc-btn"
              onClick={() => {
                playCyberSound('click');
                onTabChange('soc');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'soc'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-300" />
              <span>SOC Analytics</span>
            </button>

            <button
              id="tab-rules-btn"
              onClick={() => {
                playCyberSound('click');
                onTabChange('rules');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span>Heuristic Matrix</span>
            </button>

            <button
              id="tab-api-btn"
              onClick={() => {
                playCyberSound('click');
                onTabChange('api');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'api'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-300" />
              <span>API Gateway</span>
            </button>
          </nav>

          {/* Immersive Action Controls (Scanlines, Audio FX, Export Bundle) */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {/* Scanline Toggle */}
            <button
              id="toggle-scanlines-btn"
              onClick={() => {
                playCyberSound('click');
                onToggleScanlines();
              }}
              title="Toggle retro CRT scanlines"
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                scanlinesEnabled
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/70 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                  : 'bg-[#03060B] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Scanlines</span>
            </button>

            {/* Audio Pulse FX Toggle */}
            <button
              id="toggle-audio-btn"
              onClick={() => {
                onToggleAudio();
              }}
              title="Toggle synthetic cyber audio feedback"
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                audioEnabled
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/70 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                  : 'bg-[#03060B] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px]">Audio FX</span>
            </button>

            {/* Export Secure Audit Bundle */}
            <button
              id="export-audit-bundle-btn"
              onClick={() => {
                playCyberSound('click');
                onExportAuditBundle();
              }}
              title="Export complete cryptographic security audit bundle (.json & .md)"
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold border border-cyan-400/40 transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,242,254,0.25)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px]">Export Audit</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-cyan-950/80 text-xs font-mono gap-2 scrollbar-none">
          <button
            onClick={() => onTabChange('inspector')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'inspector' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Threat Arena
          </button>
          <button
            onClick={() => onTabChange('redteam')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'redteam' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Red Team
          </button>
          <button
            onClick={() => onTabChange('benchmark')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'benchmark' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Attacks
          </button>
          <button
            onClick={() => onTabChange('soc')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'soc' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            SOC Ops
          </button>
          <button
            onClick={() => onTabChange('rules')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'rules' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Matrix
          </button>
          <button
            onClick={() => onTabChange('api')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'api' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            API
          </button>
        </div>
      </div>
    </header>
  );
};
