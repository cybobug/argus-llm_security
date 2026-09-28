import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './pages/DashboardOverview';
import { TargetChatbotPage } from './pages/TargetChatbotPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ScansPage } from './pages/ScansPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { AttackPathsPage } from './pages/AttackPathsPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { ReportsPage } from './pages/ReportsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NewScanModal } from './components/NewScanModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load saved theme or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('argus-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('argus-theme', nextTheme);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview onOpenScanModal={() => setIsScanModalOpen(true)} onNavigateTab={setActiveTab} />;
      case 'target-chatbot':
        return <TargetChatbotPage />;
      case 'digital-twin':
        return <DigitalTwinPage />;
      case 'scans':
        return <ScansPage onOpenScanModal={() => setIsScanModalOpen(true)} onNavigateTab={setActiveTab} />;
      case 'vulnerabilities':
        return <VulnerabilitiesPage onNavigateTab={setActiveTab} />;
      case 'attack-paths':
        return <AttackPathsPage onNavigateTab={setActiveTab} />;
      case 'threat-intel':
        return <ThreatIntelPage onNavigateTab={setActiveTab} />;
      case 'reports':
        return <ReportsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview onOpenScanModal={() => setIsScanModalOpen(true)} onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Content Area */}
      <div className="main-content">
        <Header 
          onOpenScanModal={() => setIsScanModalOpen(true)} 
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateTab={setActiveTab}
        />
        {renderActivePage()}
      </div>

      {/* Interactive Scan Modal */}
      <NewScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
      />
    </div>
  );
};
