import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Activity, 
  Radio, 
  ShieldCheck, 
  Wifi, 
  Clock, 
  Settings2,
  Server
} from 'lucide-react';

export default function Hero({ backendOnline, backendUrl, onUpdateBackendUrl }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showConfig, setShowConfig] = useState(false);
  const [inputUrl, setInputUrl] = useState(backendUrl);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    onUpdateBackendUrl(inputUrl);
    setShowConfig(false);
  };

  return (
    <header className="relative w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl z-20">
      {/* Railway track top accent */}
      <div className="w-full h-1 bg-gradient-to-r from-railway-blue via-railway-orange to-railway-red relative overflow-hidden">
        <div className="absolute inset-0 bg-white/30 animate-rail-shimmer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-railway-blue to-slate-900 border border-railway-blue/40 shadow-lg shadow-railway-blue/20">
              <Train className="w-7 h-7 text-sky-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-railway-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                  <span>RAILGUARD</span>
                  <span className="text-railway-blue-light drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">AI</span>
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800/90 text-sky-400 border border-slate-700 font-semibold tracking-wider">
                  v2.4 OPS
                </span>
              </div>
              <p className="text-sm font-medium text-slate-400">
                AI-Powered Predictive Railway Maintenance
              </p>
            </div>
          </div>

          {/* Operations Center Telemetry & Status */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Real-time Clock */}
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-railway-blue-light" />
              <span>{time} UTC</span>
            </div>

            {/* Backend Status indicator */}
            <div 
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              title="Click to configure backend API URL"
            >
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300">
                {backendOnline ? 'API Connected' : 'Ready (Port 3000)'}
              </span>
              <Settings2 className="w-3 h-3 text-slate-500 hover:text-slate-300 ml-1" />
            </div>

            {/* Telemetry Live Badge */}
            <div className="flex items-center space-x-1.5 bg-sky-950/40 text-sky-300 px-3 py-1.5 rounded-lg border border-sky-800/50">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>SENSORS LIVE</span>
            </div>
          </div>
        </div>

        {/* Backend Configuration Modal / Popover */}
        {showConfig && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/95 border border-sky-900/60 shadow-2xl backdrop-blur-xl animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Server className="w-4 h-4 text-sky-400" />
                <span>Backend API Configuration</span>
              </div>
              <button 
                onClick={() => setShowConfig(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>
            <form onSubmit={handleSaveUrl} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-railway-blue hover:bg-sky-600 text-white transition-all shadow-md"
              >
                Update Endpoint
              </button>
            </form>
            <p className="mt-2 text-[11px] text-slate-400">
              Default is <code className="text-sky-300">http://localhost:3000</code>. All requests invoke <code className="text-sky-300 font-mono">POST /api/automation/run</code>.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
