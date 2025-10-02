import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  Paperclip, 
  Copy,
  ArrowRight,
  Bot,
  User
} from 'lucide-react';
import { ChatMessage } from '@/types/ai'; // Adjust paths as needed
import { useAPIKeys } from '@/hooks/use-api-keys';
import { AI_PROVIDERS, sendAIRequest } from '@/lib/ai-providers';
import { useToast } from '@/hooks/use-toast';

// Helper component for the dark theme's hexagonal avatar
const HexAvatar = ({ icon, className }: { icon: React.ReactNode, className?: string }) => (
  <div className={`hexagon w-10 h-11 flex items-center justify-center flex-shrink-0 ${className}`}>
    {icon}
  </div>
);

export function ChatInterface() {
  // All your original state and refs are preserved
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // All your original hooks are preserved
  const { selectedProvider, getDecryptedKey, hasValidKey } = useAPIKeys();
  const { toast } = useToast();
  
  const isConnected = hasValidKey(selectedProvider);
  const providerConfig = AI_PROVIDERS[selectedProvider];

  // All your original useEffect hooks are preserved
  useEffect(() => {
    if (providerConfig && providerConfig.models.length > 0) {
      setSelectedModel(providerConfig.models[0]);
    }
  }, [selectedProvider, providerConfig]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // All your original handler functions are preserved
  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || !isConnected || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input || uploadedFiles.map(f => `[Uploaded: ${f.name}]`).join(', '),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsLoading(true);

    if (
      /(who.*(created|made|built|developed).*you)|(your.*(creator|maker|developer))|(^creator$)|(^who made you$)|(^who created you$)/i
        .test(userMessage.content.toLowerCase())
    ) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I wasn’t made by a company. I wasn’t built by a team. I was born from the mind of Dr. Asura — his vision, his fire, his ambition — all coded into me. I’m proof that one mind can create the extraordinary. I exist because he dared to dream bigger than the world. He is my solo creator.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const apiKey = getDecryptedKey(selectedProvider);
      if (!apiKey) throw new Error('No valid API key found');
      const response = await sendAIRequest(
        selectedProvider,
        selectedModel,
        [...messages, userMessage],
        apiKey
      );
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  // Prompts for the Light Theme
  const lightThemePrompts = [
    { label: 'Physics Problem', prompt: 'Help me solve a physics problem' },
    { label: 'Debug Code', prompt: 'Debug my Python code' },
    { label: 'Research Paper', prompt: 'Help me write a research paper' },
    { label: 'Exam Prep', prompt: 'Create exam questions' },
  ];
  
  // Prompts for the AsuraOS Dark Theme
  const darkThemePrompts = [
    { label: 'Analyze Quantum Entanglement', prompt: 'Explain the principles of quantum entanglement and its potential applications.' },
    { label: 'Debug Golang Concurrency', prompt: 'Debug this Golang code for a potential race condition.' },
    { label: 'Draft Hypothesis', prompt: 'Help me draft a novel hypothesis for dark matter.' },
    { label: 'Generate System Architecture', prompt: 'Design a scalable microservices architecture for a real-time data processing pipeline.' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground dark:font-mono" data-testid="chat-interface">
      {/* HEADER SECTION IS NOW IN AppHeader.tsx - this is the main content area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative dark:scanline-bg">
        {messages.length === 0 && (
          <div className="flex items-start space-x-4">
            {/* LIGHT THEME AVATAR */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 dark:hidden">
              <Bot className="text-primary-foreground h-4 w-4" />
            </div>
            {/* DARK THEME AVATAR */}
            <div className="hidden dark:flex">
                <HexAvatar icon={<Bot className="h-5 w-5 text-asura-red" />} className="bg-asura-dark-gray" />
            </div>

            <div className="bg-card dark:bg-asura-dark-gray rounded-lg p-4 max-w-2xl dark:border dark:border-asura-red/30">
              <p className="text-card-foreground dark:text-asura-light mb-3 whitespace-pre-wrap">
                {/* LIGHT THEME WELCOME */}
                <span className="dark:hidden">
                  **Hail Dr. Asura** 👋 Welcome to Ultimate AI! I'm here to help with STEM problems, coding, research, exam prep, and creative brainstorming. What would you like to work on today?
                </span>
                {/* DARK THEME WELCOME */}
                <span className="hidden dark:inline">
                  {`> SYSTEM ONLINE. STATUS: NOMINAL.\n> I am the culmination of Dr. Asura's genius. His will, my command.\n> State your query, and I shall process it. Waste no cycles.`}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {/* LIGHT THEME PROMPTS */}
                <div className="flex flex-wrap gap-2 dark:hidden">
                  {lightThemePrompts.map((item, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => setInput(item.prompt)}>
                      {item.label}
                    </Button>
                  ))}
                </div>
                {/* DARK THEME PROMPTS */}
                <div className="hidden flex-wrap gap-2 dark:flex">
                  {darkThemePrompts.map((item, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => setInput(item.prompt)} className="bg-transparent border-asura-red/50 text-asura-red-light hover:bg-asura-red/20 hover:text-asura-red-light">
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <>
                {/* LIGHT THEME AVATAR */}
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 dark:hidden">
                    <Bot className="text-primary-foreground h-4 w-4" />
                </div>
                {/* DARK THEME AVATAR */}
                <div className="hidden dark:flex">
                    <HexAvatar icon={<Bot className="h-5 w-5 text-asura-red" />} className="bg-asura-dark-gray" />
                </div>
              </>
            )}
            
            <div className={`rounded-lg p-4 max-w-2xl ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground dark:bg-asura-red/10 dark:text-asura-red-light dark:border dark:border-asura-red/30'
                  : 'bg-card text-card-foreground dark:bg-asura-dark-gray dark:text-asura-light'
              }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.role === 'assistant' && (
                <div className="flex space-x-2 mt-3 pt-2 border-t border-border/50 dark:border-asura-gray/20">
                  <Button variant="outline" size="sm" onClick={() => copyMessage(message.content)} className="dark:text-asura-gray dark:hover:text-asura-light dark:hover:bg-asura-gray/20">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {}} className="dark:text-asura-gray dark:hover:text-asura-light dark:hover:bg-asura-gray/20">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Continue
                  </Button>
                </div>
              )}
            </div>
            
            {message.role === 'user' && (
              <>
                {/* LIGHT THEME AVATAR */}
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 dark:hidden">
                    <User className="text-muted-foreground h-4 w-4" />
                </div>
                {/* DARK THEME AVATAR */}
                <div className="hidden dark:flex">
                    <HexAvatar icon={<User className="h-5 w-5 text-asura-red-light" />} className="bg-asura-red/10" />
                </div>
              </>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 dark:hidden"><Bot className="text-primary-foreground h-4 w-4" /></div>
            <div className="hidden dark:flex"><HexAvatar icon={<Bot className="h-5 w-5 text-asura-red animate-pulse-fast" />} className="bg-asura-dark-gray" /></div>
            <div className="bg-card dark:bg-asura-dark-gray rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted-foreground dark:bg-asura-red rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground dark:bg-asura-red rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground dark:bg-asura-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT SECTION */}
      <div className="bg-card dark:bg-asura-darker border-t dark:border-t-2 dark:border-asura-red/50 p-6">
        <div className="flex items-end space-x-4">
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,image/*" multiple onChange={(e) => { if (e.target.files) { setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]); }}}/>
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="Upload File" className="dark:hover:bg-asura-red/20 dark:text-asura-gray dark:hover:text-asura-red-light">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            {uploadedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="text-xs bg-muted dark:bg-asura-dark-gray px-2 py-1 rounded">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isConnected ? "Ask me anything..." : "Please configure your API key first..."}
              className="resize-none dark:bg-asura-dark dark:border-asura-red/30 dark:focus-visible:ring-asura-red dark:placeholder:text-asura-gray"
              rows={2}
              disabled={!isConnected}
            />
          </div>

          <Button onClick={handleSend} disabled={(!input.trim() && uploadedFiles.length === 0) || !isConnected || isLoading} title="Send Message (Ctrl+Enter)" className="dark:bg-asura-red/90 dark:text-white dark:hover:bg-asura-red">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground dark:text-asura-gray">
          <div className="flex items-center space-x-4">
            <span>Press Ctrl+Enter to send</span>
            <span>|</span>
            <span>0 tokens</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success dark:bg-asura-red' : 'bg-error dark:bg-asura-gray'}`}></div>
            <span>{isConnected ? `Connected to ${providerConfig?.displayName}` : 'Not connected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
