'use client'

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { Material, getMaterials, saveMaterial, deleteMaterial } from '@/data/contentData';
import { toast } from 'sonner';
import MaterialHeader from '@/components/learning/MaterialHeader';
import MaterialGrid from '@/components/learning/MaterialGrid';
import MaterialEmptyState from '@/components/learning/MaterialEmptyState';
import MaterialLoadingState from '@/components/learning/MaterialLoadingState';
import MaterialDialog from '@/components/learning/MaterialDialog';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);

  useEffect(() => {
    // Get materials from localStorage via our data service
    setMaterials(getMaterials());
    setIsLoading(false);
  }, []);

  // Filter materials based on selected language
  const filteredMaterials = materials.filter(material => material.language === language);

  // Function to handle adding a new material
  const handleAddMaterial = () => {
    setCurrentMaterial({
      id: '',
      title: '',
      description: '',
      type: 'pdf',
      fileSize: '0 KB',
      downloadUrl: '#',
      level: 'beginner',
      language: language
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a material
  const handleEditMaterial = (material: Material) => {
    setCurrentMaterial({...material});
    setEditDialogOpen(true);
  };

  // Function to handle deleting a material
  const handleDeleteMaterial = (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      const updatedMaterials = deleteMaterial(id);
      setMaterials(updatedMaterials);
      toast.success('Material deleted successfully');
    }
  };

  // Function to save material (add or update)
  const handleSaveMaterial = (material: Material) => {
    // Form validation
    if (!material.title || !material.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const updatedMaterials = saveMaterial(material);
      setMaterials(updatedMaterials);
      setEditDialogOpen(false);
      toast.success(`Material ${material.id ? 'updated' : 'added'} successfully`);
    } catch (error) {
      toast.error('Error saving material');
      console.error(error);
    }
  };

  return (
    <>
      <MaterialHeader
        isAdmin={isAdmin}
        onAddMaterial={handleAddMaterial}
      />
      
      {isLoading ? (
        <MaterialLoadingState />
      ) : filteredMaterials.length > 0 ? (
        <MaterialGrid
          materials={filteredMaterials}
          isAdmin={isAdmin}
          onEditMaterial={handleEditMaterial}
          onDeleteMaterial={handleDeleteMaterial}
        />
      ) : (
        <MaterialEmptyState language={language} />
      )}

      <MaterialDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        material={currentMaterial}
        onMaterialChange={setCurrentMaterial}
        onSave={handleSaveMaterial}
      />
    </>
  );
} 