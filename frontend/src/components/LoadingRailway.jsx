import React, { useState, useEffect } from 'react';
import { Train, Cpu, ShieldAlert, FileText, Users, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { label: 'Reading sensor telemetry & wear matrices...', icon: Cpu },
  { label: 'Evaluating thermal stress & weather thresholds...', icon: ShieldAlert },
  { label: 'Synthesizing Gemini AI predictive diagnosis...', icon: Train },
  { label: 'Formulating automated work order & dispatching crew...', icon: Users },
];

export default function LoadingRailway() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-sky-500/30">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-gradient from-sky-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Railway Animated Track */}
      <div className="max-w-xl mx-auto my-8 relative">
        {/* Sleeper Cross Ties */}
        <div className="h-6 w-full rail-ties rounded-md opacity-40 mb-1" />

        {/* Rails with high-speed bullet train animation */}
        <div className="relative h-4 w-full bg-slate-900 rounded-full border border-slate-700/80 overflow-hidden shadow-inner flex items-center">
          {/* Steel Rail Line 1 */}
          <div className="absolute top-1 left-0 right-0 h-[2px] bg-slate-600/80" />
          {/* Steel Rail Line 2 */}
          <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-slate-600/80" />

          {/* Glowing Train Bullet Icon Moving Along Track */}
          <div className="absolute flex items-center space-x-1 animate-train-progress">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-railway-blue text-slate-950 shadow-[0_0_20px_#38bdf8]">
              <Train className="w-5 h-5 fill-slate-950" />
            </div>
            {/* Speed trail sparks */}
            <div className="w-16 h-1.5 bg-gradient-to-l from-sky-400 via-sky-500/60 to-transparent rounded-full" />
          </div>
        </div>

        {/* Lower sleeper ties */}
        <div className="h-6 w-full rail-ties rounded-md opacity-40 mt-1" />
      </div>

      {/* Title & Status */}
      <div className="space-y-3">
        <h3 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>Analyzing asset...</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
          </span>
        </h3>
        <p className="text-xs font-mono text-slate-400">
          Running RailGuard automated multi-agent inspection pipeline (REST: /api/automation/run)
        </p>
      </div>

      {/* Stage Progression Checklist */}
      <div className="max-w-md mx-auto mt-8 grid grid-cols-1 gap-2.5 text-left">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStage;
          const isCurrent = idx === activeStage;
          const Icon = stage.icon;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-2.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
                isCurrent 
                  ? 'bg-sky-950/40 border-sky-500/60 text-sky-200 shadow-md shadow-sky-900/20'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : 'bg-transparent border-transparent text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <span className="relative flex h-3 w-3 shrink-0 mx-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="truncate">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
