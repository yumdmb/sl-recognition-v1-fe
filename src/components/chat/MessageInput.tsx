import { useState, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Loader2, AlertCircle, RefreshCw, X, FileText, Image as ImageIcon, Film, File } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onSendFile: (file: File, message?: string) => Promise<void>;
  disabled?: boolean;
}

interface FailedMessage {
  content: string;
  type: 'text' | 'file';
  file?: File;
  message?: string;
  error: string;
}

interface AttachedFile {
  file: File;
  preview?: string;
}

export default function MessageInput({
  onSendMessage,
  onSendFile,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [failedMessage, setFailedMessage] = useState<FailedMessage | null>(null);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
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

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Film className="h-5 w-5" />;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const hasMessage = message.trim().length > 0;
    const hasFile = attachedFile !== null;
    
    if ((!hasMessage && !hasFile) || disabled || isSending) return;
    
    const messageContent = message.trim();
    setIsSending(true);
    setFailedMessage(null);
    
    try {
      if (hasFile) {
        // Send file with optional message
        await onSendFile(attachedFile.file, messageContent || undefined);
        // Clear attached file preview
        if (attachedFile.preview) {
          URL.revokeObjectURL(attachedFile.preview);
        }
        setAttachedFile(null);
        setMessage("");
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else if (hasMessage) {
        // Send text message only
        await onSendMessage(messageContent);
        setMessage("");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to send:", error);
      
      // Store failed message for retry
      setFailedMessage({
        content: hasFile ? attachedFile.file.name : messageContent,
        type: hasFile ? 'file' : 'text',
        file: hasFile ? attachedFile.file : undefined,
        message: hasFile ? messageContent : undefined,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    // Clear any previous preview URL
    if (attachedFile?.preview) {
      URL.revokeObjectURL(attachedFile.preview);
    }

    // Create preview URL for images
    let preview: string | undefined;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    setAttachedFile({ file, preview });
    setFailedMessage(null);
  };

  const handleRemoveFile = () => {
    if (attachedFile?.preview) {
      URL.revokeObjectURL(attachedFile.preview);
    }
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        await onSendFile(failedMessage.file, failedMessage.message);
        setFailedMessage(null);
        // Clear attached file if any
        if (attachedFile?.preview) {
          URL.revokeObjectURL(attachedFile.preview);
        }
        setAttachedFile(null);
        setMessage("");
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

      {/* Attached file preview */}
      {attachedFile && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg animate-in slide-in-from-bottom-2 duration-200">
          {/* File preview or icon */}
          {attachedFile.preview ? (
            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-border">
              <img 
                src={attachedFile.preview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
              {getFileIcon(attachedFile.file)}
            </div>
          )}
          
          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachedFile.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(attachedFile.file.size)}
            </p>
          </div>
          
          {/* Remove button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleRemoveFile}
            disabled={isSending}
            className="h-8 w-8 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
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
          variant={attachedFile ? "secondary" : "ghost"}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending}
          className={attachedFile ? "text-primary" : ""}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={attachedFile ? "Add a message (optional)..." : "Type a message..."}
          className="flex-1"
          disabled={disabled || isSending}
        />
        
        <Button
          type="submit"
          size="icon"
          disabled={(!message.trim() && !attachedFile) || disabled || isSending}
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
