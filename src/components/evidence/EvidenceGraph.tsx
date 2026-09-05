import React, { useState } from 'react';
import { User, Server, Terminal, Wrench, FileCode, ShieldAlert, ArrowRight, Info } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'host' | 'process' | 'service' | 'file' | 'event';
  subtext?: string;
  evidenceId?: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

interface EvidenceGraphProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  onSelectNode?: (node: GraphNode) => void;
  onOpenEvidence?: (evidenceId: string) => void;
}

export const EvidenceGraph: React.FC<EvidenceGraphProps> = ({
  nodes: customNodes,
  edges: customEdges,
  onSelectNode,
  onOpenEvidence,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n-svc');

  // Default clean linear/branching relationship graph for Investigation INV-000142
  const nodes: GraphNode[] = customNodes || [
    { id: 'n-user', label: 'DOMAIN\\admin', type: 'user', subtext: 'RDP Logon (Type 10)', evidenceId: 'EVID-001' },
    { id: 'n-host', label: 'SERVER-42', type: 'host', subtext: '10.20.4.42 (Win2022)', evidenceId: 'EVID-001' },
    { id: 'n-ps', label: 'powershell.exe', type: 'process', subtext: 'PID 4892 (-Enc Cradle)', evidenceId: 'EVID-003' },
    { id: 'n-svc', label: 'UpdaterSvc', type: 'service', subtext: 'AutoStart (LocalSystem)', evidenceId: 'EVID-004' },
    { id: 'n-bin', label: 'updater.exe', type: 'file', subtext: 'C:\\Users\\Public\\updater.exe', evidenceId: 'EVID-004' },
    { id: 'n-def', label: 'Defender Antivirus', type: 'event', subtext: 'RealTime Disabled', evidenceId: 'EVID-005' },
  ];

  const edges: GraphEdge[] = customEdges || [
    { from: 'n-user', to: 'n-host', label: 'logged in via RDP' },
    { from: 'n-user', to: 'n-ps', label: 'executed' },
    { from: 'n-ps', to: 'n-svc', label: 'installed' },
    { from: 'n-svc', to: 'n-bin', label: 'executes binary' },
    { from: 'n-bin', to: 'n-def', label: 'tampered config' },
  ];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User size={15} className="text-amber-400" />;
      case 'host':
        return <Server size={15} className="text-cyan-400" />;
      case 'process':
        return <Terminal size={15} className="text-sky-400" />;
      case 'service':
        return <Wrench size={15} className="text-rose-400" />;
      case 'file':
        return <FileCode size={15} className="text-indigo-400" />;
      case 'event':
      default:
        return <ShieldAlert size={15} className="text-red-400" />;
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Graph Visual Stage */}
      <div className="rounded-lg bg-[#0b1017] border border-slate-800 p-4 overflow-x-auto">
        <div className="min-w-[650px] flex items-center justify-between relative py-6">
          {/* Connecting Track Line */}
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />

          {nodes.map((node, idx) => {
            const isSelected = node.id === selectedNodeId;
            const nextEdge = edges.find((e) => e.from === node.id);

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    if (onSelectNode) onSelectNode(node);
                  }}
                  className={`relative z-10 flex flex-col items-center cursor-pointer transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-lg border flex items-center justify-center shadow-lg transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/30'
                        : 'bg-[#0f151e] border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="text-center mt-2">
                    <div className="font-mono text-[11px] font-semibold text-slate-200">{node.label}</div>
                    <div className="font-mono text-[9px] text-slate-400 max-w-[90px] truncate">{node.subtext}</div>
                  </div>
                </div>

                {/* Edge Label */}
                {idx < nodes.length - 1 && nextEdge && (
                  <div className="relative z-10 flex flex-col items-center px-1">
                    <span className="text-[10px] font-mono text-cyan-400/90 bg-[#0b1017] px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap shadow-xs">
                      {nextEdge.label} &rarr;
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Bar */}
      {selectedNode && (
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-700">{getNodeIcon(selectedNode.type)}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-100 font-semibold">{selectedNode.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                  {selectedNode.type}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans mt-0.5">{selectedNode.subtext}</p>
            </div>
          </div>

          {selectedNode.evidenceId && (
            <button
              onClick={() => onOpenEvidence && onOpenEvidence(selectedNode.evidenceId!)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/60 cursor-pointer text-xs"
            >
              <span>Evidence {selectedNode.evidenceId}</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
