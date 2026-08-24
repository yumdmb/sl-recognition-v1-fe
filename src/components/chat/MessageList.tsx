import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/lib/services/chatService";
import { format } from "date-fns";
import { Loader2, FileText, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentUserId: string;
}

export default function MessageList({
  messages,
  isLoading,
  currentUserId,
}: MessageListProps) {
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Group messages by date for date separators
  const messagesByDate = useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((message) => {
      // Validate date before creating Date object
      if (!message.created_at) return;
      
      const dateObj = new Date(message.created_at);
      // Check if date is valid
      if (isNaN(dateObj.getTime())) return;
      
      // Use ISO date string (YYYY-MM-DD) as key for consistent grouping
      const dateKey = dateObj.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <MessageCircle className="size-5.5" />
        </span>
        <p className="mt-4 font-semibold">No messages yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Say hello — this is the start of your conversation.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-4">
        {Object.entries(messagesByDate).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {(() => {
                    const today = new Date().toISOString().split('T')[0];
                    if (date === today) {
                      return "Today";
                    }
                    const dateObj = new Date(date + 'T00:00:00');
                    if (isNaN(dateObj.getTime())) {
                      return date;
                    }
                    return dateObj.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  })()}
                </span>
              </div>
            </div>

            {dateMessages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              
              // Safely format time with validation
              let time = "Unknown time";
              if (message.created_at) {
                const dateObj = new Date(message.created_at);
                if (!isNaN(dateObj.getTime())) {
                  time = format(dateObj, "h:mm a");
                }
              }
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={cn("flex max-w-[75%] gap-2.5", isCurrentUser && "flex-row-reverse")}>
                    {!isCurrentUser && (
                      <Avatar className="size-8 shrink-0 self-end">
                        <AvatarFallback className="bg-primary-soft text-[10px] font-bold text-primary">
                          {getInitials(message.sender?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="min-w-0">
                      {!isCurrentUser && (
                        <p className="mb-1 pl-1 text-[11px] font-medium text-muted-foreground">
                          {message.sender?.name}
                        </p>
                      )}
                      
                      <div
                        className={cn(
                          'rounded-2xl px-3.5 py-2.5 text-sm shadow-xs',
                          isCurrentUser
                            ? 'rounded-br-md bg-primary text-primary-foreground'
                            : 'rounded-bl-md border border-border bg-card'
                        )}
                      >
                        {message.file_url ? (
                          (() => {
                            // Check if it's an image by URL extension or content
                            const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(message.file_url) ||
                              message.file_url.includes('/image/') ||
                              message.file_url.includes('image%2F');
                            
                            if (isImage) {
                              return (
                                <div className="space-y-2">
                                  <a
                                    href={message.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={message.file_url}
                                      alt={message.content || "Image"}
                                      className="max-w-[300px] max-h-[300px] rounded-md object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                      loading="lazy"
                                    />
                                  </a>
                                  {message.content && message.content !== message.file_url.split('/').pop() && (
                                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                  )}
                                </div>
                              );
                            }
                            
                            // Non-image file
                            return (
                              <a
                                href={message.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                              >
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <span className="break-all">{message.content}</span>
                              </a>
                            );
                          })()
                        ) : (
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        )}
                        
                        <p
                          className={cn(
                            'mt-1 text-right text-[10px]',
                            isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}
                        >
                          {time}
                          {message.is_edited && <span className="ml-1">(edited)</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
