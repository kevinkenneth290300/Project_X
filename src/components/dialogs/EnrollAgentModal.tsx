import React, { useState } from 'react';
import { Server, X, Shield, Key, Check, Copy } from 'lucide-react';
import { agentService } from '../../services/agentService';
import { Agent } from '../../types';

interface EnrollAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentEnrolled: (agent: Agent) => void;
}

export const EnrollAgentModal: React.FC<EnrollAgentModalProps> = ({
  isOpen,
  onClose,
  onAgentEnrolled,
}) => {
  const [hostname, setHostname] = useState('SERVER-99');
  const [ip, setIp] = useState('10.20.4.99');
  const [site, setSite] = useState('US-East-DC1');
  const [os, setOs] = useState('Windows Server 2022 Datacenter (Build 20348.1607)');
  const [profileId, setProfileId] = useState('profile-baseline');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const installCommand = `msiexec.exe /i "WardenAgent-v0.1.0-x64.msi" /qn WARDEN_ENDPOINT="https://warden.corp:3000/api/v1/telemetry" ENROLL_KEY="wrden_sec_9f81a7b8e21c" PROFILE="${profileId}"`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newAgent = await agentService.enrollAgent({
        hostname,
        ip,
        site,
        os,
        profileId,
      });
      onAgentEnrolled(newAgent);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans text-xs">
      <div className="w-full max-w-lg rounded-xl bg-[#0f151e] border border-slate-700 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100">Enroll Windows Telemetry Agent</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Hostname *</label>
              <input
                type="text"
                required
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">IPv4 Address *</label>
              <input
                type="text"
                required
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Site / Enclave</label>
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="US-East-DC1">US-East-DC1</option>
                <option value="US-West-DC2">US-West-DC2</option>
                <option value="EU-Frankfurt-DC3">EU-Frankfurt-DC3</option>
                <option value="Plant-Substation-North">Plant-Substation-North</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Initial Collection Profile</label>
              <select
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="profile-baseline">Windows Server Baseline (78%)</option>
                <option value="profile-dc">Domain Controller (91%)</option>
                <option value="profile-ps">PowerShell Investigation (High)</option>
                <option value="profile-investigation">Incident Response / IR (Maximum)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Operating System</label>
            <input
              type="text"
              value={os}
              onChange={(e) => setOs(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-cyan-400">
                <Key size={12} /> Silent MSI Deployment Command:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800/80 overflow-x-auto whitespace-pre-wrap select-all">
              {installCommand}
            </pre>
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
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : '+ Enroll Host'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
