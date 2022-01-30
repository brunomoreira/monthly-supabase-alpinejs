import { createClient } from "@supabase/supabase-js";

export default createClient(
    import.meta.env.VITE_PROJECT_URL,
    import.meta.env.VITE_API_KEY,
    {
        schema: "public",
        headers: { "x-monthly": `sup-cuz-${Date.now()}` },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
);
