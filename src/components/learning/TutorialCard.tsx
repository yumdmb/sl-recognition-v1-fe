'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Trash } from 'lucide-react';
import { TutorialWithProgress } from '@/types/database';
import YouTubeVideoPreview from './YouTubeVideoPreview';

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
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <YouTubeVideoPreview
          videoUrl={tutorial.video_url}
          title={tutorial.title}
          thumbnailUrl={tutorial.thumbnail_url}
          duration={tutorial.duration}
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
          <Button variant="outline" size="sm" onClick={() => onEdit(tutorial)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(tutorial.id)}>
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TutorialCard;
