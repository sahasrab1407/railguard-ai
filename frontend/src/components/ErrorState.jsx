import React from 'react';
import { AlertTriangle, RotateCcw, Sparkles, ServerCrash, Terminal } from 'lucide-react';

export default function ErrorState({ error, onRetry, onUseDemo }) {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/40 relative overflow-hidden bg-red-950/20 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        
        <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0">
          <ServerCrash className="w-7 h-7" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Pipeline Execution Error
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700">
              API ERROR
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {error || 'An unexpected error occurred while communicating with the RailGuard AI pipeline.'}
          </p>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              Quick Troubleshooting:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
              <li>Ensure Express backend is running on <code className="text-sky-300">http://localhost:3000</code> (<code className="text-sky-300">npm run dev</code>)</li>
              <li>Verify Google Gemini and Supabase API credentials in <code className="text-sky-300">.env</code></li>
              <li>Or click "Run Demo Simulation" below to evaluate the complete dashboard interface immediately</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onRetry}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Pipeline</span>
            </button>

            {onUseDemo && (
              <button
                onClick={onUseDemo}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-sky-500/30 font-mono text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Load Live Simulation Demo</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
