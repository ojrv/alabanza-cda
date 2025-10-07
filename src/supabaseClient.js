import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fdlnptxefjzoxeiqsujx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbG5wdHhlZmp6b3hlaXFzdWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDE3ODIsImV4cCI6MjA3NDQxNzc4Mn0.BI9M80Fr-AevXnHBATTJZkRjFrCGn4x7cgDPkTinNms';

export const supabase = createClient(supabaseUrl, supabaseKey);