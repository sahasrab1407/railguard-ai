import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CloudSun, 
  CheckCircle, 
  Layers, 
  Gauge, 
  AlertOctagon,
  Flame
} from 'lucide-react';

export default function RiskAssessmentCard({ riskAssessment }) {
  if (!riskAssessment) return null;

  const { assetId, riskScore = 0, riskLevel = 'LOW', weatherRisk = 'LOW', factors = [] } = riskAssessment;

  // Exact color coding requested:
  // CRITICAL = Red, HIGH = Orange, MEDIUM = Yellow, LOW = Green
  const getTheme = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return {
          textColor: 'text-red-400',
          bgColor: 'bg-red-950/40',
          borderColor: 'border-red-500/50',
          badgeBg: 'bg-red-500 text-white',
          glow: 'glow-red',
          strokeColor: '#ef4444',
          label: 'CRITICAL HAZARD',
          signalLight: 'bg-red-500 animate-pulse-fast'
        };
      case 'HIGH':
        return {
          textColor: 'text-orange-400',
          bgColor: 'bg-orange-950/40',
          borderColor: 'border-orange-500/50',
          badgeBg: 'bg-orange-500 text-white',
          glow: 'glow-orange',
          strokeColor: '#f97316',
          label: 'HIGH RISK',
          signalLight: 'bg-orange-500 animate-pulse'
        };
      case 'MEDIUM':
        return {
          textColor: 'text-yellow-400',
          bgColor: 'bg-yellow-950/40',
          borderColor: 'border-yellow-500/50',
          badgeBg: 'bg-yellow-500 text-slate-950',
          glow: 'glow-orange',
          strokeColor: '#eab308',
          label: 'MEDIUM RISK',
          signalLight: 'bg-yellow-400'
        };
      case 'LOW':
      default:
        return {
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-950/40',
          borderColor: 'border-emerald-500/50',
          badgeBg: 'bg-emerald-500 text-white',
          glow: 'glow-green',
          strokeColor: '#10b981',
          label: 'NOMINAL STABILITY',
          signalLight: 'bg-emerald-400'
        };
    }
  };

  const theme = getTheme(riskLevel);

  // Circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, riskScore)) / 100) * circumference;

  return (
    <div className={`w-full glass-panel-glow rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all ${theme.glow}`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl border ${theme.borderColor} ${theme.bgColor}`}>
            <Gauge className={`w-5 h-5 ${theme.textColor}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Risk Assessment</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {assetId || 'ASSET'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-parameter rail stress scoring</p>
          </div>
        </div>

        {/* Railway Signal Lantern Light */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
          <span className={`w-3 h-3 rounded-full ${theme.signalLight} shadow-[0_0_10px_currentColor]`} />
          <span className={`text-xs font-black font-mono tracking-wider ${theme.textColor}`}>
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Main Metric Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 items-center">
        
        {/* Radial Risk Meter */}
        <div className="flex items-center space-x-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={theme.strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-black font-mono leading-none ${theme.textColor}`}>
                {riskScore}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">/ 100</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Composite Risk Index
            </span>
            <h4 className={`text-xl font-black tracking-tight ${theme.textColor}`}>
              {theme.label}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {riskScore >= 80 ? 'Exceeds standard derailment safety margin.' :
               riskScore >= 60 ? 'Accelerated degradation observed on track section.' :
               'Within acceptable continuous operations window.'}
            </p>
          </div>
        </div>

        {/* Weather Risk Card */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-amber-400" />
              Weather Risk Impact
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              weatherRisk === 'HIGH' ? 'bg-red-950/60 text-red-300 border-red-500/40' :
              weatherRisk === 'MEDIUM' ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' :
              'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
            }`}>
              {weatherRisk} WEATHER RISK
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-start space-x-2">
            <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p>
              {weatherRisk === 'HIGH'
                ? 'High track temperatures cause rail steel expansion and elevate buckling probability during heavy freight axle passes.'
                : weatherRisk === 'MEDIUM'
                ? 'Elevated heat index requires increased ballast joint clearance monitoring.'
                : 'Ambient atmospheric conditions are within optimal engineering boundaries.'}
            </p>
          </div>
        </div>

      </div>

      {/* Factors Breakdown */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          Contributing Diagnostic Factors ({factors.length})
        </h4>

        {factors.length === 0 ? (
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-400 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No abnormal stress anomalies detected across physical sensor feeds.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {factors.map((factor, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 text-xs text-slate-200"
              >
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-sans">{factor}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
