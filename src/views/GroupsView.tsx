import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Server,
  Layers,
  Shield,
  FileCode2,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Lock,
} from 'lucide-react';
import { AssetGroup, NavigationSection } from '../types';
import { siteService, MOCK_GROUPS } from '../services/siteService';
import { useScope } from '../context/ScopeContext';

interface GroupsViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({ onNavigate }) => {
  const { scope } = useScope();
  const [groups, setGroups] = useState<AssetGroup[]>(MOCK_GROUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<AssetGroup | null>(null);

  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    type: 'Asset Group' as const,
    criticality: 'High' as const,
    siteId: 'all',
    zoneId: 'all',
  });

  const filteredGroups = groups.filter((g) => {
    if (scope.siteId !== 'all' && g.siteId !== 'all' && g.siteId !== scope.siteId) {
      return false;
    }
    if (typeFilter !== 'All' && g.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.siteName.toLowerCase().includes(q) ||
        g.zoneName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupData.name) return;
    const newGroup: AssetGroup = {
      id: `grp-${Date.now().toString().slice(-4)}`,
      name: newGroupData.name,
      description: newGroupData.description || 'Custom defined asset operational group.',
      type: newGroupData.type,
      memberCount: 0,
      assetIds: [],
      siteId: newGroupData.siteId,
      siteName: newGroupData.siteId === 'all' ? 'Global (All Sites)' : 'Chennai Plant',
      zoneId: newGroupData.zoneId,
      zoneName: newGroupData.zoneId === 'all' ? 'All Zones' : 'Manufacturing Zone',
      collectionPolicy: 'Standard Production Baseline',
      status: 'Healthy',
      criticality: newGroupData.criticality,
    };
    setGroups([newGroup, ...groups]);
    setShowCreateModal(false);
    setNewGroupData({
      name: '',
      description: '',
      type: 'Asset Group',
      criticality: 'High',
      siteId: 'all',
      zoneId: 'all',
    });
  };

  const getCriticalityBadge = (crit: string) => {
    switch (crit) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/60 border border-rose-800/40 text-rose-400">
            CRITICAL
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 border border-amber-800/40 text-amber-400">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 border border-blue-800/40 text-blue-400">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Asset &amp; Device Groups</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              DYNAMIC &amp; STATIC CLUSTERS
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Logical collections of endpoints, OT controllers, switches, and servers sharing telemetry and detection policies
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Create Asset Group</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[#0f151e] border border-slate-800 font-mono">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search group name, applied policy, site or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', 'Agent Group', 'Network Group', 'OT Controller Group', 'Asset Group'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="rounded-xl bg-[#0f151e] border border-slate-800 hover:border-slate-700 transition-all p-4 flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {group.name}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">{group.type}</span>
                </div>
                {getCriticalityBadge(group.criticality)}
              </div>

              <p className="text-slate-300 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                {group.description}
              </p>

              {/* Attributes */}
              <div className="mt-3.5 space-y-2 p-2.5 rounded-lg bg-[#0b1017] border border-slate-800/70 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Members:</span>
                  <span className="font-bold text-slate-100">{group.memberCount} Assets</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Scope:</span>
                  <span className="text-slate-300 truncate max-w-[170px]">{group.siteName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Policy:</span>
                  <span className="text-cyan-300 truncate max-w-[170px]">{group.collectionPolicy}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 font-mono text-xs">
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {group.status}
              </span>

              <button
                onClick={() => {
                  onNavigate('assets');
                }}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold cursor-pointer"
              >
                <span>Inspect Assets</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0f151e] border border-slate-800 shadow-2xl p-5 text-slate-200 text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <FolderKanban size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-slate-100">Create Logical Asset Group</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 font-mono text-xs cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Line 4 Robot Arm Controllers"
                  value={newGroupData.name}
                  onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Group Type</label>
                  <select
                    value={newGroupData.type}
                    onChange={(e: any) => setNewGroupData({ ...newGroupData, type: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Agent Group">Windows Agent Group</option>
                    <option value="Network Group">Network Switch / FW Group</option>
                    <option value="OT Controller Group">OT / PLC Controller Group</option>
                    <option value="Asset Group">Generic Asset Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Criticality</label>
                  <select
                    value={newGroupData.criticality}
                    onChange={(e: any) => setNewGroupData({ ...newGroupData, criticality: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Group purpose and asset lifecycle..."
                  value={newGroupData.description}
                  onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
