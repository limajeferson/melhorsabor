import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let browserClient: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas"
      );
    }
    browserClient = createClient<Database>(url, anonKey);
  }
  return browserClient;
}

// Client-side (browser) — usa a anon key pública.
// Proxy com init lazy: o client só é criado no primeiro uso real, nunca na
// importação do módulo — senão o build (prerender) quebra quando o env não
// está disponível.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
