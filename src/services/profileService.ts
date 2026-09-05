import { CollectionProfile } from '../types';
import { MOCK_COLLECTION_PROFILES } from './mockData';

let profilesStore: CollectionProfile[] = [...MOCK_COLLECTION_PROFILES];

export const profileService = {
  async getProfiles(): Promise<CollectionProfile[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...profilesStore];
  },

  async getProfileById(id?: string): Promise<CollectionProfile | null> {
    if (!id) return null;
    await new Promise((r) => setTimeout(r, 30));
    const targetId = id.toLowerCase();
    const prof = profilesStore.find((p) => p.id?.toLowerCase() === targetId);
    return prof || null;
  },

  async cloneProfile(id: string): Promise<CollectionProfile | null> {
    const src = profilesStore.find((p) => p.id === id);
    if (!src) return null;
    const cloned: CollectionProfile = {
      ...src,
      id: `profile-${Date.now()}`,
      name: `${src.name} (Copy)`,
      version: '1.0-draft',
      status: 'Draft',
      deploymentCoverage: {
        totalHosts: 184,
        activeHosts: 0,
        percent: 0,
      },
      versionHistory: [
        {
          version: '1.0-draft',
          date: new Date().toISOString().slice(0, 10),
          author: 'Analyst',
          comment: `Cloned from ${src.name} v${src.version}`,
        },
      ],
    };
    profilesStore.push(cloned);
    return cloned;
  },
};
