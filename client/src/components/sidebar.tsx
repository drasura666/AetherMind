import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, History, Pin } from 'lucide-react';
import clsx from 'clsx';

// Your original chat data structure
const recentChats = [
    { id: 1, title: 'Quantum Computing Principles', timestamp: '2 hours ago', pinned: true },
    { id: 2, title: 'Python Data Structures', timestamp: '5 hours ago', pinned: false },
    { id: 3, title: 'Research Paper - ML', timestamp: '1 day ago', pinned: true },
];

export function Sidebar({ isOpen, onNewChat }: { isOpen: boolean, onNewChat: () => void }) {
  const pinnedChats = recentChats.filter(chat => chat.pinned);
  const regularChats = recentChats.filter(chat => !chat.pinned);

  return (
    <aside className={clsx(
      "flex-shrink-0 bg-card dark:bg-asura-darker border-r dark:border-r-2 dark:border-asura-red/50 flex flex-col h-full transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-0 p-0 overflow-hidden"
    )}>
      <div className="p-4 border-b dark:border-asura-red/30">
        <Button
          onClick={onNewChat}
          className="w-full bg-primary text-primary-foreground dark:bg-transparent dark:border dark:border-asura-red dark:text-asura-red-light dark:hover:bg-asura-red/20"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        <div className="p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:text-asura-gray mb-2">
            <Pin className="h-3 w-3" /> Pinned
          </h3>
          {pinnedChats.map(chat => (
            <a href="#" key={chat.id} className="block p-2 rounded-md text-sm text-foreground hover:bg-muted dark:text-asura-light dark:hover:bg-asura-red/20">
              <p className="truncate font-medium">{chat.title}</p>
              <p className="text-xs text-muted-foreground dark:text-asura-gray">{chat.timestamp}</p>
            </a>
          ))}
        </div>
        {/* Recent Chats */}
        <div className="p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:text-asura-gray mb-2">
            <History className="h-3 w-3" /> Recent
          </h3>
          {regularChats.map(chat => (
            <a href="#" key={chat.id} className="block p-2 rounded-md text-sm text-foreground hover:bg-muted dark:text-asura-light dark:hover:bg-asura-red/20">
              <p className="truncate font-medium">{chat.title}</p>
              <p className="text-xs text-muted-foreground dark:text-asura-gray">{chat.timestamp}</p>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
