# Resume Intelligence SaaS

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

A high-fidelity, production-grade SaaS intelligence engine designed to transform functional resume parsing into a premium, recruiter-grade insights experience. 

Built with Next.js 16, Supabase, and Google Generative AI, this platform extracts data, parses hidden PDF annotations, and provides transparent, deep career feedback with a visually stunning "Prismatic" and "Deep Space" design system.

---

## 🌟 Key Features

*   **Intelligent Parsing Engine:** Re-engineered parsing pipeline that reliably extracts structured data, including projects, skills, experience timelines, and hidden PDF annotations.
*   **Recruiter-Grade Insights:** Integrated with Google Generative AI to provide deep, actionable career feedback and history analysis.
*   **Premium "Prismatic" UI/UX:** Built with a sophisticated "Deep Space" design system featuring glassmorphism, iridescent borders, smooth layout transitions, and atmospheric mesh gradients.
*   **Real-time Processing States:** High-fidelity user experience utilizing skeleton loaders, dynamic progress tracking, and interactive scroll-driven animations during AI processing.
*   **Transparent Data Verification:** A completely transparent data visualization flow featuring a "Raw Resume View" for users to ensure accuracy.
*   **Full-Stack Authenticated Dashboard:** End-to-end user management and secure dashboard utilizing Supabase for database integration and authentication.

## 🛠 Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v4), PostCSS, next-themes
*   **UI Components:** Radix UI primitives, Lucide React icons, Custom animated components (tw-animate-css)
*   **Authentication & Database:** Supabase (SSR client)
*   **AI Integration:** `@google/generative-ai`
*   **PDF Processing:** `pdf-parse-fork`, `pdfjs-dist`, `jspdf`, `html2canvas`
*   **State Management & Forms:** React Hook Form, Zod (Schema validation), Zustand (or React Context)

## 📁 Project Structure

```text
.
├── app/                  # Next.js App Router pages, APIs, and layouts
├── components/           # Reusable Radix/Tailwind UI components and layouts
├── lib/                  # Utility functions, Supabase clients, and AI config
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── styles/               # Global CSS and Tailwind configurations
```

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and npm/yarn installed. You will also need a Supabase project and a Google Gemini API Key.

### 1. Clone & Install

```bash
git clone <your-repo-link>
cd resume_parser
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and populate it with your specific service keys:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Generative AI
GEMINI_API_KEY=your_gemini_api_key

# Other specific keys required by lib/ or middleware...
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design Philosophy

Resume Intelligence SaaS relies on modern, premium aesthetics. We replace traditional "AI-centric" and "Sci-Fi" terminology with professional, trust-building language tailored for high-end recruitment and career services standards. Visual parity, typography (Outfit/Inter), and component-level translucency are strictly synchronized to establish a trustworthy platform.

---
