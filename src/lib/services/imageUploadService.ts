import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'proficiency-test-images';

/**
 * Service for uploading images to Supabase Storage for proficiency tests.
 */
export const ImageUploadService = {
  /**
   * Upload an image file to Supabase Storage.
   * @param file The file to upload
   * @param folder Optional folder path (e.g., 'questions' or 'choices')
   * @returns The public URL of the uploaded image
   */
  async uploadImage(file: File, folder: string = 'general'): Promise<string> {
    const supabase = createClient();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${folder}/${uuidv4()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  /**
   * Delete an image from Supabase Storage.
   * @param imageUrl The public URL of the image to delete
   */
  async deleteImage(imageUrl: string): Promise<void> {
    const supabase = createClient();
    
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
    
    if (!pathMatch) {
      console.warn('Could not extract path from image URL:', imageUrl);
      return;
    }

    const filePath = pathMatch[1];
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      // Don't throw - deletion failures shouldn't block other operations
    }
  },

  /**
   * Check if a URL is from our storage bucket.
   */
  isStorageUrl(url: string): boolean {
    return url.includes(BUCKET_NAME);
  },
};
