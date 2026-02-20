# QuePedo / Chingon — Spanish Learning App

## Overview

A full-stack Spanish language learning application with vocabulary management, AI-powered word generation, quizzes, grammar exercises, and cultural content. The web app is branded as **Chingon**.

**Project goal**: Transform the existing Next.js web application into a cross-platform mobile app (Android & iOS) using **React Native / Expo**, while maintaining the current web version.

## Development Environment

- **Machine**: macOS
- **Package manager**: npm
- **Editor**: Claude Code CLI

## Tech Stack

### Current (Web)

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 16 (App Router, React 19, TypeScript 5)    |
| Styling        | Tailwind CSS 4, shadcn/ui (new-york), Styled Components |
| Database/Auth  | Supabase (PostgreSQL, Auth, RLS)                   |
| AI             | Google Gemini API (`gemini-3-flash-preview`)        |
| Maps           | amCharts 5                                         |
| Forms          | React Hook Form + Zod                              |
| Icons          | Lucide React                                       |
| Deployment     | Vercel                                             |

### Planned (Mobile)

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Framework      | React Native + Expo                                |
| Shared backend | Supabase (same project — shared DB, Auth, RLS)     |
| AI             | Google Gemini API (via shared server actions or API)|

## Design System — Sunny Minimal

The app follows a **sunny, minimal** design language. Prioritize simplicity, whitespace, and warmth over flashy UI effects. Replace complex/decorative components with clean, straightforward ones.

### Color Palette

| Role       | Color     | Hex       | Tailwind          |
| ---------- | --------- | --------- | ----------------- |
| Primary    | Orange    | `#F97316` | `orange-500`      |
| Accent     | Peach     | `#FB923C` | `orange-400`      |
| Background | Warm white| `#FFF7ED` | `orange-50`       |
| Surface    | White     | `#FFFFFF` | `white`           |
| Text       | Dark stone| `#292524` | `stone-800`       |
| Muted text | Mid stone | `#78716C` | `stone-500`       |
| Border     | Light stone| `#E7E5E4`| `stone-200`       |
| Success    | Green     | `#22C55E` | `green-500`       |
| Error      | Red       | `#EF4444` | `red-500`         |

### Design Principles

- **Minimal**: No gradients, shadows, or decorative animations unless essential for UX feedback.
- **Flat**: Use borders and subtle background fills instead of elevation/shadows.
- **Warm**: Lean on the orange/peach palette — backgrounds should feel warm, not clinical.
- **Spacious**: Generous padding and margins. Let content breathe.
- **Consistent**: Use the same component patterns everywhere. One button style, one card style, one input style.
- **Simple components**: Replace complex/flashy UI widgets with plain, functional equivalents. Prefer native elements when possible.

### Typography

- Use system font stack (no custom fonts needed).
- Headings: `font-semibold`, `stone-800`.
- Body: `font-normal`, `stone-800`.
- Captions/labels: `font-medium`, `stone-500`.

### Component Style Rules

- **Buttons**: Solid `orange-500` background, white text, rounded-lg, no shadows. Hover: `orange-600`.
- **Cards**: White background, `stone-200` border, rounded-xl, no shadow.
- **Inputs**: White background, `stone-200` border, rounded-lg. Focus ring: `orange-400`.
- **Navigation**: Clean and flat. Active state uses `orange-500` for text/icon color.
- **Badges/Tags**: `orange-50` background, `orange-600` text, rounded-full.

## Project Structure

```
QuePedo/
├── web/                        # Next.js web application
│   ├── src/
│   │   ├── app/                # App Router pages & layouts
│   │   │   ├── (auth)/         # Login, signup (auth layout group)
│   │   │   ├── (main)/         # Dashboard, vocabulary, exercises, grammar, culture, profile
│   │   │   ├── auth/callback/  # OAuth callback route
│   │   │   └── onboarding/     # Multi-step onboarding flow
│   │   ├── actions/            # Server Actions (vocabulary, auth, ai, activity, profile)
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui + custom styled components
│   │   │   ├── features/       # Feature components (vocabulary, quiz, grammar, culture, dashboard, translator)
│   │   │   ├── layout/         # Sidebar, BottomNav
│   │   │   └── landing/        # Landing page sections
│   │   ├── utils/supabase/     # Supabase client (client.ts) and server (server.ts) helpers
│   │   ├── lib/                # Utility functions, navigation
│   │   └── types/              # Zod schemas and TypeScript types
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── components.json         # shadcn/ui config
├── supabase/
│   └── migrations/             # SQL migration files (001–012)
└── CLAUDE.md                   # This file
```

## Getting Started

### Prerequisites

- macOS
- Node.js (LTS recommended)
- npm
- A Supabase project
- A Google Gemini API key

### Environment Variables

Create `web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-google-gemini-api-key
```

### Installation & Development

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

### Available Scripts

| Command         | Description               |
| --------------- | ------------------------- |
| `npm run dev`   | Start dev server          |
| `npm run build` | Production build          |
| `npm run start` | Serve production build    |
| `npm run lint`  | Run ESLint                |

## Architecture & Patterns

### App Router

- **Route groups**: `(auth)` and `(main)` organize layouts without affecting URLs.
- **Server Components** by default; `"use client"` for interactive components.
- **Server Actions** in `src/actions/` handle all data mutations with `"use server"`.
- **Path alias**: `@/*` maps to `./src/*`.

### Database (Supabase PostgreSQL)

Key tables:

| Table                | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `user_profiles`      | Preferences, onboarding state, trial/subscription |
| `user_vocabulary`    | Personal vocabulary (manual + AI-generated) |
| `master_vocabulary`  | Curated/teacher vocabulary with CEFR levels |
| `user_activity`      | Activity tracking for streaks              |
| `user_word_progress` | Spaced repetition tracking                 |
| `vocabulary_sets`    | Grouped vocabulary sets                    |

- **Row Level Security (RLS)** enforces user isolation on all tables.
- Migrations are in `supabase/migrations/` (apply via Supabase CLI or dashboard).
- A trigger auto-creates a profile row on user signup.

### Authentication Flow

```
Landing (/) → Login/Signup → Google OAuth or Email/Password
  → /auth/callback → /onboarding (first time) → /dashboard
```

### AI Integration

- Server action `src/actions/ai.ts` calls Google Gemini to generate vocabulary.
- Generates: Spanish terms, translations, context sentences, difficulty ratings, tags, synonyms.

## Key Features

1. **Vocabulary Management** — Add manually or via AI, search/filter/edit/bulk-delete, JSONB translations
2. **Quiz System** — Configurable difficulty, CEFR levels (A1–C2), two direction modes, results tracking
3. **AI Vocabulary Generation** — Prompt-based generation via Gemini API
4. **Dashboard** — Stats cards, streak calendar, recent activity, quick actions
5. **Onboarding** — 5-step flow collecting language, proficiency, goals, learning style
6. **Cultural Content** — Interactive world map (amCharts), culture lessons by region
7. **Grammar Exercises** — Structured grammar practice

## Deployment

The web app is configured for **Vercel**:

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`)
4. Deploy (auto-deploys on push)
5. Set Supabase OAuth redirect URL to `https://<your-domain>/auth/callback`

## Coding Guidelines

- Use **TypeScript** with strict mode — avoid `any` types.
- Validate data at boundaries with **Zod** schemas (`src/types/schemas.ts`).
- Prefer **Server Components** and **Server Actions** over API routes.
- Use `createClient()` from `utils/supabase/server.ts` in server code, `client.ts` in client code.
- Follow the **Sunny Minimal** design system above for all UI work.
- Keep imports using the `@/` path alias.
- Favor simple, flat components over complex/animated ones.
