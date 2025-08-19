import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";

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
      
      // For demo purposes, we'll store the file content directly
      // In production, you might want to process PDFs, etc.
      const document = await storage.createDocument({
        filename: originalname,
        content: content,
        type: mimetype.includes('pdf') ? 'pdf' : 'text',
        userId: 'anonymous' // In real app, get from session
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

  // AI proxy endpoint to handle API calls with user's keys
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { provider, model, messages, apiKey } = req.body;
      
      // This endpoint would proxy to various AI providers
      // For now, return a placeholder response
      res.json({ 
        message: "AI proxy endpoint - implement with actual provider integration",
        provider,
        model 
      });
    } catch (error) {
      res.status(500).json({ error: 'AI request failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
