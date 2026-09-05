import React, { useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  Key,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Layers,
  Search,
  Check,
  X,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { User, RoleDefinition, NavigationSection } from '../types';
import { authService, MOCK_USERS, MOCK_ROLES } from '../services/authService';
import { useScope } from '../context/ScopeContext';

interface UsersViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ onNavigate }) => {
  const { sites } = useScope();
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  const [newUserData, setNewUserData] = useState({
    name: '',
    username: '',
    email: '',
    roleId: 'soc-analyst',
    siteScope: 'all',
    authProvider: 'Active Directory (LDAP)' as const,
  });

  const filteredUsers = users.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.roleName.toLowerCase().includes(q) ||
        u.siteScope.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleProvisionUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.username) return;
    const selectedRole = roles.find((r) => r.id === newUserData.roleId) || roles[0];
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserData.name,
      username: newUserData.username.toLowerCase(),
      email: newUserData.email || `${newUserData.username.toLowerCase()}@acme.internal`,
      roleId: selectedRole.id,
      roleName: selectedRole.name,
      siteScope: newUserData.siteScope === 'all' ? 'All Sites (Global)' : 'Chennai Plant',
      authProvider: newUserData.authProvider,
      mfaEnabled: true,
      mfaMethod: 'TOTP / Authenticator App',
      lastLogin: 'Just now',
      status: 'Active',
    };
    setUsers([newUser, ...users]);
    setShowProvisionModal(false);
  };

  const matrixPermissions = [
    { key: 'view_telemetry', label: 'View Live Telemetry & Events', category: 'Telemetry' },
    { key: 'manage_agents', label: 'Manage Agent Collection Profiles', category: 'Telemetry' },
    { key: 'trigger_ir', label: 'Trigger IR Investigation Mode', category: 'Security' },
    { key: 'export_evidence', label: 'Export Signed Evidence Dossiers', category: 'Security' },
    { key: 'manage_zones', label: 'Create & Modify OT/IT Zones', category: 'OT Operations' },
    { key: 'manage_snmp', label: 'Configure SNMP v2c/v3 Parameters', category: 'OT Operations' },
    { key: 'manage_users', label: 'Provision Users & Assign Roles', category: 'Administration' },
    { key: 'configure_auth', label: 'Configure SSO (LDAP / SAML / OIDC)', category: 'Administration' },
  ];

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Access Control &amp; RBAC</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              HIERARCHICAL PERMISSIONS
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Role-based operational access control, plant-level scope scoping, and enterprise identity federation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProvisionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>Provision User</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={14} />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck size={14} />
          <span>RBAC Permission Matrix</span>
        </button>
      </div>

      {/* Tab 1: User Directory */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 font-mono">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name, email, role, or site scope..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-xl bg-[#0f151e] border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0b1017] text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3 font-semibold">User Identity</th>
                    <th className="py-2.5 px-3 font-semibold">Role</th>
                    <th className="py-2.5 px-3 font-semibold">Site Scope</th>
                    <th className="py-2.5 px-3 font-semibold">Identity Provider</th>
                    <th className="py-2.5 px-3 font-semibold">MFA Method</th>
                    <th className="py-2.5 px-3 font-semibold">Last Login</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-100">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </td>

                      <td className="py-2.5 px-3 font-bold text-cyan-300">{u.roleName}</td>

                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-slate-200">
                          <Building2 size={12} className="text-slate-400" />
                          <span>{u.siteScope}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-300">{u.authProvider}</td>

                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {u.mfaMethod}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-400 text-[10px]">{u.lastLogin}</td>

                      <td className="py-2.5 px-3">
                        <span className="text-emerald-400 font-semibold">{u.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === 'matrix' && (
        <div className="rounded-xl bg-[#0f151e] border border-slate-800 p-4 shadow-sm space-y-3 font-mono">
          <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Role Permission Matrix &amp; Principle of Least Privilege
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold">5 System Roles Configured</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase bg-[#0b1017]">
                  <th className="py-2.5 px-3">Capability / Operation</th>
                  {roles.map((r) => (
                    <th key={r.id} className="py-2.5 px-3 text-center">
                      <div className="text-slate-200 font-bold">{r.name}</div>
                      <div className="text-[9px] text-slate-400 font-normal lowercase">{r.scopeType}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {matrixPermissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 text-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold mr-2">
                        [{perm.category}]
                      </span>
                      <span>{perm.label}</span>
                    </td>
                    {roles.map((role) => {
                      const hasPerm =
                        role.permissions.includes('*') || role.permissions.includes(perm.key);
                      return (
                        <td key={role.id} className="py-2.5 px-3 text-center">
                          {hasPerm ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                              <Check size={12} />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-900 border border-slate-800 text-slate-600">
                              <X size={12} />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0f151e] border border-slate-800 shadow-2xl p-5 text-slate-200 text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-slate-100">Provision Operator / Analyst</span>
              </div>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 font-mono text-xs cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleProvisionUser} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sarah Chen"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="sarah.chen"
                    value={newUserData.username}
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    placeholder="sarah.chen@acme.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Role Assignment</label>
                  <select
                    value={newUserData.roleId}
                    onChange={(e) => setNewUserData({ ...newUserData, roleId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Plant Site Scope</label>
                  <select
                    value={newUserData.siteScope}
                    onChange={(e) => setNewUserData({ ...newUserData, siteScope: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Sites (Global)</option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Authentication Provider</label>
                <select
                  value={newUserData.authProvider}
                  onChange={(e: any) => setNewUserData({ ...newUserData, authProvider: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  <option value="Active Directory (LDAP)">Active Directory (LDAP / Kerberos)</option>
                  <option value="Okta (SAML 2.0)">Okta (SAML 2.0)</option>
                  <option value="Azure AD / Entra ID (OIDC)">Azure AD / Entra ID (OIDC)</option>
                  <option value="Local Database">Local Emergency Account</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
