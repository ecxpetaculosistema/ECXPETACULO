import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Sem credenciais o app roda em modo demonstração (dados de exemplo em src/data.js).
export const supabase = url && key ? createClient(url, key) : null
