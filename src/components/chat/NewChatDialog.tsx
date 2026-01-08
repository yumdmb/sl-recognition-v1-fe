import { useState, useRef, useEffect } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
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
    }    setIsSearching(true);
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
        <DialogTitle>Start a new chat</DialogTitle>
        <DialogDescription>
          Search for users to start a conversation with.
        </DialogDescription>
      </DialogHeader>

      <div className="relative mt-4">
        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
          <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>

        <div className="mt-4 space-y-1 max-h-[300px] overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : searchResults.length === 0 && searchTerm.trim() !== "" ? (
            <p className="text-muted-foreground text-center py-4">No users found</p>
          ) : (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => onCreateChat(user.id)}
              >                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DialogContent>
  );
}
