import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada");
  return url;
}

// Server-side — usa a service role key (apenas em Server Actions / API Routes)
export function createServerClient(): SupabaseClient<Database> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  return createClient<Database>(getSupabaseUrl(), serviceKey, {
    auth: { persistSession: false },
  });
}

/**
 * Valida o access token (JWT) enviado pelo browser e retorna o usuário.
 * Usado em API Routes para autenticar sem confiar em dados do body.
 */
export async function getUserFromToken(accessToken: string) {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada");
  const client = createClient<Database>(getSupabaseUrl(), anonKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user;
}
