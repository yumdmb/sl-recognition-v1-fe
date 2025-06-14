// page.tsx
'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // AvatarImage removed as it's not needed without avatar_url
import { Loader2, Send, PaperclipIcon, UserPlus, Search as SearchIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Shadcn UI Dialog components for the "New Chat" feature
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';


const supabase = createClient();

interface Chat {
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

interface Message {
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

interface SearchUserProfile {
  id: string;
  name: string;
  email: string;
}

export default function ChatPage() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [newChatSearchTerm, setNewChatSearchTerm] = useState('');
  const [newChatSearchResults, setNewChatSearchResults] = useState<SearchUserProfile[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const newChatSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (user) {
      console.log("Authenticated User ID:", user.id); // Added console log
      loadChats();
    } else {
      console.log("User is not authenticated. User object:", user); // Added console log for unauthenticated state
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
      const unsubscribe = subscribeToMessages();
      markMessagesAsRead();
      return unsubscribe;
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (newChatSearchTimeoutRef.current) {
      clearTimeout(newChatSearchTimeoutRef.current);
    }

    if (newChatSearchTerm.trim() === '') {
      setNewChatSearchResults([]);
      return;
    }

    setIsSearchingUsers(true);
    newChatSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, name, email')
          .ilike('name', `%${newChatSearchTerm}%`)
          .neq('id', user?.id || '')
          .limit(10);

        if (error) throw error;
        setNewChatSearchResults(data || []);
      } catch (error) {
        console.error('Error searching users for new chat:', error);
        toast.error('Failed to search users.');
      } finally {
        setIsSearchingUsers(false);
      }
    }, 500);
  }, [newChatSearchTerm, user?.id]);


  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(
          `*,
          participants:chat_participants(
            user_id,
            user:user_profiles(
              name
            )
          )`
        )
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error loading chats:', error);
        toast.error('Failed to load chats');
        setChats([]);
        return;
      }

      setChats(data || []);
      console.log('Chats loaded successfully:', data);
    } catch (error) {
      console.error('Unexpected error during chat loading:', error);
      toast.error('Failed to load chats due to an unexpected issue.');
      setChats([]);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(
          `*,
          sender:user_profiles(
          name
          )`
        )
        .eq('chat_id', selectedChat.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedChat) return;

    const channel = supabase
      .channel(`chat:${selectedChat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${selectedChat.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          if (payload.new.sender_id !== user?.id) {
            markMessagesAsRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markMessagesAsRead = async () => {
    if (!user || !selectedChat) return;

    try {
      const { error } = await supabase.from('message_status').upsert(
        messages
          .filter((msg) => msg.sender_id !== user.id)
          .map((msg) => ({
            message_id: msg.id,
            user_id: user.id,
            is_read: true,
            read_at: new Date().toISOString(),
          }))
      );

      if (error) throw error;
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChat || !input.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        chat_id: selectedChat.id,
        sender_id: user.id,
        content: input.trim(),
      });

      if (error) throw error;

      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedChat.id);

      setInput('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedChat) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(fileName);

      await supabase.from('messages').insert({
        chat_id: selectedChat.id,
        sender_id: user.id,
        content: file.name,
        file_url: publicUrl,
      });

      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedChat.id);

    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleCreateDirectChat = async (targetUserId: string) => {
    if (!user?.id || !targetUserId) return;

    try {
      // 1. Check if a direct chat already exists between these two users
      const { data: existingChatParticipants, error: existingChatParticipantsError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .in('user_id', [user.id, targetUserId]);

      if (existingChatParticipantsError) throw existingChatParticipantsError;

      const chatIdsWithBothUsers = existingChatParticipants
        .reduce((acc, current) => {
          acc[current.chat_id] = (acc[current.chat_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      // Find chat IDs that have exactly two participants (meaning our two users)
      const potentialDirectChatIds = Object.keys(chatIdsWithBothUsers).filter(chatId => chatIdsWithBothUsers[chatId] === 2);

      let existingDirectChatId: string | null = null;

      if (potentialDirectChatIds.length > 0) {
        // Now verify these are actually direct chats (is_group = false)
        const { data: chatsData, error: chatsDataError } = await supabase
          .from('chats')
          .select('id, is_group')
          .in('id', potentialDirectChatIds);

        if (chatsDataError) throw chatsDataError;

        const foundChat = chatsData.find(chat => !chat.is_group);
        if (foundChat) {
          existingDirectChatId = foundChat.id;
        }
      }

      if (existingDirectChatId) {
        toast.info('Chat already exists, opening it.');
        setIsNewChatDialogOpen(false);
        setNewChatSearchTerm('');
        await loadChats();
        const foundChat = chats.find(chat => chat.id === existingDirectChatId);
        if (foundChat) {
          setSelectedChat(foundChat);
        } else {
            console.warn("Existing chat found but not immediately selectable after reload.");
        }
        return;
      }

      // 2. If no existing chat, create a new one
      const { data: newChatData, error: newChatError } = await supabase
        .from('chats')
        .insert({ is_group: false, last_message_at: new Date().toISOString() })
        .select()
        .single();

      if (newChatError) throw newChatError;

      const newChatId = newChatData.id;

      // 3. Add participants to the new chat
      const { error: participantsError } = await supabase.from('chat_participants').insert([
        { chat_id: newChatId, user_id: user.id },
        { chat_id: newChatId, user_id: targetUserId }, // Corrected this line
      ]);

      if (participantsError) throw participantsError;

      toast.success('New chat created successfully!');
      setIsNewChatDialogOpen(false);
      setNewChatSearchTerm('');
      await loadChats();
      const createdChat = chats.find(chat => chat.id === newChatId);
      if (createdChat) {
        setSelectedChat(createdChat);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create new chat');
    }
  };


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 flex flex-col">
        <h2 className="font-semibold mb-4">Chats</h2>
        {user && (
          <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4">
                <UserPlus className="mr-2 h-4 w-4" /> New Chat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Start a new chat</DialogTitle>
                <DialogDescription>
                  Search for users to start a direct message.
                </DialogDescription>
              </DialogHeader>
              {/* Wrapped CommandInput and icon in a div for proper positioning */}
              <div className="relative">
                <Command className="rounded-lg border shadow-md">
                  <CommandInput
                    placeholder="Search users..."
                    value={newChatSearchTerm}
                    onValueChange={setNewChatSearchTerm}
                    // Removed rightIcon prop from CommandInput directly
                  />
                  {/* Manually position the icon within the same container */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {isSearchingUsers ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <SearchIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <CommandList>
                    {isSearchingUsers && newChatSearchTerm.trim() !== '' ? (
                      <CommandEmpty>Searching...</CommandEmpty>
                    ) : newChatSearchResults.length === 0 && newChatSearchTerm.trim() !== '' ? (
                      <CommandEmpty>No users found.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {newChatSearchResults.map((profile) => (
                          <CommandItem
                            key={profile.id}
                            onSelect={() => handleCreateDirectChat(profile.id)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Avatar className="h-8 w-8">
                              {/* AvatarImage removed */}
                              <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span>{profile.name} ({profile.email})</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </div> {/* End of relative div wrapper */}
            </DialogContent>
          </Dialog>
        )}
        <div className="space-y-2 mt-4 flex-grow overflow-y-auto">
          {chats.length === 0 ? (
            <p className="text-muted-foreground text-sm">No chats found. Start a new conversation!</p>
          ) : (
            chats.map((chat) => {
                const otherParticipant = chat.participants.find(p => p.user_id !== user?.id);
                const chatDisplayName = chat.is_group
                    ? 'Group Chat'
                    : otherParticipant?.user.name || 'Unknown User';

                return (
                    <div
                        key={chat.id}
                        className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                            selectedChat?.id === chat.id ? 'bg-primary/10' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedChat(chat)}
                    >
                        <Avatar className="h-8 w-8">
                            {/* AvatarImage removed */}
                            <AvatarFallback>{chatDisplayName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{chatDisplayName}</p>
                        </div>
                    </div>
                );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  {/* AvatarImage removed */}
                  <AvatarFallback>
                    {
                      selectedChat.participants.find(
                        p => p.user_id !== user?.id
                      )?.user.name?.[0]
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {!selectedChat.is_group
                      ? selectedChat.participants.find(
                          p => p.user_id !== user?.id
                        )?.user.name
                      : 'Group Chat'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.file_url ? (
                          <a
                            href={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {message.content}
                          </a>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <span className="text-xs opacity-70 block mt-1">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isSending}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Button type="submit" disabled={!input.trim() || isSending}>
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}