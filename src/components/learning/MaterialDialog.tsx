'use client'

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Material } from '@/data/contentData';

interface MaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
  onMaterialChange: (material: Material | null) => void;
  onSave: (material: Material) => void;
}

const MaterialDialog: React.FC<MaterialDialogProps> = ({
  open,
  onOpenChange,
  material,
  onMaterialChange,
  onSave
}) => {
  if (!material) return null;

  const handleFieldChange = (field: keyof Material, value: string) => {
    onMaterialChange({
      ...material,
      [field]: value
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{material.id ? 'Edit' : 'Add'} Material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input
              id="title"
              value={material.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={material.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select 
              value={material.type}
              onValueChange={(value) => handleFieldChange('type', value)}
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
              value={material.fileSize}
              onChange={(e) => handleFieldChange('fileSize', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="downloadUrl" className="text-right">Download URL</Label>
            <Input
              id="downloadUrl"
              value={material.downloadUrl}
              onChange={(e) => handleFieldChange('downloadUrl', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">Level</Label>
            <Select 
              value={material.level}
              onValueChange={(value) => handleFieldChange('level', value)}
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
              value={material.language}
              onValueChange={(value) => handleFieldChange('language', value)}
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave(material)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDialog;
