import React from 'react';
import { 
  GitCommit, 
  ClipboardList, 
  AlertOctagon, 
  Users, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export default function AnalyticsCards({ dynamicStats }) {
  const stats = [
    {
      id: 'assets',
      title: 'Assets Monitored',
      value: dynamicStats?.assetsCount || '1,482',
      unit: 'Tracks & Points',
      change: '+14% this quarter',
      changeType: 'positive',
      icon: GitCommit,
      accent: 'border-sky-500/30 text-sky-400 bg-sky-950/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(2,132,199,0.25)]',
      barColor: 'bg-sky-500',
      progress: 88,
    },
    {
      id: 'work-orders',
      title: 'Active Work Orders',
      value: dynamicStats?.activeOrders || '24',
      unit: 'In Pipeline',
      change: '4 in dispatch triage',
      changeType: 'neutral',
      icon: ClipboardList,
      accent: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(234,179,8,0.25)]',
      barColor: 'bg-amber-500',
      progress: 65,
    },
    {
      id: 'critical-risks',
      title: 'Critical Risks',
      value: dynamicStats?.criticalRisks || '3',
      unit: 'Immediate Action',
      change: 'Automated speed-cut alert',
      changeType: 'critical',
      icon: AlertOctagon,
      accent: 'border-red-500/30 text-red-400 bg-red-950/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]',
      barColor: 'bg-red-500',
      progress: 92,
    },
    {
      id: 'crew-availability',
      title: 'Crew Availability',
      value: dynamicStats?.crewAvailability || '94%',
      unit: 'Operational Readiness',
      change: '16 Teams on-call',
      changeType: 'positive',
      icon: Users,
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      barColor: 'bg-emerald-500',
      progress: 94,
    },
  ];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-semibold">
            Railway Corridor Telemetry & Performance KPIs
          </h2>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-slate-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>POLLING SENSOR NETWORK (400ms)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`group relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:border-slate-600 hover:-translate-y-1 ${stat.glow}`}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-sky-400 transition-all" />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">{stat.title}</p>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                      {stat.value}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{stat.unit}</span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${stat.accent} transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Progress Bar & Subtext */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className={
                    stat.changeType === 'critical' ? 'text-red-400 font-semibold' :
                    stat.changeType === 'positive' ? 'text-emerald-400' : 'text-slate-400'
                  }>
                    {stat.change}
                  </span>
                  <span className="text-slate-500">{stat.progress}%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${stat.barColor}`} 
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
