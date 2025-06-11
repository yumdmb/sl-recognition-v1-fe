import { createClient } from '@/utils/supabase/client';
import type { 
  Material,
  Database 
} from '@/types/database';

const supabase = createClient();

export class MaterialService {
  // Get all materials
  static async getMaterials(language?: 'ASL' | 'MSL'): Promise<Material[]> {
    try {
      let query = supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }

  // Get single material by ID
  static async getMaterial(id: string): Promise<Material | null> {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching material:', error);
      throw error;
    }
  }

  // Create new material (admin only)
  static async createMaterial(
    material: Database['public']['Tables']['materials']['Insert']
  ): Promise<Material> {
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert([material])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  }

  // Update material (admin only)
  static async updateMaterial(
    id: string, 
    updates: Database['public']['Tables']['materials']['Update']
  ): Promise<Material> {
    try {
      const { data, error } = await supabase
        .from('materials')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  }

  // Delete material (admin only)
  static async deleteMaterial(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  }

  // Get materials by level
  static async getMaterialsByLevel(
    level: 'beginner' | 'intermediate' | 'advanced',
    language?: 'ASL' | 'MSL'
  ): Promise<Material[]> {
    try {
      let query = supabase
        .from('materials')
        .select('*')
        .eq('level', level)
        .order('created_at', { ascending: false });

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching materials by level:', error);
      throw error;
    }
  }

  // Get materials by type
  static async getMaterialsByType(
    type: 'pdf' | 'video' | 'document',
    language?: 'ASL' | 'MSL'
  ): Promise<Material[]> {
    try {
      let query = supabase
        .from('materials')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching materials by type:', error);
      throw error;
    }
  }
}
