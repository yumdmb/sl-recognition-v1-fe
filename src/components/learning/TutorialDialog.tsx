'use client'

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TutorialWithProgress } from '@/types/database';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorial: TutorialWithProgress | null;
  onTutorialChange: (tutorial: TutorialWithProgress) => void;
  onSave: (tutorial: TutorialWithProgress) => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({
  open,
  onOpenChange,
  tutorial,
  onTutorialChange,
  onSave
}) => {
  if (!tutorial) return null;
  const handleFieldChange = (field: keyof TutorialWithProgress, value: string) => {
    onTutorialChange({
      ...tutorial,
      [field]: value
    });
  };

  const handleLevelChange = (value: string) => {
    onTutorialChange({
      ...tutorial,
      level: value as 'beginner' | 'intermediate' | 'advanced'
    });
  };

  const handleLanguageChange = (value: string) => {
    onTutorialChange({
      ...tutorial,
      language: value as 'ASL' | 'MSL'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{tutorial.id ? 'Edit' : 'Add'} Tutorial</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input
              id="title"
              value={tutorial.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={tutorial.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="col-span-3"
            />
          </div>          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="videoUrl" className="text-right">Video URL</Label>
            <Input
              id="videoUrl"
              value={tutorial.video_url}
              onChange={(e) => handleFieldChange('video_url', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thumbnailUrl" className="text-right">Thumbnail URL</Label>
            <Input
              id="thumbnailUrl"
              value={tutorial.thumbnail_url || ''}
              onChange={(e) => handleFieldChange('thumbnail_url', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">Duration</Label>
            <Input
              id="duration"
              value={tutorial.duration}
              onChange={(e) => handleFieldChange('duration', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">Level</Label>
            <Select value={tutorial.level} onValueChange={handleLevelChange}>
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
            <Select value={tutorial.language} onValueChange={handleLanguageChange}>
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
          <Button onClick={() => onSave(tutorial)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
