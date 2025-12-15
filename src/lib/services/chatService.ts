import { createClient } from '@/utils/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface Chat {
  id: string;
  is_group: boolean;
  last_message_at: string;
  participants: {
    user_id: string;
    user: {
      name: string;
    };
  }[];
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  sender_id: string;
  file_url?: string;
  created_at: string;
  is_edited: boolean;
  reply_to_id?: string;
  sender: {
    name: string;
  };
}

export interface UnreadCount {
  chatId: string;
  count: number;
}

interface UserProfile {
  id: string;
  name: string;
}

export class ChatService {
  static async getUserProfile(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    const supabase = createClient();
    return supabase
      .from('user_profiles')
      .select('id, name')
      .eq('id', userId)
      .single();
  }

  static async getChats(): Promise<Chat[]> {
    const supabase = createClient();
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        *,
        participants:chat_participants(
          user_id,
          user:user_profiles(
            name
          )
        )
      `)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return chats || [];
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    const supabase = createClient();
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:user_profiles(
          name
        )
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return messages || [];
  }

  static async sendMessage(params: {
    chat_id: string;
    sender_id: string;
    content: string;
    file_url?: string;
  }): Promise<Message> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .insert(params)
      .select(`
        *,
        sender:user_profiles(
          name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async markMessagesAsRead(params: {
    messages: Message[];
    userId: string;
  }): Promise<void> {
    const supabase = createClient();
    const { messages, userId } = params;
    const messagesToMark = messages
      .filter((msg) => msg.sender_id !== userId)
      .map((msg) => ({
        message_id: msg.id,
        user_id: userId,
        is_read: true,
        read_at: new Date().toISOString(),
      }));

    if (messagesToMark.length === 0) return;

    const { error } = await supabase
      .from('message_status')
      .upsert(messagesToMark, { onConflict: 'message_id, user_id' });

    if (error) throw error;
  }

  static async uploadFile(file: File, userId: string): Promise<string> {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  static subscribeToMessages(
    chatId: string,
    callback: (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => void
  ): RealtimeChannel {
    const supabase = createClient();
    return supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
  static async createChat(params: {
    user_ids: string[];
    is_group: boolean;
  }): Promise<Chat> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_chat_with_participants', {
      user_ids: params.user_ids,
      is_group: params.is_group,
    });

    if (error) {
      console.error('Error creating chat:', error);
      throw error;
    }

    return data as Chat;
  }

  static async updateLastMessageTime(chatId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chatId);

    if (error) throw error;
  }

  static async getUnreadCounts(userId: string): Promise<UnreadCount[]> {
    const supabase = createClient();
    
    // Get all chats for the user
    const { data: chats, error: chatsError } = await supabase
      .from('chat_participants')
      .select('chat_id')
      .eq('user_id', userId);

    if (chatsError) throw chatsError;
    if (!chats || chats.length === 0) return [];

    const chatIds = chats.map(c => c.chat_id);

    // Get unread message counts for each chat
    const { data: unreadData, error: unreadError } = await supabase
      .from('messages')
      .select(`
        id,
        chat_id,
        sender_id,
        message_status!left(is_read, user_id)
      `)
      .in('chat_id', chatIds)
      .neq('sender_id', userId);

    if (unreadError) throw unreadError;

    // Process the data to count unread messages per chat
    const unreadCounts: Record<string, number> = {};
    
    if (unreadData) {
      for (const message of unreadData) {
        const chatId = message.chat_id;
        
        // Check if there's a message_status entry for this user
        const statusArray = message.message_status as any[];
        const userStatus = statusArray?.find((s: any) => s.user_id === userId);
        
        // If no status entry or is_read is false, count as unread
        if (!userStatus || !userStatus.is_read) {
          unreadCounts[chatId] = (unreadCounts[chatId] || 0) + 1;
        }
      }
    }

    // Convert to array format
    return Object.entries(unreadCounts).map(([chatId, count]) => ({
      chatId,
      count,
    }));
  }

  static subscribeToUnreadCounts(
    userId: string,
    callback: (counts: UnreadCount[]) => void
  ): RealtimeChannel {
    const supabase = createClient();
    
    // Subscribe to changes in message_status table for this user
    const channel = supabase
      .channel(`unread_counts:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_status',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Refetch unread counts when message_status changes
          try {
            const counts = await ChatService.getUnreadCounts(userId);
            callback(counts);
          } catch (error) {
            console.error('Failed to fetch unread counts:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async () => {
          // Refetch unread counts when new messages arrive
          try {
            const counts = await ChatService.getUnreadCounts(userId);
            callback(counts);
          } catch (error) {
            console.error('Failed to fetch unread counts:', error);
          }
        }
      )
      .subscribe();

    return channel;
  }
}