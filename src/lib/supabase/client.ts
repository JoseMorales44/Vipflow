import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase Browser Client
 * 
 * Se usa en componentes con 'use client'.
 * Accede a las variables de entorno públicas.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
