import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/lib/services/chatService";
import { format } from "date-fns";
import { Loader2, FileText } from "lucide-react";

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
      const date = new Date(message.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>No messages yet</p>
        <p className="text-sm">Start the conversation!</p>
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
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  {new Date().toLocaleDateString() === date
                    ? "Today"
                    : new Date(date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                </span>
              </div>
            </div>

            {dateMessages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              const time = format(new Date(message.created_at), "h:mm a");
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2 max-w-[80%]">                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={message.sender?.profile_picture_url || undefined} 
                          alt={message.sender?.name || "User"} 
                        />
                        <AvatarFallback>
                          {getInitials(message.sender?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div>
                      {!isCurrentUser && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {message.sender?.name}
                        </p>
                      )}
                      
                      <div
                        className={`rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.file_url ? (
                          <a
                            href={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            <span>{message.content}</span>
                          </a>
                        ) : (
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        )}
                        
                        <p className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {time}
                          {message.is_edited && <span className="ml-1">(edited)</span>}
                        </p>
                      </div>
                    </div>                    {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={message.sender?.profile_picture_url || undefined} 
                          alt={message.sender?.name || "User"} 
                        />
                        <AvatarFallback>
                          {getInitials(message.sender?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                    )}
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
