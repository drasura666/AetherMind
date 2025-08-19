export type AIProvider = 'groq' | 'huggingface' | 'openrouter' | 'cohere' | 'gemini' | 'mistral';

export interface AIProviderConfig {
  name: string;
  displayName: string;
  models: string[];
  apiKeyFormat: string;
  freeAvailable: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface APIKeyStore {
  provider: AIProvider;
  encryptedKey: string;
  isValid: boolean;
  lastValidated: Date;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  usage?: {
    tokensUsed: number;
    totalTokens: number;
  };
}
