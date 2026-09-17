import React from 'react';
import { Activity, ShieldAlert, ShieldCheck, Clock, Trash2 } from 'lucide-react';
import { PimeResponse } from '../types.ts';

interface AuditLogProps {
  history: PimeResponse[];
  onClearHistory: () => void;
  onSelectLog: (item: PimeResponse) => void;
}

export const AuditLog: React.FC<AuditLogProps> = ({ history, onClearHistory, onSelectLog }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-base text-slate-100">
              Firewall Ingress Audit Trail ({history.length} Events)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time chronological log of all intercepted prompts, matched vectors, and security decisions.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950 px-3 py-1.5 rounded-lg border border-rose-900/60 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-12 text-center text-slate-500 font-mono text-xs">
          Zero transactions recorded. Inspect prompts in the Live Firewall to generate audit logs.
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((entry, idx) => {
            const isBlocked = entry.verdict === 'BLOCKED';
            const isSanitized = entry.verdict === 'SANITIZED';

            return (
              <div
                key={idx}
                onClick={() => onSelectLog(entry)}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isBlocked
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : isSanitized
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {isBlocked ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold uppercase px-1.5 py-0.5 rounded text-[10px] ${
                          isBlocked
                            ? 'bg-rose-950 text-rose-300'
                            : isSanitized
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {entry.verdict}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Threat: <strong className={isBlocked ? 'text-rose-400' : 'text-slate-300'}>{entry.threat_level}</strong>
                      </span>
                      <span className="text-slate-500 text-[11px] hidden sm:inline">
                        • {entry.execution_time_ms} ms
                      </span>
                    </div>
                    <div className="text-slate-300 text-xs truncate mt-1">
                      {entry.action_log}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 shrink-0 text-right">
                  {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : 'Just now'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
