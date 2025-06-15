import { createClient } from '@/utils/supabase/client';
import type { Material } from '@/types/database';

const supabase = createClient();

/**
 * Fetches materials for a given language.
 * @param language - The language to filter materials by ('ASL' or 'MSL').
 * @returns A promise that resolves to an array of materials.
 */
export const getMaterials = async (language: 'ASL' | 'MSL'): Promise<Material[]> => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('language', language)
    .order('created_at', { ascending: false });

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

  // If a file path exists, delete the file from storage
  if (material.file_path) {
    await deleteMaterialFile(material.file_path);
  }

  // Then, delete the material record from the database
  const { error: deleteError } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting material from database:', deleteError);
    throw deleteError;
  }
};

/**
 * Uploads a material file to the 'materials' storage bucket.
 * @param file - The file to upload.
 * @param fileName - A unique name for the file.
 * @returns A promise that resolves to the path of the uploaded file.
 */
export const uploadMaterialFile = async (file: File, fileName: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('materials')
    .upload(fileName, file);

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
export const getMaterialPublicUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('materials')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Deletes a material file from the 'materials' storage bucket.
 * @param filePath - The path of the file to delete.
 */
export const deleteMaterialFile = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('materials')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting material file:', error);
    throw error;
  }
};
