import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Plus,
  Copy,
  ArrowRight,
  Shield,
  Layers,
  Server,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { CollectionProfile, NavigationSection } from '../types';
import { profileService } from '../services/profileService';

interface CollectionProfilesViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectProfile: (profileId: string) => void;
}

export const CollectionProfilesView: React.FC<CollectionProfilesViewProps> = ({
  onNavigate,
  onSelectProfile,
}) => {
  const [profiles, setProfiles] = useState<CollectionProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProf = async () => {
      setLoading(true);
      const data = await profileService.getProfiles();
      setProfiles(data);
      setLoading(false);
    };
    fetchProf();
  }, []);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Collection Profiles</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              TELEMETRY POLICIES
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Declarative channel subscriptions, XPath event filtering, and kernel trace policies for Windows agents
          </p>
        </div>

        <button
          onClick={() => {
            onSelectProfile('profile-baseline');
            onNavigate('collection-profile-detail');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm"
        >
          <Plus size={14} />
          <span>New Profile</span>
        </button>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((prof) => (
          <div
            key={prof.id}
            onClick={() => {
              onSelectProfile(prof.id);
              onNavigate('collection-profile-detail');
            }}
            className="p-4 rounded-xl bg-[#0f151e] hover:bg-[#131d2b] border border-slate-800 hover:border-cyan-800/60 transition-all cursor-pointer shadow-sm space-y-3 group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                    <FileCode2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {prof.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Version: v{prof.version}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-cyan-300 font-mono">
                    {prof.deploymentCoverage.percent}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Fleet Coverage</div>
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">{prof.description}</p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
              {/* Coverage progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>
                    Deployed to {prof.deploymentCoverage.activeHosts} / {prof.deploymentCoverage.totalHosts} hosts
                  </span>
                  <span>{prof.status}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${prof.deploymentCoverage.percent}%` }}
                  />
                </div>
              </div>

              {/* Covered Event IDs tags */}
              <div className="flex flex-wrap gap-1">
                {prof.coveredEventIds.slice(0, 6).map((eid) => (
                  <span
                    key={eid}
                    className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]"
                  >
                    EID {eid}
                  </span>
                ))}
                {prof.coveredEventIds.length > 6 && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px]">
                    +{prof.coveredEventIds.length - 6} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{prof.channels.length} subscribed channels</span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Configure Policy <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
