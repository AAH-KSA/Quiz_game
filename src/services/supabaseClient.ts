// ✅ Supabase via ESM CDN (works without npm)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://wbzhabejiosjudtngife.supabase.co';
const supabaseAnonKey = 'sb_publishable_XnOmazJW5gkuHmtA0xup0Q_J-LEjKeB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
