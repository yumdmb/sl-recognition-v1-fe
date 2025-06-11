import { createClient } from '@/utils/supabase/client';
import type { UserProfile, Database } from '@/types/database';

const supabase = createClient();

export class UserService {  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle specific error codes
        if (error.code === 'PGRST116') {
          // No rows returned - user profile doesn't exist
          console.info(`No user profile found for user ${userId}`);
          return null;
        }
        
        // Log detailed error information for debugging
        console.warn('Supabase query error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId: userId
        });
        
        // For RLS errors or policy violations, return null instead of throwing
        if (
          error.code === '42501' || // insufficient_privilege
          error.code === 'PGRST301' || // Row level security violation
          error.message?.toLowerCase().includes('policy') ||
          error.message?.toLowerCase().includes('rls') ||
          error.message?.toLowerCase().includes('permission')
        ) {
          console.info(`RLS policy blocked access to user profile for user ${userId}, using fallback`);
          return null;
        }
        
        // For other errors, still return null to prevent app crashes
        console.warn(`Database error when fetching user profile for ${userId}, returning null`);
        return null;
      }
      
      return data;
    } catch (error) {
      // Catch any unexpected errors and log them
      console.warn('Unexpected error in getUserProfile:', {
        error: error,
        userId: userId,
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Always return null to prevent crashes
      return null;
    }
  }

  // Create user profile
  static async createUserProfile(
    profile: Database['public']['Tables']['user_profiles']['Insert']
  ): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string, 
    updates: Database['public']['Tables']['user_profiles']['Update']
  ): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get all user profiles (admin only)
  static async getAllUserProfiles(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all user profiles:', error);
      throw error;
    }
  }

  // Update user role (admin only)
  static async updateUserRole(
    userId: string, 
    role: 'admin' | 'deaf' | 'non-deaf'
  ): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          role, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Check if user is admin
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) return false;
      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Get users by role
  static async getUsersByRole(role: 'admin' | 'deaf' | 'non-deaf'): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }
}
