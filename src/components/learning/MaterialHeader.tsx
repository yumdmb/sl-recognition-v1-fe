'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface MaterialHeaderProps {
  isAdmin: boolean;
  onAddMaterial: () => void;
}

const MaterialHeader: React.FC<MaterialHeaderProps> = ({ isAdmin, onAddMaterial }) => {
  return (
    <>
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <Button onClick={onAddMaterial}>
            <Plus className="h-4 w-4 mr-2" /> Add Material
          </Button>
        </div>
      )}
    </>
  );
};

export default MaterialHeader;
