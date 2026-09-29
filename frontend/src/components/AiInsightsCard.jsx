import React, { useState } from 'react';
import { 
  Sparkles, 
  Hourglass, 
  AlertCircle, 
  Lightbulb, 
  CheckCheck, 
  Copy, 
  Bot,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function AiInsightsCard({ aiExplanation }) {
  const [copied, setCopied] = useState(false);

  if (!aiExplanation) return null;

  const {
    summary = 'No summary generated.',
    recommendation = 'Conduct routine line inspection.',
    urgency = 'IMMEDIATE',
    inspectionWindow = 'Within 24 hours'
  } = aiExplanation;

  const handleCopy = () => {
    const text = `RailGuard AI Diagnostic\nUrgency: ${urgency}\nWindow: ${inspectionWindow}\nSummary: ${summary}\nRecommendation: ${recommendation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUrgencyBadge = (u) => {
    switch (u?.toUpperCase()) {
      case 'IMMEDIATE':
        return 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.3)]';
      default:
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    }
  };

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-7 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-400 shadow-lg shadow-sky-900/20">
            <Sparkles className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">AI Insights & Advisory</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/80 font-semibold flex items-center gap-1">
                <Bot className="w-3 h-3 text-sky-400" />
                GEMINI POWERED
              </span>
            </div>
            <p className="text-xs text-slate-400">Generative root-cause explanation & safety protocols</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Dispatch</span>
            </>
          )}
        </button>
      </div>

      {/* Urgency & Inspection Window Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
        
        {/* Urgency */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            Maintenance Urgency
          </span>
          <span className={`text-xs font-mono font-black px-3 py-1 rounded-full border ${getUrgencyBadge(urgency)}`}>
            {urgency}
          </span>
        </div>

        {/* Inspection Window */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-400" />
            Inspection Window
          </span>
          <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950/50 px-3 py-1 rounded-full border border-sky-800/60">
            {inspectionWindow}
          </span>
        </div>

      </div>

      {/* Summary Box */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            Diagnostic Analysis Summary
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {summary}
          </p>
        </div>

        {/* Recommendation Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 to-slate-950/60 border border-sky-500/30 space-y-1.5 shadow-inner">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-bold">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Actionable AI Protocol Recommendation
          </h4>
          <p className="text-sm text-sky-100 font-medium leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>

    </div>
  );
}
