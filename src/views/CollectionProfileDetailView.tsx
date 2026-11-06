import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  ArrowLeft,
  Copy,
  Check,
  Send,
  Play,
  Layers,
  History,
  Server,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { CollectionProfile, NavigationSection } from '../types';
import { profileService, getProfileChannelNames } from '../services/profileService';

interface CollectionProfileDetailViewProps {
  profileId?: string;
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const CollectionProfileDetailView: React.FC<CollectionProfileDetailViewProps> = ({
  profileId,
  onNavigate,
}) => {
  const [profile, setProfile] = useState<CollectionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'definition' | 'channels' | 'history'>('definition');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProfile(null);
    setLoadError(null);
    const fetchP = async () => {
      try {
        const data = await profileService.getProfileById(profileId);
        if (active) setProfile(data);
      } catch {
        if (active) setLoadError('Unable to load the requested sample profile.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchP();
    return () => { active = false; };
  }, [profileId]);

  const handleCopyDefinition = async () => {
    if (!profile) return;
    setCopyError(null);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
      setCopied(true);
    } catch {
      setCopyError('Unable to copy the local sample definition.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-mono text-slate-400">Loading collection profile...</div>;
  }

  if (!profile) return <div role="alert" className="p-8 font-mono text-amber-300">{loadError || 'Collection profile not found.'}</div>;
  const channels = getProfileChannelNames(profile);
  const history = profile.versionHistory || [];

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('collection-profiles')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Profiles"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold text-slate-100">{profile.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-bold">
                v{profile.version}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Sample draft (not deployed)
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Sample Profile ID: {profile.id}. Deployment status unavailable.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            disabled
            aria-describedby="profile-operations-unavailable"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 cursor-not-allowed"
          >
            <Play size={12} />
            <span>Validate Query</span>
          </button>
          <button
            disabled
            aria-describedby="profile-operations-unavailable"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-semibold cursor-not-allowed"
          >
            <Send size={12} />
            <span>Deploy to Fleet</span>
          </button>
        </div>
      </div>

      <p id="profile-operations-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Fleet deployment and XPath validation are unavailable. This is a local sample definition, not a verified applied profile.
      </p>
      {copyError && <p role="alert" className="text-amber-300">{copyError}</p>}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => setActiveTab('definition')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'definition'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Sample Definition (JSON)
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'channels'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Sample Channels ({channels.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Sample Version History ({history.length})
        </button>
      </div>

      {/* Tab 1: YAML Config */}
      {activeTab === 'definition' && (
        <div className="rounded-lg bg-[#0b1017] border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Local sample JSON; not an agent deployment specification</span>
            <button
              onClick={handleCopyDefinition}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-[11px]"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Sample copied' : 'Copy Sample JSON'}</span>
            </button>
          </div>

          <pre className="text-[11px] text-cyan-300/90 overflow-x-auto p-3 rounded bg-slate-950/80 border border-slate-800/80 whitespace-pre font-mono leading-relaxed select-all">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}

      {/* Tab 2: Channels & XPath */}
      {activeTab === 'channels' && (
        <div className="space-y-3 font-mono text-xs">
          {channels.map((channel) => (
            <div key={channel} className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-xs">{channel}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Sample only
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Query Validation:</div>
              <pre className="p-2 rounded bg-slate-950 text-[10px] text-amber-300/90 overflow-x-auto border border-slate-800">
                Unavailable; no manifest validation or endpoint subscription was performed.
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <h3 className="font-bold text-slate-100 uppercase tracking-wide">Local Sample Change History</h3>
          <div className="divide-y divide-slate-800">
            {history.map((h, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300">v{h.version}</span>
                    <span className="text-slate-400 text-[11px]">by {h.author}</span>
                  </div>
                  <p className="text-slate-300 text-xs mt-0.5">{h.comment}</p>
                </div>
                <span className="text-slate-500 text-[11px]">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
