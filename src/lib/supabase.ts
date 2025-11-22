import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if both URL and key are provided
// Use placeholder values if not configured to avoid errors during initialization
// The actual usage will check if Supabase is configured before using it
let supabaseClient: SupabaseClient;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.trim() && supabaseAnonKey.trim()) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    // Fallback to placeholder to prevent crashes
    supabaseClient = createClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }
} else {
  console.warn(
    "Supabase environment variables are not set. Using in-memory storage as fallback."
  );
  // Create a placeholder client to prevent import errors
  // This will never be used if isSupabaseConfigured() checks are in place
  supabaseClient = createClient(
    "https://placeholder.supabase.co",
    "placeholder-key"
  );
}

export const supabase = supabaseClient;

