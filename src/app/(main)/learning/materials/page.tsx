'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Book, Video, Edit, Trash, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { Material, getMaterials, saveMaterial, deleteMaterial } from '@/data/contentData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);

  useEffect(() => {
    // Get materials from localStorage via our data service
    setMaterials(getMaterials());
    setIsLoading(false);
  }, []);
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      default:
        return <Book className="h-6 w-6" />;
    }
  };
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return '';
    }
  };

  // Filter materials based on selected language
  const filteredMaterials = materials.filter(material => material.language === language);

  // Function to handle adding a new material
  const handleAddMaterial = () => {
    setCurrentMaterial({
      id: '',
      title: '',
      description: '',
      type: 'pdf',
      fileSize: '0 KB',
      downloadUrl: '#',
      level: 'beginner',
      language: language
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a material
  const handleEditMaterial = (material: Material) => {
    setCurrentMaterial({...material});
    setEditDialogOpen(true);
  };

  // Function to handle deleting a material
  const handleDeleteMaterial = (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      const updatedMaterials = deleteMaterial(id);
      setMaterials(updatedMaterials);
      toast.success('Material deleted successfully');
    }
  };

  // Function to save material (add or update)
  const handleSaveMaterial = (material: Material) => {
    // Form validation
    if (!material.title || !material.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const updatedMaterials = saveMaterial(material);
      setMaterials(updatedMaterials);
      setEditDialogOpen(false);
      toast.success(`Material ${material.id ? 'updated' : 'added'} successfully`);
    } catch (error) {
      toast.error('Error saving material');
      console.error(error);
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <Button onClick={handleAddMaterial}>
            <Plus className="h-4 w-4 mr-2" /> Add Material
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading materials...</p>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMaterials.map(material => (
            <Card key={material.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <div className="mr-3 p-2 bg-muted rounded-md text-primary">
                      {getTypeIcon(material.type)}
                    </div>
                    <div>
                      {material.title}
                    </div>
                  </CardTitle>
                </div>
                <div className="flex justify-between mt-2">
                  <CardDescription>{material.description}</CardDescription>
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${getLevelColor(material.level)}`}
                  >
                    {material.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {material.fileSize ? `File size: ${material.fileSize}` : ''}
                  </span>
                  <Button>
                    <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditMaterial(material)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMaterial(material.id)}>
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
            <p className="text-gray-500">No {language} learning materials available.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Add/Edit Material Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentMaterial?.id ? 'Edit' : 'Add'} Material</DialogTitle>
          </DialogHeader>
          {currentMaterial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={currentMaterial.title}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={currentMaterial.description}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select 
                  value={currentMaterial.type}
                  onValueChange={(value) => setCurrentMaterial({
                    ...currentMaterial, 
                    type: value as 'pdf' | 'video' | 'document'
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileSize" className="text-right">File Size</Label>
                <Input
                  id="fileSize"
                  value={currentMaterial.fileSize}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, fileSize: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="downloadUrl" className="text-right">Download URL</Label>
                <Input
                  id="downloadUrl"
                  value={currentMaterial.downloadUrl}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, downloadUrl: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">Level</Label>
                <Select 
                  value={currentMaterial.level}
                  onValueChange={(value) => setCurrentMaterial({
                    ...currentMaterial, 
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
                  value={currentMaterial.language}
                  onValueChange={(value) => setCurrentMaterial({
                    ...currentMaterial, 
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
            <Button onClick={() => currentMaterial && handleSaveMaterial(currentMaterial)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 