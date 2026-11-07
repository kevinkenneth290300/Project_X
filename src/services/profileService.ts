import { CollectionProfile } from '../types';
import { MOCK_COLLECTION_PROFILES } from './mockData';

const profilesStore: CollectionProfile[] = MOCK_COLLECTION_PROFILES.map((profile) => ({
  ...structuredClone(profile),
  status: 'Draft',
  deploymentCoverage: { totalHosts: 0, activeHosts: 0, percent: 0 },
}));

export function getProfileChannelNames(profile: CollectionProfile): string[] {
  if (Array.isArray(profile.channels)) return [...profile.channels];
  return Object.entries(profile.channels).filter(([, enabled]) => enabled).map(([name]) => name === 'powershell' ? 'PowerShell' : name.charAt(0).toUpperCase() + name.slice(1));
}

export function getProfileCoveredEventIds(profile: CollectionProfile): number[] {
  const categoryIds = (profile.categories || []).filter((category) => category.enabled).flatMap((category) => category.eventIds);
  return [...new Set([...categoryIds, ...(profile.eventFilters?.includeEventIds || [])])].sort((first, second) => first - second);
}

export const profileService = {
  async getProfiles(): Promise<CollectionProfile[]> {
    await new Promise((r) => setTimeout(r, 40));
    return structuredClone(profilesStore);
  },

  async getProfileById(id?: string): Promise<CollectionProfile | null> {
    if (!id) return null;
    await new Promise((r) => setTimeout(r, 30));
    const targetId = id.toLowerCase();
    const prof = profilesStore.find((p) => p.id?.toLowerCase() === targetId);
    return prof ? structuredClone(prof) : null;
  },

  async cloneProfile(id: string): Promise<CollectionProfile | null> {
    const src = profilesStore.find((p) => p.id === id);
    if (!src) return null;
    const cloned: CollectionProfile = {
      ...structuredClone(src),
      id: `profile-${crypto.randomUUID()}`,
      name: `${src.name} (Copy)`,
      version: '1.0-draft',
      status: 'Draft',
      deploymentCoverage: {
        totalHosts: 0,
        activeHosts: 0,
        percent: 0,
      },
      versionHistory: [
        {
          version: '1.0-draft',
          date: new Date().toISOString().slice(0, 10),
          author: 'Sample analyst',
          comment: `Local sample copy of ${src.name}; not deployed`,
        },
      ],
    };
    profilesStore.push(cloned);
    return structuredClone(cloned);
  },
};
