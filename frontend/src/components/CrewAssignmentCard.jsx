import React from 'react';
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  Radio, 
  PhoneCall, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function CrewAssignmentCard({ crewAssignment }) {
  if (!crewAssignment) return null;

  const { assignedCrew, assignmentReason = 'Optimal crew allocated via skill matching engine.' } = crewAssignment;

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Crew Assignment</h3>
              <p className="text-xs text-slate-400">Automated resource allocation & dispatch</p>
            </div>
          </div>

          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
            assignedCrew 
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' 
              : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
          }`}>
            {assignedCrew ? 'CREW DEPLOYED' : 'AWAITING CREW'}
          </span>
        </div>

        {/* Crew Info Display */}
        {assignedCrew ? (
          <div className="my-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Assigned Unit
                </span>
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  {assignedCrew.name || 'Rapid Response Track Crew'}
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-slate-400">CREW ID:</span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-sky-300">
                  {assignedCrew.crewId || 'CRW-PRIMARY'}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Radius: ~4.2 km to sector</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Radio Channel 08 ACTIVE</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="my-5 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">No Regional Crew Assigned</h4>
              <p className="text-xs text-amber-400/90 mt-1">
                All qualified technicians for this trade are either engaged or outside the rapid transit radius.
              </p>
            </div>
          </div>
        )}

        {/* Assignment Reason */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/70 space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            Dispatch Justification & Reason
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {assignmentReason}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 mt-5 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>PRIORITY ROUTING ACTIVE</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> VERIFIED CREW DISPATCH
        </span>
      </div>

    </div>
  );
}
