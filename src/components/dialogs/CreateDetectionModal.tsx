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
  const [techniqueId, setTechniqueId] = useState('T1543.003');
  const [techniqueName, setTechniqueName] = useState('Windows Service Creation');
  const [tactic, setTactic] = useState('Persistence');
  const [ruleQuery, setRuleQuery] = useState(
    prefillQuery ||
      `event.code: (7045 OR 4688) AND winlog.event_data.ImagePath: "*\\\\Users\\\\Public\\\\*"`
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await detectionService.createDetection({
        name,
        description: `Local sample definition for ${techniqueName}; not deployed or evaluated.`,
        severity,
        ruleQuery,
        mitreAttack: { id: techniqueId, name: techniqueName, tactic },
      });
      onDetectionCreated(created);
      onClose();
    } catch {
      setSubmitError('Unable to save the local sample definition. A rule name and logic are required.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans text-xs">
      <div role="dialog" aria-modal="true" aria-labelledby="sample-detection-title" aria-describedby="sample-detection-unavailable" className="w-full max-w-xl rounded-lg bg-[#0f151e] border border-slate-700 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-400" />
            <h3 id="sample-detection-title" className="font-mono text-sm font-bold text-slate-100">Create Sample Detection Definition</h3>
          </div>
          <button onClick={onClose} aria-label="Close sample definition editor" className="text-slate-400 hover:text-slate-200 p-1">
            <X size={16} />
          </button>
        </div>

        <p id="sample-detection-unavailable" role="status" className="text-amber-300 font-mono text-xs">
          Validation, backtesting, and deployment are unavailable. Saved definitions are local demonstrations only, not active rules.
        </p>
        {submitError && <p role="alert" className="text-amber-300">{submitError}</p>}

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

          <div className="grid grid-cols-2 gap-3">
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
                disabled
                aria-describedby="sample-detection-unavailable"
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 cursor-not-allowed"
              >
                <Play size={10} />
                <span>Test Against Telemetry</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={ruleQuery}
              onChange={(e) => setRuleQuery(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

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
              disabled={submitting}
              className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold cursor-pointer"
            >
              {submitting ? 'Saving sample...' : 'Save Sample Definition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
