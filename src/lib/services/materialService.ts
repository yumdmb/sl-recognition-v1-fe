import { createClient } from '@/utils/supabase/client';
import type { Material } from '@/types/database';

export const MAX_MATERIAL_FILE_SIZE = 50 * 1024 * 1024;
const materialMimeTypes: Record<string, string> = {
  pdf: 'application/pdf', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', mov: 'video/quicktime',
};
export const MATERIAL_FILE_ACCEPT = Object.keys(materialMimeTypes).map(ext => `.${ext}`).join(',');

export function validateMaterialFile(file: File): string {
  if (file.size <= 0) throw new Error('Please select a non-empty file.');
  if (file.size > MAX_MATERIAL_FILE_SIZE) throw new Error('Material files must be 50 MB or smaller.');
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = materialMimeTypes[extension];
  if (!mimeType) throw new Error('Please select a supported document, image, or video file.');
  if (file.type && file.type !== 'application/octet-stream' && file.type !== mimeType) {
    throw new Error('The file type does not match its extension.');
  }
  return mimeType;
}

/**
 * Fetches materials for a given language and optionally by level.
 * @param language - The language to filter materials by ('ASL' or 'MSL').
 * @param level - Optional level to filter materials by.
 * @returns A promise that resolves to an array of materials.
 */
export const getMaterials = async (language: 'ASL' | 'MSL', level?: 'beginner' | 'intermediate' | 'advanced'): Promise<Material[]> => {
  const supabase = createClient();
  let query = supabase
    .from('materials')
    .select('*')
    .eq('language', language)
    .order('created_at', { ascending: false });

  if (level) {
    query = query.eq('level', level);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }

  return data || [];
};

/**
 * Creates a new material record in the database.
 * @param material - The material data to insert.
 * @returns A promise that resolves to the created material.
 */
export const createMaterial = async (material: Omit<Material, 'id' | 'created_at' | 'updated_at'>): Promise<Material> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('materials')
    .insert([material])
    .select()
    .single();

  if (error) {
    console.error('Error creating material:', error);
    throw error;
  }

  return data;
};

/**
 * Updates an existing material in the database.
 * @param id - The ID of the material to update.
 * @param updates - The fields to update.
 * @returns A promise that resolves to the updated material.
 */
export const updateMaterial = async (id: string, updates: Partial<Omit<Material, 'id'>>): Promise<Material> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('materials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating material:', error);
    throw error;
  }

  return data;
};

/**
 * Deletes a material from the database and its associated file from storage.
 * @param id - The ID of the material to delete.
 */
export const deleteMaterial = async (id: string): Promise<void> => {
  const supabase = createClient();
  // First, get the material to find its file path
  const { data: material, error: fetchError } = await supabase
    .from('materials')
    .select('file_path')
    .eq('id', id)
    .single();

  if (fetchError || !material) {
    console.error('Error fetching material for deletion:', fetchError);
    throw new Error('Material not found or error fetching it.');
  }

  // Keep the file available if deleting the database record fails.
  const { error: deleteError } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting material from database:', deleteError);
    throw deleteError;
  }

  if (material.file_path) {
    try {
      await deleteMaterialFile(material.file_path);
    } catch (error) {
      console.error('Material deleted, but its file could not be cleaned up:', error);
    }
  }
};

/**
 * Uploads a material file to the 'materials' storage bucket.
 * @param file - The file to upload.
 * @param fileName - A unique name for the file.
 * @returns A promise that resolves to the path of the uploaded file.
 */
export const uploadMaterialFile = async (file: File, fileName: string): Promise<string> => {
  const contentType = validateMaterialFile(file);
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from('materials')
    .upload(fileName, file, { contentType });

  if (error) {
    console.error('Error uploading material file:', error);
    throw error;
  }

  return data.path;
};

/**
 * Gets the public URL for a material file.
 * @param filePath - The path of the file in the storage bucket.
 * @returns The public URL of the file.
 */
export const getMaterialPublicUrl = (filePath: string, download = false): string => {
  const supabase = createClient();
  const { data } = supabase.storage
    .from('materials')
    .getPublicUrl(filePath, { download });

  return data.publicUrl;
};

export const getMaterialDownloadUrl = (material: Material): string =>
  material.file_path ? getMaterialPublicUrl(material.file_path, true) : material.download_url;

/**
 * Deletes a material file from the 'materials' storage bucket.
 * @param filePath - The path of the file to delete.
 */
export const deleteMaterialFile = async (filePath: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from('materials')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting material file:', error);
    throw error;
  }
};
