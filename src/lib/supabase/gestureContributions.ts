import { createClient } from '@/utils/supabase/client';
import { GestureContribution, GestureContributionFilters, GestureContributionFormData } from '@/types/gestureContributions';

export class GestureContributionService {
  
  // Submit a new gesture contribution
  static async submitContribution(data: GestureContributionFormData): Promise<{ data: GestureContribution | null; error: { message: string; originalError?: any } | null }> {
    const supabase = createClient();
    try {
      let mediaUrl = '';
      const { data: userSession } = await supabase.auth.getUser();
      if (!userSession.user) throw new Error('User not authenticated');      // Upload media file if provided
      if (data.file) {
        console.log(`Uploading file: ${data.file.name}, type: ${data.file.type}, size: ${data.file.size} bytes`);
        
        const fileExt = data.file.name.split('.').pop();
        const fileName = `${userSession.user.id}/${Date.now()}.${fileExt}`;
        const filePath = `gesture-contributions/${fileName}`;
        
        // Set content type explicitly to avoid incorrect MIME type detection
        const uploadOptions = {
          contentType: data.file.type,
          cacheControl: '3600'
        };
        
        // Try upload with retries
        let uploadError;
        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount <= maxRetries) {
          const { error: error } = await supabase.storage
            .from('media') // Ensure this is your correct bucket name
            .upload(filePath, data.file, uploadOptions);
          
          if (!error) {
            uploadError = null;
            break;
          } else {
            console.error(`Upload attempt ${retryCount + 1} failed:`, error);
            uploadError = error;
            retryCount++;
            
            if (retryCount <= maxRetries) {
              // Wait before retry (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            }
          }
        }
        
        if (uploadError) {
          console.error("All upload attempts failed:", uploadError);
          throw new Error(`File upload failed after ${maxRetries + 1} attempts: ${uploadError.message}`);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
          
        mediaUrl = publicUrl;
        console.log(`File uploaded successfully. Public URL: ${mediaUrl}`);
      } else {
        throw new Error('Media file is required.');
      }
      
      // Insert contribution record
      const { data: contribution, error } = await supabase
        .from('gesture_contributions')
        .insert({
          title: data.title,
          description: data.description,
          language: data.language,
          media_type: data.media_type,
          media_url: mediaUrl,
          submitted_by: userSession.user.id,
        })
        .select('*')
        .single();
        
      if (error) { // Handle Supabase client error from insert operation
        console.error('Supabase insert error:', error);
        return { data: null, error: { message: error.message || 'Failed to save contribution data.', originalError: error } };
      }
        
      return { data: contribution, error: null };
    } catch (error: any) { // Catch other errors (e.g., from storage upload, auth, or unexpected issues)
      let errorMessage = "An unknown error occurred during submission.";
      if (typeof error === 'object' && error !== null) {
        if (error.message) {
          errorMessage = String(error.message);
        } else if (error.details) { // Some Supabase errors might have details
          errorMessage = String(error.details);
        } else if (error.error_description) { // OAuth like errors
          errorMessage = String(error.error_description);
        } else if (error.error) { // Sometimes the actual error is nested
          errorMessage = String(error.error);
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error('Error submitting contribution. Original error:', error, 'Processed message:', errorMessage);
      // Ensure a structured error is returned
      return { data: null, error: { message: errorMessage, originalError: error } };
    }
  }
  
  // Get gesture contributions with filters
  static async getContributions(filters?: GestureContributionFilters): Promise<{ data: GestureContribution[] | null; error: any }> {
    const supabase = createClient();
    try {
      let query = supabase
        .from('gesture_contributions')
        .select(`
          *,
          submitter:user_profiles!submitted_by(id, name, email),
          reviewer:user_profiles!reviewed_by(id, name)
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.language && filters.language !== 'all') {
        query = query.eq('language', filters.language);
      }
      
      if (filters?.submitted_by) {
        query = query.eq('submitted_by', filters.submitted_by);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching contributions:', error);
      return { data: null, error };
    }
  }
  
  // Get single contribution
  static async getContribution(id: string): Promise<{ data: GestureContribution | null; error: any }> {
    const supabase = createClient();
    try {
      const { data: contribution, error } = await supabase
        .from('gesture_contributions')
        .select(`
          *,
          submitter:user_profiles!submitted_by(id, name, email),
          reviewer:user_profiles!reviewed_by(id, name)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return { data: contribution, error: null };
    } catch (error) {
      console.error('Error fetching single contribution:', error);
      return { data: null, error };
    }
  }
  
  // Approve contribution (admin only - RLS should enforce this)
  static async approveContribution(id: string): Promise<{ error: any }> {
    const supabase = createClient();
    try {
      const { data: userSession } = await supabase.auth.getUser();
      if (!userSession.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('gesture_contributions')
        .update({
          status: 'approved',
          reviewed_by: userSession.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);
        
      return { error };
    } catch (error) {
      console.error('Error approving contribution:', error);
      return { error };
    }
  }
  
  // Reject contribution (admin only)
  static async rejectContribution(id: string, reason?: string): Promise<{ error: any }> {
    const supabase = createClient();
    try {
      const { data: userSession } = await supabase.auth.getUser();
      if (!userSession.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('gesture_contributions')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_by: userSession.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);
        
      return { error };
    } catch (error) {
      console.error('Error rejecting contribution:', error);
      return { error };
    }
  }
  
  // Delete contribution (admin or owner as per RLS)
  static async deleteContribution(id: string): Promise<{ error: any }> {
    const supabase = createClient();
    try {
      const { data: userSession } = await supabase.auth.getUser();
      if (!userSession.user) throw new Error('User not authenticated for delete operation');

      const { error } = await supabase
        .from('gesture_contributions')
        .delete()
        .eq('id', id);
        
      return { error };
    } catch (error) {
      console.error('Error deleting contribution:', error);
      return { error };
    }
  }
}
