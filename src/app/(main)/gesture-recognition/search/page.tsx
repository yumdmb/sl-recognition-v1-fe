"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, PlusCircle, Edit, Trash2 } from 'lucide-react';
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
import { GestureForm } from '@/components/gesture-recognition/GestureForm';

// Define database-driven types
interface GestureCategory {
  id: number;
  name: string;
  icon: string | null;
  count?: number;
}

interface Gesture {
  id: number;
  name: string;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  language: 'ASL' | 'MSL';
  category_id: number | null;
}

const GestureRecognitionSearch: React.FC = () => {
  const supabase = createClient();
  const auth = useAuth();
  const user = auth?.currentUser;
  const isAdmin = user?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Gesture[]>([]);
  const [language, setLanguage] = useState<"ASL" | "MSL">("ASL");
  const [activeTab, setActiveTab] = useState("text");
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GestureCategory | null>(null);
  const [categoryGestures, setCategoryGestures] = useState<Gesture[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGesture, setEditingGesture] = useState<Gesture | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingGesture, setDeletingGesture] = useState<Gesture | null>(null);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('gesture_categories')
      .select('id, name, icon, gestures!inner(count)');

    if (error) {
      toast.error("Failed to load categories", { description: error.message });
    } else {
      // Fetch gesture counts per category filtered by language
      const categoriesWithCounts = await Promise.all(
        data.map(async (category) => {
          const { count } = await supabase
            .from('gestures')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('language', language);
          
          return {
            ...category,
            count: count || 0
          };
        })
      );
      setCategories(categoriesWithCounts);
    }
  }, [supabase, language]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, language]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      toast.error("Search term required", { description: "Please enter a word to search for" });
      return;
    }
    setIsLoading(true);
    setSearchResults([]);
    try {
      const { data, error } = await supabase
        .from('gestures')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .eq('language', language);

      if (error) throw error;

      setSearchResults(data || []);
      toast.success(`Found ${data?.length || 0} gestures for "${searchTerm}"`);
    } catch (error: unknown) {
      toast.error("Search failed", { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, searchTerm, language]);

  const handleCategorySelect = useCallback(async (category: GestureCategory) => {
    setSelectedCategory(category);
    setIsLoading(true);
    setCategoryGestures([]);
    try {
      const { data, error } = await supabase
        .from('gestures')
        .select('*')
        .eq('category_id', category.id)
        .eq('language', language);

      if (error) throw error;

      setCategoryGestures(data || []);
      setActiveTab('category'); // Switch tab to show results
    } catch (error: unknown) {
      toast.error(`Failed to load gestures for ${category.name}`, { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, language]);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingGesture(null);
    // Refresh data
    fetchCategories();
    if (activeTab === 'text' && searchTerm) {
      handleSearch();
    } else if (activeTab === 'category' && selectedCategory) {
      handleCategorySelect(selectedCategory);
    }
  };

  // Polling for automatic updates (refreshes every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh categories to update counts
      fetchCategories();
      
      // Refresh current view if applicable
      if (activeTab === 'text' && searchTerm) {
        handleSearch();
      } else if (activeTab === 'category' && selectedCategory) {
        handleCategorySelect(selectedCategory);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [activeTab, searchTerm, selectedCategory, fetchCategories, handleSearch, handleCategorySelect]);

  const openEditForm = (gesture: Gesture) => {
    setEditingGesture(gesture);
    setIsFormOpen(true);
  };

  const openDeleteAlert = (gesture: Gesture) => {
    setDeletingGesture(gesture);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteGesture = async () => {
    if (!deletingGesture) return;

    try {
      // Delete from gestures table
      const { error: dbError } = await supabase
        .from('gestures')
        .delete()
        .eq('id', deletingGesture.id);

      if (dbError) throw dbError;

      // Delete from storage
      const filePath = deletingGesture.media_url.split('/').pop();
      if (filePath) {
        await supabase.storage.from('gestures').remove([`public/${filePath}`]);
      }

      toast.success("Gesture deleted successfully!");
      handleFormSuccess(); // Re-use success logic to refresh data
    } catch (error: unknown) {
      toast.error("Failed to delete gesture", { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsDeleteAlertOpen(false);
      setDeletingGesture(null);
    }
  };

  const renderGestureCard = (gesture: Gesture) => (
    <Card key={gesture.id} className="overflow-hidden">
      <CardContent className="p-0">
        {gesture.media_type === 'image' ? (
          <img src={gesture.media_url} alt={gesture.name} className="w-full h-48 object-cover" />
        ) : (
          <video src={gesture.media_url} controls className="w-full h-48 object-cover" />
        )}
      </CardContent>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {gesture.name}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEditForm(gesture)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => openDeleteAlert(gesture)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>{gesture.description || 'No description available.'}</CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sign Language Gestures</h1>
        {isAdmin && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGesture(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Gesture
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingGesture ? 'Edit' : 'Add'} Gesture</DialogTitle>
                <DialogDescription>
                  {editingGesture ? 'Update the details of the gesture.' : 'Fill out the form to add a new gesture to the database.'}
                </DialogDescription>
              </DialogHeader>
              <GestureForm
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
                {searchResults.map(renderGestureCard)}
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
                    categoryGestures.map(renderGestureCard)
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
              &quot;{deletingGesture?.name}&quot; and its media file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGesture}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestureRecognitionSearch;