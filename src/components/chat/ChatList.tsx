import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, MessagesSquare } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Chat } from "@/lib/services/chatService";
import { formatDistanceToNow } from "date-fns";
import NewChatDialog from "@/components/chat/NewChatDialog";
import UnreadBadge from "@/components/chat/UnreadBadge";
import { cn } from "@/lib/utils";

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
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-lg" />
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
          <Button className="w-full" variant="outline">
            <UserPlus />
            New chat
          </Button>
        </DialogTrigger>
        <NewChatDialog
          onCreateChat={async (userId: string) => {
            await onCreateChat(userId);
            setIsNewChatDialogOpen(false);
          }}
          currentUserId={currentUserId}
        />
      </Dialog>

      <div className="mt-3 space-y-1">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-4 py-10 text-center">
            <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
              <MessagesSquare className="size-5" />
            </span>
            <p className="mt-4 text-sm font-semibold">No conversations yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start a new chat to get going.
            </p>
          </div>
        ) : (
          chats.map((chat) => {
            const chatName = getChatName(chat);
            const isActive = selectedChat?.id === chat.id;

            return (
              <button
                key={chat.id}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors',
                  isActive ? 'bg-accent' : 'hover:bg-accent/60'
                )}
                onClick={() => onSelectChat(chat)}
              >
                <Avatar className="size-10 shrink-0">
                  <AvatarImage
                    src={chat.participants.find(p => p.user_id !== currentUserId)?.user?.profile_picture_url || undefined}
                    alt={chatName}
                  />
                  <AvatarFallback className={cn('font-display text-xs font-bold', isActive ? 'bg-primary text-primary-foreground' : 'bg-primary-soft text-primary')}>
                    {getInitials(chatName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className={cn('truncate text-sm', isActive ? 'font-semibold' : 'font-medium')}>
                      {chatName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {chat.last_message_at && (() => {
                        const dateObj = new Date(chat.last_message_at);
                        if (!isNaN(dateObj.getTime())) {
                          return (
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {formatDistanceToNow(dateObj, {
                                addSuffix: false,
                              })}
                            </span>
                          );
                        }
                        return null;
                      })()}
                      <UnreadBadge count={unreadCounts[chat.id] || 0} />
                    </div>
                  </div>
                </div>
                {isActive && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            );
          })
        )}
      </div>
    </>
  );
}
