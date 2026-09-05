import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Play,
  CheckCircle2,
  Code,
  Check,
  Radio,
  FileCode,
  Save,
} from 'lucide-react';
import { syslogService } from '../services/syslogService';
import { NavigationSection } from '../types';

interface SyslogParserAssistantViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const SyslogParserAssistantView: React.FC<SyslogParserAssistantViewProps> = ({ onNavigate }) => {
  const [rawSample, setRawSample] = useState(
    '<134>1 2026-09-02T10:48:58Z APP-LOG-01 sshd 14820 - - Accepted publickey for ansible from 10.10.0.5 port 49120 ssh2: RSA SHA256:4f8a...9e'
  );
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const samplePresets = [
    {
      name: 'Linux OpenSSH RFC5424',
      sample:
        '<134>1 2026-09-02T10:48:58Z APP-LOG-01 sshd 14820 - - Accepted publickey for ansible from 10.10.0.5 port 49120 ssh2: RSA SHA256:4f8a...9e',
    },
    {
      name: 'Palo Alto / Cisco ASA Firewall',
      sample:
        'Sep 02 10:49:12 FW-HQ-01 %ASA-4-106023: Deny tcp src outside:192.168.40.88/54210 dst inside:10.20.4.42/445 by access-group "OUT_IN"',
    },
    {
      name: 'Key-Value Delimited Log',
      sample:
        '2026-09-02 10:49:12 USER=john.doe ACTION=LOGIN SOURCE_IP=10.1.2.3 AUTH_MECHANISM=NTLM_V2 STATUS=SUCCESS',
    },
  ];

  const handleTestParser = async () => {
    setParsing(true);
    const res = await syslogService.testParser(rawSample);
    setParseResult(res);
    setParsing(false);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('syslog')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Syslog"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold text-slate-100">Syslog Parser Assistant</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-bold">
                ECS SCHEMA NORMALIZER
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Interactive test bench to analyze raw unstructured syslog messages and generate regex/Grok field extractors
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!parseResult}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Save size={13} />
          <span>Save Parser Definition</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Parser definition compiled and assigned to syslog normalization pipeline.</span>
        </div>
      )}

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
        <span className="text-slate-400">Load Sample:</span>
        {samplePresets.map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setRawSample(p.sample);
              setParseResult(null);
            }}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 cursor-pointer transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Raw Input Box & Run Button */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Raw Syslog Message Sample
          </label>
          <button
            onClick={handleTestParser}
            disabled={parsing || !rawSample.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <Play size={12} className={parsing ? 'animate-spin' : ''} />
            <span>{parsing ? 'Parsing...' : 'Test & Extract Fields'}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={rawSample}
          onChange={(e) => setRawSample(e.target.value)}
          className="w-full p-3 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none select-all"
        />
      </div>

      {/* Output Results */}
      {parseResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono">
          {/* Extracted Fields */}
          <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Extracted Raw Token Fields
              </h3>
              <span className="text-[10px] text-cyan-400">{parseResult.confidence}% confidence</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {Object.entries(parseResult.extractedFields).map(([k, v]) => (
                <div key={k} className="p-2 rounded bg-[#0b1017] border border-slate-800 flex justify-between">
                  <span className="text-slate-400 text-[11px]">{k}:</span>
                  <span className="text-slate-100 font-bold">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Normalized Elastic Common Schema (ECS) Mappings */}
          <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Normalized ECS Schema Target
              </h3>
              <span className="text-[10px] text-emerald-400">{parseResult.recommendedParser}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {Object.entries(parseResult.normalizedMapping).map(([ecsField, rawField]) => (
                <div key={ecsField} className="p-2 rounded bg-[#0b1017] border border-slate-800 flex justify-between">
                  <span className="text-cyan-300 font-bold">{ecsField}</span>
                  <span className="text-slate-400">&larr; ${String(rawField)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
