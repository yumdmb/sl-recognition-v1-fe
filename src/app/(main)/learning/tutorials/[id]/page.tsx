'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Edit, Trash, Play, CheckCircle, Loader2 } from 'lucide-react';
import { useLearning } from '@/context/LearningContext';
import { useAdmin } from '@/context/AdminContext';
import YouTubeVideoPreview, { VideoProgressState } from '@/components/learning/YouTubeVideoPreview';
import TutorialDialog from '@/components/learning/TutorialDialog';
import type { TutorialWithProgress } from '@/types/database';
import { toast } from 'sonner';

export default function TutorialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tutorialId = params?.id as string;

  const { getTutorial, startTutorial, markTutorialDone, updateWatchPosition, updateTutorial, deleteTutorial: deleteFromDB } = useLearning();
  const { isAdmin } = useAdmin();

  const [tutorial, setTutorial] = useState<TutorialWithProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const lastSaveTimeRef = useRef(0);

  // Load tutorial data
  useEffect(() => {
    async function loadTutorial() {
      if (!tutorialId) return;
      
      try {
        setIsLoading(true);
        const data = await getTutorial(tutorialId);
        
        if (!data) {
          toast.error('Tutorial not found');
          router.push('/learning/tutorials');
          return;
        }
        
        setTutorial(data);
        
        // Initialize refs based on status
        if (data.status === 'started') {
          hasStartedRef.current = true;
        } else if (data.status === 'completed') {
          hasStartedRef.current = true;
          hasCompletedRef.current = true;
        }
      } catch (error) {
        console.error('Error loading tutorial:', error);
        toast.error('Failed to load tutorial');
      } finally {
        setIsLoading(false);
      }
    }

    loadTutorial();
  }, [tutorialId, getTutorial, router]);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
    if (isAdmin || !tutorial) return;
    
    if (tutorial.status === 'not-started' && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startTutorial(tutorial.id);
      setTutorial(prev => prev ? { ...prev, status: 'started' } : null);
    }
  }, [isAdmin, tutorial, startTutorial]);

  const handleVideoProgress = useCallback((state: VideoProgressState) => {
    const percent = Math.round(state.played * 100);
    setWatchedPercent(percent);
    
    if (isAdmin || !tutorial) return;
    
    // Save watch position every 10 seconds
    const now = Date.now();
    if (now - lastSaveTimeRef.current >= 10000) {
      lastSaveTimeRef.current = now;
      updateWatchPosition(tutorial.id, state.playedSeconds);
    }
    
    // Mark as completed at 90%
    if (state.played >= 0.9 && tutorial.status !== 'completed' && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      markTutorialDone(tutorial.id);
      setTutorial(prev => prev ? { ...prev, status: 'completed' } : null);
    }
  }, [isAdmin, tutorial, markTutorialDone, updateWatchPosition]);

  const handleVideoEnded = useCallback(() => {
    setIsVideoPlaying(false);
    if (isAdmin || !tutorial) return;
    
    if (tutorial.status !== 'completed' && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      markTutorialDone(tutorial.id);
      setTutorial(prev => prev ? { ...prev, status: 'completed' } : null);
    }
  }, [isAdmin, tutorial, markTutorialDone]);

  const handleStartTutorial = () => {
    if (!tutorial) return;
    startTutorial(tutorial.id);
    setTutorial(prev => prev ? { ...prev, status: 'started' } : null);
  };

  const handleMarkDone = () => {
    if (!tutorial) return;
    markTutorialDone(tutorial.id);
    setTutorial(prev => prev ? { ...prev, status: 'completed' } : null);
  };

  const handleEditTutorial = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteTutorial = async () => {
    if (!tutorial) return;
    if (confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await deleteFromDB(tutorial.id);
        toast.success('Tutorial deleted');
        router.push('/learning/tutorials');
      } catch (error) {
        console.error('Error deleting tutorial:', error);
      }
    }
  };

  const handleSaveTutorial = async (updatedTutorial: TutorialWithProgress) => {
    if (isSaving || !tutorial) return;
    
    if (!updatedTutorial.title || !updatedTutorial.description || !updatedTutorial.video_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await updateTutorial(tutorial.id, {
        title: updatedTutorial.title,
        description: updatedTutorial.description,
        thumbnail_url: updatedTutorial.thumbnail_url,
        video_url: updatedTutorial.video_url,
        level: updatedTutorial.level,
        language: updatedTutorial.language
      });
      
      setTutorial(prev => prev ? { ...prev, ...updatedTutorial } : null);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast.error('Failed to save tutorial');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    if (!tutorial) return null;
    switch (tutorial.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'started':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Tutorial Not Found</h1>
        <Button onClick={() => router.push('/learning/tutorials')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tutorials
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/learning/tutorials')}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tutorials
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">{tutorial.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">{tutorial.level}</Badge>
              <Badge variant="outline">{tutorial.language}</Badge>
              {getStatusBadge()}
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditTutorial}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteTutorial}>
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Video Player */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video w-full">
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
            
            {/* Watch progress badge */}
            {isVideoPlaying && watchedPercent > 0 && !isAdmin && tutorial.status !== 'completed' && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg">
                {watchedPercent}% watched
              </div>
            )}
          </div>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">About this Tutorial</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {tutorial.description || 'No description available.'}
            </p>
          </CardContent>
        </Card>

        {/* User Actions */}
        {!isAdmin && (
          <div className="flex justify-center pb-8">
            {tutorial.status === 'not-started' && (
              <Button onClick={handleStartTutorial} size="lg">
                <Play className="h-5 w-5 mr-2" /> Start Tutorial
              </Button>
            )}
            {tutorial.status === 'started' && (
              <Button onClick={handleMarkDone} variant="outline" size="lg">
                <CheckCircle className="h-5 w-5 mr-2" /> Mark Complete
              </Button>
            )}
            {tutorial.status === 'completed' && (
              <Button disabled size="lg" className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="h-5 w-5 mr-2" /> Completed
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <TutorialDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tutorial={tutorial}
        onTutorialChange={setTutorial}
        onSave={handleSaveTutorial}
        isSaving={isSaving}
      />
    </>
  );
}
