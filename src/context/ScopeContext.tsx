import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteScope, Site, Zone } from '../types';
import { siteService, MOCK_SITES } from '../services/siteService';

interface ScopeContextType {
  scope: SiteScope;
  setScope: (newScope: Partial<SiteScope>) => void;
  selectSite: (siteId: string | 'all') => void;
  selectZone: (zoneId: string | 'all') => void;
  setSiteScope: (siteId: string | 'all', zoneId?: string | 'all') => void;
  sites: Site[];
  currentSite: Site | undefined;
  currentZone: Zone | undefined;
  availableZones: Zone[];
}

const defaultScope: SiteScope = {
  organizationId: 'acme-mfg',
  organizationName: 'Acme Manufacturing',
  siteId: 'all',
  siteName: 'All Sites (Global Enterprise)',
  zoneId: 'all',
  zoneName: 'All Zones',
};

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

export const ScopeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scope, setScopeState] = useState<SiteScope>(defaultScope);
  const [sites] = useState<Site[]>(MOCK_SITES);

  const currentSite = sites.find((s) => s.id === scope.siteId);
  const availableZones = currentSite ? currentSite.zones : sites.flatMap((s) => s.zones);
  const currentZone = availableZones.find((z) => z.id === scope.zoneId);

  const setScope = (newScope: Partial<SiteScope>) => {
    setScopeState((prev) => {
      const updated = { ...prev, ...newScope };
      if (newScope.siteId) {
        if (newScope.siteId === 'all') {
          updated.siteName = 'All Sites (Global Enterprise)';
          updated.zoneId = 'all';
          updated.zoneName = 'All Zones';
        } else {
          const site = sites.find((s) => s.id === newScope.siteId);
          updated.siteName = site?.name || newScope.siteId;
          // reset zone if site changed
          if (prev.siteId !== newScope.siteId) {
            updated.zoneId = 'all';
            updated.zoneName = 'All Zones';
          }
        }
      }
      if (newScope.zoneId) {
        if (newScope.zoneId === 'all') {
          updated.zoneName = 'All Zones';
        } else {
          const zone = availableZones.find((z) => z.id === newScope.zoneId);
          updated.zoneName = zone?.name || newScope.zoneId;
        }
      }
      return updated;
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
