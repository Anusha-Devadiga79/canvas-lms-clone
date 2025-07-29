# Student Dashboard Application

## Overview

This is a full-stack student dashboard application built with React, Express, and PostgreSQL. It simulates a Canvas LMS-style interface where students can view their courses, track assignments, and manage tasks. The application uses a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components for a polished user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Canvas LMS-inspired color scheme
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Development**: Hot reload with Vite middleware integration

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Fallback Storage**: In-memory storage class for development/testing

## Key Components

### Database Schema
The application defines four main entities:
- **Users**: Student/instructor accounts with role-based access
- **Courses**: Course information including progress tracking
- **Tasks**: Student to-do items with priority and completion status
- **Assignments**: Course-specific assignments with grading capabilities

### Frontend Components
- **Dashboard**: Main landing page showing course overview and tasks
- **CourseCard**: Reusable component displaying course information
- **TodoList**: Interactive task management with completion tracking
- **Sidebar**: Responsive navigation with mobile sheet overlay
- **Header**: User greeting and notification access

### API Layer
RESTful API endpoints:
- `GET /api/courses` - Retrieve all courses
- `GET /api/courses/:id` - Get specific course details
- `GET /api/tasks` - Fetch user tasks
- `PATCH /api/tasks/:id` - Update task status

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data
2. **API Processing**: Express routes handle HTTP requests and validate parameters
3. **Data Access**: Storage layer (currently in-memory, designed for Drizzle ORM)
4. **Response Handling**: JSON responses with proper error handling and logging
5. **State Updates**: Query client automatically updates UI on successful mutations

The application uses optimistic updates for task completion and automatic query invalidation to keep the UI synchronized with server state.

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Modern icon library
- **Class Variance Authority**: Type-safe component variants

### Development Tools
- **Replit Integration**: Development banner and error overlay
- **TypeScript**: Full type safety across the stack
- **ESBuild**: Fast JavaScript bundling for production

### Database and Backend
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle Kit**: Database migration and introspection tools
- **Connect PG Simple**: Session store for PostgreSQL (planned feature)

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite middleware integrated with Express for seamless development
- **Type Checking**: Continuous TypeScript compilation without emit
- **Database**: Uses DATABASE_URL environment variable for connection

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static Files**: Production server serves built frontend from Express
- **Environment**: NODE_ENV-based configuration switching

### Database Setup
- **Migration Command**: `npm run db:push` applies schema changes
- **Connection**: Requires DATABASE_URL environment variable
- **Dialect**: Configured for PostgreSQL with Drizzle's pg dialect

The application is designed to work seamlessly in Replit's environment with automatic builds and deployment capabilities.