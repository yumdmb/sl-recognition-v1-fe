import { createClient } from '@/utils/supabase/client';

export interface DailyChallenge {
  id: number;
  language: 'ASL' | 'MSL';
  challenge_text: string;
  hint: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get today's daily challenge for a specific language.
 * Uses deterministic selection based on days since epoch to ensure
 * all users see the same challenge on the same day.
 */
export async function getTodayChallenge(language: 'ASL' | 'MSL'): Promise<DailyChallenge | null> {
  const supabase = createClient();
  
  // Fetch all active challenges for the specified language
  const { data: challenges, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('language', language)
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching daily challenges:', error);
    return null;
  }

  if (!challenges || challenges.length === 0) {
    console.warn(`No active challenges found for language: ${language}`);
    return null;
  }

  // Calculate days since Unix epoch for deterministic selection
  // This ensures all users see the same challenge on the same day
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  
  // Use modulo to rotate through challenges
  const index = daysSinceEpoch % challenges.length;
  
  return challenges[index] as DailyChallenge;
}

/**
 * Get all challenges for a specific language (for admin purposes)
 */
export async function getAllChallenges(language?: 'ASL' | 'MSL'): Promise<DailyChallenge[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('daily_challenges')
    .select('*')
    .order('id', { ascending: true });

  if (language) {
    query = query.eq('language', language);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }

  return (data || []) as DailyChallenge[];
}
