'use client'

import React from 'react';
import { Material } from '@/types/database';
import MaterialCard from './MaterialCard';

interface MaterialGridProps {
  materials: Material[];
  isAdmin: boolean;
  onEditMaterial: (material: Material) => void;
  onDeleteMaterial: (id: string) => void;
  onPreviewMaterial?: (material: Material) => void;
}

const MaterialGrid: React.FC<MaterialGridProps> = ({ 
  materials, 
  isAdmin, 
  onEditMaterial, 
  onDeleteMaterial,
  onPreviewMaterial
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {materials.map(material => (
        <MaterialCard
          key={material.id}
          material={material}
          isAdmin={isAdmin}
          onEdit={onEditMaterial}
          onDelete={onDeleteMaterial}
          onPreview={onPreviewMaterial}
        />
      ))}
    </div>
  );
};

export default MaterialGrid;

