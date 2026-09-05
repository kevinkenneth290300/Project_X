import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Server,
  Layers,
  SearchCheck,
  ArrowRight,
} from 'lucide-react';
import { NavigationSection } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const isServer42 = normalizedQuery.includes('42') || normalizedQuery.includes('server-42');

  return (
    <div className="fixed inset-0 bg-black/85 flex items-start justify-center pt-20 z-50 p-4">
      <div className="w-full max-w-3xl rounded-sm bg-[#151517] border border-[#242426] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#242426] bg-[#151517]">
          <Search size={18} className="text-[#8E9299] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hosts, users, events, investigations, detections, IPs, processes..."
            className="w-full bg-transparent text-sm text-white placeholder-[#5A5A5E] focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8E9299] hover:text-white text-xs px-2 py-0.5 rounded-sm mr-2"
            >
              Clear
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-[#1A1A1D] text-[#8E9299] rounded-sm border border-[#242426]">
            ESC
          </kbd>
        </div>

        {/* Quick Filters / Shortcuts */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#242426] bg-[#0B0B0C] text-[11px] font-mono text-[#8E9299] overflow-x-auto">
          <span className="text-[#5A5A5E]">Quick:</span>
          <button
            onClick={() => setQuery('SERVER-42')}
            className="px-2 py-0.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] text-white border border-[#242426] transition-colors"
          >
            SERVER-42
          </button>
          <button
            onClick={() => setQuery('INV-000142')}
            className="px-2 py-0.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] text-[#F2994A] border border-[#242426] transition-colors"
          >
            INV-000142
          </button>
          <button
            onClick={() => setQuery('Event 7045')}
            className="px-2 py-0.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] text-white border border-[#242426] transition-colors"
          >
            Event 7045 (Service)
          </button>
          <button
            onClick={() => setQuery('CORP\\admin')}
            className="px-2 py-0.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] text-white border border-[#242426] transition-colors"
          >
            CORP\admin
          </button>
          <button
            onClick={() => setQuery('powershell.exe')}
            className="px-2 py-0.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] text-white border border-[#242426] transition-colors"
          >
            powershell.exe
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs font-sans">
          {/* Specific Showcase for SERVER-42 if matched */}
          {(isServer42 || !query) && (
            <div className="rounded-sm bg-[#1A1A1D] border border-[#242426] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-sm bg-[#242426] border border-[#3A3A3C] text-white">
                    <Server size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <span>SERVER-42</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[#27AE60]/15 text-[#27AE60] border border-[#27AE60]/40">
                        Healthy (Investigation Mode)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E9299] font-mono">10.20.4.42 • Windows Server 2022 • US-East-DC1</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('agent-detail');
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-sm bg-[#E64848] hover:bg-[#D43D3D] text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  <span>Open Agent</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Aggregated host summary */}
              <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div
                  onClick={() => {
                    onClose();
                    onNavigate('events');
                  }}
                  className="p-2 rounded-sm bg-[#151517] border border-[#242426] hover:border-[#3A3A3C] cursor-pointer"
                >
                  <div className="text-[#8E9299] text-[10px]">Total Events</div>
                  <div className="font-bold text-white text-sm">17,421</div>
                  <div className="text-[10px] text-white">View Events &rarr;</div>
                </div>
                <div
                  onClick={() => {
                    onClose();
                    onNavigate('investigations');
                  }}
                  className="p-2 rounded-sm bg-[#151517] border border-[#242426] hover:border-[#3A3A3C] cursor-pointer"
                >
                  <div className="text-[#8E9299] text-[10px]">Investigations</div>
                  <div className="font-bold text-[#F2994A] text-sm">3 Total</div>
                  <div className="text-[10px] text-[#F2994A]">INV-000142 Active</div>
                </div>
                <div
                  onClick={() => {
                    onClose();
                    onNavigate('detections');
                  }}
                  className="p-2 rounded-sm bg-[#151517] border border-[#242426] hover:border-[#3A3A3C] cursor-pointer"
                >
                  <div className="text-[#8E9299] text-[10px]">Detections</div>
                  <div className="font-bold text-[#E64848] text-sm">2 Triggered</div>
                  <div className="text-[10px] text-[#E64848]">T1543.003, T1562</div>
                </div>
                <div
                  onClick={() => {
                    onClose();
                    onNavigate('agent-detail');
                  }}
                  className="p-2 rounded-sm bg-[#151517] border border-[#242426] hover:border-[#3A3A3C] cursor-pointer"
                >
                  <div className="text-[#8E9299] text-[10px]">Live Telemetry</div>
                  <div className="font-bold text-[#27AE60] text-sm">87 ev/sec</div>
                  <div className="text-[10px] text-[#8E9299]">Queue: 18 MB</div>
                </div>
              </div>
            </div>
          )}

          {/* Investigations Results */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E9299] mb-1.5 flex items-center gap-1.5">
              <SearchCheck size={13} className="text-[#F2994A]" />
              <span>Matching Investigations</span>
            </div>
            <div className="space-y-1.5">
              <div
                onClick={() => {
                  onClose();
                  onNavigate('investigation-detail');
                }}
                className="p-2.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] hover:border-[#3A3A3C] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-sm font-mono text-[11px] bg-[#E64848]/15 border border-[#E64848]/40 text-[#E64848]">
                    HIGH
                  </span>
                  <div>
                    <div className="font-mono text-white font-semibold">
                      INV-000142: Suspicious Service Installation
                    </div>
                    <div className="text-[11px] text-[#8E9299]">Host: SERVER-42 • 5 Evidence Items • AI Confidence 87%</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-white flex items-center gap-1">
                  Open Workspace <ArrowRight size={12} />
                </span>
              </div>

              <div
                onClick={() => {
                  onClose();
                  onNavigate('investigations');
                }}
                className="p-2.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] hover:border-[#3A3A3C] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-sm font-mono text-[11px] bg-[#F2994A]/15 border border-[#F2994A]/40 text-[#F2994A]">
                    HIGH
                  </span>
                  <div>
                    <div className="font-mono text-white font-semibold">
                      INV-000141: Unusual Privileged Login
                    </div>
                    <div className="text-[11px] text-[#8E9299]">Host: DC-02 • Created by CORP\svc_backup</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-white flex items-center gap-1">
                  Open <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>

          {/* Events Results */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E9299] mb-1.5 flex items-center gap-1.5">
              <Layers size={13} className="text-[#8E9299]" />
              <span>Matching Windows Events</span>
            </div>
            <div className="space-y-1.5">
              <div
                onClick={() => {
                  onClose();
                  onNavigate('event-detail');
                }}
                className="p-2.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] hover:border-[#3A3A3C] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-sm font-mono text-[11px] bg-[#E64848]/15 border border-[#E64848]/40 text-[#E64848] font-bold">
                    ID 7045
                  </span>
                  <div>
                    <div className="font-mono text-white">
                      Service Installation: UpdaterSvc (C:\Users\Public\updater.exe)
                    </div>
                    <div className="text-[11px] text-[#8E9299] font-mono">
                      SERVER-42 • User: CORP\admin • System Channel • 10:42:17 UTC
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-white flex items-center gap-1">
                  Event Detail <ArrowRight size={12} />
                </span>
              </div>

              <div
                onClick={() => {
                  onClose();
                  onNavigate('events');
                }}
                className="p-2.5 rounded-sm bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] hover:border-[#3A3A3C] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-sm font-mono text-[11px] bg-[#F2994A]/15 border border-[#F2994A]/40 text-[#F2994A] font-bold">
                    ID 4688
                  </span>
                  <div>
                    <div className="font-mono text-white">
                      Process Creation: powershell.exe -NoP -NonI -W Hidden -Enc...
                    </div>
                    <div className="text-[11px] text-[#8E9299] font-mono">SERVER-42 • Security Channel • 10:42:11 UTC</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-white flex items-center gap-1">
                  Explore <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Instructions */}
        <div className="p-3 border-t border-[#242426] bg-[#0B0B0C] flex items-center justify-between text-[11px] font-mono text-[#8E9299]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#1A1A1D] rounded-sm border border-[#242426] text-white mr-1">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#1A1A1D] rounded-sm border border-[#242426] text-white mr-1">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-[#5A5A5E]">Cross-indexed telemetry index</span>
        </div>
      </div>
    </div>
  );
};

