import { useState, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onSendFile: (file: File) => Promise<void>;
  disabled?: boolean;
}

interface FailedMessage {
  content: string;
  type: 'text' | 'file';
  file?: File;
  error: string;
}

export default function MessageInput({
  onSendMessage,
  onSendFile,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [failedMessage, setFailedMessage] = useState<FailedMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return "Network error. Please check your connection and try again.";
      }
      if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        return "You don't have permission to send messages in this chat.";
      }
      if (error.message.includes('storage')) {
        return "Failed to upload file. The file might be too large.";
      }
      return error.message || "Failed to send message. Please try again.";
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isSending) return;
    
    const messageContent = message.trim();
    setIsSending(true);
    setFailedMessage(null);
    
    try {
      await onSendMessage(messageContent);
      setMessage("");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to send message:", error);
      
      // Store failed message for retry
      setFailedMessage({
        content: messageContent,
        type: 'text',
        error: errorMessage,
      });
      
      // Show error toast with retry option
      toast.error(errorMessage, {
        action: {
          label: "Retry",
          onClick: () => handleRetry(),
        },
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    setIsSending(true);
    setFailedMessage(null);
    
    try {
      await onSendFile(file);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to upload file:", error);
      
      // Store failed file for retry
      setFailedMessage({
        content: file.name,
        type: 'file',
        file: file,
        error: errorMessage,
      });
      
      // Show error toast with retry option
      toast.error(errorMessage, {
        action: {
          label: "Retry",
          onClick: () => handleRetry(),
        },
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleRetry = async () => {
    if (!failedMessage || isSending) return;
    
    setIsSending(true);
    
    try {
      if (failedMessage.type === 'text') {
        await onSendMessage(failedMessage.content);
        setMessage("");
        setFailedMessage(null);
        toast.success("Message sent successfully");
      } else if (failedMessage.type === 'file' && failedMessage.file) {
        await onSendFile(failedMessage.file);
        setFailedMessage(null);
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Retry failed:", error);
      
      // Update error message
      setFailedMessage({
        ...failedMessage,
        error: errorMessage,
      });
      
      // Show error toast with retry option again
      toast.error(errorMessage, {
        action: {
          label: "Retry",
          onClick: () => handleRetry(),
        },
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Failed message indicator */}
      {failedMessage && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive">Failed to send</p>
            <p className="text-xs text-muted-foreground truncate">
              {failedMessage.type === 'text' ? failedMessage.content : `File: ${failedMessage.content}`}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRetry}
            disabled={isSending}
            className="flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Message input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isSending}
        />
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          disabled={disabled || isSending}
        />
        
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled || isSending}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
