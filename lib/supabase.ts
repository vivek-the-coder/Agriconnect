import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            // Using a manual lock manager behavior or different storage can help with 
            // the lock timeout issue. Here we ensure basic config is explicitly set.
            storageKey: 'agriconnect-auth-token',
            flowType: 'pkce'
        }
    }
)
