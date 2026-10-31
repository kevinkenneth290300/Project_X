import React, { useState } from 'react';
import {
  ShieldAlert,
  HardDrive,
  Lock,
  CheckCircle2,
  Sliders,
  Server,
  Save,
  Radio,
} from 'lucide-react';
import { NavigationSection } from '../types';

interface PoliciesViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ onNavigate }) => {
  const [airGappedMode, setAirGappedMode] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);
  const [spoolDiskMaxGb, setSpoolDiskMaxGb] = useState(250);
  const [enforceMtls, setEnforceMtls] = useState(true);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Sample Security &amp; Retention Preferences</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 font-semibold">
              NOT ENFORCED
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Local sample preferences only. No transport, retention, egress, or air-gap policy is applied.
          </p>
        </div>

        <button
          disabled
          aria-describedby="policy-deployment-unavailable"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs font-semibold cursor-not-allowed"
        >
          <Save size={13} />
          <span>Apply Policies</span>
        </button>
      </div>

      <p id="policy-deployment-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Policy deployment and synchronization are unavailable. Air-gap and mTLS preferences are local samples, not enforced security controls.
      </p>

      {/* Policy Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {/* Air Gap & Network Isolation */}
        <div className="p-4 rounded-xl bg-[#0f151e] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Lock size={16} className="text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
              Enclave Transport &amp; Isolation
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded bg-[#0b1017] border border-slate-800">
              <div>
                <div className="font-bold text-slate-200 text-xs">Sample Air-Gap Preference</div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Egress isolation is not enforced by this sample preference.
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Sample Air-Gap Preference"
                checked={airGappedMode}
                onChange={(e) => setAirGappedMode(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#0b1017] border border-slate-800">
              <div>
                <div className="font-bold text-slate-200 text-xs">Sample Mutual TLS Preference</div>
                <div className="text-[11px] text-slate-400 font-sans">
                  No certificate requirement or TLS policy is deployed from this demonstration.
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Sample Mutual TLS Preference"
                checked={enforceMtls}
                onChange={(e) => setEnforceMtls(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Telemetry Storage & Backpressure Buffer */}
        <div className="p-4 rounded-xl bg-[#0f151e] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <HardDrive size={16} className="text-amber-400" />
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
              Telemetry Retention &amp; Buffer Spool
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Hot Storage Retention Period:</span>
                <span className="text-cyan-300 font-bold">{retentionDays} Days</span>
              </div>
              <input
                type="range"
                min="14"
                max="365"
                step="1"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>14 Days (Minimum)</span>
                <span>365 Days (Sample Only)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Agent Local Disk Spool Cap:</span>
                <span className="text-amber-300 font-bold">{spoolDiskMaxGb} MB</span>
              </div>
              <input
                type="range"
                min="50"
                max="2048"
                step="50"
                value={spoolDiskMaxGb}
                onChange={(e) => setSpoolDiskMaxGb(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>50 MB (Lightweight)</span>
                <span>2048 MB (Disconnected Enclaves)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
