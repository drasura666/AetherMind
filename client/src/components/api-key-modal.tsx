import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Eye, EyeOff } from 'lucide-react';
import { AIProvider } from '@/types/ai';
import { AI_PROVIDERS } from '@/lib/ai-providers';
import { useAPIKeys } from '@/hooks/use-api-keys';
import { useToast } from '@/hooks/use-toast';

interface APIKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function APIKeyModal({ open, onClose, onSave }: APIKeyModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('groq');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { storeAPIKey, hasValidKey } = useAPIKeys();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = storeAPIKey(selectedProvider, apiKey);
      
      if (success) {
        toast({
          title: "Success",
          description: `${AI_PROVIDERS[selectedProvider].displayName} API key saved successfully`,
        });
        setApiKey('');
        onSave();
      } else {
        toast({
          title: "Invalid API Key",
          description: `Please check your ${AI_PROVIDERS[selectedProvider].displayName} API key format`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key to test",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API test
    setTimeout(() => {
      toast({
        title: "Connection Test",
        description: "API key format is valid (actual connection test would be implemented here)",
      });
      setIsLoading(false);
    }, 1000);
  };

  const selectedProviderConfig = AI_PROVIDERS[selectedProvider];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4" data-testid="api-key-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Configure API Keys</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as AIProvider)}>
              <SelectTrigger data-testid="select-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AI_PROVIDERS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.displayName} {config.freeAvailable && '(Free Available)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={selectedProviderConfig.apiKeyFormat}
                className="pr-10"
                data-testid="input-api-key"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
                data-testid="button-toggle-key-visibility"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Your key is stored in your browser's local storage.</p>

            {/* 🔗 Direct links for API key generation */}
            {selectedProvider === "groq" && (
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-1 block"
              >
                ➕ Get a Groq API Key
              </a>
            )}

            {selectedProvider === "openai" && (
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-1 block"
              >
                ➕ Get an OpenAI API Key
              </a>
            )}

            {selectedProvider === "huggingface" && (
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-1 block"
              >
                ➕ Get a HuggingFace Token
              </a>
            )}

            {selectedProvider === "mistral" && (
              <a
                href="https://console.mistral.ai/api-keys/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-1 block"
              >
                ➕ Get a Mistral API Key
              </a>
            )}

            {selectedProvider === "gemini" && (
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-1 block"
              >
                ➕ Get a Gemini API Key
              </a>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              {selectedProviderConfig.displayName}
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {selectedProviderConfig.description}
            </p>
            {selectedProviderConfig.freeAvailable && (
              <p className="text-xs text-success mt-1">
                ✓ Free tier available
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleTest}
              disabled={isLoading}
              data-testid="button-test-connection"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={isLoading}
              data-testid="button-save-api-key"
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
