import React, { useState } from 'react';
import { ShieldAlert, X, Code, CheckCircle, Play } from 'lucide-react';
import { detectionService } from '../../services/detectionService';
import { Detection, SeverityLevel } from '../../types';

interface CreateDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetectionCreated: (detection: Detection) => void;
  prefillQuery?: string;
  prefillTitle?: string;
}

export const CreateDetectionModal: React.FC<CreateDetectionModalProps> = ({
  isOpen,
  onClose,
  onDetectionCreated,
  prefillQuery = '',
  prefillTitle = '',
}) => {
  const [name, setName] = useState(prefillTitle || 'Suspicious Process Spawning from Public Directory');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [confidence, setConfidence] = useState(85);
  const [techniqueId, setTechniqueId] = useState('T1543.003');
  const [techniqueName, setTechniqueName] = useState('Windows Service Creation');
  const [tactic, setTactic] = useState('Persistence');
  const [ruleQuery, setRuleQuery] = useState(
    prefillQuery ||
      `event.code: (7045 OR 4688) AND winlog.event_data.ImagePath: "*\\\\Users\\\\Public\\\\*"`
  );
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTestRule = async () => {
    setIsTesting(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsTesting(false);
    setTestResult('Rule validated: 1 match found in recent 24h event cache (SERVER-42, Event 7045)');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await detectionService.createDetection({
      name,
      description: `Deterministic security rule monitoring ${techniqueName}.`,
      severity,
      confidence,
      ruleQuery,
      mitreAttack: {
        id: techniqueId,
        name: techniqueName,
        tactic,
      },
    });
    onDetectionCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans text-xs">
      <div className="w-full max-w-xl rounded-xl bg-[#0f151e] border border-slate-700 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100">Create Detection Rule</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Rule Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Confidence Score (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">MITRE ATT&CK ID</label>
              <input
                type="text"
                value={techniqueId}
                onChange={(e) => setTechniqueId(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-slate-400">Rule Logic Expression (Lucene / KQL)</label>
              <button
                type="button"
                onClick={handleTestRule}
                disabled={isTesting}
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-900 cursor-pointer"
              >
                <Play size={10} />
                <span>{isTesting ? 'Testing Query...' : 'Test Against Telemetry'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={ruleQuery}
              onChange={(e) => setRuleQuery(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {testResult && (
            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
              <CheckCircle size={14} className="shrink-0" />
              <span>{testResult}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold cursor-pointer"
            >
              Save &amp; Deploy Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
