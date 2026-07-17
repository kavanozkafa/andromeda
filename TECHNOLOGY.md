# Andromeda - AI Development Context

## Project Overview

This is a modern full-stack React application built with TanStack Start (SSR framework). The project follows a monorepo-style structure with TypeScript-first development.

## Technology Stack

### Core Framework

- **React 19** - UI library with latest concurrent features
- **TypeScript 6** - Strongly typed JavaScript superset
- **Vite 8** - Lightning-fast build tool and dev server

### Routing & Navigation

- **TanStack Router** - Type-safe routing with file-based route generation
- **TanStack Start** - Full-stack React framework with SSR support
- **Router DevTools** - Development tools for route debugging

### State Management & Data Fetching

- **TanStack Query** - Server state management with caching
- **TanStack React Form** - Form state management
- **TanStack React Table** - Headless table library for data grids

### Styling

- **TailwindCSS 4** - Utility-first CSS framework
- **@tailwindcss/typography** - Typography plugin for prose styling

### Validation

- **Zod 4** - TypeScript-first schema validation

### UI Components

- **Mantine UI** - Full-featured React component library (v9)
  - @mantine/core - Core UI components (Button, Modal, Table, etc.)
  - @mantine/hooks - Custom React hooks
  - @mantine/form - Form state management with validation
  - @mantine/modals - Modal management
  - @mantine/notifications - Toast notifications
- **Emotion** - CSS-in-JS library (Mantine dependency)
- **Lucide React** - Icon library

### Testing

- **Vitest** - Vite-native testing framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/dom** - DOM testing utilities
- **jsdom** - JavaScript DOM implementation for testing

### Code Quality

- **ESLint 9** - Code linting
- **Prettier** - Code formatting
- **@tanstack/eslint-config** - TanStack-specific lint rules

### Development Tools

- **TanStack DevTools** - React DevTools integration
- **@tanstack/router-cli** - CLI tools for route generation
- **@tanstack/devtools-vite** - Vite plugin for devtools

### Utilities

- **@faker-js/faker** - Fake data generation for testing
- **@tanstack/match-sorter-utils** - Fuzzy sorting/filtering utilities

## Project Structure

```
src/
├── routes/          # File-based routing (TanStack Router)
│   ├── __root.tsx           # Root layout with MantineProvider
│   ├── index.tsx            # Home page
│   ├── about.tsx            # About page
│   ├── duyurular.tsx        # Announcements CRUD page
│   ├── kullanicilar.tsx     # User management page
│   ├── bankacilik-loglari.tsx # Banking logs data grid
│   └── demo/               # Demo pages
├── components/      # Reusable UI components
│   ├── Header.tsx           # Header with hamburger menu
│   ├── Footer.tsx           # Footer component
│   ├── ThemeToggle.tsx      # Light/Dark theme toggle
│   ├── NavigationDrawer.tsx # Left sidebar navigation drawer
│   └── LinkTree.tsx         # Technology links with icons
├── data/            # Mock data and data models
│   └── mock-data.ts        # Faker-based mock data generators
├── hooks/           # Custom React hooks
├── integrations/    # Third-party integrations
│   └── tanstack-query/     # TanStack Query setup
└── styles.css       # Global styles and TailwindCSS
```

## Development Commands

```bash
pnpm dev          # Start development server (port 3000)
pnpm build        # Production build
pnpm test         # Run tests with Vitest
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm generate-routes  # Generate route tree
```

## Application Pages

### Home Page (`/`)

- Landing page with hero section and feature cards
- LinkTree component showing technology stack with icons
- Quick navigation to application pages

### Duyurular (`/duyurular`)

- Announcements management with CRUD operations
- Add new announcements via modal form
- Edit existing announcements
- Delete with confirmation dialog
- Status badges (aktif/pasif/taslak)

### Kullanıcı İşlemleri (`/kullanicilar`)

- Customer information management
- Search functionality by name, email, or account number
- Edit customer details via modal form
- Display bakiye (balance) in Turkish Lira

### Dijital Bankacılık Logları (`/bankacilik-loglari`)

- Data grid with 50 mock banking transactions
- Columns: Müşteri Adı, İşlem Tipi, Tutar, Tarih, Durum, IP Adresi, Cihaz, Konum, Referans No
- Searchable by customer name, reference number, or transaction type
- Pagination with 10 records per page
- Color-coded badges for transaction types and status

### Navigation

- Hamburger menu (left drawer) accessible from header
- Links to all application pages

## AI Assistant Guidelines

### When Working With This Project:

1. **Type Safety First** - Always use TypeScript types, leverage Zod for runtime validation
2. **Component Patterns** - Use functional components with hooks, follow existing component structure
3. **Server Components** - Leverage TanStack Start's server-side capabilities
4. **Data Fetching** - Use TanStack Query for server state, avoid manual useEffect for data fetching
5. **Routing** - File-based routing in src/routes/, use TanStack Router's type-safe navigation
6. **Styling** - Use TailwindCSS utility classes, maintain consistent design tokens
7. **Testing** - Write tests with Vitest + React Testing Library, follow existing test patterns
8. **Performance** - Use React.memo, useMemo, useCallback appropriately, leverage concurrent features
9. **Mantine UI** - Use Mantine components for forms, modals, tables, and UI elements
   - Import from `@mantine/core` for UI components
   - Use `@mantine/form` for form state management
   - Use `@mantine/notifications` for toast messages
   - Follow green/white color theme (primaryColor: 'green')

### Code Conventions:

- Use TypeScript interfaces over types when possible
- Prefer named exports over default exports
- Follow existing naming conventions in the codebase
- Use Zod schemas for form validation and API contracts
- Implement proper error boundaries and loading states
- Use Mantine's `useForm` hook for form management
- Use Mantine's `notifications` for user feedback
- Keep components in src/components/ reusable across pages
