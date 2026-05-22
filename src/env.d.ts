// Cloudflare Workers environment type declarations
// These match the bindings defined in wrangler.toml

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Supabase
      SUPABASE_URL?: string;
      SUPABASE_PUBLISHABLE_KEY?: string;
      SUPABASE_SECRET_KEY?: string;
      NEXT_PUBLIC_SUPABASE_URL?: string;
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;

      // Database
      DATABASE_URL?: string;

      // AI Providers
      OPENAI_API_KEY?: string;
      ANTHROPIC_API_KEY?: string;
      OPENROUTER_API_KEY?: string;
      GROQ_API_KEY?: string;
      GEMINI_API_KEY?: string;
      DEEPSEEK_API_KEY?: string;

      // Discovery
      SERPER_API_KEY?: string;
      TAVILY_API_KEY?: string;
      BRAVE_API_KEY?: string;
      EXA_API_KEY?: string;

      // Email
      RESEND_API_KEY?: string;
      CONTACT_EMAIL?: string;

      // Push
      VAPID_PUBLIC_KEY?: string;
      VAPID_PRIVATE_KEY?: string;
      NEXT_PUBLIC_VAPID_PUBLIC_KEY?: string;

      // Cron
      CRON_SECRET?: string;

      // App
      APP_URL?: string;
      NODE_ENV?: string;
    }
  }
}

export {};
