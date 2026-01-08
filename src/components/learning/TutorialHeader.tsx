'use client'

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface TutorialHeaderProps {
  onTabChange: (value: string) => void;
  isAdmin: boolean;
  onAddTutorial: () => void;
}

const TutorialHeader: React.FC<TutorialHeaderProps> = ({
  onTabChange,
  isAdmin,
  onAddTutorial
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      {isAdmin ? (
        // Admins see level tabs to filter content
        <Tabs defaultValue="all" onValueChange={onTabChange} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Levels</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        // Regular users don't need level tabs - content is already filtered server-side
        <div className="flex-1" />
      )}
      
      {isAdmin && (
        <Button className="ml-4" onClick={onAddTutorial}>
          <Plus className="h-4 w-4 mr-2" /> Add Tutorial
        </Button>
      )}
    </div>
  );
};

export default TutorialHeader;
