# RankPulse

**RankPulse** is a cutting-edge social media performance platform that analyzes your content against 2026 algorithms (Instagram, LinkedIn, X/Twitter) in real-time. It leverages advanced AI for predictive rewriting and hyper-specific content generation.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database & Authentication**: [Supabase](https://supabase.com/) (using `@supabase/ssr` for zero-friction SSR/middleware auth)
- **AI Infrastructure**: NVIDIA NIM via OpenAI SDK, operating the `deepseek-ai/deepseek-v3.1-terminus` model for zero-cost, high-performance inferences.
- **Styling**: Tailwind CSS configured with a Neo-Brutalist design system (vibrant contrasts, sharp edges, and high-impact typography).

## ✨ Features

- **SEO Content Analyser**: Real-time evaluation of content with a 100-point scoring algorithm evaluating engagement hooks, format, keyword density, and platform-specific constraints.
- **AI Post Rewrite**: Native streaming using Next.js route handlers that automatically read your SEO parameters and seamlessly upgrade your captions inside the UI.
- **AI Content Studio**: Form-based content brief creator providing 5 customized engagement hooks based strictly on input niche, format, and keywords. Secure JSON-enforced AI generation limits erratic formatting.
- **Full Authentication Pipeline**: Real-time sign-in protections using Supabase middleware proxy enforcement.

## 🛠️ Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd RankPulse
   ```

2. **Install dependancies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file at the root of the project with the following items:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # NVIDIA NIM Configuration
   NVIDIA_API_KEY=your_nvidia_api_key
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## 🚀 Deployment (Vercel)

Ensure that all Environment Variables noted above are entered safely into your Vercel Project Settings prior to deployment to ensure the AI and session capabilities correctly ignite.
