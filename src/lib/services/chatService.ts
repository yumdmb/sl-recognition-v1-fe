import { createClient } from '@/utils/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient();

export interface Chat {
  id: string;
  is_group: boolean;
  last_message_at: string;
  participants: {
    user_id: string;
    user: {
      full_name: string;
      avatar_url?: string;
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
    full_name: string;
    avatar_url?: string;
  };
}

export class ChatService {
  static async getChats(): Promise<Chat[]> {
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        *,
        participants:chat_participants(
          user_id,
          user:users(
            full_name,
            avatar_url
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
        sender:users(
          full_name,
          avatar_url
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
  }): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .insert(params);

    if (error) throw error;
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
      .upsert(messagesToMark);

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
    callback: (message: Message) => void
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
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }

  static async createChat(params: {
    user_ids: string[];
    is_group: boolean;
  }): Promise<Chat> {
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({
        is_group: params.is_group,
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (chatError) throw chatError;

    const participants = params.user_ids.map((userId) => ({
      chat_id: chat.id,
      user_id: userId,
    }));

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participants);

    if (participantsError) throw participantsError;

    return chat;
  }

  static async updateLastMessageTime(chatId: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chatId);

    if (error) throw error;
  }
}