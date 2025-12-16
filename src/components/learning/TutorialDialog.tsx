'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TutorialWithProgress } from '@/types/database';
import { isValidYouTubeUrl } from '@/lib/utils/youtube';
import { useYouTubeMetadata } from '@/hooks/useYouTubeMetadata';
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorial: TutorialWithProgress | null;
  onTutorialChange: (tutorial: TutorialWithProgress) => void;
  onSave: (tutorial: TutorialWithProgress) => void;
  isSaving?: boolean;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({
  open,
  onOpenChange,
  tutorial,
  onTutorialChange,
  onSave,
  isSaving = false
}) => {const [videoUrlDebounce, setVideoUrlDebounce] = useState('');
  const { isLoading: isLoadingMetadata, error, fetchMetadata } = useYouTubeMetadata();

  // Reset video URL debounce when dialog closes
  useEffect(() => {
    if (!open) {
      setVideoUrlDebounce('');
    }
  }, [open]);
  // Debounce video URL changes to avoid too many API calls
  useEffect(() => {
    if (!tutorial?.video_url) return;
    
    const timer = setTimeout(() => {
      if (tutorial.video_url && tutorial.video_url !== videoUrlDebounce && tutorial.video_url.trim() !== '') {
        setVideoUrlDebounce(tutorial.video_url);
        if (isValidYouTubeUrl(tutorial.video_url)) {
          handleFetchMetadata(tutorial.video_url);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [tutorial?.video_url, videoUrlDebounce]);

  // Early return AFTER all hooks
  if (!tutorial) return null;
  const handleFetchMetadata = async (url: string) => {
    try {
      const metadata = await fetchMetadata(url);
        if (metadata) {      // Auto-populate fields if they're empty
        onTutorialChange({
          ...tutorial,
          title: tutorial.title || metadata.title,
          thumbnail_url: metadata.thumbnail,
        });        toast.success('Video metadata loaded', {
          description: 'Title and thumbnail have been automatically detected.'
        });
      }
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      // Silently fail for metadata fetching to not interrupt the save process
    }
  };

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
      <DialogContent className="sm:max-w-[525px]">        <DialogHeader>
          <DialogTitle>{tutorial.id ? 'Edit' : 'Add'} Tutorial</DialogTitle>
          <div className="text-sm text-gray-600 mt-2">
            📺 Enter a YouTube URL and the title, thumbnail, and duration will be automatically detected.
          </div>
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
            <Label htmlFor="videoUrl" className="text-right">YouTube URL</Label>
            <div className="col-span-3 relative">
              <Input
                id="videoUrl"
                value={tutorial.video_url}
                onChange={(e) => handleFieldChange('video_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isLoadingMetadata && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {!isLoadingMetadata && tutorial.video_url && isValidYouTubeUrl(tutorial.video_url) && !error && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {error && tutorial.video_url && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>
          
          {/* Error message */}
          {error && tutorial.video_url && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="col-span-3 text-sm text-red-600">
                {error}
              </div>
            </div>
          )}
          
          {/* Show thumbnail preview if available */}
          {tutorial.thumbnail_url && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Thumbnail Preview</Label>
              <div className="col-span-3">
                <img 
                  src={tutorial.thumbnail_url} 
                  alt="Video thumbnail" 
                  className="w-32 h-18 object-cover rounded border shadow-sm"
                  onError={(e) => {
                    // Hide broken image
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Auto-detected from YouTube</p>
              </div>
            </div>
          )}          {/* Duration field removed */}
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
        </div>        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSave(tutorial)}
            disabled={!tutorial.title || !tutorial.description || !tutorial.video_url || isLoadingMetadata || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isLoadingMetadata ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
