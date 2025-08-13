# Polytask

A client-only, Linear-inspired task manager that demonstrates how to build a web app centered around commands. The app showcases a command registry integrated with a command palette, global keyboard shortcuts, and Redux for state management.

> [!NOTE]  
> This project is a client-only demo. It ships mock data and focuses on the command architecture rather than persistence. To make it production-ready, add a backend, authentication, and replace mock data with API integrations.

## Features

- Command palette powered by a centralized command registry
- Global keyboard shortcuts mapped to commands
- Redux Toolkit state management with undo/redo support
- Task list with filters, statuses, priorities, assignees, and details view
- Theme switching (light/dark) with system preference support
- Accessible UI built on Radix UI primitives

## Tech stack

- Framework: Next.js 15 (App Router) + React 19
- Styling: Tailwind CSS v4, tailwind-merge, class-variance-authority
- State: Redux Toolkit, React Redux, redux-undo
- Commands UI: cmdk (command palette)
- UI Primitives: Radix UI (Dialog, Popover, Tooltip, Dropdown, Context Menu, Scroll Area, Label)
- Theming: next-themes

## Getting started

### Prerequisites

- Node.js 22+ (recommended)
- pnpm 8+ (project uses pnpm via `packageManager`)

### Installation

```bash
pnpm install
```

### Development

Runs Next.js dev server with Turbopack.

```bash
pnpm dev
```

Open http://localhost:3000.

### Build

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Project structure

```
src/
  app/
    components/
      commands/              # Command registry, context, palette UI
      tasks/                 # Task UI (list, item, details, create, status/priority/assignee)
      theme/                 # Theme provider, toggle, theme commands
      ui/                    # Shared UI primitives composed from Radix
    shortcuts/               # Keyboard shortcuts hook and formatting helpers
    providers/               # App-level providers (e.g., Redux)
  data/                      # Mock data for tasks and assignees
  lib/                       # Utilities and hooks
  store/                     # Redux store, slices, selectors
public/                      # Static assets
```

Key files and folders:

- `src/app/components/commands/commands-registry.ts` — central registry of all commands
- `src/app/components/commands/command-palette.tsx` — palette UI (cmdk)
- `src/app/components/commands/commands-context.tsx` — context + provider for commands
- `src/app/components/commands/commands-initializer.tsx` — bootstraps/loads commands
- `src/app/shortcuts/use-keyboard-shortcuts.ts` — registers global shortcuts -> commands
- `src/store/store.ts` — Redux store configuration
- `src/store/features/tasks/*` — tasks slice and selectors
- `src/store/features/display/*` — view/display preferences
- `src/store/features/theme/*` — theme state (plus `src/app/theme/*` UI)
- `src/app/app/page.tsx` — main page (App Router)

## Architecture overview

Polytask is organized around commands as first-class primitives.

- Command registry
  - Source of truth for all commands, their ids, titles, categories, icons, and handlers
  - Declared in `commands-registry.ts` with strong typing (`src/app/components/commands/types.ts`)
  - Consumers execute commands by id, enabling decoupled UI-triggered actions
- Command palette (cmdk)
  - `command-palette.tsx` renders searchable command items from the registry
  - Integrates with keyboard shortcuts and context to dispatch command handlers
- Keyboard shortcuts
  - `use-keyboard-shortcuts.ts` binds OS-aware combos (e.g., `⌘K`) to command ids
  - Formatting helpers in `format-shortcut.ts` standardize display strings
- State management (Redux Toolkit)
  - Store in `src/store/store.ts`, slices under `src/store/features/*`
  - Tasks domain in `tasks-slice.ts` with selectors in `tasks-selectors.ts`
  - `redux-undo` enables time travel for tasks operations where appropriate
- UI and theming
  - Radix UI primitives composed into app-specific components in `src/app/ui/*`
  - Theme handled by `next-themes` (`src/app/theme/*`, `theme-provider.tsx`, `theme-toggle.tsx`)
- Data layer
  - Client-only demo data in `src/data/mock-*.ts` (no backend)
  - Replace mock modules with real API calls to integrate a backend

## Scripts

- `pnpm dev` — start dev server (Turbopack)
- `pnpm build` — production build
- `pnpm start` — start production server
- `pnpm lint` — run ESLint
