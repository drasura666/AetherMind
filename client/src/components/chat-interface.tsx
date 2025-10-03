import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Copy, Paperclip, Send } from 'lucide-react';
import { ChatMessage } from '@/types/ai';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

// This component now takes up the full available space and scrolls internally
export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Your other state and logic for sending messages
  const { toast } = useToast();

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied" });
  };
  
  return (
    <div className="flex-1 flex flex-col bg-background text-foreground dark:font-mono min-h-0">
      {/* SCROLLING AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative dark:scanline-bg">
        {messages.length === 0 && (
          <div className="prose dark:prose-invert max-w-none bg-card dark:bg-asura-dark-gray p-4 rounded-lg">
            <ReactMarkdown className="text-foreground dark:text-asura-light">
              {`> SYSTEM ONLINE. STATUS: NOMINAL.\n> State your query.`}
            </ReactMarkdown>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-4 max-w-2xl ${message.role === 'user' ? 'ml-auto justify-end' : ''}`}>
             <div className={`rounded-lg p-1 prose dark:prose-invert max-w-none prose-p:my-2 ${ message.role === 'user' ? 'bg-primary text-primary-foreground dark:bg-asura-red/10 dark:text-asura-red-light' : 'bg-card text-card-foreground dark:bg-asura-dark-gray'}`}>
               <ReactMarkdown className="text-foreground dark:text-asura-light">{message.content}</ReactMarkdown>
             </div>
          </div>
        ))}
      </div>
      {/* INPUT AREA */}
      <div className="bg-card dark:bg-asura-darker border-t dark:border-t-2 dark:border-asura-red/50 p-6 flex-shrink-0">
         {/* Your input form JSX goes here */}
      </div>
    </div>
  );
}
