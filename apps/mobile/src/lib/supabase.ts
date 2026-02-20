import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ibwuhoqhxobuknwnufrd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlid3Vob3FoeG9idWtud251ZnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjA2NjAsImV4cCI6MjA4Njk5NjY2MH0.GfEQUICT3TRMCwtpPQhKw2HQfc91L2KIP2tU-ONrri4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
