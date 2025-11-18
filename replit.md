# Kubernetes Platform - OpenShift-like Dashboard

## Overview

This is a modern Kubernetes management platform inspired by OpenShift, providing a web-based interface for managing and monitoring Kubernetes resources. The application features a dashboard for cluster overview, along with dedicated pages for managing pods, nodes, deployments, and services. It uses mock Kubernetes data for demonstration purposes, making it suitable for development and testing without requiring an actual Kubernetes cluster.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with Vite as the build tool and development server
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and data fetching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: TailwindCSS with custom design system based on enterprise Kubernetes platforms

**Design System**:
- Typography: IBM Plex Sans font family
- Color scheme: Neutral-based palette with HSL color system supporting light/dark modes
- Spacing: Consistent Tailwind units (2, 4, 6, 8) for rhythm
- Component variants: Leverages class-variance-authority for dynamic styling

**Key UI Patterns**:
- Sidebar navigation with collapsible functionality
- Card-based dashboard layout with resource statistics
- Table-based views for detailed resource listings
- Status badges with color-coded indicators for resource health
- Responsive design with mobile breakpoint at 768px

### Backend Architecture

**Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints returning JSON
- **Data Layer**: In-memory storage using mock data generators (no database required)

**API Endpoints**:
- `/api/stats` - Dashboard statistics aggregation
- `/api/pods` - Pod resource listing
- `/api/nodes` - Node resource listing
- `/api/deployments` - Deployment resource listing
- `/api/services` - Service resource listing

**Development Architecture**:
- Vite middleware integration for HMR during development
- Single server serving both API and static assets
- Request logging with timing information for API calls

**Data Generation**:
- Mock data generators create realistic Kubernetes resource representations
- Randomized status values and metadata for demonstration purposes
- Statuses include: Running, Pending, Failed, Succeeded (pods); Ready, NotReady (nodes)

### Build and Deployment

**Development**: Single command (`npm run dev`) starts both frontend and backend
- Vite dev server with HMR for React components
- Express server with tsx for TypeScript execution
- Concurrent serving of API endpoints and frontend assets

**Production Build**:
- Vite builds optimized frontend bundle to `dist/public`
- esbuild bundles backend TypeScript to `dist/index.js`
- Single Node.js process serves static files and API

**Project Structure**:
- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared TypeScript schemas and types
- `/attached_assets` - Static assets and documentation

## External Dependencies

### Core Framework Dependencies
- **React 18+**: Frontend UI library
- **Express**: Backend web framework
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type safety across frontend and backend

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives (accordion, dialog, dropdown, popover, tabs, etc.)
- **shadcn/ui**: Pre-built component implementations using Radix UI
- **TailwindCSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **Lucide React**: Icon library

### Data Management
- **TanStack React Query**: Server state management, caching, and data synchronization
- **Zod**: Schema validation (via drizzle-zod)
- **Wouter**: Lightweight routing library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay (Replit environment)
- **@replit/vite-plugin-cartographer**: Development tooling (Replit environment)

### Database Infrastructure (Configured but Unused)
- **Drizzle ORM**: Type-safe ORM configured with PostgreSQL dialect
- **@neondatabase/serverless**: PostgreSQL serverless driver
- Configuration present in `drizzle.config.ts` but not actively used in current implementation
- Note: The application currently uses in-memory storage instead of a database

### Form Management
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Validation resolver integration

### Styling and Theming
- **PostCSS**: CSS processing with Autoprefixer
- **tailwind-merge**: Utility for merging Tailwind classes
- **clsx**: Conditional className construction

### Utilities
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel component functionality
- **cmdk**: Command menu functionality
- **nanoid**: Unique ID generation