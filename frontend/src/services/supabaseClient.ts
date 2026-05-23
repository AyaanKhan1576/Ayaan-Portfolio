import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!config.supabaseConfigured) {
    return null;
  }

  if (!client) {
    client = createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}
