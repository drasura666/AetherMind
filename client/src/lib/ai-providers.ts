import { AIProvider, AIProviderConfig, AIResponse, ChatMessage } from '@/types/ai';

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  groq: {
    name: 'groq',
    displayName: 'Groq (Recommended)',
    models: ['llama-3.3-70b-versatile', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant', 'moonshotai/kimi-k2-instruct', 'meta-llama/llama-4-maverick-17b-128e-instruct', 'gemma2-9b-it'],
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
  switch (provider) {
    case "groq":
      return await sendGroqRequest(model, messages, apiKey);
    case "huggingface":
      return await sendHuggingFaceRequest(model, messages, apiKey);
    case "cohere":
      return await sendCohereRequest(model, messages, apiKey);
    case "openrouter":
      return await sendOpenRouterRequest(model, messages, apiKey);
    case "gemini":
      return await sendGeminiRequest(model, messages, apiKey);
    case "mistral":
      return await sendMistralRequest(model, messages, apiKey);
    default:
      return {
        content: `❌ Unknown provider: ${provider}`,
        provider,
        model,
        usage: { tokensUsed: 0, totalTokens: 0 }
      };
  }
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

// ✅ Hugging Face
async function sendHuggingFaceRequest(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  const input = messages.map(m => m.content).join("\n");

  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: input })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HF error ${response.status}`);

  return {
    content: data[0]?.generated_text || JSON.stringify(data),
    provider: "huggingface",
    model,
    usage: { tokensUsed: 0, totalTokens: 0 }
  };
}

// ✅ Cohere
async function sendCohereRequest(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  const response = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Cohere error ${response.status}`);

  return {
    content: data.text || data.reply || "No response",
    provider: "cohere",
    model,
    usage: { tokensUsed: 0, totalTokens: 0 }
  };
}

// ✅ OpenRouter
async function sendOpenRouterRequest(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `OpenRouter error ${response.status}`);

  return {
    content: data.choices?.[0]?.message?.content || "No response",
    provider: "openrouter",
    model,
    usage: {
      tokensUsed: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
  };
}

// ✅ Gemini
async function sendGeminiRequest(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  const input = messages.map(m => m.content).join("\n");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: input }] }]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Gemini error ${response.status}`);

  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
    provider: "gemini",
    model,
    usage: { tokensUsed: 0, totalTokens: 0 }
  };
}

// ✅ Mistral
async function sendMistralRequest(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Mistral error ${response.status}`);

  return {
    content: data.choices?.[0]?.message?.content || "No response",
    provider: "mistral",
    model,
    usage: {
      tokensUsed: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
  };
}

export function validateAPIKey(provider: AIProvider, apiKey: string): boolean {
  const config = AI_PROVIDERS[provider];
  if (!config) return false;

  if (!apiKey || apiKey.trim().length < 10) return false;

  const format = config.apiKeyFormat.replace('...', '');
  if (format && format.length > 0) {
    return apiKey.startsWith(format) || apiKey.length >= 20;
  }
  
  return apiKey.length >= 10;
          }
