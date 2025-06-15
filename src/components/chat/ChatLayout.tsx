import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Chat, Message, ChatService } from "@/lib/services/chatService";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { AuthContext } from "@/context/AuthContext";
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Load chats when component mounts
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    loadChats();
  }, [user, router]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages();
      const unsubscribe = subscribeToMessages();
      markMessagesAsRead();
      return unsubscribe;
    }
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
    if (!selectedChat) return () => {};

    const channel = ChatService.subscribeToMessages(
      selectedChat.id,
      async (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
        const newRecord = payload.new as Message;

        // The payload from a subscription doesn't include relational data.
        // We need to fetch the sender's profile separately.
        const { data: sender, error } = await ChatService.getUserProfile(newRecord.sender_id);

        if (error) {
          console.error("Failed to fetch sender profile for new message:", error);
          return;
        }

        const newMessage: Message = {
          ...newRecord,
          sender: {
            name: sender?.name || "Unknown User",
          },
        };

        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.id === newMessage.id)) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });

        if (newMessage.sender_id !== user?.id) {
          markMessagesAsRead();
        }
      }
    );

    return () => {
      channel.unsubscribe();
    };
  };

  const markMessagesAsRead = async () => {
    if (!user || !selectedChat || messages.length === 0) return;
    
    try {
      await ChatService.markMessagesAsRead({
        messages,
        userId: user.id,
      });
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedChat) return;
    
    try {
      const newMessage = await ChatService.sendMessage({
        chat_id: selectedChat.id,
        sender_id: user.id,
        content,
      });
      
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      await ChatService.updateLastMessageTime(selectedChat.id);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const handleSendFile = async (file: File) => {
    if (!user || !selectedChat) return;
    
    try {
      const fileUrl = await ChatService.uploadFile(file, user.id);
      
      const newMessage = await ChatService.sendMessage({
        chat_id: selectedChat.id,
        sender_id: user.id,
        content: file.name,
        file_url: fileUrl,
      });
      
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      await ChatService.updateLastMessageTime(selectedChat.id);
    } catch (error) {
      console.error("Failed to upload file:", error);
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
      {/* Chat List Sidebar */}
      <div className={`border-r w-80 flex-shrink-0 h-full ${selectedChat ? 'hidden md:flex' : 'flex'} flex-col p-4`}>
        <h1 className="font-semibold text-xl mb-4">Messages</h1>
        <ChatList
          chats={chats}
          isLoading={isLoadingChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onCreateChat={handleCreateChat}
          currentUserId={user.id}
        />
      </div>
      
      {/* Chat Area */}
      <div className="flex-grow flex flex-col h-full">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Avatar className="h-10 w-10">
                {selectedChat && (
                  <>                    <AvatarFallback>
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
