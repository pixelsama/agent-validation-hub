# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Agent Validation Hub** - a React-based web application for testing and validating AI agents. It provides a comprehensive platform for managing test datasets, running validation tests, analyzing results, and crawling data for agent evaluation.

The application supports multiple task types:
- **Intent Recognition** (`intent`) - Classifying user intents
- **Named Entity Recognition** (`ner`) - Extracting entities from text
- **Text-to-SQL** (`t2sql`) - Converting natural language to SQL queries  
- **End-to-End** (`e2e`) - Full conversational testing
- **Mixed** - Combined task types

## Development Commands

```bash
# Install dependencies (using pnpm as configured packageManager)
pnpm install

# Start development server (runs on port 8080)
pnpm run dev

# Build for production
pnpm run build

# Build for development environment
pnpm run build:dev

# Run linting
pnpm run lint

# Preview production build
pnpm run preview
```

## Architecture & Key Components

### Frontend Structure
- **React 18** with TypeScript and Vite build system
- **shadcn/ui** components with Radix UI primitives
- **TanStack Query** for API state management
- **React Router** for navigation with nested routes in `AppLayout`
- **Tailwind CSS** for styling with custom theme support

### Main Pages Structure
```
src/pages/
├── Index.tsx          # Dashboard/home page
├── Crawler.tsx        # Data spider management (src/services/api.ts:362-402)
├── Datasets.tsx       # Test dataset management (src/services/api.ts:250-284) 
├── Agents.tsx         # Agent/endpoint configuration (src/services/api.ts:286-316)
├── TestRuns.tsx       # Test execution management (src/services/api.ts:318-347)
├── Results.tsx        # Results analysis (src/services/api.ts:349-353)
└── Settings.tsx       # App configuration
```

### Data Layer & API Service
- **Centralized API service** at `src/services/api.ts` with comprehensive TypeScript types
- **Mock system** enabled by default (`USE_MOCKS = true` in `src/config.ts`)
- **LocalStorage-based** mock data persistence for development
- **Database-aligned types** for seamless backend integration

Key API endpoints when `USE_MOCKS = false`:
- `/api/datasets` - Dataset CRUD operations
- `/api/questions` - Question management within datasets  
- `/api/agents` - Agent configuration management
- `/api/endpoints` - LLM endpoint management
- `/api/tests/*` - Test run execution and monitoring
- `/api/spiders/*` - Data crawling operations

### Configuration
- **Mock/Live API toggle**: Set `USE_MOCKS = false` in `src/config.ts` to connect to FastAPI backend
- **API base URL**: Configured as `http://localhost:8000` 
- **Polling interval**: 2 seconds for test run progress updates
- **Path alias**: `@/` maps to `src/` directory

### Component Architecture
- **AppLayout** provides consistent navigation sidebar and header
- **UI components** from shadcn/ui located in `src/components/ui/`
- **Layout components** in `src/components/layout/`
- **Common components** in `src/components/common/`

### Type System
The codebase uses strict TypeScript with comprehensive type definitions for:
- Database entities (Dataset, Question, Agent, TestRun, etc.)
- API request/response shapes
- Task types and validation states
- Spider/crawler configurations

## Development Notes

- **TypeScript config** relaxed for rapid prototyping (noImplicitAny: false, strictNullChecks: false)
- **ESLint** configured with React hooks and TypeScript rules
- **Vite** configured with SWC for fast builds and HMR
- **Component tagging** enabled in development mode via lovable-tagger
- The application is built using **Lovable.dev** platform for rapid prototyping

## Backend Integration

When ready to connect to a real backend:
1. Set `USE_MOCKS = false` in `src/config.ts`
2. Ensure FastAPI backend is running on `localhost:8000`
3. The API service automatically switches from localStorage to HTTP requests
4. All TypeScript types are already aligned with the expected database schema