import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// THÊM 2 DÒNG NÀY ĐỂ DEBUG
console.log('Supabase URL from env:', supabaseUrl);
console.log('Is URL valid format?', supabaseUrl && supabaseUrl.startsWith('https'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
