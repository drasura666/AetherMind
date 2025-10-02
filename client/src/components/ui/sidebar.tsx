import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, History } from "lucide-react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar"; // This path should point to your complex sidebar component file

// Mock data for chat history - you can replace this with your actual data
const pinnedChats = [
  { id: 1, title: 'Quantum Computing...' },
  { id: 2, title: 'Research Paper An...' },
];
const recentChats = [
  { id: 3, title: 'Python Data St...' },
  { id: 4, title: 'Creative Writing...' },
  { id: 5, title: 'STEM Problem S...' },
];

interface SimpleSidebarProps {
  onNewChat: () => void;
  isOpen: boolean; // We will use this prop to control the state
  // Add other props from Dashboard if needed
}

export function Sidebar({ onNewChat, isOpen }: SimpleSidebarProps) {
  // We use the isOpen prop from the Dashboard to control the sidebar's state.
  // Note: The original component had its own internal state, but we'll control it from the parent.
  return (
    <div className={isOpen ? "w-64" : "w-0"}>
      <SidebarProvider defaultOpen={isOpen}>
        <Sidebar>
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
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
