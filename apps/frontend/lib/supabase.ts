import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side (browser) — usa a anon key pública
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side — usa a service role key (apenas em Server Actions / API Routes)
export function createServerClient(): SupabaseClient<Database> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
