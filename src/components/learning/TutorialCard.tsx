'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Edit, Trash } from 'lucide-react';
import { Tutorial } from '@/data/contentData';

interface TutorialCardProps {
  tutorial: Tutorial;
  isAdmin: boolean;
  onEdit: (tutorial: Tutorial) => void;
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
      <div className="relative">
        <img 
          src={tutorial.thumbnailUrl} 
          alt={tutorial.title} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button className="bg-primary text-white p-3 rounded-full">
            <Play className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 m-2 rounded">
          {tutorial.duration}
        </div>
        <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 m-2 rounded capitalize">
          {tutorial.level}
        </div>
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
