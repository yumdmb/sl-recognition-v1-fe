'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TutorialWithProgress } from '@/types/database';
import { isValidYouTubeUrl } from '@/lib/utils/youtube';
import { useYouTubeMetadata } from '@/hooks/useYouTubeMetadata';
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

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
}) => {
  const [videoUrlDebounce, setVideoUrlDebounce] = useState('');
  const { isLoading: isLoadingMetadata, metadata, error, fetchMetadata } = useYouTubeMetadata();

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
    }, 1000);

    return () => clearTimeout(timer);
  }, [tutorial?.video_url, videoUrlDebounce]);

  // Early return AFTER all hooks
  if (!tutorial) return null;

  const handleFetchMetadata = async (url: string) => {
    try {
      const metadata = await fetchMetadata(url);
      if (metadata) {
        // Auto-populate fields if they're empty
        onTutorialChange({
          ...tutorial,
          title: tutorial.title || metadata.title,
          thumbnail_url: metadata.thumbnail,
        });
        toast.success('Video metadata loaded', {
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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-display">{tutorial.id ? 'Edit' : 'New'} tutorial</DialogTitle>
          <DialogDescription className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Paste a YouTube URL and the title and thumbnail will be detected automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">YouTube URL</Label>
            <div className="relative">
              <Input
                id="videoUrl"
                value={tutorial.video_url}
                onChange={(e) => handleFieldChange('video_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=â€¦"
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isLoadingMetadata && (
                  <Loader2 className="size-4 animate-spin text-primary" />
                )}
                {!isLoadingMetadata && tutorial.video_url && isValidYouTubeUrl(tutorial.video_url) && !error && (
                  <CheckCircle2 className="size-4 text-primary" />
                )}
                {error && tutorial.video_url && (
                  <AlertCircle className="size-4 text-destructive" />
                )}
              </div>
            </div>
            {error && tutorial.video_url && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          {tutorial.thumbnail_url && (
            <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-3">
              <img
                src={tutorial.thumbnail_url}
                alt="Video thumbnail"
                className="h-16 w-28 shrink-0 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs text-muted-foreground">Thumbnail auto-detected from YouTube</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={tutorial.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Greetings in BIM"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={tutorial.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="What will learners pick up from this video?"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={tutorial.level} onValueChange={handleLevelChange}>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={tutorial.language} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASL">ASL</SelectItem>
                  <SelectItem value="MSL">MSL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(tutorial)}
            disabled={!tutorial.title || !tutorial.description || !tutorial.video_url || isLoadingMetadata || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" />
                Savingâ€¦
              </>
            ) : isLoadingMetadata ? (
              <>
                <Loader2 className="animate-spin" />
                Loadingâ€¦
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
