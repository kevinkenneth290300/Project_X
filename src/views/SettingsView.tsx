import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  HardDrive,
  Shield,
  Layers,
  Key,
  Lock,
  Radio,
  Server,
  KeyRound,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { NavigationSection, AuthProviderConfig } from '../types';
import { authService, MOCK_AUTH_PROVIDERS } from '../services/authService';

interface SettingsViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'collector' | 'pki' | 'retention'>('auth');
  const [selectedProvider, setSelectedProvider] = useState<'ldap' | 'saml' | 'oidc' | 'local'>('ldap');

  // Form states
  const [clusterName, setClusterName] = useState('WARDEN-MASTER-SOC-01');
  const [collectorPort, setCollectorPort] = useState(8443);
  const [logLevel, setLogLevel] = useState('INFO');

  // LDAP Form
  const [ldapHost, setLdapHost] = useState('ldaps://ad01.acme.internal:636');
  const [ldapBaseDn, setLdapBaseDn] = useState('dc=acme,dc=internal');
  const [ldapBindDn, setLdapBindDn] = useState('cn=warden_bind,ou=service_accounts,dc=acme,dc=internal');
  const [ldapUserFilter, setLdapUserFilter] = useState('(&(objectClass=user)(sAMAccountName={0}))');
  const [ldapStartTls, setLdapStartTls] = useState(true);

  // SAML Form
  const [samlEntityId, setSamlEntityId] = useState('https://warden.acme.internal/saml/metadata');
  const [samlSsoUrl, setSamlSsoUrl] = useState('https://acme.okta.com/app/warden/sso/saml');
  const [samlCert, setSamlCert] = useState('-----BEGIN CERTIFICATE-----\nMIIDpDCCAoygAwIBAgIGAY/4zV12MA0GCSqGSIb3DQEBCwUAMIGQMQswCQYDVQQGEwJV\nUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsG\n-----END CERTIFICATE-----');

  // OIDC Form
  const [oidcIssuer, setOidcIssuer] = useState('https://login.microsoftonline.com/acme-tenant-id/v2.0');
  const [oidcClientId, setOidcClientId] = useState('warden-enterprise-console');

  // MFA Form
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [mfaMethods, setMfaMethods] = useState({
    totp: true,
    fido2: true,
    sms: false,
  });

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Platform Configuration</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              SAMPLE CONFIGURATION
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Sample settings only. Authentication, MFA, TLS validation, and collector configuration deployment are unavailable.
          </p>
        </div>

        <button
          disabled
          aria-describedby="settings-operations-unavailable"
          title="Configuration deployment unavailable in this demonstration"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs font-semibold cursor-not-allowed"
        >
          <Save size={13} />
          <span>Save Changes</span>
        </button>
      </div>

      <p id="settings-operations-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Configuration deployment and connection tests are unavailable. Edits are local sample values only; no security controls are enforced.
      </p>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 font-mono text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('auth')}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'auth'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound size={14} />
          <span>Enterprise Authentication &amp; SSO</span>
        </button>

        <button
          onClick={() => setActiveTab('collector')}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'collector'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server size={14} />
          <span>Collector Ingress &amp; Routing</span>
        </button>

        <button
          onClick={() => setActiveTab('pki')}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pki'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield size={14} />
          <span>PKI &amp; TLS Certificates</span>
        </button>
      </div>

      {/* Tab 1: Enterprise Authentication */}
      {activeTab === 'auth' && (
        <div className="space-y-4">
          {/* Provider Selection Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 font-mono">
            <button
              onClick={() => setSelectedProvider('ldap')}
              className={`p-3 rounded-lg text-left transition-all cursor-pointer border ${
                selectedProvider === 'ldap'
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                  : 'bg-[#0f151e] border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="font-bold text-xs">Active Directory / LDAP</div>
              <div className="text-[10px] text-slate-400 mt-1">Direct Domain Controller Bind</div>
            </button>

            <button
              onClick={() => setSelectedProvider('saml')}
              className={`p-3 rounded-lg text-left transition-all cursor-pointer border ${
                selectedProvider === 'saml'
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                  : 'bg-[#0f151e] border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="font-bold text-xs">SAML 2.0 (Okta / Ping)</div>
              <div className="text-[10px] text-slate-400 mt-1">Federated Single Sign-On</div>
            </button>

            <button
              onClick={() => setSelectedProvider('oidc')}
              className={`p-3 rounded-lg text-left transition-all cursor-pointer border ${
                selectedProvider === 'oidc'
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                  : 'bg-[#0f151e] border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="font-bold text-xs">OpenID Connect (OIDC)</div>
              <div className="text-[10px] text-slate-400 mt-1">Microsoft Entra ID / Google</div>
            </button>

            <button
              onClick={() => setSelectedProvider('local')}
              className={`p-3 rounded-lg text-left transition-all cursor-pointer border ${
                selectedProvider === 'local'
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                  : 'bg-[#0f151e] border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="font-bold text-xs">Emergency Local Auth</div>
              <div className="text-[10px] text-slate-400 mt-1">Air-Gapped Break-Glass</div>
            </button>
          </div>

          {/* Active Directory / LDAP Settings Form */}
          {selectedProvider === 'ldap' && (
            <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Active Directory / LDAP Federation Parameters
                </span>
                <span className="text-[10px] text-amber-300 font-bold">UNAVAILABLE (DEMO)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">LDAP Server Host &amp; Port *</label>
                  <input
                    type="text"
                    value={ldapHost}
                    onChange={(e) => setLdapHost(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Search Base DN *</label>
                  <input
                    type="text"
                    value={ldapBaseDn}
                    onChange={(e) => setLdapBaseDn(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Bind User Distinguished Name (DN)</label>
                <input
                  type="text"
                  value={ldapBindDn}
                  onChange={(e) => setLdapBindDn(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Bind Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••••••••••"
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">User Search Filter</label>
                  <input
                    type="text"
                    value={ldapUserFilter}
                    onChange={(e) => setLdapUserFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Test Connection Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled
                  aria-describedby="settings-operations-unavailable"
                  title="LDAP, TLS handshake, and bind validation are unavailable"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 text-slate-400 border border-slate-700 font-semibold cursor-not-allowed"
                >
                  <Play size={12} />
                  <span>Test Connection &amp; Bind</span>
                </button>
              </div>
            </div>
          )}

          {/* SAML 2.0 Form */}
          {selectedProvider === 'saml' && (
            <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  SAML 2.0 Single Sign-On (Okta / PingFederate)
                </span>
                <span className="text-[10px] text-amber-300 font-bold">NOT DEPLOYED (DEMO)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Service Provider Entity ID</label>
                  <input
                    type="text"
                    value={samlEntityId}
                    onChange={(e) => setSamlEntityId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">IdP Single Sign-On URL</label>
                  <input
                    type="text"
                    value={samlSsoUrl}
                    onChange={(e) => setSamlSsoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Identity Provider X.509 Certificate</label>
                <textarea
                  rows={4}
                  value={samlCert}
                  onChange={(e) => setSamlCert(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* OIDC Form */}
          {selectedProvider === 'oidc' && (
            <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  OpenID Connect (Microsoft Entra ID / Google Cloud Identity)
                </span>
                <span className="text-[10px] text-amber-300 font-bold">UNAVAILABLE (DEMO)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">OIDC Issuer Authority URL</label>
                  <input
                    type="text"
                    value={oidcIssuer}
                    onChange={(e) => setOidcIssuer(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Client ID</label>
                  <input
                    type="text"
                    value={oidcClientId}
                    onChange={(e) => setOidcClientId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Local Emergency Form */}
          {selectedProvider === 'local' && (
            <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Break-Glass Emergency Local Accounts
                </span>
                <span className="text-[10px] text-amber-300 font-bold">UNAVAILABLE (DEMO)</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Local authentication is unavailable. These are sample settings, not protected emergency accounts.
              </p>
            </div>
          )}

          {/* Multi-Factor Authentication (MFA) Settings */}
          <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Multi-Factor Authentication (MFA) Policies
              </span>
              <span className="text-[10px] text-amber-300 font-bold">NOT ENFORCED (DEMO)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">FIDO2 / WebAuthn</span>
                  <input
                    type="checkbox"
                    checked={mfaMethods.fido2}
                    onChange={(e) => setMfaMethods({ ...mfaMethods, fido2: e.target.checked })}
                    className="accent-cyan-500"
                  />
                </div>
                <div className="text-[10px] text-slate-400">YubiKey &amp; hardware security keys</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">TOTP Authenticator</span>
                  <input
                    type="checkbox"
                    checked={mfaMethods.totp}
                    onChange={(e) => setMfaMethods({ ...mfaMethods, totp: e.target.checked })}
                    className="accent-cyan-500"
                  />
                </div>
                <div className="text-[10px] text-slate-400">RFC 6238 time-based tokens</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">SMS Verification</span>
                  <input
                    type="checkbox"
                    checked={mfaMethods.sms}
                    onChange={(e) => setMfaMethods({ ...mfaMethods, sms: e.target.checked })}
                    className="accent-cyan-500"
                  />
                </div>
                <div className="text-[10px] text-rose-400 font-semibold">Disabled (NIST SP 800-63B)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Collector Ingress */}
      {activeTab === 'collector' && (
        <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 space-y-4 font-mono">
          <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
            Cluster &amp; Agent Control Plane
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Cluster Identifier</label>
              <input
                type="text"
                value={clusterName}
                onChange={(e) => setClusterName(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Sample Collector Port (Not Listening)</label>
              <input
                type="number"
                value={collectorPort}
                onChange={(e) => setCollectorPort(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PKI */}
      {activeTab === 'pki' && (
        <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 space-y-4 font-mono">
          <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
            PKI &amp; Certificate Authority
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Root CA:</span>
              <span className="text-cyan-300 font-bold">Warden Enclave Internal Root CA G3</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Fingerprint:</span>
              <span className="text-slate-300 font-mono text-[11px]">Unavailable</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Expiration:</span>
              <span className="text-slate-400 font-bold">Unavailable</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Agent mTLS Validation:</span>
              <span className="text-amber-300 font-bold">Unavailable (demo)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
