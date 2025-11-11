// supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 1️⃣ Replace with your Supabase project URL
const SUPABASE_URL = 'https://kpxgrcgvwzhorfztuscu.supabase.co';

// 2️⃣ Replace with your Supabase anon (public) key
const SUPABASE_ANON_KEY = 'sb_publishable_feUoYNKi6wh5MJfWu4l6dQ_SLg_eFbO';

// 3️⃣ Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 4️⃣ Export it so other scripts can use it
export default supabase;
