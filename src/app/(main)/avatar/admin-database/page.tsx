"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Eye, CheckCircle2, XCircle, User, Search, Tag, Database, Loader2, Plus } from 'lucide-react';
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") as "all" | "pending" | "approved" | "rejected" | null;
  
  const [avatars, setAvatars] = useState<SignAvatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<SignAvatar | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<"all" | "ASL" | "MSL">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">(initialStatus || "all");
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<SignAvatar | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
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
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm">Checking your access...</p>
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
              <Database className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Admin</p>
              <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight">Avatar Database</h1>
              <p className="mt-1 text-muted-foreground">
                View and manage all user-submitted avatars
              </p>
            </div>
          </div>
          <Button onClick={() => router.push('/avatar/generate')} className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Create New Avatar
          </Button>
        </div>

        {/* Search and Filter - botanical styling */}
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
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "pending" | "approved" | "rejected")}>
            <SelectTrigger className="w-32 rounded-xl">
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
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {avatar.user_name || "Unknown"} • {avatar.language} • {new Date(avatar.created_at).toLocaleDateString()}
                    </CardDescription>
                    {/* Category Badge - botanical pill */}
                    <div className="flex items-center gap-2 mt-2">
                      {avatar.category ? (
                        <Badge variant="secondary" className="cursor-pointer rounded-full bg-primary-soft text-primary" onClick={() => openEditCategoryDialog(avatar)}>
                          {avatar.category.icon && <span className="mr-1">{avatar.category.icon}</span>}
                          {avatar.category.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="cursor-pointer rounded-full text-muted-foreground" onClick={() => openEditCategoryDialog(avatar)}>
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
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No Preview</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center pt-2">
                      {avatar.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[80px] gap-1 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => void approveAvatar(avatar.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[80px] gap-1 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => void rejectAvatar(avatar.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 rounded-full"
                        onClick={() => void deleteAvatar(avatar.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 rounded-full"
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
                onClick={() => { setSearchQuery(""); setLanguageFilter("all"); setStatusFilter("all"); }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-soft">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Database className="size-6" />
            </span>
            <h3 className="font-display mt-5 text-lg font-bold">No avatars in the database</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              User-submitted avatars will appear here for review once they are created.
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

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Category</DialogTitle>
            <DialogDescription>
              Change the category for &quot;{editingAvatar?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategoryId || "none"} onValueChange={(v) => setSelectedCategoryId(v === "none" ? "" : v)}>
                <SelectTrigger className="rounded-xl">
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
              <Button variant="outline" className="rounded-full" onClick={() => setEditCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="rounded-full" onClick={() => void handleUpdateCategory()}>
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
