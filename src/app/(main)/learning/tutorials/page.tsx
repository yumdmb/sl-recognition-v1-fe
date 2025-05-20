'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Edit, Trash, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { Tutorial, getTutorials, saveTutorial, deleteTutorial } from '@/data/contentData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    // Get tutorials from localStorage via our data service
    setTutorials(getTutorials());
    setIsLoading(false);
  }, []);

  // Filter tutorials by both level and selected language
  const filteredTutorials = tutorials.filter(tutorial => 
    (activeTab === 'all' || tutorial.level === activeTab) && 
    tutorial.language === language
  );

  // Function to handle adding a new tutorial
  const handleAddTutorial = () => {
    setCurrentTutorial({
      id: '',
      title: '',
      description: '',
      thumbnailUrl: 'https://placehold.co/400x225?text=New+Tutorial',
      videoUrl: '',
      duration: '00:00',
      level: 'beginner',
      progress: 0,
      language: language
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a tutorial
  const handleEditTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial({...tutorial});
    setEditDialogOpen(true);
  };

  // Function to handle deleting a tutorial
  const handleDeleteTutorial = (id: string) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      const updatedTutorials = deleteTutorial(id);
      setTutorials(updatedTutorials);
      toast.success('Tutorial deleted successfully');
    }
  };

  // Function to save tutorial (add or update)
  const handleSaveTutorial = (tutorial: Tutorial) => {
    // Form validation
    if (!tutorial.title || !tutorial.description || !tutorial.videoUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const updatedTutorials = saveTutorial(tutorial);
      setTutorials(updatedTutorials);
      setEditDialogOpen(false);
      toast.success(`Tutorial ${tutorial.id ? 'updated' : 'added'} successfully`);
    } catch (error) {
      toast.error('Error saving tutorial');
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Levels</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isAdmin && (
          <Button className="ml-4" onClick={handleAddTutorial}>
            <Plus className="h-4 w-4 mr-2" /> Add Tutorial
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading tutorials...</p>
        </div>
      ) : filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTutorials.map(tutorial => (
            <Card key={tutorial.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={tutorial.thumbnailUrl} 
                  alt={tutorial.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-primary text-white p-3 rounded-full">
                    <Play className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 m-2 rounded">
                  {tutorial.duration}
                </div>
                <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 m-2 rounded capitalize">
                  {tutorial.level}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" /> {tutorial.title}
                </CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{tutorial.progress || 0}%</span>
                  </div>
                  <Progress value={tutorial.progress || 0} className="h-2" />
                </div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditTutorial(tutorial)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTutorial(tutorial.id)}>
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No {language} tutorials found for this level.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Tutorial Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentTutorial?.id ? 'Edit' : 'Add'} Tutorial</DialogTitle>
          </DialogHeader>
          {currentTutorial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={currentTutorial.title}
                  onChange={(e) => setCurrentTutorial({...currentTutorial, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={currentTutorial.description}
                  onChange={(e) => setCurrentTutorial({...currentTutorial, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoUrl" className="text-right">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={currentTutorial.videoUrl}
                  onChange={(e) => setCurrentTutorial({...currentTutorial, videoUrl: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thumbnailUrl" className="text-right">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  value={currentTutorial.thumbnailUrl}
                  onChange={(e) => setCurrentTutorial({...currentTutorial, thumbnailUrl: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duration</Label>
                <Input
                  id="duration"
                  value={currentTutorial.duration}
                  onChange={(e) => setCurrentTutorial({...currentTutorial, duration: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">Level</Label>
                <Select 
                  value={currentTutorial.level}
                  onValueChange={(value) => setCurrentTutorial({
                    ...currentTutorial, 
                    level: value as 'beginner' | 'intermediate' | 'advanced'
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right">Language</Label>
                <Select 
                  value={currentTutorial.language}
                  onValueChange={(value) => setCurrentTutorial({
                    ...currentTutorial, 
                    language: value as 'ASL' | 'MSL'
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASL">ASL</SelectItem>
                    <SelectItem value="MSL">MSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => currentTutorial && handleSaveTutorial(currentTutorial)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 