import React from 'react';
import { NavigationSection } from '../../types';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Cpu,
  Server,
  Layers,
  Radio,
  Network,
  Activity,
  FileCode2,
  ShieldAlert,
  SearchCheck,
  FolderLock,
  Workflow,
  HeartPulse,
  History,
  Sliders,
  Users,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeSection: NavigationSection;
  onNavigate: (section: NavigationSection) => void;
  investigationCount?: number;
  criticalDetectionCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  investigationCount = 4,
  criticalDetectionCount = 4,
}) => {
  const isSectionActive = (section: NavigationSection) => {
    if (activeSection === section) return true;
    if (section === 'sites' && activeSection === 'site-detail') return true;
    if (section === 'assets' && activeSection === 'asset-detail') return true;
    if (section === 'agents' && activeSection === 'agent-detail') return true;
    if (section === 'network-devices' && activeSection === 'network-device-detail') return true;
    if (section === 'events' && activeSection === 'event-detail') return true;
    if (section === 'syslog' && activeSection === 'parser-assistant') return true;
    if (section === 'collection-profiles' && activeSection === 'collection-profile-detail') return true;
    if (section === 'detections' && activeSection === 'detection-detail') return true;
    if (section === 'investigations' && activeSection === 'investigation-detail') return true;
    if (section === 'evidence' && activeSection === 'evidence-detail') return true;
    return false;
  };

  const navItemClass = (section: NavigationSection) => {
    const active = isSectionActive(section);
    return `w-full flex items-center justify-between px-5 py-2 text-[13px] transition-colors cursor-pointer group select-none ${
      active
        ? 'bg-[#1A1A1D] text-white border-r-2 border-[#E64848] font-medium'
        : 'text-[#8E9299] hover:text-[#E0E0E0] hover:bg-[#1A1A1D]'
    }`;
  };

  return (
    <aside className="w-[230px] shrink-0 bg-[#0F0F11] border-r border-[#242426] flex flex-col h-screen select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#242426] cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="text-white font-bold tracking-widest text-lg font-mono leading-none">WARDEN</div>
        <div className="text-[10px] text-cyan-400 font-medium leading-none mt-1 tracking-wider uppercase font-mono">
          OT/ICS &amp; SOC Platform
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-2 text-[13px] overflow-y-auto space-y-1">
        {/* Overview */}
        <div>
          <div className="px-5 py-1.5 text-[#5A5A5E] text-[10px] font-bold uppercase tracking-wider font-mono">
            Overview
          </div>
          <button onClick={() => onNavigate('dashboard')} className={navItemClass('dashboard')}>
            <span className="flex items-center gap-2.5">
              <LayoutDashboard size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Dashboard</span>
            </span>
          </button>
        </div>

        {/* Organization */}
        <div>
          <div className="px-5 pt-2.5 pb-1 text-[#5A5A5E] text-[10px] font-bold uppercase tracking-wider font-mono">
            Organization
          </div>
          <button onClick={() => onNavigate('sites')} className={navItemClass('sites')}>
            <span className="flex items-center gap-2.5">
              <Building2 size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Sites &amp; Zones</span>
            </span>
            <span className="ml-auto bg-[#242426] text-[#8E9299] text-[9px] px-1.5 py-0.5 rounded-sm font-mono">
              4 Plants
            </span>
          </button>

          <button onClick={() => onNavigate('groups')} className={navItemClass('groups')}>
            <span className="flex items-center gap-2.5">
              <FolderKanban size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Asset Groups</span>
            </span>
            <span className="ml-auto bg-[#242426] text-[#8E9299] text-[9px] px-1.5 py-0.5 rounded-sm font-mono">
              9
            </span>
          </button>

          <button onClick={() => onNavigate('assets')} className={navItemClass('assets')}>
            <span className="flex items-center gap-2.5">
              <Cpu size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Unified Assets</span>
            </span>
            <span className="ml-auto bg-[#242426] text-[#8E9299] text-[9px] px-1.5 py-0.5 rounded-sm font-mono">
              4.4k
            </span>
          </button>
        </div>

        {/* Telemetry */}
        <div>
          <div className="px-5 pt-2.5 pb-1 text-[#5A5A5E] text-[10px] font-bold uppercase tracking-wider font-mono">
            Telemetry
          </div>
          <button onClick={() => onNavigate('agents')} className={navItemClass('agents')}>
            <span className="flex items-center gap-2.5">
              <Server size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Windows Agents</span>
            </span>
            <span className="ml-auto bg-[#242426] text-[#8E9299] text-[9px] px-1.5 py-0.5 rounded-sm font-mono">
              685
            </span>
          </button>

          <button onClick={() => onNavigate('events')} className={navItemClass('events')}>
            <span className="flex items-center gap-2.5">
              <Layers size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Events</span>
            </span>
            <span className="ml-auto text-[9px] font-mono text-[#27AE60] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] animate-pulse" />
              LIVE
            </span>
          </button>

          <button onClick={() => onNavigate('syslog')} className={navItemClass('syslog')}>
            <span className="flex items-center gap-2.5">
              <Radio size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Syslog</span>
            </span>
            <span className="ml-auto text-[9px] font-mono text-[#8E9299]">217 src</span>
          </button>

          <button onClick={() => onNavigate('network-devices')} className={navItemClass('network-devices')}>
            <span className="flex items-center gap-2.5">
              <Network size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Network Devices</span>
            </span>
            <span className="ml-auto text-[9px] font-mono text-[#8E9299]">323</span>
          </button>

          <button onClick={() => onNavigate('telemetry-sources')} className={navItemClass('telemetry-sources')}>
            <span className="flex items-center gap-2.5">
              <Activity size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Telemetry Sources</span>
            </span>
          </button>

          <button onClick={() => onNavigate('collection-profiles')} className={navItemClass('collection-profiles')}>
            <span className="flex items-center gap-2.5">
              <FileCode2 size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Profiles</span>
            </span>
          </button>
        </div>

        {/* Security */}
        <div>
          <div className="px-5 pt-2.5 pb-1 text-[#5A5A5E] text-[10px] font-bold uppercase tracking-wider font-mono">
            Security
          </div>
          <button onClick={() => onNavigate('detections')} className={navItemClass('detections')}>
            <span className="flex items-center gap-2.5">
              <ShieldAlert size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Detections</span>
            </span>
            {criticalDetectionCount > 0 && (
              <span className="ml-auto bg-[#E64848] text-white text-[9px] px-1.5 py-0.5 rounded-sm font-mono font-bold">
                {criticalDetectionCount}
              </span>
            )}
          </button>

          <button onClick={() => onNavigate('investigations')} className={navItemClass('investigations')}>
            <span className="flex items-center gap-2.5">
              <SearchCheck size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Investigations</span>
            </span>
            {investigationCount > 0 && (
              <span className="ml-auto bg-[#242426] text-[#F2994A] border border-[#F2994A]/30 text-[9px] px-1.5 py-0.5 rounded-sm font-mono">
                {investigationCount}
              </span>
            )}
          </button>

          <button onClick={() => onNavigate('evidence')} className={navItemClass('evidence')}>
            <span className="flex items-center gap-2.5">
              <FolderLock size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Evidence</span>
            </span>
          </button>
        </div>

        {/* Operations */}
        <div>
          <div className="px-5 pt-2.5 pb-1 text-[#5A5A5E] text-[10px] font-bold uppercase tracking-wider font-mono">
            Operations
          </div>
          <button onClick={() => onNavigate('integrations')} className={navItemClass('integrations')}>
            <span className="flex items-center gap-2.5">
              <Workflow size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Integrations</span>
            </span>
          </button>

          <button onClick={() => onNavigate('health')} className={navItemClass('health')}>
            <span className="flex items-center gap-2.5">
              <HeartPulse size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Health</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] ml-auto" />
          </button>

          <button onClick={() => onNavigate('audit-log')} className={navItemClass('audit-log')}>
            <span className="flex items-center gap-2.5">
              <History size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Audit Log</span>
            </span>
          </button>
        </div>

        {/* Administration */}
        <div>
          <div className="px-5 pt-2.5 pb-1 text-[#5A5A5E] text-[10px] font-bold uppercase tracking-wider font-mono">
            Administration
          </div>
          <button onClick={() => onNavigate('users')} className={navItemClass('users')}>
            <span className="flex items-center gap-2.5">
              <Users size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Users &amp; Roles</span>
            </span>
          </button>

          <button onClick={() => onNavigate('policies')} className={navItemClass('policies')}>
            <span className="flex items-center gap-2.5">
              <Sliders size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Policies</span>
            </span>
          </button>

          <button onClick={() => onNavigate('settings')} className={navItemClass('settings')}>
            <span className="flex items-center gap-2.5">
              <Settings size={14} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>Settings</span>
            </span>
          </button>
        </div>
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#242426] bg-[#0F0F11]">
        <div className="flex items-center gap-2 text-[11px] text-[#8E9299]">
          <span className="w-2 h-2 rounded-full bg-[#27AE60] shrink-0" />
          <span className="font-medium text-[#E0E0E0]">Platform Operational</span>
        </div>
        <div className="text-[10px] text-[#5A5A5E] mt-1 font-mono flex items-center justify-between">
          <span>v0.1.0-OT</span>
          <span>AIR-GAP SEC</span>
        </div>
      </div>
    </aside>
  );
};

