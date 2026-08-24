"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Eye, Plus, Search, Tag, PersonStanding, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Avatar3DPlayer from "@/components/avatar/Avatar3DPlayer";
import AvatarViewDialog from "@/components/avatar/AvatarViewDialog";
import { signAvatarService, SignAvatar } from "@/lib/services/signAvatarService";

const MyAvatarsPage = () => {
  const [avatars, setAvatars] = useState<SignAvatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<SignAvatar | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<"all" | "ASL" | "MSL">("all");
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  // Filter avatars based on search and language
  const filteredAvatars = useMemo(() => {
    return avatars.filter(avatar => {
      const matchesSearch = avatar.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = languageFilter === "all" || avatar.language === languageFilter;
      return matchesSearch && matchesLanguage;
    });
  }, [avatars, searchQuery, languageFilter]);

  const fetchAvatars = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      const data = await signAvatarService.getByUserId(currentUser.id);
      setAvatars(data);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      toast.error("Failed to load avatars", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to view your avatars"
      });
      router.push("/auth/login");
      return;
    }

    void fetchAvatars();
  }, [isAuthenticated, router, fetchAvatars]);

  const deleteAvatar = async (id: string) => {
    try {
      await signAvatarService.delete(id);
      setAvatars(avatars.filter(avatar => avatar.id !== id));
      
      toast.success("Avatar deleted", {
        description: "The avatar has been removed from your collection"
      });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error("Delete failed", {
        description: "Unable to delete the avatar. Please try again."
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
              <PersonStanding className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Avatar Studio</p>
              <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight">My Avatars</h1>
              <p className="mt-1 text-muted-foreground">
                Your library of saved sign language avatars
              </p>
            </div>
          </div>
          <Button onClick={() => router.push('/avatar/generate')} className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Create New Avatar
          </Button>
        </div>

        {/* Search and Filter - botanical */}
        <div className="flex flex-wrap gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <Select value={languageFilter} onValueChange={(v) => setLanguageFilter(v as "all" | "ASL" | "MSL")}>
            <SelectTrigger className="w-32 rounded-xl">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ASL">ASL</SelectItem>
              <SelectItem value="MSL">MSL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-5 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredAvatars.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAvatars.map((avatar, i) => (
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="card-lift h-full gap-0 pb-0 rounded-2xl shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-display text-base">
                      <span className="truncate">{avatar.name}</span>
                      <Badge
                        variant={avatar.status === "approved" ? "default" : "secondary"}
                        className={
                          avatar.status === "approved"
                            ? "rounded-full bg-green-500 hover:bg-green-600 text-white"
                            : avatar.status === "rejected"
                            ? "rounded-full bg-red-500 hover:bg-red-600 text-white"
                            : "rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                        }
                      >
                        {avatar.status === "approved" ? "Approved" : avatar.status === "rejected" ? "Rejected" : "Pending"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {avatar.language} • {new Date(avatar.created_at).toLocaleDateString()}
                    </CardDescription>
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mt-2">
                      {avatar.category ? (
                        <Badge variant="secondary" className="rounded-full bg-primary-soft text-primary">
                          {avatar.category.icon && <span className="mr-1">{avatar.category.icon}</span>}
                          {avatar.category.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="rounded-full text-muted-foreground">
                          <Tag className="h-3 w-3 mr-1" />
                          No category
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 p-4 pb-5">
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
                      {avatar.recording_data && avatar.recording_data.frames.length > 0 ? (
                        <Avatar3DPlayer recording={avatar.recording_data} />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No Preview
                        </div>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void deleteAvatar(avatar.id)}
                        className="gap-2 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full"
                        onClick={() => {
                          setSelectedAvatar(avatar);
                          setViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : avatars.length > 0 ? (
          <Card className="rounded-2xl shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">No avatars match your search</p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => { setSearchQuery(""); setLanguageFilter("all"); }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-soft">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
              <PersonStanding className="size-6" />
            </span>
            <h3 className="font-display mt-5 text-lg font-bold">No avatars saved yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Capture a gesture with your camera and it will appear here as a saved avatar.
            </p>
            <Button className="mt-6 rounded-full" onClick={() => router.push('/avatar/generate')}>
              <Plus className="h-4 w-4" />
              Create an Avatar
            </Button>
          </div>
        )}
      </div>

      {/* View Dialog */}
      <AvatarViewDialog
        avatar={selectedAvatar}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};

export default MyAvatarsPage;
