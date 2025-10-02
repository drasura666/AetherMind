// client/src/components/app-header.tsx

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Key, Settings, Menu, MessageSquare, Calculator, Code, Microscope, GraduationCap, Lightbulb } from 'lucide-react';
import { useAPIKeys } from '@/hooks/use-api-keys';
import { AI_PROVIDERS } from '@/lib/ai-providers';
import { ThemeToggle } from './ThemeToggle';
import clsx from 'clsx';

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenApiKeys: () => void;
  onOpenSettings: () => void;
  onClearData: () => void;
  onToggleSidebar: () => void;
}

export function AppHeader({ activeTab, onTabChange, onOpenApiKeys, onOpenSettings, onClearData, onToggleSidebar }: AppHeaderProps) {
  const { selectedProvider, hasValidKey } = useAPIKeys();
  const isConnected = hasValidKey(selectedProvider);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'stem', label: 'STEM Lab', icon: Calculator },
    { id: 'code', label: 'Code Lab', icon: Code },
    { id: 'research', label: 'Research Hub', icon: Microscope },
    { id: 'exam', label: 'Exam Prep', icon: GraduationCap },
    { id: 'creative', label: 'Creative Studio', icon: Lightbulb },
  ];

  return (
    <header className="bg-card dark:bg-asura-darker border-b dark:border-b-2 dark:border-asura-red/50 px-4 py-3 z-20">
      <div className="flex items-center justify-between">
        {/* Left side - Preserved Original Structure */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="md:hidden dark:text-asura-gray dark:hover:text-asura-light">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-asura-red dark:to-red-500 rounded-lg flex items-center justify-center">
              <Brain className="text-white h-4 w-4" />
            </div>
            <h1 className="text-lg font-semibold text-foreground dark:text-asura-red-light">Ultimate AI</h1>
            <span className="text-xs text-muted-foreground dark:text-asura-gray bg-muted dark:bg-asura-dark-gray px-2 py-0.5 rounded-full">
              by AetherMind
            </span>
          </div>
        </div>

        {/* Right side - Preserved Original Structure */}
        <div className="flex items-center space-x-2">
          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center space-x-1 bg-muted dark:bg-asura-dark-gray rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  className={clsx(
                    "text-xs font-medium",
                    isActive 
                      ? 'bg-background text-foreground shadow-sm dark:bg-asura-red dark:text-asura-light' 
                      : 'hover:bg-background/50 dark:text-asura-gray dark:hover:bg-asura-red/20 dark:hover:text-asura-light'
                  )}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Mobile Tab Selector */}
          <div className="lg:hidden">
            <Select value={activeTab} onValueChange={onTabChange}>
              <SelectTrigger className="w-32 dark:bg-asura-dark-gray dark:border-asura-red/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-asura-dark-gray dark:border-asura-red/50">
                {tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id} className="dark:focus:bg-asura-red/20">
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Settings Buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenApiKeys}
              title="API Settings"
              className={clsx(
                isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-500',
                "dark:hover:text-asura-light"
              )}
            >
              <Key className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onOpenSettings} title="Settings" className="dark:text-asura-gray dark:hover:text-asura-light">
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
