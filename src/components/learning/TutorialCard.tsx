'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Trash, Play, CheckCircle } from 'lucide-react';
import { TutorialWithProgress } from '@/types/database';
import YouTubeVideoPreview from './YouTubeVideoPreview';
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
  const { startTutorial, markTutorialDone } = useLearning();

  const handleStartTutorial = () => {
    startTutorial(tutorial.id);
  };

  const handleMarkDone = () => {
    markTutorialDone(tutorial.id);
  };

  const getStatusBadge = () => {
    switch (tutorial.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'started':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video md:h-48">
        <YouTubeVideoPreview
          videoUrl={tutorial.video_url}
          title={tutorial.title}
          thumbnailUrl={tutorial.thumbnail_url}
          className="h-full"
        />
        
        <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 m-2 rounded capitalize">
          {tutorial.level}
        </div>
        
        {/* Auto-detected badge */}
        {tutorial.thumbnail_url && tutorial.thumbnail_url.includes('img.youtube.com') && (
          <div className="absolute top-0 right-0 bg-green-600 text-white text-xs px-2 py-1 m-2 rounded">
            📺 Auto-detected
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2 px-4 md:px-6">
        <CardTitle className="text-base md:text-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center min-w-0">
            <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" /> 
            <span className="truncate">{tutorial.title}</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-between pt-0 px-4 md:px-6">
        {isAdmin ? (
          <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => onEdit(tutorial)} className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(tutorial.id)} className="w-full sm:w-auto">
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2 w-full">
            {tutorial.status === 'not-started' && (
              <Button onClick={handleStartTutorial} className="flex-1">
                <Play className="h-4 w-4 mr-2" /> Start
              </Button>
            )}
            {tutorial.status === 'started' && (
              <Button onClick={handleMarkDone} variant="outline" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" /> Mark Done
              </Button>
            )}
            {tutorial.status === 'completed' && (
              <Button disabled className="flex-1 bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-2" /> Completed
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TutorialCard;
