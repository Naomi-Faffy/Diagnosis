# Diagnosis
# Diagnosis & Sensors - Automotive Service Website

## Overview

This is a full-stack web application for "Diagnosis & Sensors," an automotive diagnostic and repair service company based in Zimbabwe. The application is built with a modern tech stack featuring React frontend with TypeScript, Express.js backend, and PostgreSQL database integration through Drizzle ORM. The site serves as a professional showcase for automotive diagnostic services, sensor supply, and repair solutions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and glassmorphism effects
- **State Management**: TanStack Query for server state and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: In-memory storage with planned PostgreSQL session store
- **Development**: Hot reload with Vite middleware integration

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Blog Posts Table**: Content management with title, content, excerpt, category, and publishing status
- **Schema Definition**: Centralized in `shared/schema.ts` with Drizzle ORM
- **Validation**: Zod schemas generated from Drizzle tables
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Frontend Components
- **Landing Page**: Single-page application with sections for services, about, products, and contact
- **Blog System**: Full-featured blog with article listings, individual post pages, and category filtering
- **Floating Navigation**: Responsive navigation with glassmorphism design including blog access
- **Service Sections**: Detailed automotive service offerings with visual cards
- **Contact Integration**: WhatsApp integration and email contact forms
- **Responsive Design**: Mobile-first approach with desktop enhancements

### Backend Services
- **Storage Interface**: Abstracted storage layer with in-memory and database implementations
- **Blog API**: RESTful endpoints for blog post CRUD operations
- **Route Registration**: Centralized route management in Express
- **Development Tools**: Integrated Vite middleware for seamless development experience
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Shared Resources
- **Type Definitions**: Shared TypeScript types between frontend and backend
- **Schema Validation**: Unified Zod schemas for data validation
- **Database Models**: Drizzle ORM table definitions

## Data Flow

1. **Client Requests**: Frontend makes API calls through TanStack Query
2. **Server Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM provides type-safe database interactions
4. **Response Handling**: Structured JSON responses with proper error handling
5. **State Management**: TanStack Query manages caching and synchronization

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for cloud database hosting
- **UI Components**: Extensive Radix UI component library
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: Vite with TypeScript support and error overlays

### Third-Party Integrations
- **WhatsApp**: Direct messaging integration for customer contact
- **Google Fonts**: Inter and Orbitron fonts for modern typography
- **Font Awesome**: Icon library for social media and UI elements
- **Unsplash**: High-quality automotive imagery

### Build and Development Tools
- **ESBuild**: Fast bundling for production server builds
- **TSX**: TypeScript execution for development
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon database connection via environment variables
- **Port Configuration**: Development server on port 5000

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Built to `dist/public` directory
- **Server Entry**: Bundled server code in `dist/index.js`



## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Changelog

```
Changelog:
- June 13, 2025. Initial setup
- June 13, 2025. Added blog functionality with full CRUD operations, updated logo design to match brand identity
``` 

modules = ["nodejs-20", "web"]
run = "npm run dev"
hidden = [".config", ".git", "generated-icon.png", "node_modules", "dist"]

[nix]
channel = "stable-24_05"

[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]

[[ports]]
localPort = 5000
externalPort = 80

[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "agent"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "Start application"

[[workflows.workflow]]
name = "Start application"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000
