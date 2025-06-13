import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types/database';

const supabase = createClient();

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user_profile?: {
    username: string;
    avatar_url?: string;
  };
};

export type ForumComment = {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: {
    username: string;
    avatar_url?: string;
  };
  replies?: ForumComment[];
};

export class ForumService {
  // Posts CRUD operations
  static async getPosts(): Promise<ForumPost[]> {
    try {
      // First, let's try without the join to see if basic query works
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      // If we have posts, get the user profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(post => post.user_id))];
        
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, name')
          .in('id', userIds);

        if (profileError) {
          console.error('Error fetching user profiles:', profileError);
          // Continue without profiles if there's an error
          return data.map(post => ({
            ...post,
            user_profile: { username: 'Anonymous', avatar_url: undefined }
          }));
        }

        // Create a map of user profiles
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        return data.map(post => ({
          ...post,
          user_profile: {
            username: profileMap.get(post.user_id)?.name || 'Anonymous',
            avatar_url: undefined
          }
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      throw error;
    }
  }
  
  static async getPostById(id: string): Promise<ForumPost | null> {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      if (!data) return null;
      
      // Get user profile separately
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', data.user_id)
        .single();
      
      return {
        ...data,
        user_profile: {
          username: profile?.name || 'Anonymous',
          avatar_url: undefined
        }
      };
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      throw error;
    }
  }

  static async createPost(post: {
    title: string;
    content: string;
  }): Promise<ForumPost> {
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
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      // Process the data with user profiles
      const processedData = await Promise.all((data || []).map(async (comment) => {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('id', comment.user_id)
          .single();

        return {
          ...comment,
          user_profile: {
            username: profile?.name || 'Anonymous',
            avatar_url: undefined
          }
        };
      }));
      
      // Organize comments into a hierarchical structure
      const commentMap = new Map<string, ForumComment>();
      const rootComments: ForumComment[] = [];
      
      // First, add all comments to the map
      processedData.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
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
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }

  static async createComment(comment: {
    post_id: string;
    content: string;
    parent_comment_id?: string | null;
  }): Promise<ForumComment> {
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
}
