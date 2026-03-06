
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
    const table = 'forum_posts'
    console.log(`Checking table: ${table}...`)
    const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })

    if (error) {
        console.error(`Error checking ${table}:`, error.message)
    } else {
        console.log(`Table ${table} exists. Count: ${count}`)
        if (data && data.length > 0) {
            console.log(`Full sample data for ${table}:`, JSON.stringify(data[0], null, 2))
        }
    }
}

checkTables()
