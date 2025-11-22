Part 1: The Architectural Strategy
To achieve a "Mobile App" feel via a browser (Web App) that also works on Desktop, while using Supabase, the best modern stack is a Progressive Web App (PWA) built with Next.js.
Framework: Next.js (React)
Why: It offers the best performance, excellent SEO (for the web part), and easy API integration. Most importantly, it is easily converted into a PWA, meaning users can "install" the website on their phone's home screen, and it will look and feel like a native app (hiding the browser bar).
Language: TypeScript
Why: Copilot is much smarter with TypeScript because the strict typing helps it understand your data structures (interfaces) better, reducing bugs.
Backend & Database: Supabase
Auth: Built-in Google/Email login.
Database: PostgreSQL (powerful and scalable).
Vector Embeddings (Optional but good): For semantic search in vocabulary.
Styling: Tailwind CSS
Why: Standard for modern web apps. Copilot is excellent at generating Tailwind classes. "Mobile-first" responsive design is easy here.
AI Integration: Gemini API (via Supabase Edge Functions)
Why: You need this for the exercises, generating vocab, and translation. We will route this through Supabase to keep your API keys secure.
State Management: React Query (TanStack Query)
Why: Essential for managing the server state (fetching vocab, syncing progress) without manual useEffect spaghetti code.

Part 2: Instructions on How to Start
Step 1: Scaffold the App
"Hey Copilot, read my PROJECT_SPEC.md. Let's start by setting up the Next.js project structure with TypeScript and Tailwind. Please give me the terminal commands to create the app and install the necessary dependencies listed in the stack."
Step 2: Setup Database (Supabase)
"Based on the database schema in PROJECT_SPEC.md, please write the SQL migration code to create these tables in Supabase. Include Row Level Security (RLS) policies so users can only see their own data."
Step 3: Build the Layout
"Create the main layout for the application. As per the UI guidelines, implement a Bottom Tab Navigation for mobile and a Sidebar for desktop. Use Lucide icons."
Step 4: Implement Feature 1 (Vocabulary)
"Let's build Feature 1: The Vocabulary Builder. Create a Supabase service file to fetch and add vocabulary. Then create a UI component with a form to add new words manually. Use React Hook Form."
Step 5: Implement AI Features
"I need to implement the AI Vocabulary generator. Create a Next.js API route (or Server Action) that takes a 'topic' string, sends a prompt to OpenAI to generate 10 Spanish words with translations in JSON format, and returns them."
Key "Refinements" I added to your requirements:
Difficulty Rating: I formalized this into a 1-5 scale in the database schema. This is crucial for the "Spaced Repetition" logic later (showing you words you find hard more often).
Translator: I added the logic that the translator should have a "Save to Vocabulary" button. This connects Feature 5 to Feature 1, making the app cohesive.
Speaking/Listening: I specified using the Web Speech API initially. This is built into browsers (Chrome/Safari) and is free. Using OpenAI for audio (Whisper/TTS) gets expensive quickly. You can upgrade to OpenAI later if you need higher quality.
PWA Focus: I explicitly added PWA instructions so the mobile usage feels native without needing the App Store.