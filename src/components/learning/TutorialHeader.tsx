'use client'

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'lucide-react';

interface TutorialHeaderProps {
  onTabChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isAdmin: boolean;
  onAddTutorial: () => void;
}

const TutorialHeader: React.FC<TutorialHeaderProps> = ({
  onTabChange,
  searchQuery,
  onSearchChange,
  isAdmin,
  onAddTutorial
}) => {
  return (
    <div className="sticky top-0 z-10 bg-background pb-4 space-y-4">
      {/* Admin-only level tabs row */}
      {isAdmin && (
        <div className="flex justify-between items-center">
          <Tabs defaultValue="all" onValueChange={onTabChange} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Levels</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button className="ml-4" onClick={onAddTutorial}>
            <Plus className="h-4 w-4 mr-2" /> Add Tutorial
          </Button>
        </div>
      )}
      
      {/* Search row - visible to all users */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tutorials..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default TutorialHeader;
