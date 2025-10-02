// client/src/pages/dashboard.tsx

import { useState, useEffect } from 'react';
import { WelcomeModal } from '@/components/welcome-modal';
import { APIKeyModal } from '@/components/api-key-modal';
import { AppHeader } from '@/components/app-header';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { STEMLab } from '@/components/stem-lab';
import { CodeLab } from '@/components/code-lab';
import { ResearchHub } from '@/components/research-hub';
import { ExamPrep } from '@/components/exam-prep';
import { CreativeStudio } from '@/components/creative-studio';
import { SettingsModal } from '@/components/settings-modal';
import { useAPIKeys } from '@/hooks/use-api-keys';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true); // <-- STATE IS RESTORED
  
  const { hasValidKey, selectedProvider, clearAllKeys } = useAPIKeys();
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('ultimateai_welcome_seen');
    const hasAnyValidKey = hasValidKey(selectedProvider);
    
    if (!hasSeenWelcome && !hasAnyValidKey) {
      setShowWelcome(true);
    }
  }, [hasValidKey, selectedProvider]);

  const handleWelcomeClose = () => { /* ... (preserved) ... */ };
  const handleGetStarted = () => { /* ... (preserved) ... */ };
  const handleApiKeySaved = () => { /* ... (preserved) ... */ };
  const handleClearAllData = () => { /* ... (preserved) ... */ };
  const handleNewChat = () => { /* ... (preserved) ... */ };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat': return <ChatInterface />;
      case 'stem': return <STEMLab />;
      // ... other cases
      default: return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="dashboard">
      <WelcomeModal open={showWelcome} onClose={handleWelcomeClose} onGetStarted={handleGetStarted} />
      <APIKeyModal open={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} onSave={handleApiKeySaved} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      <div className="flex flex-col h-screen">
        <AppHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenApiKeys={() => setShowApiKeyModal(true)}
          onOpenSettings={() => setShowSettings(true)}
          onClearData={handleClearAllData}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} // <-- CONNECTION IS RESTORED
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onNewChat={handleNewChat} isOpen={sidebarOpen} /> {/* <-- PROP IS RESTORED */}
          <div className="flex-1 flex flex-col">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
