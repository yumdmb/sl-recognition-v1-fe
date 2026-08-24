import { useState, useRef, useEffect } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserX } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SearchUserProfile {
  id: string;
  name: string;
  email: string;
}

interface NewChatDialogProps {
  onCreateChat: (userId: string) => Promise<void> | void;
  currentUserId: string;
}

export default function NewChatDialog({ onCreateChat, currentUserId }: NewChatDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id, name, email")
          .ilike("name", `%${searchTerm}%`)
          .neq("id", currentUserId)
          .limit(10);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error searching users for new chat:", error);
        toast.error("Failed to search users.");
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, currentUserId, supabase]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="font-display">Start a new chat</DialogTitle>
        <DialogDescription>
          Search for someone to begin a conversation with.
        </DialogDescription>
      </DialogHeader>

      <div className="relative mt-2">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-xs transition-colors focus-within:border-primary/50">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="scrollbar-thin mt-4 max-h-[300px] space-y-1 overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center p-5">
              <Loader2 className="size-6 animate-spin text-muted-foreground/60" />
            </div>
          ) : searchResults.length === 0 && searchTerm.trim() !== "" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
                <UserX className="size-5" />
              </span>
              <p className="mt-3 text-sm text-muted-foreground">No users found</p>
            </div>
          ) : (
            searchResults.map((user) => (
              <button
                key={user.id}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-accent"
                onClick={() => onCreateChat(user.id)}
              >
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className="font-display bg-primary-soft text-xs font-bold text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </DialogContent>
  );
}
