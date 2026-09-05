import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  Search,
  Download,
  FileCheck,
  ShieldCheck,
  Server,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Hash,
  CheckCircle2,
} from 'lucide-react';
import { EvidenceItem, NavigationSection } from '../types';
import { evidenceService } from '../services/evidenceService';
import { SeverityBadge } from '../components/severity/SeverityBadge';

interface EvidenceViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectEvent: (eventId: string) => void;
  onSelectInvestigation: (invId: string) => void;
}

// Deterministic mock hash helper for evidence display
const getEvidenceHash = (id: string, eventId: number) => {
  const hashes: Record<string, string> = {
    'EVID-001': '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    'EVID-002': 'd57fe2b947c0ea4e8b4f9e1c0ded4a3d721162114671a0b5ab34b1cef01edd60',
    'EVID-003': '35293297a7a3b38ef040003b41d24a926d83501a4e1d533ab99a80b06a099a5e',
    'EVID-004': 'a1945d83777bc89d81d2df524b0744e88383e6a2569e5d7990b79cfb7b62fb9c',
    'EVID-005': '1a72d3f746194602f06a0fd62923595b11122a61369cfd6ae6be719875f6d893',
  };
  return hashes[id] || `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
};

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  onNavigate,
  onSelectEvent,
  onSelectInvestigation,
}) => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEv = async () => {
      setLoading(true);
      const data = await evidenceService.getEvidenceItems();
      setEvidence(data);
      setLoading(false);
    };
    fetchEv();
  }, []);

  const searchTarget = (search || '').trim().toLowerCase();
  const filtered = evidence.filter((e) => {
    if (!searchTarget) return true;
    return (
      (e.id || '').toLowerCase().includes(searchTarget) ||
      (e.title || '').toLowerCase().includes(searchTarget) ||
      (e.category || '').toLowerCase().includes(searchTarget) ||
      (e.host || '').toLowerCase().includes(searchTarget) ||
      (e.summary || '').toLowerCase().includes(searchTarget) ||
      String(e.eventId || '').includes(searchTarget) ||
      getEvidenceHash(e.id, e.eventId).includes(searchTarget)
    );
  });

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#242426]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-base font-bold text-[#EDEDED] tracking-tight">Evidence Vault &amp; Chain of Custody</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102A1C] border border-[#27AE60]/40 text-[#27AE60] font-semibold">
              CRYPTOGRAPHIC PRESERVATION
            </span>
          </div>
          <p className="text-[#8E9299] text-xs mt-0.5">
            Immutable Windows telemetry artifacts preserved for forensic admissibility and incident response
          </p>
        </div>
      </div>

      {/* Top Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-lg bg-[#151517] border border-[#242426]">
          <div className="text-[#8E9299] text-[10px] uppercase">Preserved Artifacts</div>
          <div className="text-lg font-bold text-[#EDEDED] mt-0.5">{evidence.length} Items</div>
        </div>
        <div className="p-3 rounded-lg bg-[#151517] border border-[#242426]">
          <div className="text-[#8E9299] text-[10px] uppercase">Integrity Verification</div>
          <div className="text-lg font-bold text-[#27AE60] mt-0.5">100% Valid</div>
        </div>
        <div className="p-3 rounded-lg bg-[#151517] border border-[#242426]">
          <div className="text-[#8E9299] text-[10px] uppercase">Active Cases</div>
          <div className="text-lg font-bold text-[#F2994A] mt-0.5">3 Dossiers</div>
        </div>
        <div className="p-3 rounded-lg bg-[#151517] border border-[#242426]">
          <div className="text-[#8E9299] text-[10px] uppercase">Hashing Algorithm</div>
          <div className="text-lg font-bold text-[#8E9299] mt-0.5">SHA-256</div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-3 rounded-lg bg-[#151517] border border-[#242426] flex items-center justify-between font-mono">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-2.5 text-[#5A5A5E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search evidence ID, host, category, hash..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#1A1A1D] border border-[#242426] text-[#EDEDED] text-xs focus:border-[#4B88FF] focus:outline-none placeholder-[#5A5A5E]"
          />
        </div>
        <span className="text-[11px] text-[#8E9299]">{filtered.length} artifacts indexed</span>
      </div>

      {/* Evidence Table */}
      <div className="rounded-lg bg-[#151517] border border-[#242426] overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111113] text-[10px] text-[#8E9299] uppercase tracking-wider border-b border-[#242426]">
              <tr>
                <th className="px-4 py-3">Evidence ID</th>
                <th className="px-3 py-3">Severity</th>
                <th className="px-3 py-3">Category / Event</th>
                <th className="px-3 py-3">Host</th>
                <th className="px-3 py-3">Timestamp (UTC)</th>
                <th className="px-3 py-3">Summary / Key Detail</th>
                <th className="px-3 py-3">SHA-256 Hash</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Inspect Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242426]">
              {filtered.map((item) => {
                const itemHash = getEvidenceHash(item.id, item.eventId);
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      if (item.eventRecordId) {
                        onSelectEvent(item.eventRecordId);
                      } else if (item.id === 'EVID-001') {
                        onSelectEvent('evt-4624-rdp');
                      } else if (item.id === 'EVID-002') {
                        onSelectEvent('evt-4672-priv');
                      } else if (item.id === 'EVID-003') {
                        onSelectEvent('evt-4688-proc');
                      } else if (item.id === 'EVID-004') {
                        onSelectEvent('evt-7045-svc');
                      } else if (item.id === 'EVID-005') {
                        onSelectEvent('evt-5007-def');
                      }
                      onNavigate('event-detail');
                    }}
                    className="hover:bg-[#1A1A1D] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3 font-bold text-[#4B88FF]">{item.id}</td>
                    <td className="px-3 py-3">
                      <SeverityBadge severity={item.severity || 'Medium'} size="sm" />
                    </td>
                    <td className="px-3 py-3 text-[#EDEDED]">
                      <span className="text-[#8E9299]">Event {item.eventId}:</span> {item.category}
                    </td>
                    <td className="px-3 py-3 text-[#EDEDED] font-semibold">{item.host}</td>
                    <td className="px-3 py-3 text-[#8E9299] text-[11px]">{item.timestamp}</td>
                    <td className="px-3 py-3 text-[#EDEDED] max-w-[260px] truncate" title={item.summary || item.title}>
                      {item.summary || item.title}
                    </td>
                    <td className="px-3 py-3 text-[#5A5A5E] text-[10px] truncate max-w-[120px]" title={itemHash}>
                      {itemHash.slice(0, 16)}...
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#102A1C] border border-[#27AE60]/40 text-[#27AE60] font-semibold">
                        VERIFIED
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-[#4B88FF] text-[11px] font-semibold group-hover:underline">
                      Inspect &rarr;
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
