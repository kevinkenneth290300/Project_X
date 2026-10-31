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
import { profileService, getProfileChannelNames, getProfileCoveredEventIds } from '../services/profileService';

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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProf = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await profileService.getProfiles();
        if (active) setProfiles(data);
      } catch {
        if (active) {
          setProfiles([]);
          setLoadError('Sample profiles unavailable: the data could not be loaded.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProf();
    return () => { active = false; };
  }, []);

  const openProfile = (profile: CollectionProfile) => {
    onSelectProfile(profile.id);
    onNavigate('collection-profile-detail');
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Sample Collection Profiles</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              NOT DEPLOYED
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Sample channel and event definitions only; no endpoint subscription or collection policy is applied.
          </p>
        </div>

        <button
          disabled
          aria-describedby="profile-list-unavailable"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs font-semibold cursor-not-allowed"
        >
          <Plus size={14} />
          <span>New Profile</span>
        </button>
      </div>

      <p id="profile-list-unavailable" role="status" className="text-amber-300 font-mono text-xs">Profile creation, deployment, and XPath validation are unavailable. Existing definitions are local samples.</p>
      {loadError && <p role="alert" className="text-amber-300">{loadError}</p>}
      {!loading && !loadError && profiles.length === 0 && <p role="status" className="text-slate-400">No sample profiles found.</p>}

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((prof) => {
          const channels = getProfileChannelNames(prof);
          const coveredEventIds = getProfileCoveredEventIds(prof);
          return (
          <div
            key={prof.id}
            role="button"
            tabIndex={0}
            aria-label={`Inspect sample profile ${prof.name}`}
            onClick={() => openProfile(prof)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProfile(prof);
              }
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
                  <div className="text-xs font-bold text-slate-400 font-mono">
                    Unavailable
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Deployment Status</div>
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">{prof.description || prof.purpose}</p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
              {/* Coverage progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>
                    Sample definition only; not deployed
                  </span>
                  <span>Local draft</span>
                </div>
              </div>

              {/* Covered Event IDs tags */}
              <div className="flex flex-wrap gap-1">
                {coveredEventIds.slice(0, 6).map((eid) => (
                  <span
                    key={eid}
                    className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]"
                  >
                    EID {eid}
                  </span>
                ))}
                {coveredEventIds.length > 6 && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px]">
                    +{coveredEventIds.length - 6} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{channels.length} sample channels</span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Inspect Sample <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
