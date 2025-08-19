import { type User, type InsertUser, type ChatSession, type InsertChatSession, type Document, type InsertDocument } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getChatSessionsByUser(userId: string): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession & { userId: string }): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession>;
  
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByUser(userId: string): Promise<Document[]>;
  createDocument(document: InsertDocument & { userId: string }): Promise<Document>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatSessions: Map<string, ChatSession>;
  private documents: Map<string, Document>;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.documents = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getChatSessionsByUser(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  async createChatSession(sessionData: InsertChatSession & { userId: string }): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...sessionData,
      id,
      userId: sessionData.userId,
      messages: sessionData.messages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const session = this.chatSessions.get(id);
    if (!session) {
      throw new Error('Chat session not found');
    }
    
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.userId === userId
    );
  }

  async createDocument(documentData: InsertDocument & { userId: string }): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...documentData,
      id,
      userId: documentData.userId,
      summary: documentData.summary || null,
      createdAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }
}

export const storage = new MemStorage();
