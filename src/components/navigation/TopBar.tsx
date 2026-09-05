import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Activity,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { NavigationSection } from '../../types';
import { ScopeSelector } from './ScopeSelector';

interface TopBarProps {
  sectionTitle?: string;
  activeSection?: NavigationSection;
  breadcrumbs?: { label: string; onClick?: () => void }[];
  onOpenSearch?: () => void;
  onOpenGlobalSearch?: () => void;
  onNavigate: (section: NavigationSection) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  sectionTitle,
  activeSection = 'dashboard',
  breadcrumbs = [],
  onOpenSearch,
  onOpenGlobalSearch,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleOpenSearch = onOpenGlobalSearch || onOpenSearch || (() => {});

  const displayTitle = sectionTitle || (
    activeSection === 'dashboard' ? 'Operations Overview' :
    activeSection === 'sites' || activeSection === 'site-detail' ? 'Sites & Zones' :
    activeSection === 'groups' ? 'Asset Groups' :
    activeSection === 'assets' || activeSection === 'asset-detail' ? 'Unified Assets' :
    activeSection === 'agents' || activeSection === 'agent-detail' ? 'Windows Fleet' :
    activeSection === 'events' || activeSection === 'event-detail' ? 'Event Explorer' :
    activeSection === 'syslog' || activeSection === 'parser-assistant' ? 'Syslog & Parsers' :
    activeSection === 'network-devices' || activeSection === 'network-device-detail' ? 'Network Devices' :
    activeSection === 'telemetry-sources' ? 'Telemetry Sources' :
    activeSection === 'detections' || activeSection === 'detection-detail' ? 'Detections Console' :
    activeSection === 'investigations' || activeSection === 'investigation-detail' ? 'Active Investigations' :
    activeSection === 'evidence' ? 'Evidence Ledger' :
    activeSection === 'collection-profiles' || activeSection === 'collection-profile-detail' ? 'Collection Profiles' :
    activeSection === 'integrations' ? 'Integrations & SIEM' :
    activeSection === 'health' ? 'System Health' :
    activeSection === 'audit-log' ? 'Audit Log' :
    activeSection === 'policies' ? 'Security Policies' :
    activeSection === 'certificates' ? 'PKI & Certificates' :
    activeSection === 'users' ? 'Access Control & RBAC' : 'Platform Settings'
  );

  return (
    <header className="h-[60px] border-b border-[#242426] bg-[#0B0B0C] flex items-center px-6 justify-between shrink-0 select-none z-20 gap-4">
      {/* Left: Section Title & Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs shrink-0">
        <div className="flex items-center text-[#8E9299] font-mono">
          <span className="text-[#5A5A5E] font-bold">WARDEN</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={13} className="text-[#5A5A5E] mx-1.5" />
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="hover:text-white text-[#8E9299] transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-[#8E9299]">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
          <ChevronRight size={13} className="text-[#5A5A5E] mx-1.5" />
          <span className="text-sm font-semibold text-white font-sans">{displayTitle}</span>
        </div>
      </div>

      {/* Global Scope Selector */}
      <div className="shrink-0">
        <ScopeSelector />
      </div>

      {/* Center: Technical Search Bar */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <button
            onClick={handleOpenSearch}
            className="w-full flex items-center justify-between bg-[#151517] border border-[#242426] text-[12px] px-3.5 py-1.5 rounded text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#3A3A3C] focus:border-[#E64848] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search size={13} className="text-[#8E9299] group-hover:text-white shrink-0" />
              <span className="truncate text-xs">Search hosts, OT assets, events...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-[#242426] text-[#8E9299] rounded border border-[#3A3A3C] shrink-0 ml-1">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Real-time Ingestion Stream Counter */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#151517] border border-[#242426] font-mono text-xs">
          <Activity size={12} className="text-[#27AE60] animate-pulse" />
          <span className="text-[#8E9299] text-[11px]">EPS:</span>
          <span className="text-white font-semibold text-[11px]">12,481/m</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded hover:bg-[#1A1A1D] text-[#8E9299] hover:text-white transition-colors relative cursor-pointer"
            title="System Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E64848]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded bg-[#151517] border border-[#242426] shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#242426] mb-2">
                <span className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">
                  Alert Stream (3)
                </span>
                <span className="text-[10px] text-[#E64848] cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2">
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('investigation-detail');
                  }}
                  className="p-2.5 rounded bg-[#1A1A1D] hover:bg-[#242426] border-l-2 border-[#E64848] border border-[#242426] cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#E64848] font-mono text-[11px]">
                    <span className="font-bold">INV-000142 Triggered</span>
                    <span className="text-[#8E9299]">4m ago</span>
                  </div>
                  <p className="text-[#E0E0E0] text-[11px] mt-0.5">
                    Suspicious service installation on SERVER-42
                  </p>
                </div>
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('agent-detail');
                  }}
                  className="p-2.5 rounded bg-[#1A1A1D] hover:bg-[#242426] border-l-2 border-[#F2994A] border border-[#242426] cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#F2994A] font-mono text-[11px]">
                    <span className="font-bold">Agent Queue Warning</span>
                    <span className="text-[#8E9299]">21m ago</span>
                  </div>
                  <p className="text-[#E0E0E0] text-[11px] mt-0.5">DC-01 backpressure queue reached 1.2 GB</p>
                </div>
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('health');
                  }}
                  className="p-2.5 rounded bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#8E9299] font-mono text-[11px]">
                    <span>Syslog TLS Renewal</span>
                    <span>1h ago</span>
                  </div>
                  <p className="text-[#E0E0E0] text-[11px] mt-0.5">Listener TCP 6514 TLS cert valid until 2027</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documentation Modal trigger */}
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2 rounded hover:bg-[#1A1A1D] text-[#8E9299] hover:text-white transition-colors cursor-pointer"
          title="Telemetry Documentation"
        >
          <HelpCircle size={15} />
        </button>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full bg-[#242426] border border-[#3A3A3C] hover:border-[#E64848] flex items-center justify-center text-[11px] font-bold text-white transition-colors cursor-pointer"
          >
            JD
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded bg-[#151517] border border-[#242426] shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#242426] mb-1">
                <div className="font-bold text-white">John Doe (JD)</div>
                <div className="text-[10px] font-mono text-[#8E9299]">j.doe@security.internal</div>
                <div className="text-[9px] font-mono text-[#27AE60] mt-1">Tier-3 Lead Analyst</div>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigate('users');
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#1A1A1D] text-[#E0E0E0] text-[11px]"
              >
                Access &amp; Credentials
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigate('settings');
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#1A1A1D] text-[#E0E0E0] text-[11px]"
              >
                Platform Preferences
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigate('audit-log');
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-[#1A1A1D] text-[#E0E0E0] text-[11px]"
              >
                My Audit Trail
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl rounded bg-[#151517] border border-[#242426] shadow-2xl p-5 text-[#E0E0E0] text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-[#242426] pb-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#E64848]" />
                <span className="font-mono text-sm font-bold text-white">
                  Warden Telemetry Platform Reference
                </span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-[#8E9299] hover:text-white font-mono px-2 py-1 rounded bg-[#242426] cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>
            <div className="space-y-2 text-[#8E9299] leading-relaxed">
              <p>
                <strong className="text-white font-mono">Collect. Preserve. Understand.</strong> Warden provides an
                evidence-first Windows telemetry, syslog, and detection architecture engineered for enterprise and
                restricted environments.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                <div className="p-2.5 rounded bg-[#1A1A1D] border border-[#242426]">
                  <div className="text-white font-semibold">Key Windows Events</div>
                  <div className="text-[#8E9299] text-[10px] mt-1 space-y-0.5">
                    <div>• 4624: Logon Success (Type 10 RDP)</div>
                    <div>• 4672: Privileged Token Assigned</div>
                    <div>• 4688: Process Creation + Cmdline</div>
                    <div>• 7045: New Service Installed</div>
                    <div>• 5007: Defender Tampering</div>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#1A1A1D] border border-[#242426]">
                  <div className="text-white font-semibold">Hotkeys &amp; Navigation</div>
                  <div className="text-[#8E9299] text-[10px] mt-1 space-y-0.5">
                    <div>• <kbd className="text-white bg-[#242426] px-1 py-0.5 rounded">Ctrl+K</kbd>: Omnisearch</div>
                    <div>• Click hosts to inspect Agent</div>
                    <div>• Click Event IDs to inspect raw XML</div>
                    <div>• Click Evidence badges in IR panel</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 rounded bg-[#242426] hover:bg-[#3A3A3C] text-white font-medium text-xs cursor-pointer"
              >
                Close Documentation
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
