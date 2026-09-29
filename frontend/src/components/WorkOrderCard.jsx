import React, { useState } from 'react';
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  Tag, 
  Copy, 
  Check, 
  Share2, 
  AlertTriangle,
  SendHorizontal
} from 'lucide-react';

export default function WorkOrderCard({ workOrder }) {
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  if (!workOrder) return null;

  const {
    workOrderId = 'WO-AUTO-001',
    priority = 'CRITICAL',
    deadline = new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    status = 'PENDING'
  } = workOrder;

  const handleCopyId = () => {
    navigator.clipboard.writeText(workOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = (() => {
    try {
      return new Date(deadline).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return deadline;
    }
  })();

  const getPriorityStyle = (p) => {
    switch (p?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Work Order Synthesis</h3>
              <p className="text-xs text-slate-400">Automated maintenance dispatch record</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${getPriorityStyle(priority)}`}>
              {priority} PRIORITY
            </span>
          </div>
        </div>

        {/* Work Order ID Barcode-Style Tile */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Work Order Identifier
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-mono font-bold text-sky-300 tracking-wider">
                {workOrderId}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Copy Work Order ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Status:</span>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{acknowledged ? 'ACKNOWLEDGED' : status}</span>
            </span>
          </div>
        </div>

        {/* Deadline & Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              Completion Deadline
            </span>
            <p className="text-xs font-mono font-semibold text-slate-200">
              {formattedDate}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              Service SLA Window
            </span>
            <p className="text-xs font-mono font-semibold text-orange-300">
              Mandatory inspection SLA
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          AUTO-SYNCED TO SUPABASE
        </span>
        <button
          onClick={() => setAcknowledged(true)}
          disabled={acknowledged}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 ${
            acknowledged
              ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 cursor-default'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 cursor-pointer'
          }`}
        >
          {acknowledged ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dispatched to Field Crew</span>
            </>
          ) : (
            <>
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>Acknowledge & Dispatch</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
