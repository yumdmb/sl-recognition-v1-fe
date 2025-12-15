import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/database';

export type ProficiencyTestRow = Database['public']['Tables']['proficiency_tests']['Row'];

/**
 * Server-side function to fetch all proficiency tests.
 * Use this in Server Components for initial data fetching.
 */
export async function getAllProficiencyTestsServer(): Promise<ProficiencyTestRow[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('proficiency_tests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proficiency tests:', error);
    throw new Error('Failed to fetch proficiency tests');
  }

  return data || [];
}

/**
 * Server-side function to fetch a single proficiency test with questions.
 */
export async function getProficiencyTestServer(testId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('proficiency_tests')
    .select(`
      *,
      questions:proficiency_test_questions(
        *,
        choices:proficiency_test_question_choices(*)
      )
    `)
    .eq('id', testId)
    .single();

  if (error) {
    console.error('Error fetching proficiency test:', error);
    return null;
  }

  return data;
}
