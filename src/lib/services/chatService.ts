import { createClient } from '@/utils/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const supabase = createClient();

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

interface UserProfile {
  id: string;
  name: string;
}

export class ChatService {
  static async getUserProfile(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    return supabase
      .from('user_profiles')
      .select('id, name')
      .eq('id', userId)
      .single();
  }

  static async getChats(): Promise<Chat[]> {
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
    const { error } = await supabase
      .from('chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chatId);

    if (error) throw error;
  }
}