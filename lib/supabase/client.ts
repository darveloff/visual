import { createClient } from "@supabase/supabase-js";

import { getEnv } from "@/lib/env";

export function getSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  return createClient(supabaseUrl, supabaseAnonKey);
}
