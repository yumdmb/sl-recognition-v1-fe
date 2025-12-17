"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Plus, CheckCircle2, XCircle, User, Search } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Avatar3DPlayer from "@/components/avatar/Avatar3DPlayer";
import AvatarViewDialog from "@/components/avatar/AvatarViewDialog";
import { signAvatarService, SignAvatar } from "@/services/signAvatarService";

const AdminAvatarDatabasePage = () => {
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
    try {
      const data = await signAvatarService.getAll();
      setAvatars(data);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      toast.error("Failed to load avatars", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to access this page"
      });
      router.push("/auth/login");
      return;
    }
    
    if (currentUser?.role !== "admin") {
      toast.error("Access Denied", {
        description: "This page is only accessible to administrators"
      });
      router.push("/");
      return;
    }
    
    void fetchAvatars();
  }, [isAuthenticated, currentUser, router, fetchAvatars]);

  const deleteAvatar = async (id: string) => {
    try {
      await signAvatarService.delete(id);
      setAvatars(avatars.filter(avatar => avatar.id !== id));
      
      toast.success("Avatar deleted", {
        description: "The avatar has been removed from the database"
      });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error("Delete failed", {
        description: "Unable to delete the avatar. Please try again."
      });
    }
  };

  const toggleVerification = async (id: string, currentStatus: "verified" | "unverified") => {
    if (!currentUser?.id) return;
    
    try {
      const newStatus = currentStatus === "verified" ? "unverified" : "verified";
      await signAvatarService.updateStatus(id, newStatus, currentUser.id);
      
      setAvatars(avatars.map(avatar => 
        avatar.id === id ? { ...avatar, status: newStatus } : avatar
      ));
      
      toast.success("Status updated", {
        description: `Avatar is now ${newStatus}`
      });
    } catch (error) {
      console.error("Error updating avatar status:", error);
      toast.error("Update failed", {
        description: "Unable to update avatar status. Please try again."
      });
    }
  };

  if (!isAuthenticated || currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Avatar Database</h1>
              <p className="text-muted-foreground">View and manage all user-submitted avatars</p>
            </div>
            <Button 
              onClick={() => router.push('/avatar/generate')}
              className="gap-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Avatar
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={languageFilter} onValueChange={(v) => setLanguageFilter(v as "all" | "ASL" | "MSL")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ASL">ASL</SelectItem>
                <SelectItem value="MSL">MSL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAvatars.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAvatars.map(avatar => (
              <Card key={avatar.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{avatar.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void toggleVerification(avatar.id, avatar.status)}
                      className={avatar.status === "verified" ? "text-green-500" : "text-yellow-500"}
                    >
                      {avatar.status === "verified" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {avatar.user_name || "Unknown"} • {avatar.language} • {new Date(avatar.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {avatar.recording_data && avatar.recording_data.frames.length > 0 ? (
                      <Avatar3DPlayer recording={avatar.recording_data} />
                    ) : (
                      <div className="text-muted-foreground text-sm">No Preview</div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => void deleteAvatar(avatar.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          ) : avatars.length > 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No avatars match your search</p>
                <Button 
                  variant="outline"
                  onClick={() => { setSearchQuery(""); setLanguageFilter("all"); }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No avatars in the database</p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => router.push('/avatar/generate')}
                >
                  Create an Avatar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
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

export default AdminAvatarDatabasePage; 