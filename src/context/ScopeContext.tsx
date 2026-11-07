import React, { createContext, useContext, useState } from 'react';
import { SiteScope, Site, Zone } from '../types';
import { DataState, unconfiguredState } from '../data/dataState';

export interface AuthorizedScopeContext {
  organization: { id: string; name: string };
  user: { id: string; name: string; email: string };
  sites: readonly Site[];
}

interface ScopeContextType {
  scope: SiteScope;
  setScope: (newScope: Partial<SiteScope>) => void;
  selectSite: (siteId: string | 'all') => void;
  selectZone: (zoneId: string | 'all') => void;
  setSiteScope: (siteId: string | 'all', zoneId?: string | 'all') => void;
  sites: readonly Site[];
  currentSite: Site | undefined;
  currentZone: Zone | undefined;
  availableZones: Zone[];
  dataState: DataState<AuthorizedScopeContext>;
  user: AuthorizedScopeContext['user'] | undefined;
}

const defaultScope: SiteScope = {
  organizationId: '',
  organizationName: '',
  siteId: 'all',
  siteName: 'No scope configured',
  zoneId: 'all',
  zoneName: 'All Zones',
};

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

export const ScopeProvider: React.FC<{ children: React.ReactNode; authorizedContext?: DataState<AuthorizedScopeContext> }> = ({ children, authorizedContext }) => {
  const dataState = authorizedContext ?? unconfiguredState<AuthorizedScopeContext>('No authenticated scope source is connected.');
  const authorized = dataState.status === 'ready' ? dataState.data : undefined;
  const identityKey = JSON.stringify([authorized?.user, authorized?.organization, authorized?.sites.map((site) => [site.id, site.name, site.zones.map((zone) => [zone.id, zone.name])])]);
  const initialScope = {
    ...defaultScope,
    organizationId: authorized?.organization.id ?? '',
    organizationName: authorized?.organization.name ?? '',
    siteName: authorized ? 'All Sites' : 'No scope configured',
  };
  const [selection, setSelection] = useState({ identityKey, scope: initialScope });
  const scope = selection.identityKey === identityKey ? selection.scope : initialScope;
  const sites = authorized?.sites ?? [];

  const currentSite = sites.find((s) => s.id === scope.siteId);
  const availableZones = currentSite ? currentSite.zones : sites.flatMap((s) => s.zones);
  const currentZone = availableZones.find((z) => z.id === scope.zoneId);

  const setScope = (newScope: Partial<SiteScope>) => {
    if (!authorized) return;
    const siteId = newScope.siteId ?? scope.siteId;
    const site = sites.find((candidate) => candidate.id === siteId);
    if (siteId !== 'all' && !site) return;
    const zoneId = newScope.zoneId ?? (siteId !== scope.siteId ? 'all' : scope.zoneId);
    const zone = site?.zones.find((candidate) => candidate.id === zoneId && candidate.siteId === siteId);
    if (zoneId !== 'all' && !zone) return;
    setSelection({
      identityKey,
      scope: {
        ...initialScope,
        siteId,
        siteName: site?.name ?? 'All Sites',
        zoneId,
        zoneName: zone?.name ?? 'All Zones',
      },
    });
  };

  const selectSite = (siteId: string | 'all') => {
    setScope({ siteId });
  };

  const selectZone = (zoneId: string | 'all') => {
    setScope({ zoneId });
  };

  const setSiteScope = (siteId: string | 'all', zoneId: string | 'all' = 'all') => {
    setScope({ siteId, zoneId });
  };

  return (
    <ScopeContext.Provider
      value={{
        scope,
        setScope,
        selectSite,
        selectZone,
        setSiteScope,
        sites,
        currentSite,
        currentZone,
        availableZones,
        dataState,
        user: authorized?.user,
      }}
    >
      {children}
    </ScopeContext.Provider>
  );
};

export const useScope = (): ScopeContextType => {
  const context = useContext(ScopeContext);
  if (!context) {
    throw new Error('useScope must be used within a ScopeProvider');
  }
  return context;
};
