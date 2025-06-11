'use client'

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import MaterialHeader from '@/components/learning/MaterialHeader';
import MaterialGrid from '@/components/learning/MaterialGrid';
import MaterialEmptyState from '@/components/learning/MaterialEmptyState';
import MaterialLoadingState from '@/components/learning/MaterialLoadingState';
import MaterialDialog from '@/components/learning/MaterialDialog';
import type { Material } from '@/types/database';

export default function MaterialsPage() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();
  const { currentUser } = useAuth();
  const { 
    materials, 
    isLoading, 
    getMaterials, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial: deleteFromDB 
  } = useLearning();

  useEffect(() => {
    // Load materials when component mounts or language changes
    getMaterials(language);
  }, [language]);

  // Function to handle adding a new material
  const handleAddMaterial = () => {
    setCurrentMaterial({
      id: '',
      title: '',
      description: '',
      type: 'pdf',
      file_size: null,
      download_url: '#',
      level: 'beginner',
      language: language,
      created_by: currentUser?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a material
  const handleEditMaterial = (material: Material) => {
    setCurrentMaterial({...material});
    setEditDialogOpen(true);
  };

  // Function to handle deleting a material
  const handleDeleteMaterial = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteFromDB(id);
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  // Function to save material (add or update)
  const handleSaveMaterial = async (material: Material) => {
    // Form validation
    if (!material.title || !material.description || !material.download_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (material.id) {
        // Update existing material
        await updateMaterial(material.id, {
          title: material.title,
          description: material.description,
          type: material.type,
          file_size: material.file_size,
          download_url: material.download_url,
          level: material.level,
          language: material.language
        });
      } else {
        // Create new material
        await createMaterial({
          title: material.title,
          description: material.description,
          type: material.type,
          file_size: material.file_size,
          download_url: material.download_url,
          level: material.level,
          language: material.language
        });
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving material:', error);
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
      ) : materials.length > 0 ? (
        <MaterialGrid
          materials={materials}
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