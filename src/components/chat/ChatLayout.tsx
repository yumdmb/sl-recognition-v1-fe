import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Chat, Message, ChatService, UnreadCount } from "@/lib/services/chatService";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { AuthContext } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import ChatList from "./ChatList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function ChatLayout() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const router = useRouter();
  const isMobile = useIsMobile();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Load chats when component mounts
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    loadChats();
    loadUnreadCounts();

    // Subscribe to unread count changes
    const unreadChannel = ChatService.subscribeToUnreadCounts(
      user.id,
      (counts: UnreadCount[]) => {
        const countsMap: Record<string, number> = {};
        counts.forEach(({ chatId, count }) => {
          countsMap[chatId] = count;
        });
        setUnreadCounts(countsMap);
      }
    );

    return () => {
      unreadChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages();
      const unsubscribe = subscribeToMessages();
      markMessagesAsRead();
      return unsubscribe;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  const loadChats = async () => {
    if (!user) return;
    
    setIsLoadingChats(true);
    try {
      const chats = await ChatService.getChats();
      setChats(chats);
      
      // If there's only one chat, select it automatically
      if (chats.length === 1 && !selectedChat) {
        setSelectedChat(chats[0]);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
      toast.error("Failed to load chats");
    } finally {
      setIsLoadingChats(false);
    }
  };

  const loadUnreadCounts = async () => {
    if (!user) return;
    
    try {
      const counts = await ChatService.getUnreadCounts(user.id);
      const countsMap: Record<string, number> = {};
      counts.forEach(({ chatId, count }) => {
        countsMap[chatId] = count;
      });
      setUnreadCounts(countsMap);
    } catch (error) {
      console.error("Failed to load unread counts:", error);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;
    
    setIsLoadingMessages(true);
    try {
      const messages = await ChatService.getMessages(selectedChat.id);
      setMessages(messages);
      markMessagesAsRead();
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedChat || !user) return () => {};

    const channel = ChatService.subscribeToMessages(
      selectedChat.id,
      async (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
        console.log("Real-time message received:", payload);
        
        const newRecord = payload.new as Record<string, unknown>;

        // The payload from a subscription doesn't include relational data.
        // We need to fetch the sender's profile separately.
        const { data: sender, error } = await ChatService.getUserProfile(newRecord.sender_id as string);

        if (error) {
          console.error("Failed to fetch sender profile for new message:", error);
          // Still add the message with a fallback name
          const fallbackMessage: Message = {
            id: newRecord.id as string,
            content: newRecord.content as string,
            sender_id: newRecord.sender_id as string,
            chat_id: newRecord.chat_id as string,
            file_url: (newRecord.file_url as string | null) ?? undefined,
            created_at: (newRecord.created_at && typeof newRecord.created_at === 'string' && newRecord.created_at.trim() !== '') 
              ? newRecord.created_at 
              : new Date().toISOString(),
            is_edited: (newRecord.is_edited as boolean) || false,
            reply_to_id: (newRecord.reply_to_id as string | null) ?? undefined,
            sender: {
              name: "Unknown User",
              profile_picture_url: null,
            },
          };

          setMessages((prevMessages) => {
            // Check for duplicates
            if (prevMessages.some((msg) => msg.id === fallbackMessage.id)) {
              return prevMessages;
            }
            return [...prevMessages, fallbackMessage];
          });
          return;
        }

        const newMessage: Message = {
          id: newRecord.id as string,
          content: newRecord.content as string,
          sender_id: newRecord.sender_id as string,
          chat_id: newRecord.chat_id as string,
          file_url: (newRecord.file_url as string | null) ?? undefined,
          created_at: (newRecord.created_at && typeof newRecord.created_at === 'string' && newRecord.created_at.trim() !== '') 
            ? newRecord.created_at 
            : new Date().toISOString(),
          is_edited: (newRecord.is_edited as boolean) || false,
          reply_to_id: (newRecord.reply_to_id as string | null) ?? undefined,
          sender: {
            name: sender?.name || "Unknown User",
            profile_picture_url: sender?.profile_picture_url || null,
          },
        };

        console.log("Adding new message to state:", newMessage);

        setMessages((prevMessages) => {
          // Check for duplicates
          if (prevMessages.some((msg) => msg.id === newMessage.id)) {
            console.log("Duplicate message detected, skipping:", newMessage.id);
            return prevMessages;
          }
          console.log("Adding message to list");
          return [...prevMessages, newMessage];
        });

        // Mark messages as read if from another user
        if (newMessage.sender_id !== user.id) {
          // Small delay to ensure message is in state before marking as read
          setTimeout(() => {
            markMessagesAsRead();
          }, 100);
        }
      }
    );

    return () => {
      console.log("Unsubscribing from messages channel");
      channel.unsubscribe();
    };
  };

  const markMessagesAsRead = async () => {
    if (!user || !selectedChat) return;
    
    // Get current messages from state
    setMessages((currentMessages) => {
      if (currentMessages.length === 0) return currentMessages;
      
      // Mark messages as read asynchronously
      ChatService.markMessagesAsRead({
        messages: currentMessages,
        userId: user.id,
      })
        .then(() => {
          // Update unread count for this chat to 0
          setUnreadCounts((prev) => ({
            ...prev,
            [selectedChat.id]: 0,
          }));
        })
        .catch((error) => {
          console.error("Failed to mark messages as read:", error);
        });
      
      return currentMessages;
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedChat) return;
    
    try {
      const newMessage = await ChatService.sendMessage({
        chat_id: selectedChat.id,
        sender_id: user.id,
        content,
      });
      
      console.log("Message sent successfully:", newMessage);
      
      // Add message to state immediately (optimistic update)
      // The real-time subscription will also receive this, but we handle duplicates
      setMessages((prevMessages) => {
        // Check if message already exists (from subscription)
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          console.log("Message already in state from subscription");
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
      
      await ChatService.updateLastMessageTime(selectedChat.id);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      throw error;
    }
  };

  const handleSendFile = async (file: File, message?: string) => {
    if (!user || !selectedChat) return;
    
    try {
      const fileUrl = await ChatService.uploadFile(file, user.id);
      
      // Use the provided message or fallback to file name
      const content = message?.trim() || file.name;
      
      const newMessage = await ChatService.sendMessage({
        chat_id: selectedChat.id,
        sender_id: user.id,
        content,
        file_url: fileUrl,
      });
      
      console.log("File message sent successfully:", newMessage);
      
      // Add message to state immediately (optimistic update)
      // The real-time subscription will also receive this, but we handle duplicates
      setMessages((prevMessages) => {
        // Check if message already exists (from subscription)
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          console.log("File message already in state from subscription");
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
      
      await ChatService.updateLastMessageTime(selectedChat.id);
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Failed to upload file");
      throw error;
    }
  };

  const handleCreateChat = async (targetUserId: string) => {
    if (!user) return;
    
    try {
      const newChat = await ChatService.createChat({
        user_ids: [user.id, targetUserId],
        is_group: false,
      });
      
      await loadChats();
      setSelectedChat(newChat);
    } catch (error) {
      console.error("Failed to create chat:", error);
      toast.error("Failed to create chat");
      throw error;
    }
  };

  const getChatName = (chat: Chat) => {
    if (!user) return "Chat";
    
    if (chat.is_group) {
      return "Group Chat"; // In a real app, you'd store a name for group chats
    }
    
    const otherParticipant = chat.participants.find(
      (p) => p.user_id !== user.id
    );
    
    return otherParticipant?.user?.name || "Unknown User";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat List Sidebar - Hidden on mobile when chat is selected */}
      <div className={`border-r w-80 flex-shrink-0 h-full ${isMobile && selectedChat ? 'hidden' : 'flex'} ${!isMobile ? 'md:flex' : ''} flex-col p-4`}>
        <h1 className="font-semibold text-xl mb-4">Messages</h1>
        <ChatList
          chats={chats}
          isLoading={isLoadingChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onCreateChat={handleCreateChat}
          currentUserId={user.id}
          unreadCounts={unreadCounts}
        />
      </div>
      
      {/* Chat Area - Full screen on mobile when chat is selected */}
      <div className={`flex-grow flex flex-col h-full ${isMobile && !selectedChat ? 'hidden' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header with back button on mobile */}
            <div className="border-b p-4 flex items-center gap-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedChat(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              
              <Avatar className="h-10 w-10">
                {selectedChat && (
                  <>
                    <AvatarImage
                      src={selectedChat.participants.find(p => p.user_id !== user.id)?.user?.profile_picture_url || undefined}
                      alt={getChatName(selectedChat)}
                    />
                    <AvatarFallback>
                      {getInitials(getChatName(selectedChat))}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div>
                <h2 className="font-medium">{selectedChat && getChatName(selectedChat)}</h2>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-grow overflow-hidden">
              <MessageList
                messages={messages}
                isLoading={isLoadingMessages}
                currentUserId={user.id}
              />
            </div>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">Choose an existing conversation or start a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
