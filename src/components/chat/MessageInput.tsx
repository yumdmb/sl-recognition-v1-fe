import { useState, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onSendFile: (file: File) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  onSendFile,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    setIsSending(true);
    try {
      await onSendFile(file);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
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
  );
}
