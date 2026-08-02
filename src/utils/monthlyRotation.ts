import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Checks and rotates the monthly leaderboard if a rotation is due.
 * Archiving the top 10 users into `monthly_leaderboards` as a backup snapshot
 * and resetting user points to 0 on the 30th of each month.
 * For shorter months, the rotation runs on the last day of that month.
 */
export async function checkAndRotateMonthlyLeaderboard(supabase: SupabaseClient): Promise<boolean> {
  try {
    const now = new Date();
    const currentDay = now.getDate();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const rotationDay = Math.min(30, lastDayOfMonth);

    if (currentDay < rotationDay) {
      return false;
    }

    const targetYear = now.getFullYear();
    const targetMonth = now.getMonth() + 1; // 1-indexed
    const targetMonthStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;

    // 1. Check if snapshot already exists
    const { data: existing } = await supabase
      .from('monthly_leaderboards')
      .select('id')
      .eq('year_month', targetMonthStr)
      .maybeSingle();

    if (existing) {
      return false; // Already rotated for target month
    }

    // 2. Call Supabase RPC function (SECURITY DEFINER)
    const { data, error } = await supabase.rpc('rotate_monthly_leaderboard', {
      target_year_month: targetMonthStr
    });

    if (error) {
      console.warn('RPC rotate_monthly_leaderboard error:', error.message, 'Trying client fallback...');
      
      const { data: topProfiles } = await supabase
        .from('profiles')
        .select('username, avatar_url, points, role')
        .order('points', { ascending: false })
        .limit(10);

      const { error: insErr } = await supabase
        .from('monthly_leaderboards')
        .insert({
          year_month: targetMonthStr,
          leaderboard_data: topProfiles || []
        });

      if (!insErr) {
        await supabase
          .from('profiles')
          .update({ points: 0 })
          .neq('id', '00000000-0000-0000-0000-000000000000');
        return true;
      }
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Error during monthly rotation check:', err);
    return false;
  }
}
