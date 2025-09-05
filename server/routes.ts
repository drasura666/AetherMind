import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import fetch from "node-fetch"; // make sure node-fetch is installed

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
import { storage } from "./storage";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint for documents
  app.post("/api/upload", upload.single("file"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { originalname, buffer, mimetype } = req.file;
      const content = buffer.toString('utf-8');
      
      const document = await storage.createDocument({
        filename: originalname,
        content: content,
        type: mimetype.includes('pdf') ? 'pdf' : 'text',
        userId: 'anonymous'
      });

      res.json({ document });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // Chat session management
  app.get("/api/chat-sessions", async (req, res) => {
    try {
      const sessions = await storage.getChatSessionsByUser('anonymous');
      res.json({ sessions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat sessions' });
    }
  });

  app.post("/api/chat-sessions", async (req, res) => {
    try {
      const { title, provider, model } = req.body;
      const session = await storage.createChatSession({
        title,
        provider,
        model,
        messages: [],
        userId: 'anonymous'
      });
      res.json({ session });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chat session' });
    }
  });

  // Exam prep generator (AI-powered)
app.post("/api/exam-prep", async (req, res) => {
  try {
    const { examType, difficulty, topics } = req.body;

    // ✅ Auto-pick defaults (you can later plug in user selection if needed)
    const provider = "groq";
    const model = "llama-3-8b-8192"; // works well for Q&A
    const apiKey = process.env.GROQ_API_KEY; // load from env (secure)

    if (!apiKey) {
      return res.status(400).json({ error: "No API key configured" });
    }

    // Build a prompt for the AI
    const messages = [
      {
        role: "system",
        content:
          "You are an exam question generator. Only output strict JSON. " +
          "Generate multiple-choice questions with fields: id, type, question, options, correct, explanation, topic.",
      },
      {
        role: "user",
        content: `Generate 5 ${difficulty} ${examType} mock test questions on: ${Array.isArray(topics) ? topics.join(", ") : topics}.
Format strictly as:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "string",
      "topic": "string"
    }
  ]
}`,
      },
    ];

    // Call your AI proxy endpoint
    const resp = await fetch("http://localhost:3000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, model, messages, apiKey }),
    });

    const data = await resp.json();

    // ✅ Try extracting valid JSON from response
    let questions: any[] = [];
    try {
      const match = data.response.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        questions = parsed.questions ?? [];
      }
    } catch (err) {
      console.error("Parse error:", err);
    }

    // Fallback if no questions parsed
    if (!questions.length) {
      questions = [
        {
          id: 1,
          type: "multiple-choice",
          question: "AI failed to generate questions.",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: "Fallback question due to parsing error.",
          topic: examType,
        },
      ];
    }

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});
    // Call your existing AI proxy
    const resp = await fetch("http://localhost:3000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, model, messages, apiKey }),
    });

    const data = await resp.json();

    // Try parsing the AI's response
    let questions;
    try {
      questions = JSON.parse(data.response);
    } catch {
      questions = [{ error: "AI did not return valid JSON", raw: data.response }];
    }

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

  app.put("/api/chat-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const session = await storage.updateChatSession(id, updates);
      res.json({ session });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update chat session' });
    }
  });

  // Document management
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocumentsByUser('anonymous');
      res.json({ documents });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  });

  // ✅ AI proxy endpoint with real provider integration
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { provider, model, messages, apiKey } = req.body;

      let responseText = "Provider not implemented.";

      // Groq
      if (provider === "groq") {
        const resp = await fetch("https://api.groq.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ model, messages })
        });
        const data = await resp.json();
        responseText = data.choices?.[0]?.message?.content || "No response";
      }

      // Mistral
      if (provider === "mistral") {
        const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ model, messages })
        });
        const data = await resp.json();
        responseText = data.choices?.[0]?.message?.content || "No response";
      }

      // Cohere
      if (provider === "cohere") {
        const resp = await fetch("https://api.cohere.ai/v1/chat", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ model, messages })
        });
        const data = await resp.json();
        responseText = data.text || data.message || "No response";
      }

      // Hugging Face
      if (provider === "huggingface") {
        const resp = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: messages.map((m: any) => m.content).join("\n") })
        });
        const data = await resp.json();
        responseText = data[0]?.generated_text || JSON.stringify(data);
      }

      // OpenRouter
      if (provider === "openrouter") {
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ model, messages })
        });
        const data = await resp.json();
        responseText = data.choices?.[0]?.message?.content || "No response";
      }

      res.json({ response: responseText });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI request failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
