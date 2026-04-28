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

## Design System — ¡Qué Pedo!

Mexican-inspired, gamified Spanish learning. Mercado-bright colors, papel picado motifs, chunky tactile buttons. Built to feel like a physical game, not a sterile form.

**Single source of truth**: `shared/design/tokens.ts` — imported by both web and mobile. Never hardcode colors, fonts, radii, or shadows; always pull from tokens.

### Color Families

7 color families, each named after something unmistakably Mexican. Every ramp has 50–700/900 stops tuned for legible text and confident UI.

| Family       | Stop 500  | Role                               |
| ------------ | --------- | ---------------------------------- |
| Chili 🌶     | `#ef5a1c` | Primary action, brand, CTAs        |
| Rosa 🌺      | `#e91e7a` | Danger, destructive, celebrations  |
| Jade 🌵      | `#089a4f` | Success, verbs, nature             |
| Cielo ☀      | `#2563eb` | Info, culture, water               |
| Maíz 🌽      | `#f5b81f` (400) | Warning, streaks fire        |
| Jacaranda 💜 | `#6f3ff0` | Achievements, accents              |
| Masa         | `#a48d66` | Warm beige neutrals (corn dough)   |
| Ink 🖤       | `#1a1915` (700) | Text & dark surfaces         |

**Surface**: `bg = #fcf9f3` (Masa-50), `card = #ffffff`, `dark = #1a1915`.

### Typography

Four typefaces, each with a job:

| Family               | Role                | Use for                                       |
| -------------------- | ------------------- | --------------------------------------------- |
| **Fraunces**         | Display / Headings  | Hero titles, screen headers, big numbers      |
| **Plus Jakarta Sans**| Body / UI           | Body copy, buttons, inputs, labels            |
| **Caprasimo**        | Marker / Accent     | Rewards, streak milestones, branded headlines |
| **JetBrains Mono**   | Mono / Details      | Tags, meta info, CEFR levels, counters        |

### Design Principles

- **Chunky & tactile**: Buttons use a signature "press me" shadow (`0 4px 0` color match). Pressing translates the button down 4px and removes the shadow — feels physical.
- **Bright & confident**: Saturated mercado colors over muted pastels. Lean into the palette, don't tone it down.
- **Spanish first**: UI strings use Mexican Spanish — `¡Dale!` instead of "Submit", `Cocinando…` instead of "Loading", `¡Ay, no!` instead of "Error". See `voice` export in tokens.
- **Cultural motifs**: PapelPicado banners, Talavera tile watermarks, Sunbursts, ChiliMascot. Use sparingly as backgrounds, dividers, celebratory moments.
- **Generous radii**: `xs=6, sm=10, md=14, lg=20, xl=28, full=999`. Cards default `lg`, buttons `md`, badges `full`.
- **Border + chunky shadow** instead of soft elevation. Cards have a 1px ink-100 border and a subtle `shadow.sm`. Active/featured cards get the chunky shadow in their accent color.

### Component Rules

- **Button**: 6 variants — `primary` (chili), `secondary` (ink), `success` (jade), `outline` (chili stroke), `ghost`, `danger` (rosa). All use chunky shadow + press-translate.
- **Card**: White, `radius lg`, 1px `ink-100` border, `shadow.sm`. Featured cards: 3px solid color border + matching chunky shadow.
- **Input**: White, 2px `ink-200` border, `radius md`. Focus: 2px chili-400 border + `0 0 0 4px chili-100` ring.
- **Badge**: `radius full`, mono font uppercase, 3 variants — `solid` (color-500 / white), `soft` (color-100 / color-700), `outline` (color-300 stroke / color-600 text).
- **CEFR levels**: A1=chili, A2=jade, B1=cielo, B2=maíz, C1=jacaranda, C2=rosa.
- **Word categories**: noun=chili, verb=jade, adj=cielo, slang=jacaranda, idiom=rosa.

### Voice & Copy

Use Mexican Spanish for all UI strings. Key phrases (also exported as `voice` from tokens):

| Concept    | Use this        | Not this        |
| ---------- | --------------- | --------------- |
| Submit/CTA | `¡Dale!`        | Submit / Confirm |
| Loading    | `Cocinando…`    | Loading…        |
| Error      | `¡Ay, no!`      | Error           |
| Success    | `¡Órale!`       | Great job!      |
| Continue   | `Ándale`        | Continue / Next |
| Greeting   | `¿Qué pedo?`    | Hello           |
| Streak/win | `¡chingón!`     | Awesome         |

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
