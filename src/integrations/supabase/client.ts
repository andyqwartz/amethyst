// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hyplbzvyvbcjzpioemay.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cGxienZ5dmJjanpwaW9lbWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1MjA4NzcsImV4cCI6MjAyNDA5Njg3N30.Hs-Vd9MrpzJoaHBmxG2YhABkKQFaaW_BYpXGmhiRAYY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);