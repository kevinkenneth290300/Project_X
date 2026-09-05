import { AuthConfig, User, UserScoped, RoleDefinition, AuthProviderConfig } from '../types';

export const MOCK_AUTH_PROVIDERS: AuthProviderConfig[] = [
  {
    id: 'prov-ldap',
    name: 'Active Directory / LDAP (Corp DC)',
    type: 'LDAP',
    status: 'Active',
    details: 'ldaps://ad01.acme.internal:636 • Base: DC=acme,DC=internal',
  },
  {
    id: 'prov-saml',
    name: 'Okta Workforce Identity SAML 2.0',
    type: 'SAML',
    status: 'Configured',
    details: 'https://acme.okta.com/app/warden/sso/saml',
  },
  {
    id: 'prov-oidc',
    name: 'Microsoft Entra ID (Azure AD)',
    type: 'OIDC',
    status: 'Configured',
    details: 'Tenant ID: 72f988bf-86f1-41af-91ab-2d7cd011db47',
  },
  {
    id: 'prov-local',
    name: 'Air-Gapped Emergency Local Database',
    type: 'Local',
    status: 'Active',
    details: 'Salted Argon2id hashes • Restricted Break-Glass',
  },
];

export const MOCK_AUTH_CONFIG: AuthConfig = {
  local: {
    enabled: true,
    passwordMinLength: 14,
    requireSpecial: true,
    lockoutThreshold: 5,
    sessionTimeoutMin: 30,
  },
  ldap: {
    enabled: true,
    serverUrl: 'ldaps://ad01.acme.internal',
    port: 636,
    useTls: true,
    baseDn: 'dc=acme,dc=internal',
    bindAccount: 'cn=warden_bind,ou=service_accounts,dc=acme,dc=internal',
    userSearchBase: 'ou=Security,ou=Users,dc=acme,dc=internal',
    groupSearchBase: 'ou=SecurityGroups,dc=acme,dc=internal',
    usernameAttr: 'sAMAccountName',
    groupAttr: 'memberOf',
    status: 'Connected',
  },
  saml: {
    enabled: true,
    idpName: 'Okta Enterprise SSO',
    entityId: 'https://warden.acme.internal/saml/metadata',
    ssoUrl: 'https://acme.okta.com/app/warden/sso/saml',
    certFingerprint: '94:F8:72:1B:3E:99:A1:6D:77:42:01:CE:39:DF:88:52',
    autoProvision: true,
    status: 'Configured',
  },
  oidc: {
    enabled: true,
    issuerUrl: 'https://login.microsoftonline.com/acme-tenant-id/v2.0',
    clientId: 'warden-enterprise-console',
    authEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopes: 'openid profile email groups',
    groupClaim: 'roles',
    status: 'Configured',
  },
  mfa: {
    enabled: true,
    totp: true,
    webauthn: true,
    idpMfa: true,
    requiredRoles: ['Platform Administrator', 'Security Administrator', 'OT Security Analyst', 'Site Administrator'],
  },
};

export const MOCK_USERS: User[] = [
  {
    id: 'usr-01',
    name: 'Alex Vance',
    username: 'alex.vance',
    email: 'alex.vance@acme.internal',
    roleId: 'role-plat-admin',
    roleName: 'Platform Administrator',
    siteScope: 'All Sites (Global Enterprise)',
    authProvider: 'Active Directory (LDAP)',
    mfaEnabled: true,
    mfaMethod: 'Hardware FIDO2 (YubiKey 5 FIPS)',
    lastLogin: '2026-09-02 10:52:00',
    status: 'Active',
  },
  {
    id: 'usr-02',
    name: 'John Smith',
    username: 'john.smith',
    email: 'john.smith@acme.internal',
    roleId: 'role-ot-analyst',
    roleName: 'OT Security Analyst',
    siteScope: 'Chennai Plant',
    authProvider: 'Active Directory (LDAP)',
    mfaEnabled: true,
    mfaMethod: 'Hardware FIDO2 (YubiKey 5C)',
    lastLogin: '2026-09-02 10:48:12',
    status: 'Active',
  },
  {
    id: 'usr-03',
    name: 'Marcus Reid',
    username: 'marcus.reid',
    email: 'marcus.reid@acme.internal',
    roleId: 'role-sec-analyst',
    roleName: 'Security Analyst',
    siteScope: 'All Sites (Global)',
    authProvider: 'Okta (SAML 2.0)',
    mfaEnabled: true,
    mfaMethod: 'TOTP (Authenticator App)',
    lastLogin: '2026-09-02 09:12:44',
    status: 'Active',
  },
  {
    id: 'usr-04',
    name: 'Elena Rostova',
    username: 'elena.rostova',
    email: 'elena.rostova@acme.internal',
    roleId: 'role-ot-analyst',
    roleName: 'Incident Responder / OT Lead',
    siteScope: 'Chennai Plant & Pune Plant',
    authProvider: 'Active Directory (LDAP)',
    mfaEnabled: true,
    mfaMethod: 'Hardware FIDO2 Active',
    lastLogin: '2026-09-01 18:30:19',
    status: 'Active',
  },
  {
    id: 'usr-05',
    name: 'Rajesh Kumar',
    username: 'rajesh.kumar',
    email: 'rajesh.kumar@acme.internal',
    roleId: 'role-site-admin',
    roleName: 'Site Administrator',
    siteScope: 'Bangalore Plant',
    authProvider: 'Azure AD / Entra ID (OIDC)',
    mfaEnabled: true,
    mfaMethod: 'TOTP Enforced',
    lastLogin: '2026-09-02 08:15:20',
    status: 'Active',
  },
  {
    id: 'usr-06',
    name: 'Anita Desai',
    username: 'anita.desai',
    email: 'anita.desai@acme.internal',
    roleId: 'role-network-op',
    roleName: 'Network & OT Operator',
    siteScope: 'Chennai Plant',
    authProvider: 'Active Directory (LDAP)',
    mfaEnabled: true,
    mfaMethod: 'TOTP Enforced',
    lastLogin: '2026-09-02 10:14:33',
    status: 'Active',
  },
];

export const MOCK_USERS_SCOPED: UserScoped[] = [
  {
    id: 'usr-01',
    name: 'John Smith',
    username: 'john.smith',
    email: 'john.smith@acme-mfg.internal',
    role: 'OT Security Analyst',
    scope: {
      siteId: 'chennai',
      siteName: 'Chennai Plant',
      zoneIds: ['chn-mfg', 'chn-ctrl', 'chn-safety'],
      zoneNames: ['Manufacturing Zone', 'Control Zone', 'Safety Zone'],
    },
    mfaStatus: 'Hardware FIDO2 Token (YubiKey 5C)',
    lastLogin: '2026-09-02 10:48:12 UTC',
    status: 'Active',
    permissions: ['view_assets', 'view_events', 'view_detections', 'create_investigation', 'manage_ir_mode'],
  },
];

export const MOCK_ROLES: RoleDefinition[] = [
  {
    id: 'role-plat-admin',
    name: 'Platform Administrator',
    description: 'Full superuser access across all organizations, plants, configurations, and PKI certs.',
    scopeType: 'Global Enterprise Scope',
    isSystem: true,
    permissions: ['*'],
  },
  {
    id: 'role-sec-analyst',
    name: 'Senior SOC Analyst',
    description: 'Triage live SOC telemetry, analyze detection events, and build investigation dossiers.',
    scopeType: 'Multi-Site Fleet',
    isSystem: true,
    permissions: ['view_telemetry', 'manage_agents', 'trigger_ir', 'export_evidence', 'manage_snmp'],
  },
  {
    id: 'role-ot-analyst',
    name: 'OT Security Operator',
    description: 'Specialized for industrial plant environments with scoped zone access and safety awareness.',
    scopeType: 'Plant-Scoped Access',
    isSystem: false,
    permissions: ['view_telemetry', 'trigger_ir', 'manage_zones', 'manage_snmp', 'export_evidence'],
  },
  {
    id: 'role-auditor',
    name: 'Compliance Auditor',
    description: 'Read-only access to audit logs, compliance evidence, and policy verifications.',
    scopeType: 'Read-Only Audit Scope',
    isSystem: true,
    permissions: ['view_telemetry', 'export_evidence'],
  },
  {
    id: 'role-readonly',
    name: 'Read-Only Observer',
    description: 'Standard viewing rights for read-only monitoring dashboards and operational visibility.',
    scopeType: 'Unrestricted Observer',
    isSystem: true,
    permissions: ['view_telemetry'],
  },
];

export const authService = {
  getAuthConfig: async (): Promise<AuthConfig> => {
    return MOCK_AUTH_CONFIG;
  },

  getAuthProviders: async (): Promise<AuthProviderConfig[]> => {
    return MOCK_AUTH_PROVIDERS;
  },

  getUsers: async (): Promise<User[]> => {
    return MOCK_USERS;
  },

  getRoles: async (): Promise<RoleDefinition[]> => {
    return MOCK_ROLES;
  },
};
