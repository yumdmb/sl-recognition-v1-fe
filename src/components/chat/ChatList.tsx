import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Chat } from "@/lib/services/chatService";
import { formatDistanceToNow } from "date-fns";
import NewChatDialog from "@/components/chat/NewChatDialog";
import UnreadBadge from "@/components/chat/UnreadBadge";

interface ChatListProps {
  chats: Chat[];
  isLoading: boolean;
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: (userId: string) => Promise<void> | void;
  currentUserId: string;
  unreadCounts?: Record<string, number>;
}

export default function ChatList({
  chats,
  isLoading,
  selectedChat,
  onSelectChat,
  onCreateChat,
  currentUserId,
  unreadCounts = {},
}: ChatListProps) {
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getChatName = (chat: Chat) => {
    if (chat.is_group) {
      return "Group Chat"; // In a real app, you'd store the group name in the chat record
    }
    
    const otherParticipant = chat.participants.find(
      (p) => p.user_id !== currentUserId
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

  return (
    <>
      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mb-4" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </DialogTrigger>        <NewChatDialog 
          onCreateChat={async (userId: string) => {
            await onCreateChat(userId);
            setIsNewChatDialogOpen(false);
          }} 
          currentUserId={currentUserId}
        />
      </Dialog>

      <div className="space-y-2">
        {chats.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No chats found. Start a new conversation!
          </p>
        ) : (
          chats.map((chat) => {
            const chatName = getChatName(chat);
            const otherParticipant = chat.participants.find(
              (p) => p.user_id !== currentUserId
            );
            
            return (
              <div
                key={chat.id}
                className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                  selectedChat?.id === chat.id
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                }`}
                onClick={() => onSelectChat(chat)}
              >                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={otherParticipant?.user?.profile_picture_url || undefined} 
                    alt={chatName} 
                  />
                  <AvatarFallback>
                    {getInitials(chatName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{chatName}</h3>
                    <div className="flex items-center gap-2">
                      {chat.last_message_at && (() => {
                        const dateObj = new Date(chat.last_message_at);
                        // Only render if date is valid
                        if (!isNaN(dateObj.getTime())) {
                          return (
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(dateObj, {
                                addSuffix: true,
                              })}
                            </span>
                          );
                        }
                        return null;
                      })()}
                      <UnreadBadge count={unreadCounts[chat.id] || 0} />
                    </div>
                  </div>
                  {/* You could add last message preview here */}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
