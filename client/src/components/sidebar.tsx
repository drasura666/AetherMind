import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus,
  Search,
  MessageSquare,
  Clock,
  Pin,
  MoreHorizontal,
  Edit3
} from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
}

export function Sidebar({ onNewChat, isOpen }: SidebarProps) {
  // All your original data and logic is preserved
  const recentChats = [
    { id: 1, title: 'Quantum Computing Principles', timestamp: '2 hours ago', pinned: true },
    { id: 2, title: 'Python Data Structures Deep Dive', timestamp: '5 hours ago', pinned: false },
    { id: 3, title: 'Research Paper Analysis - ML', timestamp: '1 day ago', pinned: true },
    { id: 4, title: 'Creative Writing: Sci-Fi World', timestamp: '2 days ago', pinned: false },
    { id: 5, title: 'STEM Problem Solving Session', timestamp: '3 days ago', pinned: false }
  ];

  const pinnedChats = recentChats.filter(chat => chat.pinned);
  const regularChats = recentChats.filter(chat => !chat.pinned);

  if (!isOpen) return null;

  return (
    // UPDATED: Theme-aware background and borders
    <div className="w-64 bg-card dark:bg-asura-darker border-r dark:border-r-2 dark:border-asura-red/50 flex flex-col h-full transition-all duration-300">
      {/* New Chat Button */}
      <div className="p-3 border-b dark:border-asura-red/30">
        <Button
          onClick={onNewChat}
          // UPDATED: Theme-aware button styles
          className="w-full bg-primary text-primary-foreground dark:bg-transparent dark:border dark:border-asura-red dark:text-asura-red-light dark:hover:bg-asura-red/20"
          data-testid="button-new-chat"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b dark:border-asura-red/30">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search chats..."
            // UPDATED: Theme-aware input styles
            className="pl-9 text-sm bg-background dark:bg-asura-dark-gray dark:border-asura-red/50"
            data-testid="input-search-chats"
          />
          <Search className="absolute left-3 top-3 h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        {pinnedChats.length > 0 && (
          <div className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <Pin className="h-3 w-3 text-muted-foreground dark:text-asura-gray" />
              <h3 className="text-xs font-medium text-muted-foreground dark:text-asura-gray uppercase tracking-wider">Pinned</h3>
            </div>
            <div className="space-y-1">
              {pinnedChats.map((chat) => (
                <div
                  key={chat.id}
                  // UPDATED: Theme-aware hover styles
                  className="group flex items-center justify-between p-2 hover:bg-muted dark:hover:bg-asura-red/20 rounded-lg cursor-pointer"
                  data-testid={`chat-pinned-${chat.id}`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <MessageSquare className="h-3 w-3 text-muted-foreground dark:text-asura-gray flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground dark:text-asura-light truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-asura-gray">
                        {chat.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-asura-gray dark:hover:text-asura-light">
                      <Pin className="h-3 w-3 fill-current text-yellow-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-asura-gray dark:hover:text-asura-light">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Chats */}
        <div className="p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-3 w-3 text-muted-foreground dark:text-asura-gray" />
            <h3 className="text-xs font-medium text-muted-foreground dark:text-asura-gray uppercase tracking-wider">Recent</h3>
          </div>
          <div className="space-y-1">
            {regularChats.map((chat) => (
              <div
                key={chat.id}
                // UPDATED: Theme-aware hover styles
                className="group flex items-center justify-between p-2 hover:bg-muted dark:hover:bg-asura-red/20 rounded-lg cursor-pointer"
                data-testid={`chat-recent-${chat.id}`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <MessageSquare className="h-3 w-3 text-muted-foreground dark:text-asura-gray flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground dark:text-asura-light truncate">
                      {chat.title}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-asura-gray">
                      {chat.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-asura-gray dark:hover:text-asura-light">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-asura-gray dark:hover:text-asura-light">
                    <Pin className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-asura-gray dark:hover:text-asura-light">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
