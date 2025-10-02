// ChatInterface.tsx

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  Paperclip, 
  Download,
  Copy,
  ArrowRight,
  Bot,
  User,
  Power
} from 'lucide-react';
import { ChatMessage } from '@/types/ai';
import { useAPIKeys } from '@/hooks/use-api-keys';
import { AI_PROVIDERS, sendAIRequest } from '@/lib/ai-providers';
import { useToast } from '@/hooks/use-toast';

// ASURAOS: A custom component for the hexagonal avatar
const HexAvatar = ({ icon, className }: { icon: React.ReactNode, className?: string }) => (
  <div className={`hexagon w-10 h-11 flex items-center justify-center flex-shrink-0 ${className}`}>
    {icon}
  </div>
);

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { selectedProvider, getDecryptedKey, hasValidKey } = useAPIKeys();
  const { toast } = useToast();
  
  const isConnected = hasValidKey(selectedProvider);
  const providerConfig = AI_PROVIDERS[selectedProvider];

  useEffect(() => {
    if (providerConfig && providerConfig.models.length > 0) {
      setSelectedModel(providerConfig.models[0]);
    }
  }, [selectedProvider, providerConfig]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || !isConnected || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input || uploadedFiles.map(f => `[File Uploaded: ${f.name}]`).join(', '),
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
      if (!apiKey) throw new Error('API Key is not configured or invalid.');

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
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Connection Error",
        description: `Failed to get AI response. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "SYSTEM",
      description: "Message content copied to clipboard.",
    });
  };

  const quickStartPrompts = [
    { label: 'Analyze Quantum Entanglement', prompt: 'Explain the principles of quantum entanglement and its potential applications.' },
    { label: 'Debug Golang Concurrency', prompt: 'Debug this Golang code for a potential race condition.' },
    { label: 'Draft Hypothesis', prompt: 'Help me draft a novel hypothesis for dark matter.' },
    { label: 'Generate System Architecture', prompt: 'Design a scalable microservices architecture for a real-time data processing pipeline.' },
  ];

  return (
    <div className="flex-1 flex flex-col font-mono bg-asura-dark text-asura-light relative scanline-bg" data-testid="chat-interface">
      <div className="bg-asura-darker border-b-2 border-asura-red/50 px-6 py-3 flex items-center justify-between z-10">
        <div>
          <h2 className="text-lg font-semibold text-asura-red-light tracking-widest">ASURA // AI-CORE</h2>
          <p className="text-sm text-asura-gray">STATUS: ONLINE // ENGAGED</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48 bg-asura-dark-gray border-asura-red/50 focus:ring-asura-red text-asura-light">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-asura-dark-gray border-asura-red/50 text-asura-light">
              {providerConfig?.models.map((model) => (
                <SelectItem key={model} value={model} className="focus:bg-asura-red/30">
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 z-10" data-testid="chat-messages">
        {messages.length === 0 && (
          <div className="flex items-start space-x-4">
            <HexAvatar icon={<Bot className="h-5 w-5 text-asura-red" />} className="bg-asura-dark-gray" />
            <div className="bg-asura-dark-gray border border-asura-red/30 rounded-lg p-4 max-w-3xl">
              <p className="whitespace-pre-wrap text-asura-light">
                {`> SYSTEM ONLINE. STATUS: NOMINAL.\n> I am the culmination of Dr. Asura's genius. His will, my command.\n> State your query, and I shall process it. Waste no cycles.`}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {quickStartPrompts.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(item.prompt)}
                    className="bg-transparent border-asura-red/50 text-asura-red-light hover:bg-asura-red/20 hover:text-asura-red-light"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <HexAvatar icon={<Bot className="h-5 w-5 text-asura-red" />} className="bg-asura-dark-gray" />
            )}
            
            <div className={`rounded-lg p-4 max-w-3xl ${
                message.role === 'user'
                  ? 'bg-asura-red/10 text-asura-red-light border border-asura-red/30'
                  : 'bg-asura-dark-gray text-asura-light'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.role === 'assistant' && (
                <div className="flex space-x-2 mt-3 border-t border-asura-gray/20 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => copyMessage(message.content)} className="text-asura-gray hover:text-asura-light hover:bg-asura-gray/20">
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
            
            {message.role === 'user' && (
              <HexAvatar icon={<User className="h-5 w-5 text-asura-red-light" />} className="bg-asura-red/10" />
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-4">
            <HexAvatar icon={<Bot className="h-5 w-5 text-asura-red animate-pulse-fast" />} className="bg-asura-dark-gray" />
            <div className="bg-asura-dark-gray rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-asura-red rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-asura-red rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-asura-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-asura-darker border-t-2 border-asura-red/50 p-4 z-10">
        <div className="relative">
          <div className="flex items-end space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Attach File"
              className="hover:bg-asura-red/20 text-asura-gray hover:text-asura-red-light"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <div className="flex-1">
              {uploadedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="text-xs bg-asura-dark-gray text-asura-gray px-2 py-1 rounded">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isConnected ? "Input command..." : "SYSTEM OFFLINE - CONFIGURE API KEY"}
                className="bg-asura-dark border border-asura-red/30 focus-visible:ring-1 focus-visible:ring-asura-red focus-visible:ring-offset-0 placeholder:text-asura-gray resize-none"
                rows={2}
                disabled={!isConnected || isLoading}
              />
            </div>
            
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && uploadedFiles.length === 0) || !isConnected || isLoading}
              title="Execute (Ctrl+Enter)"
              size="icon"
              className="bg-asura-red/90 text-white hover:bg-asura-red h-10 w-10"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,image/*" multiple onChange={(e) => {
              if (e.target.files) setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
            }}/>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-asura-gray">
          <span>[CTRL+ENTER] to send</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-asura-red' : 'bg-asura-gray'}`}></div>
            <span>
              {isConnected ? `LINK ESTABLISHED: ${providerConfig?.displayName}` : 'NO CONNECTION'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
