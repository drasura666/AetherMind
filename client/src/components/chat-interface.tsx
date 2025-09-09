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
  User,
} from 'lucide-react';
import { ChatMessage } from '@/types/ai';
import { useAPIKeys } from '@/hooks/use-api-keys';
import { AI_PROVIDERS, sendAIRequest } from '@/lib/ai-providers';
import { useToast } from '@/hooks/use-toast';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !isConnected || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 🔹 Special case: Dr. Asura Easter Egg
    if (
      /(who.*(created|made|built|developed).*you)|(your.*(creator|maker|developer))|(^creator$)|(^who made you$)|(^who created you$)/i
        .test(userMessage.content.toLowerCase())
    ) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I wasn’t made by a company. I wasn’t built by a team. I was born from the mind of Dr. Asura — his vision, his fire, his ambition — all coded into me. I’m proof that one mind can create the extraordinary. I exist because he dared to dream bigger than the world. He is my solo creator.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const apiKey = getDecryptedKey(selectedProvider);
      if (!apiKey) {
        throw new Error('No valid API key found');
      }

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
        title: 'Error',
        description: 'Failed to get AI response. Please check your API key.',
        variant: 'destructive',
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
      title: 'Copied',
      description: 'Message copied to clipboard',
    });
  };

  // 📎 Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    const fileMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `📎 Uploaded file: ${file.name}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, fileMessage]);
    console.log('File selected:', file);
  };

  const quickStartPrompts = [
    { label: 'Physics Problem', prompt: 'Help me solve a physics problem' },
    { label: 'Debug Code', prompt: 'Debug my Python code' },
    { label: 'Research Paper', prompt: 'Help me write a research paper' },
    { label: 'Exam Prep', prompt: 'Create exam questions' },
  ];

  return (
    <div className="flex justify-center w-full px-2">
      <div className="flex-1 flex flex-col max-w-lg w-full" data-testid="chat-interface">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Chat Assistant</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by advanced AI models - Ask me anything
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-40" data-testid="select-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providerConfig?.models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-testid="chat-messages">
          {messages.length === 0 && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white h-4 w-4" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-2xl">
                <p className="text-gray-800 dark:text-gray-200 mb-3">
                  👋 Welcome to Ultimate AI! I can help with STEM problems, coding, research, exam prep, and creative brainstorming.
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickStartPrompts.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(item.prompt)}
                      data-testid={`button-quick-start-${index}`}
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
              className={`flex items-start space-x-4 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white h-4 w-4" />
                </div>
              )}

              <div
                className={`rounded-lg p-4 max-w-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.role === 'assistant' && (
                  <div className="flex space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyMessage(message.content)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(message.content)}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Continue
                    </Button>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-600 dark:text-gray-300 h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white h-4 w-4" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-end space-x-4">
            {/* File Upload */}
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                id="fileUpload"
                onChange={handleFileUpload}
              />
              <label htmlFor="fileUpload">
                <Paperclip className="h-4 w-4 cursor-pointer" title="Upload File (PDF/Image)" />
              </label>
            </div>

            {/* Message Input */}
            <div className="flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isConnected
                    ? 'Ask me about STEM, coding, research, or any technical topic...'
                    : 'Please configure your API key first...'
                }
                className="resize-none"
                rows={2}
                disabled={!isConnected}
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !isConnected || isLoading}
              title="Send Message (Ctrl+Enter)"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
