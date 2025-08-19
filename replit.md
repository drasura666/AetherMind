# Ultimate AI - Multi-Modal AI Platform

## Overview

Ultimate AI is a comprehensive multi-modal AI platform that provides specialized tools for STEM education, coding, research, and creative work. The application is built as a full-stack TypeScript solution with a React frontend and Express backend, featuring a modular architecture that supports multiple AI providers through a "bring your own API key" model. The platform emphasizes privacy by storing encrypted API keys locally and never transmitting them to external servers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state and local React state for UI
- **Routing**: Wouter for lightweight client-side routing
- **Module Structure**: Component-based architecture with specialized modules for different AI use cases:
  - Chat Interface: General-purpose AI conversation
  - STEM Lab: Math, physics, chemistry problem solving
  - Code Lab: Programming assistance and code execution
  - Research Hub: Academic research and paper writing tools
  - Exam Prep: Study assistance and test preparation
  - Creative Studio: Creative writing and content generation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with file upload support using Multer
- **Session Management**: In-memory storage for chat sessions and documents
- **Development Setup**: Vite integration for hot module replacement and development server

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for schema management and migrations
- **Provider**: Neon Database serverless PostgreSQL
- **Schema Design**: 
  - Users table for authentication
  - Chat sessions with JSON message storage
  - Documents table for file uploads and content management
- **Fallback Storage**: In-memory storage implementation for development/testing

### Authentication and Authorization
- **API Key Management**: Client-side encrypted storage using CryptoJS AES encryption
- **Provider Support**: Multiple AI providers (Groq, Hugging Face, OpenRouter, Cohere, Gemini, Mistral)
- **Security Model**: Zero-trust approach where API keys never leave the client device
- **Session Management**: Anonymous user sessions with local storage persistence

### AI Provider Integration
- **Multi-Provider Support**: Abstracted AI provider interface supporting 6 different services
- **Provider Configuration**: Each provider has specific models, API key formats, and capabilities
- **Request Handling**: Unified request/response handling across different provider APIs
- **Error Management**: Comprehensive error handling with user-friendly messaging

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **express**: Web application framework for Node.js
- **multer**: Middleware for handling file uploads
- **connect-pg-simple**: PostgreSQL session store for Express

### AI Integration
- **@google/genai**: Google Gemini AI SDK for generative AI capabilities
- **Multiple AI SDKs**: Support for various AI providers through HTTP clients

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **wouter**: Lightweight routing library for React
- **class-variance-authority**: Utility for managing CSS class variants
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Forms with validation
- **crypto-js**: Client-side encryption for API key storage

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and schema management
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements

### Database and Storage
- **PostgreSQL**: Primary database through Neon serverless
- **File Storage**: In-memory file handling with plans for cloud storage integration
- **Session Storage**: PostgreSQL-backed session management with fallback to memory