import { createClient } from '@/utils/supabase/client';

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_profile?: {
    username: string;
    avatar_url?: string | null;
  };
  comment_count?: number;
  like_count?: number;
  user_liked?: boolean;
};

export type ForumComment = {
  id: string;
  post_id: string | null;
  content: string;
  user_id: string | null;
  parent_comment_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_profile?: {
    username: string;
    avatar_url?: string | null;
  };
  replies?: ForumComment[];
};

export type ForumAttachment = {
  id: string;
  post_id: string | null;
  comment_id: string | null;
  file_url: string;
  file_type: string;
  file_name: string;
  user_id: string;
  created_at: string | null;
};

// Allowed MIME types for forum attachments
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class ForumService {
  // Posts CRUD operations
  static async getPosts(): Promise<ForumPost[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching forum posts:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Failed to fetch forum posts: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        return [];
      }

      // Get unique user IDs, filtering out null values
      const userIds = [...new Set(data.map(post => post.user_id).filter((id): id is string => id !== null))];
      const postIds = data.map(post => post.id);
      
      // Fetch comment counts for all posts in a single query
      const { data: commentCounts, error: countError } = await supabase
        .from('forum_comments')
        .select('post_id')
        .in('post_id', postIds);
      
      // Build comment count map
      const commentCountMap = new Map<string, number>();
      if (!countError && commentCounts) {
        commentCounts.forEach(c => {
          const currentCount = commentCountMap.get(c.post_id) || 0;
          commentCountMap.set(c.post_id, currentCount + 1);
        });
      }

      // Fetch like counts for all posts
      const { data: { user } } = await supabase.auth.getUser();
      const { data: postLikes, error: likesError } = await supabase
        .from('post_likes')
        .select('post_id, user_id')
        .in('post_id', postIds);
      
      // Build like count map
      const likeCountMap = new Map<string, { count: number; userLiked: boolean }>();
      postIds.forEach(id => {
        likeCountMap.set(id, { count: 0, userLiked: false });
      });
      if (!likesError && postLikes) {
        postLikes.forEach(like => {
          const current = likeCountMap.get(like.post_id);
          if (current) {
            current.count++;
            if (user && like.user_id === user.id) {
              current.userLiked = true;
            }
          }
        });
      }
      
      // If no valid user IDs, return posts with anonymous profiles and counts
      if (userIds.length === 0) {
        return data.map(post => {
          const likeData = likeCountMap.get(post.id) || { count: 0, userLiked: false };
          return {
            ...post,
            user_profile: { username: 'Anonymous', avatar_url: null },
            comment_count: commentCountMap.get(post.id) || 0,
            like_count: likeData.count,
            user_liked: likeData.userLiked
          };
        });
      }

      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, name, profile_picture_url')
        .in('id', userIds);

      if (profileError) {
        console.error('Error fetching user profiles:', profileError);
        // Continue without profiles if there's an error
        return data.map(post => {
          const likeData = likeCountMap.get(post.id) || { count: 0, userLiked: false };
          return {
            ...post,
            user_profile: { username: 'Anonymous', avatar_url: null },
            comment_count: commentCountMap.get(post.id) || 0,
            like_count: likeData.count,
            user_liked: likeData.userLiked
          };
        });
      }

      // Create a map of user profiles
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data.map(post => {
        const likeData = likeCountMap.get(post.id) || { count: 0, userLiked: false };
        const profile = post.user_id ? profileMap.get(post.user_id) : null;
        return {
          ...post,
          user_profile: {
            username: profile?.name || 'Anonymous',
            avatar_url: profile?.profile_picture_url || null
          },
          comment_count: commentCountMap.get(post.id) || 0,
          like_count: likeData.count,
          user_liked: likeData.userLiked
        };
      });
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }
  
  static async getPostById(id: string): Promise<ForumPost | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // PGRST116 means no rows returned, which is not an error for single queries
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching post:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
        throw new Error(`Failed to fetch post: ${error.message}`);
      }
      
      if (!data) return null;
      
      // Get user profile separately if user_id exists
      let profileName = 'Anonymous';
      let profilePictureUrl: string | null = null;
      if (data.user_id) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name, profile_picture_url')
          .eq('id', data.user_id)
          .single();
        
        if (profile?.name) {
          profileName = profile.name;
        }
        if (profile?.profile_picture_url) {
          profilePictureUrl = profile.profile_picture_url;
        }
      }
      
      return {
        ...data,
        user_profile: {
          username: profileName,
          avatar_url: profilePictureUrl
        }
      };
    } catch (error) {
      console.error(`Error in getPostById(${id}):`, error);
      throw error;
    }
  }

  static async createPost(post: {
    title: string;
    content: string;
  }): Promise<ForumPost> {
    const supabase = createClient();
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          title: post.title,
          content: post.content,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }
  }

  static async updatePost(id: string, updates: {
    title?: string;
    content?: string;
  }): Promise<ForumPost> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating post with id ${id}:`, error);
      throw error;
    }
  }

  static async deletePost(id: string): Promise<void> {
    const supabase = createClient();
    try {
      // First delete all comments related to this post
      await supabase
        .from('forum_comments')
        .delete()
        .eq('post_id', id);
      
      // Then delete the post itself
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting post with id ${id}:`, error);
      throw error;
    }
  }
  
  // Comments CRUD operations
  static async getCommentsByPostId(postId: string): Promise<ForumComment[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
        throw new Error(`Failed to fetch comments: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        return [];
      }

      // Get unique user IDs, filtering out null values
      const userIds = [...new Set(data.map(c => c.user_id).filter((id): id is string => id !== null))];
      
      // Fetch all user profiles in a single query for efficiency
      let profileMap = new Map<string, { name: string; profile_picture_url: string | null }>();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('id, name, profile_picture_url')
          .in('id', userIds);
        
        if (profiles) {
          profileMap = new Map(profiles.map(p => [p.id, { name: p.name, profile_picture_url: p.profile_picture_url }]));
        }
      }

      // Process comments with user profiles
      const processedData: ForumComment[] = data.map(comment => {
        const profile = comment.user_id ? profileMap.get(comment.user_id) : null;
        return {
          ...comment,
          user_profile: {
            username: profile?.name || 'Anonymous',
            avatar_url: profile?.profile_picture_url || null
          },
          replies: []
        };
      });
      
      // Organize comments into a hierarchical structure
      const commentMap = new Map<string, ForumComment>();
      const rootComments: ForumComment[] = [];
      
      // First, add all comments to the map
      processedData.forEach(comment => {
        commentMap.set(comment.id, comment);
      });
      
      // Then, organize them into a tree structure
      commentMap.forEach(comment => {
        if (comment.parent_comment_id) {
          const parentComment = commentMap.get(comment.parent_comment_id);
          if (parentComment) {
            parentComment.replies = [...(parentComment.replies || []), comment];
          } else {
            rootComments.push(comment); // Fallback if parent not found
          }
        } else {
          rootComments.push(comment);
        }
      });
      
      return rootComments;
    } catch (error) {
      console.error(`Error in getCommentsByPostId(${postId}):`, error);
      throw error;
    }
  }

  static async createComment(comment: {
    post_id: string;
    content: string;
    parent_comment_id?: string | null;
  }): Promise<ForumComment> {
    const supabase = createClient();
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_comments')
        .insert([{
          post_id: comment.post_id,
          content: comment.content,
          user_id: user.id,
          parent_comment_id: comment.parent_comment_id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating forum comment:', error);
      throw error;
    }
  }

  static async updateComment(id: string, content: string): Promise<ForumComment> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating comment with id ${id}:`, error);
      throw error;
    }
  }

  static async deleteComment(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting comment with id ${id}:`, error);
      throw error;
    }
  }

  // Comment Like operations
  static async likeComment(commentId: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id
        });

      if (error) {
        // If it's a unique constraint violation, the user already liked this comment
        if (error.code === '23505') {
          throw new Error('You have already liked this comment');
        }
        throw error;
      }
    } catch (error) {
      console.error(`Error liking comment ${commentId}:`, error);
      throw error;
    }
  }

  static async unlikeComment(commentId: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error unliking comment ${commentId}:`, error);
      throw error;
    }
  }

  static async getCommentLikes(commentId: string): Promise<{ count: number; userLiked: boolean }> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Get total like count
      const { count, error: countError } = await supabase
        .from('comment_likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId);

      if (countError) throw countError;

      // Check if current user has liked
      let userLiked = false;
      if (user) {
        const { data: userLike } = await supabase
          .from('comment_likes')
          .select('id')
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .single();
        
        userLiked = !!userLike;
      }

      return {
        count: count || 0,
        userLiked
      };
    } catch (error) {
      console.error(`Error getting likes for comment ${commentId}:`, error);
      throw error;
    }
  }

  static async getCommentLikesBatch(commentIds: string[]): Promise<Map<string, { count: number; userLiked: boolean }>> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Get all likes for the given comments
      const { data: likes, error } = await supabase
        .from('comment_likes')
        .select('comment_id, user_id')
        .in('comment_id', commentIds);

      if (error) throw error;

      // Build the result map
      const result = new Map<string, { count: number; userLiked: boolean }>();
      
      // Initialize all comment IDs with zero counts
      commentIds.forEach(id => {
        result.set(id, { count: 0, userLiked: false });
      });

      // Count likes and check user likes
      likes?.forEach(like => {
        const current = result.get(like.comment_id);
        if (current) {
          current.count++;
          if (user && like.user_id === user.id) {
            current.userLiked = true;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting batch comment likes:', error);
      throw error;
    }
  }

  static async toggleCommentLike(commentId: string): Promise<{ count: number; userLiked: boolean }> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already liked
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await this.unlikeComment(commentId);
      } else {
        // Like
        await this.likeComment(commentId);
      }

      // Return updated state
      return this.getCommentLikes(commentId);
    } catch (error) {
      console.error(`Error toggling like for comment ${commentId}:`, error);
      throw error;
    }
  }

  // Post Like operations
  static async likePost(postId: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already liked this post');
        }
        throw error;
      }
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      throw error;
    }
  }

  static async unlikePost(postId: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error unliking post ${postId}:`, error);
      throw error;
    }
  }

  static async getPostLikes(postId: string): Promise<{ count: number; userLiked: boolean }> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Get total like count
      const { count, error: countError } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (countError) throw countError;

      // Check if current user has liked
      let userLiked = false;
      if (user) {
        const { data: userLike } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();
        
        userLiked = !!userLike;
      }

      return {
        count: count || 0,
        userLiked
      };
    } catch (error) {
      console.error(`Error getting likes for post ${postId}:`, error);
      throw error;
    }
  }

  static async getPostLikesBatch(postIds: string[]): Promise<Map<string, { count: number; userLiked: boolean }>> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Get all likes for the given posts
      const { data: likes, error } = await supabase
        .from('post_likes')
        .select('post_id, user_id')
        .in('post_id', postIds);

      if (error) throw error;

      // Build the result map
      const result = new Map<string, { count: number; userLiked: boolean }>();
      
      // Initialize all post IDs with zero counts
      postIds.forEach(id => {
        result.set(id, { count: 0, userLiked: false });
      });

      // Count likes and check user likes
      likes?.forEach(like => {
        const current = result.get(like.post_id);
        if (current) {
          current.count++;
          if (user && like.user_id === user.id) {
            current.userLiked = true;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting batch post likes:', error);
      throw error;
    }
  }

  static async togglePostLike(postId: string): Promise<{ count: number; userLiked: boolean }> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await this.unlikePost(postId);
      } else {
        await this.likePost(postId);
      }

      return this.getPostLikes(postId);
    } catch (error) {
      console.error(`Error toggling like for post ${postId}:`, error);
      throw error;
    }
  }

  // Attachment operations
  static async uploadAttachment(
    file: File,
    postId?: string,
    commentId?: string
  ): Promise<ForumAttachment> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Allowed: Images (JPEG, PNG, GIF, WebP), PDF, Word, Excel, Text files.');
      }

      // Validate that either postId or commentId is provided (but not both)
      if ((!postId && !commentId) || (postId && commentId)) {
        throw new Error('Attachment must belong to either a post or a comment, not both.');
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('forum_attachments')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('forum_attachments')
        .getPublicUrl(fileName);

      // Create attachment record
      const { data, error } = await supabase
        .from('forum_attachments')
        .insert({
          post_id: postId || null,
          comment_id: commentId || null,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_name: file.name,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        // Try to clean up uploaded file if database insert fails
        await supabase.storage.from('forum_attachments').remove([fileName]);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  }

  static async getAttachmentsByPostId(postId: string): Promise<ForumAttachment[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('forum_attachments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error getting attachments for post ${postId}:`, error);
      throw error;
    }
  }

  static async getAttachmentsByCommentId(commentId: string): Promise<ForumAttachment[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('forum_attachments')
        .select('*')
        .eq('comment_id', commentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error getting attachments for comment ${commentId}:`, error);
      throw error;
    }
  }

  static async deleteAttachment(attachmentId: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get attachment to find file path
      const { data: attachment, error: fetchError } = await supabase
        .from('forum_attachments')
        .select('*')
        .eq('id', attachmentId)
        .single();

      if (fetchError) throw fetchError;
      if (!attachment) throw new Error('Attachment not found');

      // Check ownership
      if (attachment.user_id !== user.id) {
        throw new Error('You can only delete your own attachments');
      }

      // Extract file path from URL
      const urlParts = attachment.file_url.split('/forum_attachments/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        // Delete from storage
        await supabase.storage.from('forum_attachments').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('forum_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting attachment ${attachmentId}:`, error);
      throw error;
    }
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit.'
      };
    }

    return { valid: true };
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Allowed: Images (JPEG, PNG, GIF, WebP), PDF, Word, Excel, Text files.'
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit.'
      };
    }

    return { valid: true };
  }

  static isImageFile(fileType: string): boolean {
    return ALLOWED_IMAGE_TYPES.includes(fileType);
  }

  static getFileTypeLabel(fileType: string): string {
    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/msword': 'Word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
      'application/vnd.ms-excel': 'Excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
      'text/plain': 'Text',
      'image/jpeg': 'Image',
      'image/png': 'Image',
      'image/gif': 'Image',
      'image/webp': 'Image'
    };
    return typeMap[fileType] || 'File';
  }
}
