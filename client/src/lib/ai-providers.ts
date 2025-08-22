import { AIProvider, AIProviderConfig, AIResponse, ChatMessage } from '@/types/ai';

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  groq: {
    name: 'groq',
    displayName: 'Groq (Recommended)',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama-guard-3-8b', 'gemma2-9b-it', 'mistral-saba-24b'],
    apiKeyFormat: 'gsk_...',
    freeAvailable: true,
    description: 'Ultra-fast inference with 14,400 requests/day free'
  },
  huggingface: {
    name: 'huggingface',
    displayName: 'Hugging Face',
    models: ['microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill'],
    apiKeyFormat: 'hf_...',
    freeAvailable: true,
    description: 'Free inference API with various open models'
  },
  openrouter: {
    name: 'openrouter',
    displayName: 'OpenRouter',
    models: ['openai/gpt-4', 'anthropic/claude-3-opus', 'meta-llama/llama-2-70b'],
    apiKeyFormat: 'sk-or-...',
    freeAvailable: false,
    description: 'Unified access to premium models'
  },
  cohere: {
    name: 'cohere',
    displayName: 'Cohere',
    models: ['command-r-plus', 'command-r', 'command'],
    apiKeyFormat: 'co-...',
    freeAvailable: true,
    description: 'Enterprise-grade language models'
  },
  gemini: {
    name: 'gemini',
    displayName: 'Google Gemini',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-pro'],
    apiKeyFormat: 'AIza...',
    freeAvailable: true,
    description: 'Google AI with multimodal capabilities'
  },
  mistral: {
    name: 'mistral',
    displayName: 'Mistral AI',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    apiKeyFormat: 'sk-...',
    freeAvailable: false,
    description: 'Efficient European AI models'
  }
};

export async function sendAIRequest(
  provider: AIProvider,
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  if (provider === 'groq') {
    return await sendGroqRequest(model, messages, apiKey);
  }
  
  // For other providers, return simulation for now
  const response: AIResponse = {
    content: `This provider (${provider}) integration is coming soon! For now, try Groq for real AI responses.`,
    provider,
    model,
    usage: {
      tokensUsed: 10,
      totalTokens: 20
    }
  };

  await new Promise(resolve => setTimeout(resolve, 500));
  return response;
}

async function sendGroqRequest(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  try {
    // Format messages for Groq API (OpenAI compatible)
    const groqMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: groqMessages,
        max_tokens: 4000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Groq API');
    }

    return {
      content: data.choices[0].message.content,
      provider: 'groq',
      model: model,
      usage: {
        tokensUsed: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    console.error('Groq API request failed:', error);
    
    // Return a helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: `❌ **API Error**: ${errorMessage}\n\nPlease check:\n1. Your Groq API key is valid\n2. You have sufficient credits\n3. Your internet connection is stable\n\nGet a free API key at: https://console.groq.com/`,
      provider: 'groq',
      model: model,
      usage: {
        tokensUsed: 0,
        totalTokens: 0
      }
    };
  }
}

export function validateAPIKey(provider: AIProvider, apiKey: string): boolean {
  const config = AI_PROVIDERS[provider];
  if (!config) return false;

  // More lenient validation - just check if it's not empty and has reasonable length
  if (!apiKey || apiKey.trim().length < 10) return false;

  // Optional: Check format prefix if provided
  const format = config.apiKeyFormat.replace('...', '');
  if (format && format.length > 0) {
    // Allow keys that start with the format OR are long enough to be valid
    return apiKey.startsWith(format) || apiKey.length >= 20;
  }
  
  return apiKey.length >= 10;
}
