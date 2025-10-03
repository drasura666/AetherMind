import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Key, 
  Settings, 
  Trash, 
  MessageSquare, 
  Calculator, 
  Code, 
  Microscope, 
  GraduationCap, 
  Lightbulb,
  Menu
} from 'lucide-react';
import { useAPIKeys } from '@/hooks/use-api-keys';
import { AI_PROVIDERS } from '@/lib/ai-providers';

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
  const providerName = AI_PROVIDERS[selectedProvider]?.displayName || 'No Provider';

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'stem', label: 'STEM Lab', icon: Calculator },
    { id: 'code', label: 'Code Lab', icon: Code },
    { id: 'research', label: 'Research Hub', icon: Microscope },
    { id: 'exam', label: 'Exam Prep', icon: GraduationCap },
    { id: 'creative', label: 'Creative Studio', icon: Lightbulb },
  ];

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white h-4 w-4" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Ultimate AI</h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              by AetherMind
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden lg:flex items-center space-x-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`text-xs font-medium ${
                    isActive 
                      ? 'bg-white dark:bg-gray-700 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => onTabChange(tab.id)}
                  data-testid={`button-tab-${tab.id}`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
          <div className="lg:hidden">
            <Select value={activeTab} onValueChange={onTabChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenApiKeys}
              title="API Settings"
              data-testid="button-api-settings"
              className={`${isConnected ? 'text-green-600' : 'text-red-500'}`}
            >
              <Key className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              title="Settings"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
