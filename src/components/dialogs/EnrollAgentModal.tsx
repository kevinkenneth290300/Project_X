import React from 'react';
import { Server, X } from 'lucide-react';
import { Agent } from '../../types';

interface EnrollAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentEnrolled: (agent: Agent) => void;
}

export const EnrollAgentModal: React.FC<EnrollAgentModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans text-xs">
      <div role="dialog" aria-modal="true" aria-labelledby="agent-enrollment-title" aria-describedby="agent-enrollment-unavailable" onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }} className="w-full max-w-lg rounded-lg bg-[#0f151e] border border-slate-700 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-cyan-400" />
            <h3 id="agent-enrollment-title" className="font-mono text-sm font-bold text-slate-100">Agent Enrollment Unavailable</h3>
          </div>
          <button onClick={onClose} aria-label="Close enrollment dialog" autoFocus className="text-slate-400 hover:text-slate-200 p-1">
            <X size={16} />
          </button>
        </div>

        <p id="agent-enrollment-unavailable" role="status" className="text-amber-300 font-mono leading-relaxed">
          Enrollment is unavailable. This console has no endpoint-agent installer, enrollment credentials, or operational enrollment API. No host will be registered or profile deployed.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs">Close</button>
          <button type="button" disabled aria-describedby="agent-enrollment-unavailable" className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs cursor-not-allowed">
            <Server size={13} /> Enroll Host
          </button>
        </div>
      </div>
    </div>
  );
};
