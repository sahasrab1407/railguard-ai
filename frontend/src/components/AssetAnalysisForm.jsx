import React, { useState } from 'react';
import { 
  Play, 
  Wrench, 
  Thermometer, 
  Activity, 
  Calendar, 
  Cpu, 
  Sparkles, 
  Sliders, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

const PRESETS = [
  {
    name: 'Critical Track Failure',
    label: 'High Stress (Prompt Example)',
    color: 'border-red-500/40 text-red-300 hover:bg-red-950/30',
    data: {
      assetId: 'TRK-1001',
      wearPercentage: 85,
      vibrationLevel: 9.4,
      temperature: 53,
      lastMaintenanceDays: 210,
      requiredSkill: 'TRACK'
    }
  },
  {
    name: 'Overheated Signal Relay',
    label: 'Thermal Anomaly',
    color: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/30',
    data: {
      assetId: 'SIG-8840',
      wearPercentage: 48,
      vibrationLevel: 3.8,
      temperature: 58,
      lastMaintenanceDays: 195,
      requiredSkill: 'SIGNAL'
    }
  },
  {
    name: 'Switch Point Wear',
    label: 'High Vibration',
    color: 'border-sky-500/40 text-sky-300 hover:bg-sky-950/30',
    data: {
      assetId: 'SW-402',
      wearPercentage: 72,
      vibrationLevel: 7.6,
      temperature: 38,
      lastMaintenanceDays: 140,
      requiredSkill: 'MECHANICAL'
    }
  },
  {
    name: 'Catenary Wire Routine',
    label: 'Nominal Health',
    color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30',
    data: {
      assetId: 'CAT-204',
      wearPercentage: 22,
      vibrationLevel: 1.8,
      temperature: 27,
      lastMaintenanceDays: 45,
      requiredSkill: 'ELECTRICAL'
    }
  }
];

// Default sample crews pool for realistic assignment
const DEFAULT_CREWS = [
  {
    crewId: 'CRW-DELTA-01',
    name: 'Rapid Track Engineering Unit A',
    skill: 'TRACK',
    available: true,
    distanceKm: 3.5,
    workload: 1
  },
  {
    crewId: 'CRW-SIG-04',
    name: 'Automated Signaling Techs',
    skill: 'SIGNAL',
    available: true,
    distanceKm: 8.2,
    workload: 2
  },
  {
    crewId: 'CRW-ELEC-09',
    name: 'Catenary & Traction Specialists',
    skill: 'ELECTRICAL',
    available: true,
    distanceKm: 12.0,
    workload: 0
  },
  {
    crewId: 'CRW-MECH-02',
    name: 'Heavy Switch & Point Crew',
    skill: 'MECHANICAL',
    available: true,
    distanceKm: 5.1,
    workload: 3
  }
];

export default function AssetAnalysisForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    assetId: 'TRK-1001',
    wearPercentage: 85,
    vibrationLevel: 9.4,
    temperature: 53,
    lastMaintenanceDays: 210,
    requiredSkill: 'TRACK'
  });

  const [includeCrewPool, setIncludeCrewPool] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'assetId' || name === 'requiredSkill' ? value : Number(value)
    }));
  };

  const handleApplyPreset = (preset) => {
    setFormData(preset.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      assetData: formData,
      crews: includeCrewPool ? DEFAULT_CREWS : []
    });
  };

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative background grid and railway accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-railway-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Asset Analysis Telemetry Intake
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Feed physical sensor readings and asset registry metrics to trigger AI risk inference.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Quick Scenarios:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${p.color}`}
              title={p.label}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. Asset ID */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-sky-400" />
                Asset ID / Track Code
              </span>
              <span className="text-[10px] font-mono text-slate-500">FORMAT: TRK-XXXX</span>
            </label>
            <input
              type="text"
              name="assetId"
              id="assetId"
              value={formData.assetId}
              onChange={handleChange}
              placeholder="e.g. TRK-1001"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
            />
          </div>

          {/* 2. Wear Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-railway-orange" />
                Wear Percentage
              </span>
              <span className="text-xs font-mono font-bold text-orange-400">
                {formData.wearPercentage}%
              </span>
            </div>
            <div className="space-y-1.5">
              <input
                type="number"
                name="wearPercentage"
                id="wearPercentage"
                min="0"
                max="100"
                step="1"
                value={formData.wearPercentage}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
              />
              <input
                type="range"
                min="0"
                max="100"
                name="wearPercentage"
                value={formData.wearPercentage}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>

          {/* 3. Vibration Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-red-400" />
                Vibration Level
              </span>
              <span className="text-xs font-mono font-bold text-red-400">
                {formData.vibrationLevel} G
              </span>
            </div>
            <div className="space-y-1.5">
              <input
                type="number"
                name="vibrationLevel"
                id="vibrationLevel"
                min="0"
                max="25"
                step="0.1"
                value={formData.vibrationLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-red-500"
              />
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                name="vibrationLevel"
                value={formData.vibrationLevel}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>

          {/* 4. Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Rail Temperature
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {formData.temperature} °C
              </span>
            </div>
            <div className="space-y-1.5">
              <input
                type="number"
                name="temperature"
                id="temperature"
                min="-20"
                max="80"
                step="1"
                value={formData.temperature}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              />
              <input
                type="range"
                min="-10"
                max="75"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* 5. Last Maintenance Days */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Days Since Last Maintenance
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {formData.lastMaintenanceDays} d
              </span>
            </div>
            <div className="space-y-1.5">
              <input
                type="number"
                name="lastMaintenanceDays"
                id="lastMaintenanceDays"
                min="0"
                max="730"
                step="1"
                value={formData.lastMaintenanceDays}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-sky-500"
              />
              <input
                type="range"
                min="0"
                max="365"
                name="lastMaintenanceDays"
                value={formData.lastMaintenanceDays}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>

          {/* 6. Required Skill */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                Required Crew Specialization
              </span>
              <span className="text-[10px] font-mono text-slate-500">WORK ORDER SPEC</span>
            </label>
            <select
              name="requiredSkill"
              id="requiredSkill"
              value={formData.requiredSkill}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="TRACK">TRACK (Rails, Sleepers, Ballast)</option>
              <option value="SIGNAL">SIGNAL (Interlocking, Relays, Lights)</option>
              <option value="ELECTRICAL">ELECTRICAL (Overhead Catenary, Power)</option>
              <option value="MECHANICAL">MECHANICAL (Switch Points, Crossings)</option>
            </select>
          </div>

        </div>

        {/* Crew Dispatch Toggle & Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800 gap-4">
          <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={includeCrewPool}
              onChange={(e) => setIncludeCrewPool(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Include active regional crew roster for automated assignment matching</span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            id="run-analysis-btn"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-railway-blue via-sky-500 to-railway-blue hover:from-sky-500 hover:to-railway-blue text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Play className={`w-4 h-4 fill-white ${isLoading ? 'animate-spin' : ''}`} />
            <span>Run AI Analysis</span>
          </button>
        </div>
      </form>
    </div>
  );
}
