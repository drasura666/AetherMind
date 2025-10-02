// client/src/components/sidebar.tsx

import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, History } from "lucide-react";
import { 
  Sidebar as BaseSidebar, // Renamed to avoid conflict
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar"; // This path must point to your complex sidebar component library
import clsx from 'clsx';

// Mock data for chat history
const pinnedChats = [
  { id: 1, title: 'Quantum Computing...' },
  { id: 2, title: 'Research Paper An...' },
];
const recentChats = [
  { id: 3, title: 'Python Data St...' },
  { id: 4, title: 'Creative Writing...' },
  { id: 5, title: 'STEM Problem S...' },
];

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
}

export function Sidebar({ onNewChat, isOpen }: SidebarProps) {
  if (!isOpen) {
    return null; // The parent will control visibility
  }
  
  return (
    <BaseSidebar className={clsx(
        "transition-all duration-300 ease-in-out",
        isOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden" // Basic hide/show logic
      )}>
        <SidebarHeader>
           <Button
             onClick={onNewChat}
             className="w-full bg-primary text-primary-foreground dark:bg-transparent dark:border dark:border-asura-red dark:text-asura-red-light dark:hover:bg-asura-red/20"
           >
             <PlusCircle className="h-4 w-4 mr-2" />
             New Chat
           </Button>
        </SidebarHeader>
        <SidebarContent>
           <SidebarMenu>
             <h3 className="px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:text-asura-gray">Pinned</h3>
             {pinnedChats.map(chat => (
                <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton>
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">{chat.title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             ))}
           </SidebarMenu>
           <SidebarMenu className="mt-4">
             <h3 className="px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:text-asura-gray">Recent</h3>
             {recentChats.map(chat => (
                <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton>
                        <History className="h-4 w-4" />
                        <span className="truncate">{chat.title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             ))}
           </SidebarMenu>
        </SidebarContent>
      </BaseSidebar>
  );
}
