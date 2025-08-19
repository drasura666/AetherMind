import { useState, useEffect } from 'react';
import { AIProvider, APIKeyStore } from '@/types/ai';
import { encryptAPIKey, decryptAPIKey } from '@/lib/crypto';
import { validateAPIKey } from '@/lib/ai-providers';

export function useAPIKeys() {
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, APIKeyStore | null>>({
    groq: null,
    huggingface: null,
    openrouter: null,
    cohere: null,
    gemini: null,
    mistral: null,
  });
  
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('groq');

  useEffect(() => {
    // Load stored keys on mount
    loadStoredKeys();
  }, []);

  const loadStoredKeys = () => {
    try {
      const stored = localStorage.getItem('ultimateai_api_keys');
      const provider = localStorage.getItem('ultimateai_selected_provider') as AIProvider;
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setApiKeys(parsed);
      }
      
      if (provider) {
        setSelectedProvider(provider);
      }
    } catch (error) {
      console.error('Failed to load stored keys:', error);
    }
  };

  const storeAPIKey = (provider: AIProvider, apiKey: string): boolean => {
    try {
      if (!validateAPIKey(provider, apiKey)) {
        return false;
      }

      const encryptedKey = encryptAPIKey(apiKey);
      const keyStore: APIKeyStore = {
        provider,
        encryptedKey,
        isValid: true,
        lastValidated: new Date(),
      };

      const newApiKeys = {
        ...apiKeys,
        [provider]: keyStore,
      };

      setApiKeys(newApiKeys);
      localStorage.setItem('ultimateai_api_keys', JSON.stringify(newApiKeys));
      return true;
    } catch (error) {
      console.error('Failed to store API key:', error);
      return false;
    }
  };

  const getDecryptedKey = (provider: AIProvider): string | null => {
    try {
      const keyStore = apiKeys[provider];
      if (!keyStore || !keyStore.isValid) {
        return null;
      }

      return decryptAPIKey(keyStore.encryptedKey);
    } catch (error) {
      console.error('Failed to decrypt API key:', error);
      return null;
    }
  };

  const removeAPIKey = (provider: AIProvider) => {
    const newApiKeys = {
      ...apiKeys,
      [provider]: null,
    };
    
    setApiKeys(newApiKeys);
    localStorage.setItem('ultimateai_api_keys', JSON.stringify(newApiKeys));
  };

  const selectProvider = (provider: AIProvider) => {
    setSelectedProvider(provider);
    localStorage.setItem('ultimateai_selected_provider', provider);
  };

  const hasValidKey = (provider: AIProvider): boolean => {
    return apiKeys[provider]?.isValid ?? false;
  };

  const clearAllKeys = () => {
    setApiKeys({
      groq: null,
      huggingface: null,
      openrouter: null,
      cohere: null,
      gemini: null,
      mistral: null,
    });
    localStorage.removeItem('ultimateai_api_keys');
    localStorage.removeItem('ultimateai_selected_provider');
  };

  return {
    apiKeys,
    selectedProvider,
    storeAPIKey,
    getDecryptedKey,
    removeAPIKey,
    selectProvider,
    hasValidKey,
    clearAllKeys,
  };
}
