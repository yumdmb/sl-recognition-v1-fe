"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, PlusCircle, Edit, Trash2, Cuboid } from 'lucide-react';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GestureContribution, GestureCategory } from '@/types/gestureContributions';
import { GestureContributionService } from '@/lib/supabase/gestureContributions';
import { AdminGestureForm } from '@/components/gesture-recognition/AdminGestureForm';
import Avatar3DPlayer from '@/components/avatar/Avatar3DPlayer';
import { Avatar3DRecording } from '@/types/hand';
import { signAvatarService } from '@/lib/services/signAvatarService';

// Extended type for gesture with joined avatar data
interface GestureWithAvatar extends GestureContribution {
  sign_avatars?: {
    id: string;
    recording_data: Avatar3DRecording;
    frame_count: number;
    duration_ms: number;
  } | null;
}

// Grouped gesture type - combines multiple versions of the same word
interface GroupedGesture {
  key: string; // title-language
  title: string;
  language: string;
  versions: GestureWithAvatar[];
  hasAvatar: boolean;
  hasMedia: boolean; // image or video
}

// Helper function to group gestures by title+language
function groupGestures(gestures: GestureWithAvatar[]): GroupedGesture[] {
  const grouped = new Map<string, GestureWithAvatar[]>();
  
  for (const gesture of gestures) {
    const key = `${gesture.title.toLowerCase()}-${gesture.language}`;
    const existing = grouped.get(key) || [];
    existing.push(gesture);
    grouped.set(key, existing);
  }
  
  return Array.from(grouped.entries()).map(([key, versions]) => ({
    key,
    title: versions[0].title,
    language: versions[0].language,
    versions,
    hasAvatar: versions.some(v => v.media_type === 'avatar'),
    hasMedia: versions.some(v => v.media_type === 'image' || v.media_type === 'video'),
  }));
}

const GestureRecognitionSearch: React.FC = () => {
  const supabase = createClient();
  const auth = useAuth();
  const user = auth?.currentUser;
  const isAdmin = user?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GestureWithAvatar[]>([]);
  const [language, setLanguage] = useState<"ASL" | "MSL">("ASL");
  const [activeTab, setActiveTab] = useState("text");
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GestureCategory | null>(null);
  const [categoryGestures, setCategoryGestures] = useState<GestureWithAvatar[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGesture, setEditingGesture] = useState<GestureContribution | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingGesture, setDeletingGesture] = useState<GestureContribution | null>(null);
  const [deletingAvatarId, setDeletingAvatarId] = useState<string | null>(null);
  // Track which version (media or avatar) is selected for each grouped card
  const [selectedVersions, setSelectedVersions] = useState<Record<string, 'media' | 'avatar'>>({});


  // Fetch categories with counts from gesture_contributions
  const fetchCategories = useCallback(async () => {
    const { data: categoriesData, error } = await supabase
      .from('gesture_categories')
      .select('id, name, icon');

    if (error) {
      toast.error("Failed to load categories", { 
        description: error.message,
        style: { color: 'black' }
      });
      return;
    }

    // Fetch gesture counts per category filtered by language (from approved contributions)
    const categoriesWithCounts = await Promise.all(
      (categoriesData || []).map(async (category) => {
        const { count } = await supabase
          .from('gesture_contributions')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('language', language)
          .eq('status', 'approved');
        
        return {
          ...category,
          count: count || 0
        };
      })
    );
    setCategories(categoriesWithCounts);
  }, [supabase, language]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, language]);

  // Search approved gestures by title (including avatars)
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      toast.error("Search term required", { 
        description: "Please enter a word to search for",
        style: { color: 'black' }
      });
      return;
    }
    setIsLoading(true);
    setSearchResults([]);
    try {
      const { data, error } = await supabase
        .from('gesture_contributions')
        .select(`
          *,
          category:gesture_categories!category_id(id, name, icon),
          sign_avatars!avatar_id(id, recording_data, frame_count, duration_ms)
        `)
        .ilike('title', `%${searchTerm}%`)
        .eq('language', language)
        .eq('status', 'approved');

      if (error) throw error;

      setSearchResults((data || []) as GestureWithAvatar[]);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} gesture${data.length > 1 ? 's' : ''} for "${searchTerm}"`, {
          style: { color: 'black' }
        });
      } else {
        toast.info(`No record for "${searchTerm}"`, {
          style: { color: 'black' }
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error("Search failed", { 
        description: errorMessage,
        style: { color: 'black' }
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, searchTerm, language]);

  // Load gestures by category (including avatars)
  const handleCategorySelect = useCallback(async (category: GestureCategory) => {
    setSelectedCategory(category);
    setIsLoading(true);
    setCategoryGestures([]);
    try {
      const { data, error } = await supabase
        .from('gesture_contributions')
        .select(`
          *,
          category:gesture_categories!category_id(id, name, icon),
          sign_avatars!avatar_id(id, recording_data, frame_count, duration_ms)
        `)
        .eq('category_id', category.id)
        .eq('language', language)
        .eq('status', 'approved');

      if (error) throw error;

      setCategoryGestures((data || []) as GestureWithAvatar[]);
      setActiveTab('category');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load gestures for ${category.name}`, { 
        description: errorMessage,
        style: { color: 'black' }
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, language]);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingGesture(null);
    fetchCategories();
    if (activeTab === 'text' && searchTerm) {
      handleSearch();
    } else if (activeTab === 'category' && selectedCategory) {
      handleCategorySelect(selectedCategory);
    }
  };

  // Silent background refresh (including avatars)
  const silentRefresh = useCallback(async () => {
    // Refresh categories
    const { data: categoriesData } = await supabase
      .from('gesture_categories')
      .select('id, name, icon');

    if (categoriesData) {
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          const { count } = await supabase
            .from('gesture_contributions')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('language', language)
            .eq('status', 'approved');
          
          return { ...category, count: count || 0 };
        })
      );
      setCategories(categoriesWithCounts);
    }

    // Refresh current view
    if (activeTab === 'text' && searchTerm.trim()) {
      const { data } = await supabase
        .from('gesture_contributions')
        .select(`
          *,
          category:gesture_categories!category_id(id, name, icon),
          sign_avatars!avatar_id(id, recording_data, frame_count, duration_ms)
        `)
        .ilike('title', `%${searchTerm}%`)
        .eq('language', language)
        .eq('status', 'approved');
      
      if (data) setSearchResults(data as GestureWithAvatar[]);
    } else if (activeTab === 'category' && selectedCategory) {
      const { data } = await supabase
        .from('gesture_contributions')
        .select(`
          *,
          category:gesture_categories!category_id(id, name, icon),
          sign_avatars!avatar_id(id, recording_data, frame_count, duration_ms)
        `)
        .eq('category_id', selectedCategory.id)
        .eq('language', language)
        .eq('status', 'approved');
      
      if (data) setCategoryGestures(data as GestureWithAvatar[]);
    }
  }, [supabase, activeTab, searchTerm, selectedCategory, language]);

  useEffect(() => {
    const interval = setInterval(silentRefresh, 5000);
    return () => clearInterval(interval);
  }, [silentRefresh]);

  const openEditForm = (gesture: GestureContribution) => {
    setEditingGesture(gesture);
    setIsFormOpen(true);
  };

  const openDeleteAlert = (gesture: GestureContribution) => {
    setDeletingGesture(gesture);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteGesture = async () => {
    if (!deletingGesture) return;

    try {
      const { error } = await GestureContributionService.deleteContribution(deletingGesture.id);
      if (error) throw error;

      toast.success("Gesture deleted successfully!", { style: { color: 'black' } });
      handleFormSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error("Failed to delete gesture", { 
        description: errorMessage,
        style: { color: 'black' }
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setDeletingGesture(null);
    }
  };

  // Handle delete for 3D avatars
  const handleDeleteAvatar = async (avatarId: string) => {
    try {
      await signAvatarService.delete(avatarId);
      toast.success("3D Avatar deleted successfully!", { style: { color: 'black' } });
      handleFormSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error("Failed to delete avatar", { 
        description: errorMessage,
        style: { color: 'black' }
      });
    } finally {
      setDeletingAvatarId(null);
    }
  };


  // Get the selected version type for a grouped gesture
  const getSelectedVersion = (group: GroupedGesture): 'media' | 'avatar' => {
    const selected = selectedVersions[group.key];
    if (selected) return selected;
    // Default: prefer media if available, otherwise avatar
    return group.hasMedia ? 'media' : 'avatar';
  };

  // Toggle version for a grouped gesture
  const toggleVersion = (groupKey: string, version: 'media' | 'avatar') => {
    setSelectedVersions(prev => ({ ...prev, [groupKey]: version }));
  };

  // Render a grouped gesture card with version toggle
  const renderGroupedGestureCard = (group: GroupedGesture) => {
    const selectedType = getSelectedVersion(group);
    const hasMultipleVersions = group.hasAvatar && group.hasMedia;
    
    // Find the gesture to display based on selected type
    const displayGesture = selectedType === 'avatar'
      ? group.versions.find(v => v.media_type === 'avatar')
      : group.versions.find(v => v.media_type === 'image' || v.media_type === 'video');
    
    // Fallback to first version if selected type not found
    const gesture = displayGesture || group.versions[0];
    const isAvatar = gesture.media_type === 'avatar';
    const avatarData = gesture.sign_avatars?.recording_data;
    
    // Collect all unique categories from all versions
    const allCategories = group.versions
      .filter(v => v.category)
      .map(v => v.category!)
      .filter((cat, idx, arr) => arr.findIndex(c => c.id === cat.id) === idx);
    
    return (
      <Card key={group.key} className="overflow-hidden">
        <CardContent className="p-0 relative h-48">
          {isAvatar && avatarData ? (
            <div className="w-full h-full bg-muted">
              <Avatar3DPlayer recording={avatarData} />
            </div>
          ) : gesture.media_type === 'image' && gesture.media_url ? (
            <Image 
              src={gesture.media_url} 
              alt={gesture.title} 
              fill
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : gesture.media_url ? (
            <video src={gesture.media_url} controls className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              No preview available
            </div>
          )}
        </CardContent>
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>{group.title}</span>
            {isAdmin && !isAvatar && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditForm(gesture)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openDeleteAlert(gesture)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            {isAdmin && isAvatar && gesture.sign_avatars && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setDeletingAvatarId(gesture.sign_avatars!.id);
                    setIsDeleteAlertOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardTitle>
          <CardDescription className="line-clamp-2">{gesture.description || 'No description available.'}</CardDescription>
          
          {/* Version Toggle - only show if multiple versions exist */}
          {hasMultipleVersions && (
            <div className="flex gap-1 mt-3">
              <Button
                variant={selectedType === 'media' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => toggleVersion(group.key, 'media')}
              >
                📷 Image/Video
              </Button>
              <Button
                variant={selectedType === 'avatar' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => toggleVersion(group.key, 'avatar')}
              >
                <Cuboid className="h-3 w-3 mr-1" />
                3D Avatar
              </Button>
            </div>
          )}
          
          {/* Single version badge (no toggle needed) */}
          {!hasMultipleVersions && isAvatar && (
            <Badge variant="outline" className="w-fit mt-2 text-xs">
              <Cuboid className="h-3 w-3 mr-1" />
              3D Avatar
            </Badge>
          )}
          
          {/* Categories */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {allCategories.map(cat => (
                <Badge key={cat.id} variant="secondary" className="text-xs">
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sign Language Dictionary</h1>
        {isAdmin && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGesture(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Gesture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingGesture ? 'Edit' : 'Add'} Gesture</DialogTitle>
                <DialogDescription>
                  {editingGesture ? 'Update the details of the gesture.' : 'Fill out the form to add a new gesture to the dictionary.'}
                </DialogDescription>
              </DialogHeader>
              <AdminGestureForm
                gesture={editingGesture}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text" className="py-3">Search by Text</TabsTrigger>
          <TabsTrigger value="category" className="py-3" onClick={() => setSelectedCategory(null)}>Browse Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Search by Text</CardTitle>
              <CardDescription>Enter a word or phrase to find corresponding sign language gestures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="searchTerm">Search Term</Label>
                  <Input
                    id="searchTerm"
                    placeholder="e.g., Hello, Thank you, Please"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text-language">Sign Language</Label>
                  <Select value={language} onValueChange={(val: "ASL" | "MSL") => setLanguage(val)}>
                    <SelectTrigger id="text-language"><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASL">American (ASL)</SelectItem>
                      <SelectItem value="MSL">Malaysian (MSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                  {isLoading ? 'Searching...' : <><SearchIcon className="h-5 w-5 mr-2" />Search</>}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupGestures(searchResults).map(renderGroupedGestureCard)}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="category">
          {!selectedCategory ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Browse by Category</CardTitle>
                <CardDescription>Explore sign language gestures organized by categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <Label htmlFor="category-language">Select Sign Language</Label>
                  <Select value={language} onValueChange={(val: "ASL" | "MSL") => setLanguage(val)}>
                    <SelectTrigger id="category-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                      <SelectItem value="MSL">Malaysian Sign Language (MSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {categories.map(category => (
                    <Card key={category.id} className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer" onClick={() => handleCategorySelect(category)}>
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl mb-2">{category.icon || "👋"}</div>
                        <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-400">{category.count} gestures</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              <Button variant="link" onClick={() => setSelectedCategory(null)} className="mb-4">
                &larr; Back to Categories
              </Button>
              <h2 className="text-xl md:text-2xl font-bold mb-4">{selectedCategory.name} Gestures</h2>
              {isLoading ? (
                <p>Loading gestures...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryGestures.length > 0 ? (
                    groupGestures(categoryGestures).map(renderGroupedGestureCard)
                  ) : (
                    <p>No gestures found in this category for the selected language.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the gesture
              &quot;{deletingGesture?.title}&quot; and its media file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deletingAvatarId) {
                void handleDeleteAvatar(deletingAvatarId);
              } else {
                void handleDeleteGesture();
              }
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestureRecognitionSearch;
