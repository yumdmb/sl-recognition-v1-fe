"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, CheckCircle2, XCircle, User, Search, Tag } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Avatar3DPlayer from "@/components/avatar/Avatar3DPlayer";
import AvatarViewDialog from "@/components/avatar/AvatarViewDialog";
import { signAvatarService, SignAvatar } from "@/lib/services/signAvatarService";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface GestureCategory {
  id: number;
  name: string;
  icon: string | null;
}

const AdminAvatarDatabasePage = () => {
  const [avatars, setAvatars] = useState<SignAvatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<SignAvatar | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<"all" | "ASL" | "MSL">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<SignAvatar | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  // Filter avatars based on search, language, and status
  const filteredAvatars = useMemo(() => {
    return avatars.filter(avatar => {
      const matchesSearch = avatar.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = languageFilter === "all" || avatar.language === languageFilter;
      const matchesStatus = statusFilter === "all" || avatar.status === statusFilter;
      return matchesSearch && matchesLanguage && matchesStatus;
    });
  }, [avatars, searchQuery, languageFilter, statusFilter]);

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

  const fetchCategories = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('gesture_categories')
      .select('id, name, icon')
      .order('name');
    setCategories(data || []);
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
    void fetchCategories();
  }, [isAuthenticated, currentUser, router, fetchAvatars, fetchCategories]);

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

  const approveAvatar = async (id: string) => {
    if (!currentUser?.id) return;
    
    try {
      await signAvatarService.updateStatus(id, "approved", currentUser.id);
      
      setAvatars(avatars.map(avatar => 
        avatar.id === id ? { ...avatar, status: "approved" as const, rejection_reason: null } : avatar
      ));
      
      toast.success("Avatar Approved", {
        description: "Avatar has been approved and added to the Gesture Dictionary"
      });
    } catch (error) {
      console.error("Error approving avatar:", error);
      toast.error("Update failed", {
        description: "Unable to approve avatar. Please try again."
      });
    }
  };

  const rejectAvatar = async (id: string, reason?: string) => {
    if (!currentUser?.id) return;
    
    try {
      await signAvatarService.updateStatus(id, "rejected", currentUser.id, reason);
      
      setAvatars(avatars.map(avatar => 
        avatar.id === id ? { ...avatar, status: "rejected" as const, rejection_reason: reason || null } : avatar
      ));
      
      toast.success("Avatar Rejected", {
        description: "Avatar has been rejected"
      });
    } catch (error) {
      console.error("Error rejecting avatar:", error);
      toast.error("Update failed", {
        description: "Unable to reject avatar. Please try again."
      });
    }
  };

  const openEditCategoryDialog = (avatar: SignAvatar) => {
    setEditingAvatar(avatar);
    setSelectedCategoryId(avatar.category_id?.toString() || "");
    setEditCategoryDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingAvatar) return;

    try {
      const categoryId = selectedCategoryId ? parseInt(selectedCategoryId) : null;
      await signAvatarService.updateCategory(editingAvatar.id, categoryId);
      
      // Update local state
      const updatedCategory = categories.find(c => c.id === categoryId);
      setAvatars(avatars.map(avatar => 
        avatar.id === editingAvatar.id 
          ? { ...avatar, category_id: categoryId, category: updatedCategory || undefined } 
          : avatar
      ));
      
      toast.success("Category Updated", {
        description: "Avatar category has been updated"
      });
      setEditCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Update failed", {
        description: "Unable to update avatar category. Please try again."
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
          <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Avatar Database</h1>
            <p className="text-muted-foreground">View and manage all user-submitted avatars</p>
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
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "pending" | "approved" | "rejected")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
                    <Badge 
                      variant={avatar.status === "approved" ? "default" : "secondary"} 
                      className={
                        avatar.status === "approved" 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : avatar.status === "rejected"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }
                    >
                      {avatar.status === "approved" ? "Approved" : avatar.status === "rejected" ? "Rejected" : "Pending"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {avatar.user_name || "Unknown"} • {avatar.language} • {new Date(avatar.created_at).toLocaleDateString()}
                  </CardDescription>
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mt-2">
                    {avatar.category ? (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => openEditCategoryDialog(avatar)}>
                        {avatar.category.icon && <span className="mr-1">{avatar.category.icon}</span>}
                        {avatar.category.name}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="cursor-pointer text-muted-foreground" onClick={() => openEditCategoryDialog(avatar)}>
                        <Tag className="h-3 w-3 mr-1" />
                        No category
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {avatar.recording_data && avatar.recording_data.frames.length > 0 ? (
                      <Avatar3DPlayer recording={avatar.recording_data} />
                    ) : (
                      <div className="text-muted-foreground text-sm">No Preview</div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center pt-2">
                    {avatar.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 min-w-[80px] text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => void approveAvatar(avatar.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 min-w-[80px] text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => void rejectAvatar(avatar.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={avatar.status === "pending" ? "flex-1 min-w-[80px]" : "flex-1"}
                      onClick={() => void deleteAvatar(avatar.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={avatar.status === "pending" ? "flex-1 min-w-[80px]" : "flex-1"}
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

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Change the category for &quot;{editingAvatar?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategoryId || "none"} onValueChange={(v) => setSelectedCategoryId(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => void handleUpdateCategory()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAvatarDatabasePage; 