import { createClient } from "@/utils/supabase/client";
import { Avatar3DRecording } from "@/types/hand";

export interface SignAvatar {
  id: string;
  name: string;
  description: string | null;
  language: "ASL" | "MSL";
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  recording_data: Avatar3DRecording;
  frame_count: number;
  duration_ms: number;
  user_id: string;
  category_id: number | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user_name?: string;
  category?: {
    id: number;
    name: string;
    icon: string | null;
  };
}

// Type for database row with joined user_profiles and category
interface SignAvatarRow {
  id: string;
  name: string;
  description: string | null;
  language: "ASL" | "MSL";
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  recording_data: Avatar3DRecording;
  frame_count: number;
  duration_ms: number;
  user_id: string;
  category_id: number | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  user_profiles: { name: string } | null;
  gesture_categories: { id: number; name: string; icon: string | null } | null;
}

export interface CreateSignAvatarInput {
  name: string;
  description?: string;
  language: "ASL" | "MSL";
  recording: Avatar3DRecording;
  categoryId?: number | null;
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
        category_id: input.categoryId || null,
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
        user_profiles!sign_avatars_user_id_fkey(name),
        gesture_categories!category_id(id, name, icon)
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
      category: item.gesture_categories || undefined,
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
        user_profiles!sign_avatars_user_id_fkey(name),
        gesture_categories!category_id(id, name, icon)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all avatars:", error);
      throw new Error(error.message);
    }

    return ((data || []) as SignAvatarRow[]).map((item) => ({
      ...item,
      user_name: item.user_profiles?.name || "Unknown",
      category: item.gesture_categories || undefined,
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
        user_profiles!sign_avatars_user_id_fkey(name),
        gesture_categories!category_id(id, name, icon)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      console.error("Error fetching avatar:", error);
      throw new Error(error.message);
    }

    const row = data as SignAvatarRow;
    return {
      ...row,
      user_name: row.user_profiles?.name || "Unknown",
      category: row.gesture_categories || undefined,
    } as SignAvatar;
  },

  /**
   * Update avatar status (admin only)
   * When approving, automatically creates a gesture_contributions entry for the dictionary
   * When rejecting, removes from dictionary if it was previously added
   */
  async updateStatus(
    id: string,
    status: "approved" | "rejected",
    reviewerId: string,
    rejectionReason?: string
  ): Promise<SignAvatar> {
    const supabase = createClient();

    // First, get the avatar details
    const { data: avatar, error: fetchError } = await supabase
      .from("sign_avatars")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching avatar:", fetchError);
      throw new Error(fetchError.message);
    }

    // Update the avatar status
    const { data, error } = await supabase
      .from("sign_avatars")
      .update({
        status,
        rejection_reason: status === "rejected" ? (rejectionReason || null) : null,
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

    // If approving, auto-create gesture_contributions entry for dictionary
    if (status === "approved") {
      await this.addToDictionary(avatar as SignAvatar, reviewerId);
    }

    // If rejecting, remove from dictionary (in case it was previously approved)
    if (status === "rejected") {
      await this.removeFromDictionary(id);
    }

    return data as SignAvatar;
  },

  /**
   * Add verified avatar to gesture dictionary (gesture_contributions)
   */
  async addToDictionary(avatar: SignAvatar, reviewerId: string): Promise<void> {
    const supabase = createClient();

    // Check if already exists in dictionary
    const { data: existing } = await supabase
      .from("gesture_contributions")
      .select("id")
      .eq("avatar_id", avatar.id)
      .single();

    if (existing) {
      console.log("Avatar already in dictionary, skipping");
      return;
    }

    // Create gesture_contributions entry with category
    const { error } = await supabase
      .from("gesture_contributions")
      .insert({
        title: avatar.name,
        description: avatar.description || `3D avatar for "${avatar.name}"`,
        language: avatar.language,
        media_type: "avatar",
        media_url: null,
        avatar_id: avatar.id,
        submitted_by: avatar.user_id,
        status: "approved",
        source: "avatar",
        category_id: avatar.category_id,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error adding avatar to dictionary:", error);
      // Don't throw - avatar is still verified, just log the error
    }
  },

  /**
   * Remove avatar from gesture dictionary when unverified
   */
  async removeFromDictionary(avatarId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from("gesture_contributions")
      .delete()
      .eq("avatar_id", avatarId);

    if (error) {
      console.error("Error removing avatar from dictionary:", error);
      // Don't throw - just log the error
    }
  },

  /**
   * Delete an avatar
   * First removes from dictionary, then deletes the avatar
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();

    // First, remove from gesture_contributions (dictionary) if exists
    await this.removeFromDictionary(id);

    // Then delete the avatar
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
   * Get approved avatars (public)
   */
  async getApproved(language?: "ASL" | "MSL"): Promise<SignAvatar[]> {
    const supabase = createClient();

    let query = supabase
      .from("sign_avatars")
      .select(`
        *,
        user_profiles!sign_avatars_user_id_fkey(name),
        gesture_categories!category_id(id, name, icon)
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (language) {
      query = query.eq("language", language);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching approved avatars:", error);
      throw new Error(error.message);
    }

    return ((data || []) as SignAvatarRow[]).map((item) => ({
      ...item,
      user_name: item.user_profiles?.name || "Unknown",
      category: item.gesture_categories || undefined,
    })) as SignAvatar[];
  },

  /**
   * Update avatar category (admin only)
   */
  async updateCategory(id: string, categoryId: number | null): Promise<SignAvatar> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("sign_avatars")
      .update({ category_id: categoryId })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating avatar category:", error);
      throw new Error(error.message);
    }

    // Also update the gesture_contributions entry if it exists
    await supabase
      .from("gesture_contributions")
      .update({ category_id: categoryId })
      .eq("avatar_id", id);

    return data as SignAvatar;
  },
};
