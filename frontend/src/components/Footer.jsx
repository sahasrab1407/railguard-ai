import React from 'react';
import { Train, ShieldCheck, Cpu, GitFork, Radio } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl relative">
      {/* Railway sleeper ties track accent */}
      <div className="w-full h-2 rail-ties opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-slate-500">
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-lg bg-sky-950/80 border border-sky-800/40 flex items-center justify-center text-sky-400">
              <Train className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-300">RAILGUARD AI</span>
              <span className="mx-2">•</span>
              <span>Predictive Railway Maintenance Operations Center</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Safety Certified ML Engine
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              Real-time Sensor Ingestion Active
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
              ISO 55001 Asset Mgmt
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
