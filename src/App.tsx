import React, { useState } from 'react';
import { NavigationSection, SeverityLevel } from './types';
import { Sidebar } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
import { GlobalSearchModal } from './components/dialogs/GlobalSearchModal';
import { ScopeProvider } from './context/ScopeContext';

// Existing Views
import { DashboardView } from './views/DashboardView';
import { AgentsView } from './views/AgentsView';
import { AgentDetailView } from './views/AgentDetailView';
import { EventsView } from './views/EventsView';
import { EventDetailView } from './views/EventDetailView';
import { InvestigationsView } from './views/InvestigationsView';
import { InvestigationDetailView } from './views/InvestigationDetailView';
import { EvidenceView } from './views/EvidenceView';
import { CollectionProfilesView } from './views/CollectionProfilesView';
import { CollectionProfileDetailView } from './views/CollectionProfileDetailView';
import { DetectionsView } from './views/DetectionsView';
import { DetectionDetailView } from './views/DetectionDetailView';
import { SyslogView } from './views/SyslogView';
import { SyslogParserAssistantView } from './views/SyslogParserAssistantView';
import { IntegrationsView } from './views/IntegrationsView';
import { HealthView } from './views/HealthView';
import { AuditLogView } from './views/AuditLogView';
import { PoliciesView } from './views/PoliciesView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';

// New Multi-Site OT/ICS Views
import { SitesView } from './views/SitesView';
import { SiteDetailView } from './views/SiteDetailView';
import { GroupsView } from './views/GroupsView';
import { AssetsView } from './views/AssetsView';
import { NetworkDevicesView } from './views/NetworkDevicesView';
import { TelemetrySourcesView } from './views/TelemetrySourcesView';

function AppContent() {
  const [activeSection, setActiveSection] = useState<NavigationSection>('dashboard');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Parameterized drilldown selections
  const [selectedAgentId, setSelectedAgentId] = useState<string>('SERVER-42');
  const [selectedEventId, setSelectedEventId] = useState<string>('evt-7045-svc');
  const [selectedInvId, setSelectedInvId] = useState<string>('INV-000142');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('profile-baseline');
  const [selectedDetectionId, setSelectedDetectionId] = useState<string>('det-001');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('chennai');

  // Navigation Filter Contexts
  const [eventsHostFilter, setEventsHostFilter] = useState<string>('All');
  const [detectionsSeverityFilter, setDetectionsSeverityFilter] = useState<SeverityLevel | 'All'>('All');

  const handleNavigate = (section: NavigationSection, params?: any) => {
    if (params) {
      if (params.agentId) setSelectedAgentId(params.agentId);
      if (params.eventId) setSelectedEventId(params.eventId);
      if (params.invId) setSelectedInvId(params.invId);
      if (params.profileId) setSelectedProfileId(params.profileId);
      if (params.detectionId) setSelectedDetectionId(params.detectionId);
      if (params.siteId) setSelectedSiteId(params.siteId);
      if (params.hostFilter) setEventsHostFilter(params.hostFilter);
      if (params.severityFilter) setDetectionsSeverityFilter(params.severityFilter);
      if (params.severity) setDetectionsSeverityFilter(params.severity);
    }
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={handleNavigate}
            onSelectAgent={(agentId) => {
              setSelectedAgentId(agentId);
              setActiveSection('agent-detail');
            }}
            onSelectInvestigation={(invId) => {
              setSelectedInvId(invId);
              setActiveSection('investigation-detail');
            }}
          />
        );

      // Multi-Site OT/ICS Sections
      case 'sites':
        return (
          <SitesView
            onNavigate={handleNavigate}
            onSelectSite={(siteId) => {
              setSelectedSiteId(siteId);
              setActiveSection('site-detail');
            }}
          />
        );

      case 'site-detail':
        return <SiteDetailView siteId={selectedSiteId} onNavigate={handleNavigate} />;

      case 'groups':
        return <GroupsView onNavigate={handleNavigate} />;

      case 'assets':
        return <AssetsView onNavigate={handleNavigate} />;

      case 'network-devices':
        return <NetworkDevicesView onNavigate={handleNavigate} />;

      case 'telemetry-sources':
        return <TelemetrySourcesView onNavigate={handleNavigate} />;

      case 'agents':
        return (
          <AgentsView
            onNavigate={handleNavigate}
            onSelectAgent={(agentId) => {
              setSelectedAgentId(agentId);
              setActiveSection('agent-detail');
            }}
          />
        );

      case 'agent-detail':
        return (
          <AgentDetailView
            agentId={selectedAgentId}
            onNavigate={handleNavigate}
            onSelectEvent={(eventId) => {
              setSelectedEventId(eventId);
              setActiveSection('event-detail');
            }}
            onSelectInvestigation={(invId) => {
              setSelectedInvId(invId);
              setActiveSection('investigation-detail');
            }}
          />
        );

      case 'events':
        return (
          <EventsView
            onNavigate={handleNavigate}
            onSelectEvent={(eventId) => {
              setSelectedEventId(eventId);
              setActiveSection('event-detail');
            }}
            initialHostFilter={eventsHostFilter}
          />
        );

      case 'event-detail':
        return (
          <EventDetailView
            eventId={selectedEventId}
            onNavigate={handleNavigate}
            onSelectAgent={(agentId) => {
              setSelectedAgentId(agentId);
              setActiveSection('agent-detail');
            }}
            onSelectInvestigation={(invId) => {
              setSelectedInvId(invId);
              setActiveSection('investigation-detail');
            }}
          />
        );

      case 'investigations':
        return (
          <InvestigationsView
            onNavigate={handleNavigate}
            onSelectInvestigation={(invId) => {
              setSelectedInvId(invId);
              setActiveSection('investigation-detail');
            }}
          />
        );

      case 'investigation-detail':
        return (
          <InvestigationDetailView
            investigationId={selectedInvId}
            onNavigate={handleNavigate}
            onSelectEvent={(eventId) => {
              setSelectedEventId(eventId);
              setActiveSection('event-detail');
            }}
            onSelectAgent={(agentId) => {
              setSelectedAgentId(agentId);
              setActiveSection('agent-detail');
            }}
          />
        );

      case 'evidence':
        return (
          <EvidenceView
            onNavigate={handleNavigate}
            onSelectEvent={(eventId) => {
              setSelectedEventId(eventId);
              setActiveSection('event-detail');
            }}
            onSelectInvestigation={(invId) => {
              setSelectedInvId(invId);
              setActiveSection('investigation-detail');
            }}
          />
        );

      case 'collection-profiles':
        return (
          <CollectionProfilesView
            onNavigate={handleNavigate}
            onSelectProfile={(profileId) => {
              setSelectedProfileId(profileId);
              setActiveSection('collection-profile-detail');
            }}
          />
        );

      case 'collection-profile-detail':
        return (
          <CollectionProfileDetailView
            profileId={selectedProfileId}
            onNavigate={handleNavigate}
          />
        );

      case 'detections':
        return (
          <DetectionsView
            onNavigate={handleNavigate}
            onSelectDetection={(detId) => {
              setSelectedDetectionId(detId);
              setActiveSection('detection-detail');
            }}
            initialSeverityFilter={detectionsSeverityFilter}
          />
        );

      case 'detection-detail':
        return (
          <DetectionDetailView
            detectionId={selectedDetectionId}
            onNavigate={handleNavigate}
            onSelectEvent={(eventId) => {
              setSelectedEventId(eventId);
              setActiveSection('event-detail');
            }}
            onSelectAgent={(agentId) => {
              setSelectedAgentId(agentId);
              setActiveSection('agent-detail');
            }}
          />
        );

      case 'syslog':
        return <SyslogView onNavigate={handleNavigate} />;

      case 'parser-assistant':
        return <SyslogParserAssistantView onNavigate={handleNavigate} />;

      case 'integrations':
        return <IntegrationsView onNavigate={handleNavigate} />;

      case 'health':
        return <HealthView onNavigate={handleNavigate} />;

      case 'audit-log':
        return <AuditLogView onNavigate={handleNavigate} />;

      case 'policies':
        return <PoliciesView onNavigate={handleNavigate} />;

      case 'users':
        return <UsersView onNavigate={handleNavigate} />;

      case 'settings':
        return <SettingsView onNavigate={handleNavigate} />;

      default:
        return (
          <DashboardView
            onNavigate={handleNavigate}
            onSelectAgent={(agentId) => {
              setSelectedAgentId(agentId);
              setActiveSection('agent-detail');
            }}
            onSelectInvestigation={(invId) => {
              setSelectedInvId(invId);
              setActiveSection('investigation-detail');
            }}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0B0C] text-[#E0E0E0]">
      {/* Platform Navigation Sidebar */}
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0B0C]">
        <TopBar
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Command Palette / Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ScopeProvider>
      <AppContent />
    </ScopeProvider>
  );
}
