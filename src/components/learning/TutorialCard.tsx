'use client'

import React, { useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Play, CheckCircle } from 'lucide-react';
import { TutorialWithProgress } from '@/types/database';
import YouTubeVideoPreview, { VideoProgressState } from './YouTubeVideoPreview';
import { useLearning } from '@/context/LearningContext';
import { Badge } from "@/components/ui/badge";

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
        return <Badge className="bg-green-100 text-green-800 border-green-200 shrink-0">Completed</Badge>;
      case 'started':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 shrink-0">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="shrink-0">Not Started</Badge>;
    }
  };

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full">
        {/* Video Preview */}
        <div className="relative aspect-video w-full group">
          <YouTubeVideoPreview
            videoUrl={tutorial.video_url}
            title={tutorial.title}
            thumbnailUrl={tutorial.thumbnail_url}
            className="w-full h-full"
            startTime={tutorial.watch_position || 0}
            onVideoPlay={handleVideoPlay}
            onVideoProgress={handleVideoProgress}
            onVideoEnded={handleVideoEnded}
          />
          
          {/* Level badge */}
          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded capitalize">
            {tutorial.level}
          </div>

          {/* Watch progress badge */}
          {isVideoPlaying && watchedPercent > 0 && !isAdmin && tutorial.status !== 'completed' && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {watchedPercent}% watched
            </div>
          )}
        </div>
        
        {/* Card Content - Title and Status */}
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col gap-2 h-full">
            <div className="flex items-start justify-between gap-2 min-h-[3rem]">
              <h3 
                onClick={() => router.push(`/learning/tutorials/${tutorial.id}`)}
                className="font-medium text-sm md:text-base leading-tight line-clamp-2 flex-1 cursor-pointer hover:underline hover:text-primary transition-colors"
                title="View tutorial"
              >
                {tutorial.title}
              </h3>
              {getStatusBadge()}
            </div>
          </div>
        </CardContent>
        
        {/* Footer - Actions */}
        <CardFooter className="p-4 pt-0">
          {isAdmin ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => onEdit(tutorial)} className="flex-1">
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(tutorial.id)} className="flex-1">
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          ) : (
            <div className="flex w-full">
              {tutorial.status === 'not-started' && (
                <Button onClick={handleStartTutorial} size="sm" className="w-full">
                  <Play className="h-4 w-4 mr-1" /> Start Tutorial
                </Button>
              )}
              {tutorial.status === 'started' && (
                <Button onClick={handleMarkDone} variant="outline" size="sm" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-1" /> Mark Complete
                </Button>
              )}
              {tutorial.status === 'completed' && (
                <Button disabled size="sm" className="w-full bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="h-4 w-4 mr-1" /> Completed
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default TutorialCard;
