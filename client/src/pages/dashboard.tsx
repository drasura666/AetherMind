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
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'; // <-- Import layout components

export default function Dashboard() {
  // All your original state and logic is preserved
  const [showWelcome, setShowWelcome] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  const { hasValidKey, selectedProvider, clearAllKeys } = useAPIKeys();
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('ultimateai_welcome_seen');
    const hasAnyValidKey = hasValidKey(selectedProvider);
    
    if (!hasSeenWelcome && !hasAnyValidKey) {
      setShowWelcome(true);
    }
  }, [hasValidKey, selectedProvider]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('ultimateai_welcome_seen', 'true');
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowApiKeyModal(true);
    localStorage.setItem('ultimateai_welcome_seen', 'true');
  };

  const handleApiKeySaved = () => {
    setShowApiKeyModal(false);
    toast({
      title: "Welcome to Ultimate AI!",
      description: "You're all set to start using the platform.",
    });
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
      clearAllKeys();
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All stored data has been cleared.",
      });
      setShowWelcome(true);
    }
  };

  const handleNewChat = () => {
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }
    toast({
      title: "New Chat",
      description: "Started a new conversation.",
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'stem':
        return <STEMLab />;
      case 'code':
        return <CodeLab />;
      case 'research':
        return <ResearchHub />;
      case 'exam':
        return <ExamPrep />;
      case 'creative':
        return <CreativeStudio />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    // Uses theme-aware background from your CSS
    <div className="min-h-screen bg-background text-foreground" data-testid="dashboard">
      <WelcomeModal
        open={showWelcome}
        onClose={handleWelcomeClose}
        onGetStarted={handleGetStarted}
      />
      
      <APIKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySaved}
      />

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* The SidebarProvider now wraps the entire layout */}
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar onNewChat={handleNewChat} />
          
          {/* SidebarInset is the main content area that correctly adjusts itself */}
          <SidebarInset>
            <div className="flex flex-col h-full">
              <AppHeader
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onOpenApiKeys={() => setShowApiKeyModal(true)}
                onOpenSettings={() => setShowSettings(true)}
                onClearData={handleClearAllData}
                onToggleSidebar={() => {}} // The sidebar's own trigger now handles this
              />
              <div className="flex-1 flex overflow-hidden">
                {renderActiveTab()}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
