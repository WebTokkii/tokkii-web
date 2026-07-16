import { createClient } from '@supabase/supabase-js';
import { syncRssFeeds } from './sync_rss_module.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearAndSync() {
    console.log("Deleting all existing news articles in Supabase...");
    
    // Deleting all rows by querying an inequality on ID
    const { error: deleteError } = await supabase
        .from('news_articles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.error("Error deleting articles:", deleteError.message);
        process.exit(1);
    }
    
    console.log("Database cleared successfully!");
    
    // Now trigger a clean sync of 4 fresh articles (translated to Spanish, default authors)
    await syncRssFeeds(4);
    
    console.log("Clear and Sync script finished successfully!");
    process.exit(0);
}

clearAndSync();
