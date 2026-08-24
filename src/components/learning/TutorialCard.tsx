'use client';

import React, { useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { TutorialWithProgress } from '@/types/database';
import YouTubeVideoPreview, { VideoProgressState } from './YouTubeVideoPreview';
import { useLearning } from '@/context/LearningContext';

interface TutorialCardProps {
  tutorial: TutorialWithProgress;
  isAdmin: boolean;
  onEdit: (tutorial: TutorialWithProgress) => void;
  onDelete: (id: string) => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  isAdmin,
  onEdit,
  onDelete
}) => {
  const router = useRouter();
  const { startTutorial, markTutorialDone, updateWatchPosition } = useLearning();
  const lastSaveTimeRef = useRef(0);
  
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  React.useEffect(() => {
    if (tutorial.status === 'not-started') {
      hasStartedRef.current = false;
      hasCompletedRef.current = false;
    } else if (tutorial.status === 'started') {
      hasStartedRef.current = true;
      hasCompletedRef.current = false;
    } else if (tutorial.status === 'completed') {
      hasStartedRef.current = true;
      hasCompletedRef.current = true;
    }
  }, [tutorial.status]);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
    if (isAdmin) return;
    if (tutorial.status === 'not-started' && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startTutorial(tutorial.id);
    }
  }, [isAdmin, tutorial.status, tutorial.id, startTutorial]);

  const handleVideoProgress = useCallback((state: VideoProgressState) => {
    const percent = Math.round(state.played * 100);
    setWatchedPercent(percent);
    
    if (isAdmin) return;
    
    const now = Date.now();
    if (now - lastSaveTimeRef.current >= 10000) {
      lastSaveTimeRef.current = now;
      updateWatchPosition(tutorial.id, state.playedSeconds);
    }
    
    if (state.played >= 0.9 && tutorial.status !== 'completed' && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      markTutorialDone(tutorial.id);
    }
  }, [isAdmin, tutorial.status, tutorial.id, markTutorialDone, updateWatchPosition]);

  const handleVideoEnded = useCallback(() => {
    setIsVideoPlaying(false);
    if (isAdmin) return;
    if (tutorial.status !== 'completed' && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      markTutorialDone(tutorial.id);
    }
  }, [isAdmin, tutorial.status, tutorial.id, markTutorialDone]);

  const handleStartTutorial = () => {
    startTutorial(tutorial.id);
  };

  const handleMarkDone = () => {
    markTutorialDone(tutorial.id);
  };

  const getStatusBadge = () => {
    switch (tutorial.status) {
      case 'completed':
        return <Badge className="bg-primary-soft text-primary">Completed</Badge>;
      case 'started':
        return <Badge className="bg-sun/10 text-sun">In progress</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Not started</Badge>;
    }
  };

  return (
    <Card className="card-lift gap-0 overflow-hidden py-0">
      <div className="relative h-44 w-full overflow-hidden">
        <YouTubeVideoPreview
          videoUrl={tutorial.video_url}
          title={tutorial.title}
          thumbnailUrl={tutorial.thumbnail_url}
          className="h-full"
          startTime={tutorial.watch_position || 0}
          onVideoPlay={handleVideoPlay}
          onVideoProgress={handleVideoProgress}
          onVideoEnded={handleVideoEnded}
        />

        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold capitalize text-mint backdrop-blur-sm">
          {tutorial.level}
        </span>

        {isVideoPlaying && watchedPercent > 0 && !isAdmin && tutorial.status !== 'completed' && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
            {watchedPercent}% watched
          </span>
        )}

        {tutorial.thumbnail_url && tutorial.thumbnail_url.includes('img.youtube.com') && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-mint backdrop-blur-sm">
            <Sparkles className="size-3" />
            Auto thumbnail
          </span>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold leading-snug cursor-pointer hover:text-primary" onClick={() => router.push(`/learning/tutorials/${tutorial.id}`)}>{tutorial.title}</h3>
          {getStatusBadge()}
        </div>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {tutorial.description}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          {isAdmin ? (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit(tutorial)}>
                <Edit />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(tutorial.id)}
              >
                <Trash2 />
                Delete
              </Button>
            </>
          ) : (
            <>
              {tutorial.status === 'not-started' && (
                <Button size="sm" className="flex-1" onClick={handleStartTutorial}>
                  <Play />
                  Start learning
                </Button>
              )}
              {tutorial.status === 'started' && (
                <Button size="sm" variant="outline" className="flex-1" onClick={handleMarkDone}>
                  <CheckCircle2 />
                  Mark as done
                </Button>
              )}
              {tutorial.status === 'completed' && (
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="size-4" />
                  Completed — great work
                </span>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorialCard;
