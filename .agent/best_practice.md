# Best Practices & Coding Standards – LingoApp

## 1. Project Structure & Modularity

To ensure scalability and reuse, we adopt a **feature-based folder structure**. Code should be grouped by what it does (feature) rather than what it is (file type).

### 1.1 The 300-Line Rule

`page.tsx` files should strictly remain **under 300 lines**.

A `page.tsx` should primarily act as a **controller/orchestrator**:

- Fetch initial server data  
- Define SEO metadata  
- Render a wrapper Client Component or a Layout  

All **business logic and UI rendering** must be extracted into separate components and hooks.

### 1.2 Recommended Folder Structure

```txt
src/
├── app/
│   ├── vocabulary/
│   │   └── page.tsx       # < 300 lines. Imports VocabularyDashboard.
│   └── ...
├── components/
│   ├── ui/                # Generic shadcn/ui atoms (Button, Input, Card)
│   ├── shared/            # Reusable app-wide components (Navbar, FAB)
│   └── features/          # Domain-specific modular components
│       ├── vocabulary/
│       │   ├── VocabularyList.tsx
│       │   ├── AddWordForm.tsx
│       │   └── useVocabulary.ts   # Custom hook for logic
│       ├── grammar/
│       └── dashboard/
├── lib/
│   ├── supabase/          # Client creation
│   ├── ai/                # OpenAI utilities
│   └── utils.ts           # cn helper, date formatters
└── hooks/                 # Global hooks (use-toast, etc.)
```

---

## 2. Component Architecture

### 2.1 Server vs. Client Components

Default to **Server Components**. Only add `"use client"` when you specifically need:

- Event listeners (`onClick`, `onChange`)  
- React hooks (`useState`, `useEffect`)  
- Browser-only APIs (`localStorage`, `window`)  

**Pattern:** Pass server data down to Client Components as **props**.

### 2.2 Composition & Reusability

Use **atomic design**: build complex views from small, dumb components.

- **Bad:** A single `Quiz.tsx` file handling logic, UI, and result calculation.  
- **Good:**  
  - `QuizContainer` (logic)  
  - `FlashCard` (UI)  
  - `MultipleChoice` (UI)  
  - `ProgressBar` (UI)

Each component must have a clearly defined **TypeScript interface** for its props.

---

## 3. State Management Strategy

### 3.1 Server State (TanStack Query)

Use **TanStack Query** for all asynchronous data:

- Supabase fetches  
- AI responses  

Guidelines:

- Do **not** store API data in `useState` unless you are modifying it locally before saving.  
- Create custom hooks for queries to ensure reusability across pages.  
- Example: `useVocabularyQuery()` can be used in the **Vocabulary List** page **and** the **Translator Modal**.

### 3.2 Global Client State (Zustand)

Use **Zustand** for global UI states that **do not persist** in the DB.

Examples:

- Sidebar open/close  
- Theme toggles  
- Global Translator Modal visibility  

Keep stores **small and focused**.

### 3.3 Local State (`useState` / `useReducer`)

Use local state for UI-only logic isolated to a **single component**, for example:

- Is this dropdown open?  
- Is the card flipped?  

### 3.4 Form State (React Hook Form + Zod)

- Never use manual `useState` for **complex forms**.  
- Use **react-hook-form** controlled by **Zod schemas** for validation.

---

## 4. Supabase & Database Patterns

### 4.1 Type Safety

- Always generate types from the **database schema**.  
- Use the generated `Database` type in **all Supabase client calls**.

### 4.2 Data Access

- **Row Level Security (RLS):**  
  - Never rely solely on client-side filters for security.  
  - Ensure RLS policies enforce `user_id` checks on the backend.
- **Edge Functions:**  
  - All OpenAI API calls must go through **Supabase Edge Functions**.  
  - Never expose the OpenAI API key on the client.

---

## 5. AI Integration Guidelines

### 5.1 UX Patterns for AI

- **Streaming:**  
  When generating long text (e.g., *Culture Snippet*), stream the response to the UI so the user sees progress immediately.

- **Optimistic Updates:**  
  If the user saves a translated word, add it to the UI list immediately while the background request saves it to Supabase.

- **Error Handling:**  
  AI fails occasionally. Always implement:
  - A fallback UI  
  - Or a **Retry** button  

---

## 6. Styling & Mobile-First (Tailwind CSS)

### 6.1 Responsive Design

Design **mobile first**: write the base class for mobile, then add breakpoints.

- **Bad:** `className="w-1/2 sm:w-full"`  
- **Good:** `className="w-full md:w-1/2"`

**Touch targets:**  
All interactive elements (buttons, inputs) must have a minimum height of **44px** for mobile users.

### 6.2 Shadcn & Utility Classes

- Use **shadcn/ui** components as the base.  
- Avoid long strings of classes.  
  - If a set of classes is used **more than 3 times** (e.g., a specific card style), extract it into a **small component wrapper**.  
- Use the `cn()` utility to merge classes conditionally.

---

## 7. General Code Conventions

### 7.1 Naming

- **Components:** `PascalCase`  
  - e.g., `VerbConjugator.tsx`
- **Functions/Hooks:** `camelCase`  
  - e.g., `useAuth.ts`, `calculateScore`
- **Constants:** `UPPER_SNAKE_CASE`

### 7.2 Imports

Use **absolute imports**.

- **Right:**  
  ```ts
  import { Button } from "@/components/ui/button";
  ```
- **Wrong:**  
  ```ts
  import { Button } from "../../../components/ui/button";
  ```

### 7.3 Strict Mode

- No `any` types in TypeScript.  
- Fix the type or use `unknown` with proper narrowing.
