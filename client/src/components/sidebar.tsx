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
  const recentChats = [
    { 
      id: 1, 
      title: 'Quantum Computing Principles', 
      timestamp: '2 hours ago',
      pinned: true 
    },
    { 
      id: 2, 
      title: 'Python Data Structures Deep Dive', 
      timestamp: '5 hours ago',
      pinned: false 
    },
    { 
      id: 3, 
      title: 'Research Paper Analysis - ML', 
      timestamp: '1 day ago',
      pinned: true 
    },
    { 
      id: 4, 
      title: 'Creative Writing: Sci-Fi World', 
      timestamp: '2 days ago',
      pinned: false 
    },
    { 
      id: 5, 
      title: 'STEM Problem Solving Session', 
      timestamp: '3 days ago',
      pinned: false 
    }
  ];

  const pinnedChats = recentChats.filter(chat => chat.pinned);
  const regularChats = recentChats.filter(chat => !chat.pinned);

  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          data-testid="button-new-chat"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search chats..."
            className="pl-9 text-sm"
            data-testid="input-search-chats"
          />
          <Search className="absolute left-3 top-3 h-3 w-3 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {pinnedChats.length > 0 && (
          <div className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <Pin className="h-3 w-3 text-gray-500" />
              <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pinned</h3>
            </div>
            <div className="space-y-1">
              {pinnedChats.map((chat) => (
                <div key={chat.id} className="group flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <MessageSquare className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{chat.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Pin className="h-3 w-3 fill-current text-yellow-500" /></Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreHorizontal className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-3 w-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Recent</h3>
          </div>
          <div className="space-y-1">
            {regularChats.map((chat) => (
              <div key={chat.id} className="group flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <MessageSquare className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Edit3 className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Pin className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreHorizontal className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
