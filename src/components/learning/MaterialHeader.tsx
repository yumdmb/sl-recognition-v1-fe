'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'lucide-react';

interface MaterialHeaderProps {
  onTabChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isAdmin: boolean;
  onAddMaterial: () => void;
}

const MaterialHeader: React.FC<MaterialHeaderProps> = ({
  onTabChange,
  searchQuery,
  onSearchChange,
  isAdmin,
  onAddMaterial
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs defaultValue="all" onValueChange={onTabChange} className="flex-1">
          <TabsList className="h-10 rounded-xl bg-muted p-1">
            <TabsTrigger value="all" className="rounded-lg px-4 data-[state=active]:shadow-soft">All Levels</TabsTrigger>
            <TabsTrigger value="beginner" className="rounded-lg px-4 data-[state=active]:shadow-soft">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate" className="rounded-lg px-4 data-[state=active]:shadow-soft">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced" className="rounded-lg px-4 data-[state=active]:shadow-soft">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        {isAdmin && (
          <Button onClick={onAddMaterial}>
            <Plus className="size-4" /> New material
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search materials…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default MaterialHeader;
