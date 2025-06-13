// Debug script to test forum database access
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export async function testForumDatabase() {
  console.log('Testing forum database access...');
  
  try {
    // Test 1: Check if forum_posts table exists and is accessible
    console.log('Test 1: Basic forum_posts access...');
    const { data: posts, error: postsError } = await supabase
      .from('forum_posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.error('Error accessing forum_posts:', postsError);
      return { success: false, error: 'forum_posts access failed', details: postsError };
    }
    
    console.log('✅ forum_posts table accessible:', posts);
    
    // Test 2: Check if forum_comments table exists and is accessible
    console.log('Test 2: Basic forum_comments access...');
    const { data: comments, error: commentsError } = await supabase
      .from('forum_comments')
      .select('*')
      .limit(1);
    
    if (commentsError) {
      console.error('Error accessing forum_comments:', commentsError);
      return { success: false, error: 'forum_comments access failed', details: commentsError };
    }
    
    console.log('✅ forum_comments table accessible:', comments);
    
    // Test 3: Check what profile-related tables exist
    console.log('Test 3: Checking for profile tables...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ profiles table not accessible:', profilesError);
      
      // Try user_profiles instead
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (userProfilesError) {
        console.log('❌ user_profiles table not accessible:', userProfilesError);
      } else {
        console.log('✅ user_profiles table accessible:', userProfiles);
      }
    } else {
      console.log('✅ profiles table accessible:', profiles);
    }
    
    return { success: true, message: 'Database tests completed' };
    
  } catch (error) {
    console.error('Unexpected error during database test:', error);
    return { success: false, error: 'Unexpected error', details: error };
  }
}
