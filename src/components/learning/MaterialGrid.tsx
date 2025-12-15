'use client'

import React from 'react';
import { Material } from '@/types/database';
import MaterialCard from './MaterialCard';

interface MaterialGridProps {
  materials: Material[];
  isAdmin: boolean;
  onEditMaterial: (material: Material) => void;
  onDeleteMaterial: (id: string) => void;
}

const MaterialGrid: React.FC<MaterialGridProps> = ({ 
  materials, 
  isAdmin, 
  onEditMaterial, 
  onDeleteMaterial 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {materials.map(material => (
        <MaterialCard
          key={material.id}
          material={material}
          isAdmin={isAdmin}
          onEdit={onEditMaterial}
          onDelete={onDeleteMaterial}
        />
      ))}
    </div>
  );
};

export default MaterialGrid;
