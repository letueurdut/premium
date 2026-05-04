import { createBrowserClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SRK  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createSupabaseBrowserClient() {
  return createBrowserClient(URL, ANON);
}
export function createSupabaseAdminClient(): SupabaseClient {
  return createClient(URL, SRK, { auth: { autoRefreshToken: false, persistSession: false } });
}
