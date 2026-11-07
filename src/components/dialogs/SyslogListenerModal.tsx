import React, { useState } from 'react';
import { Radio, X, AlertTriangle } from 'lucide-react';

interface SyslogListenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SyslogListenerModal: React.FC<SyslogListenerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [protocol, setProtocol] = useState<'UDP' | 'TCP' | 'TCP TLS'>('TCP TLS');
  const [port, setPort] = useState(6514);
  const [bufferSize, setBufferSize] = useState('1.0 GB');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans text-xs">
      <div role="dialog" aria-modal="true" aria-labelledby="sample-listener-title" aria-describedby="sample-listener-unavailable" className="w-full max-w-md rounded-lg bg-[#0f151e] border border-slate-700 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio size={18} className="text-cyan-400" />
            <h3 id="sample-listener-title" className="font-mono text-sm font-bold text-slate-100">Sample Listener Preferences</h3>
          </div>
          <button onClick={onClose} aria-label="Close sample listener dialog" className="text-slate-400 hover:text-slate-200 p-1">
            <X size={16} />
          </button>
        </div>

        <p id="sample-listener-unavailable" role="status" className="text-amber-300 font-mono text-xs">Listener startup and TLS validation are unavailable. Preferences are local samples; no port is opened or policy applied.</p>

        <div className="space-y-3 font-mono">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Protocol / Transport</label>
            <div className="grid grid-cols-3 gap-2">
              {(['UDP', 'TCP', 'TCP TLS'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setProtocol(p);
                    if (p === 'TCP TLS') setPort(6514);
                    else setPort(514);
                  }}
                  className={`p-2 rounded border text-xs text-center cursor-pointer transition-colors ${
                    protocol === p
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Listen Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Queue Buffer</label>
              <select
                value={bufferSize}
                onChange={(e) => setBufferSize(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="512 MB">512 MB</option>
                <option value="1.0 GB">1.0 GB (Recommended)</option>
                <option value="2.0 GB">2.0 GB (High Volume)</option>
              </select>
            </div>
          </div>

          {protocol === 'TCP TLS' && (
            <div className="p-2.5 rounded bg-slate-900 border border-cyan-900/50 text-[11px] text-cyan-300 flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>TLS and mutual authentication are not configured or verified.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled
              aria-describedby="sample-listener-unavailable"
              className="px-4 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Start Listener
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
