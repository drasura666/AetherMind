import { Button } from '@/components/ui/button';
import { Brain, Key, Settings, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import clsx from 'clsx';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  // Add other props back as you need them
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenApiKeys: () => void;
  onOpenSettings: () => void;
}

export function AppHeader({ onToggleSidebar, onOpenApiKeys, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="bg-card dark:bg-asura-darker border-b dark:border-b-2 dark:border-asura-red/50 px-4 py-3 z-20 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="dark:text-asura-gray dark:hover:text-asura-light">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-asura-red dark:to-red-500 rounded-lg flex items-center justify-center">
            <Brain className="text-white h-4 w-4" />
          </div>
          <h1 className="text-lg font-semibold text-foreground dark:text-asura-red-light">Ultimate AI</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onOpenApiKeys} title="API Settings" className="dark:hover:text-asura-light">
          <Key className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onOpenSettings} title="Settings" className="dark:text-asura-gray dark:hover:text-asura-light">
          <Settings className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
