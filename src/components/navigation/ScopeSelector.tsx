import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Building2,
  Layers,
  ChevronDown,
  Check,
  Shield,
  Activity,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useScope } from '../../context/ScopeContext';

export const ScopeSelector: React.FC = () => {
  const { scope, selectSite, selectZone, sites, currentSite, availableZones } = useScope();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSiteStatusDot = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-400';
      case 'Warning':
        return 'bg-amber-400 animate-pulse';
      case 'Offline':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="relative font-mono text-xs" ref={dropdownRef}>
      {/* Scope Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#151517] hover:bg-[#1A1A1D] border border-[#242426] hover:border-[#3A3A3C] text-slate-200 transition-all cursor-pointer group shadow-sm"
      >
        <div className="flex items-center gap-1.5 text-slate-400">
          {scope.siteId === 'all' ? (
            <Globe size={13} className="text-cyan-400" />
          ) : (
            <Building2 size={13} className="text-amber-400" />
          )}
          <span className="text-[10px] uppercase font-bold text-slate-400">Scope:</span>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-slate-100 max-w-[220px] truncate">
          <span className="truncate">{scope.siteId === 'all' ? 'All Sites' : scope.siteName}</span>
          {scope.zoneId !== 'all' && (
            <>
              <span className="text-slate-500">/</span>
              <span className="text-cyan-300 truncate">{scope.zoneName}</span>
            </>
          )}
        </div>

        {scope.siteId !== 'all' && currentSite && (
          <span className={`w-2 h-2 rounded-full ${getSiteStatusDot(currentSite.status)} shrink-0`} />
        )}

        <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-200 transition-transform ml-0.5" />
      </button>

      {/* Scope Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-[360px] rounded-md bg-[#12141A] border border-slate-700 shadow-2xl p-2.5 z-50 text-xs text-slate-300 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 font-mono">
            <div className="flex items-center gap-1.5">
              <Shield size={13} className="text-cyan-400" />
              <span className="text-[11px] font-bold text-slate-100 uppercase tracking-wider">
                Hierarchical Scope Context
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
              Acme Manufacturing
            </span>
          </div>

          {/* Sites Section */}
          <div className="space-y-1 mb-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-0.5">
              Plant / Location Hierarchy
            </div>

            {/* All Sites Option */}
            <button
              onClick={() => {
                selectSite('all');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                scope.siteId === 'all'
                  ? 'bg-cyan-950/60 border border-cyan-700/50 text-cyan-200 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-mono">
                <Globe size={13} className={scope.siteId === 'all' ? 'text-cyan-400' : 'text-slate-400'} />
                <span className="text-xs">All Sites (Global Enterprise)</span>
              </div>
              {scope.siteId === 'all' && <Check size={13} className="text-cyan-400" />}
            </button>

            {/* Individual Sites */}
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  selectSite(site.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                  scope.siteId === site.id
                    ? 'bg-cyan-950/60 border border-cyan-700/50 text-cyan-200 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getSiteStatusDot(site.status)} shrink-0`} />
                  <div>
                    <div className="font-mono text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{site.name}</span>
                      <span className="text-[10px] font-normal text-slate-400">({site.code})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {site.assetsCount.toLocaleString()} Assets • {site.eps.toLocaleString()} EPS • {site.activeDetections} Detections
                    </div>
                  </div>
                </div>
                {scope.siteId === site.id && <Check size={13} className="text-cyan-400 shrink-0 ml-2" />}
              </button>
            ))}
          </div>

          {/* Zones Section (if site is selected) */}
          {scope.siteId !== 'all' && currentSite && (
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-0.5 flex items-center justify-between">
                <span>Purdue OT/IT Zones</span>
                <span className="text-[9px] text-slate-400 font-normal">
                  {currentSite.zones.length} Zones Defined
                </span>
              </div>

              {/* All Zones in current site */}
              <button
                onClick={() => {
                  selectZone('all');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                  scope.zoneId === 'all'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-mono">
                  <Layers size={12} className="text-slate-400" />
                  <span className="text-xs">All Zones ({currentSite.name})</span>
                </div>
                {scope.zoneId === 'all' && <Check size={12} className="text-cyan-400" />}
              </button>

              {/* Individual Zones */}
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {currentSite.zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      selectZone(zone.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      scope.zoneId === zone.id
                        ? 'bg-cyan-950/70 border border-cyan-800/50 text-cyan-200 font-semibold'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${getSiteStatusDot(zone.status)}`} />
                      <div>
                        <div className="font-mono text-xs text-slate-200">{zone.name}</div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {zone.purdueLevel} • {zone.assetCount} assets
                        </div>
                      </div>
                    </div>
                    {scope.zoneId === zone.id && <Check size={12} className="text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
