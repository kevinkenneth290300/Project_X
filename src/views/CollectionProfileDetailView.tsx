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
import { profileService } from '../services/profileService';

interface CollectionProfileDetailViewProps {
  profileId?: string;
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const CollectionProfileDetailView: React.FC<CollectionProfileDetailViewProps> = ({
  profileId = 'profile-baseline',
  onNavigate,
}) => {
  const [profile, setProfile] = useState<CollectionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deployNotification, setDeployNotification] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'yaml' | 'channels' | 'history'>('yaml');

  useEffect(() => {
    const fetchP = async () => {
      setLoading(true);
      const data = await profileService.getProfileById(profileId || 'profile-baseline');
      setProfile(data || (await profileService.getProfileById('profile-baseline')));
      setLoading(false);
    };
    fetchP();
  }, [profileId]);

  const handleCopyYaml = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.yamlConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeployToFleet = () => {
    if (!profile) return;
    setDeployNotification(`Policy v${profile.version} queued for rolling deployment across 144 Windows agents.`);
    setTimeout(() => setDeployNotification(null), 4000);
  };

  const handleTestXPath = () => {
    setTestResult('XPath syntax valid. Query validated against standard Microsoft-Windows-Security channel manifest schema.');
    setTimeout(() => setTestResult(null), 4000);
  };

  if (loading || !profile) {
    return <div className="p-8 text-center font-mono text-slate-400">Loading collection profile...</div>;
  }

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
                {profile.status}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Target Profile ID: {profile.id} • Deployed on {profile.deploymentCoverage.activeHosts} hosts ({profile.deploymentCoverage.percent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleTestXPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer"
          >
            <Play size={12} />
            <span>Validate Query</span>
          </button>
          <button
            onClick={handleDeployToFleet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold cursor-pointer shadow-sm"
          >
            <Send size={12} />
            <span>Deploy to Fleet</span>
          </button>
        </div>
      </div>

      {deployNotification && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{deployNotification}</span>
        </div>
      )}

      {testResult && (
        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-700 text-cyan-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => setActiveTab('yaml')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'yaml'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          YAML Configuration
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'channels'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Subscribed Channels &amp; XPath ({profile.channels.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Version History ({profile.versionHistory.length})
        </button>
      </div>

      {/* Tab 1: YAML Config */}
      {activeTab === 'yaml' && (
        <div className="rounded-lg bg-[#0b1017] border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Warden Agent Deployment Spec (profile.yaml)</span>
            <button
              onClick={handleCopyYaml}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-[11px]"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied YAML' : 'Copy YAML'}</span>
            </button>
          </div>

          <pre className="text-[11px] text-cyan-300/90 overflow-x-auto p-3 rounded bg-slate-950/80 border border-slate-800/80 whitespace-pre font-mono leading-relaxed select-all">
            {profile.yamlConfig}
          </pre>
        </div>
      )}

      {/* Tab 2: Channels & XPath */}
      {activeTab === 'channels' && (
        <div className="space-y-3 font-mono text-xs">
          {profile.channels.map((ch, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-xs">{ch.channel}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {ch.filterMode}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">XPath Query Filter:</div>
              <pre className="p-2 rounded bg-slate-950 text-[10px] text-amber-300/90 overflow-x-auto border border-slate-800">
                {ch.xpath}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <h3 className="font-bold text-slate-100 uppercase tracking-wide">Audit &amp; Change Ledger</h3>
          <div className="divide-y divide-slate-800">
            {profile.versionHistory.map((h, i) => (
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
