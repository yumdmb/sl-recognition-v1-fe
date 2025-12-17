import { createClient } from "@/utils/supabase/client";
import { Avatar3DRecording } from "@/types/hand";

export interface SignAvatar {
  id: string;
  name: string;
  description: string | null;
  language: "ASL" | "MSL";
  status: "verified" | "unverified";
  recording_data: Avatar3DRecording;
  frame_count: number;
  duration_ms: number;
  user_id: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user_name?: string;
}

// Type for database row with joined user_profiles
interface SignAvatarRow {
  id: string;
  name: string;
  description: string | null;
  language: "ASL" | "MSL";
  status: "verified" | "unverified";
  recording_data: Avatar3DRecording;
  frame_count: number;
  duration_ms: number;
  user_id: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  user_profiles: { name: string } | null;
}

export interface CreateSignAvatarInput {
  name: string;
  description?: string;
  language: "ASL" | "MSL";
  recording: Avatar3DRecording;
}

export const signAvatarService = {
  /**
   * Create a new sign avatar
   */
  async create(input: CreateSignAvatarInput, userId: string): Promise<SignAvatar> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("sign_avatars")
      .insert({
        name: input.name,
        description: input.description || null,
        language: input.language,
        recording_data: input.recording,
        frame_count: input.recording.frames.length,
        duration_ms: input.recording.duration,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating sign avatar:", error);
      throw new Error(error.message);
    }

    return data as SignAvatar;
  },

  /**
   * Get all avatars for a specific user
   */
  async getByUserId(userId: string): Promise<SignAvatar[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("sign_avatars")
      .select(`
        *,
        user_profiles!sign_avatars_user_id_fkey(name)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user avatars:", error);
      throw new Error(error.message);
    }

    return ((data || []) as SignAvatarRow[]).map((item) => ({
      ...item,
      user_name: item.user_profiles?.name || "Unknown",
    })) as SignAvatar[];
  },

  /**
   * Get all avatars (admin only)
   */
  async getAll(): Promise<SignAvatar[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("sign_avatars")
      .select(`
        *,
        user_profiles!sign_avatars_user_id_fkey(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all avatars:", error);
      throw new Error(error.message);
    }

    return ((data || []) as SignAvatarRow[]).map((item) => ({
      ...item,
      user_name: item.user_profiles?.name || "Unknown",
    })) as SignAvatar[];
  },

  /**
   * Get a single avatar by ID
   */
  async getById(id: string): Promise<SignAvatar | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("sign_avatars")
      .select(`
        *,
        user_profiles!sign_avatars_user_id_fkey(name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      console.error("Error fetching avatar:", error);
      throw new Error(error.message);
    }

    return {
      ...data,
      user_name: data.user_profiles?.name || "Unknown",
    } as SignAvatar;
  },

  /**
   * Update avatar status (admin only)
   */
  async updateStatus(
    id: string,
    status: "verified" | "unverified",
    reviewerId: string
  ): Promise<SignAvatar> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("sign_avatars")
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating avatar status:", error);
      throw new Error(error.message);
    }

    return data as SignAvatar;
  },

  /**
   * Delete an avatar
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from("sign_avatars")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting avatar:", error);
      throw new Error(error.message);
    }
  },

  /**
   * Get verified avatars (public)
   */
  async getVerified(language?: "ASL" | "MSL"): Promise<SignAvatar[]> {
    const supabase = createClient();

    let query = supabase
      .from("sign_avatars")
      .select(`
        *,
        user_profiles!sign_avatars_user_id_fkey(name)
      `)
      .eq("status", "verified")
      .order("created_at", { ascending: false });

    if (language) {
      query = query.eq("language", language);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching verified avatars:", error);
      throw new Error(error.message);
    }

    return ((data || []) as SignAvatarRow[]).map((item) => ({
      ...item,
      user_name: item.user_profiles?.name || "Unknown",
    })) as SignAvatar[];
  },
};
