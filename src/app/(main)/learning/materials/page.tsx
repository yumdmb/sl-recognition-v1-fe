'use client'

import React, { useState, useEffect, useMemo } from 'react';
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
import MaterialPreviewDialog from '@/components/learning/MaterialPreviewDialog';
import type { Material } from '@/types/database';

// Helper to convert proficiency level to lowercase
const toLowerLevel = (level: string | null | undefined): 'beginner' | 'intermediate' | 'advanced' | undefined => {
  if (!level) return undefined;
  return level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
};

export default function MaterialsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  
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

  // Get the user's proficiency level for the currently selected language (only for non-admins)
  const userLevel = useMemo(() => {
    if (isAdmin) return undefined; // Admins see all levels
    
    // Use language-specific proficiency level based on selected language
    if (language === 'ASL') {
      return toLowerLevel(currentUser?.asl_proficiency_level);
    } else if (language === 'MSL') {
      return toLowerLevel(currentUser?.msl_proficiency_level);
    }
    
    // Fallback to legacy proficiency_level
    return toLowerLevel(currentUser?.proficiency_level);
  }, [isAdmin, currentUser?.asl_proficiency_level, currentUser?.msl_proficiency_level, currentUser?.proficiency_level, language]);

  useEffect(() => {
    // Load materials when component mounts or language/level changes
    // Pass level for non-admins to filter server-side
    getMaterials(language, userLevel);
  }, [language, userLevel, getMaterials]);

  // Filter materials by level (admin only) and search (all users)
  const filteredMaterials = useMemo(() => {
    let filtered = materials;
    
    // Apply level filter for admins only
    if (isAdmin && activeTab !== 'all') {
      filtered = filtered.filter(material => material.level === activeTab);
    }
    
    // Apply search filter for all users
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(query) ||
        material.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [materials, activeTab, searchQuery, isAdmin]);

  // Function to handle adding a new material
  const handleAddMaterial = () => {
    setCurrentMaterial({
      id: '',
      title: '',
      description: '',
      type: '',
      file_size: null,
      download_url: '',
      file_path: null,
      level: 'beginner',
      language: language,
      created_by: currentUser?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a material
  const handleEditMaterial = (material: Material) => {
    setCurrentMaterial({ ...material });
    setEditDialogOpen(true);
  };

  // Function to handle deleting a material
  const handleDeleteMaterial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteFromDB(id);
        toast.success('Material deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete material.');
        console.error('Error deleting material:', error);
      }
    }
  };

  // Function to handle previewing a material
  const handlePreviewMaterial = (material: Material) => {
    setPreviewMaterial(material);
    setPreviewDialogOpen(true);
  };

  // Function to save material (add or update)
  const handleSaveMaterial = async (material: Material, file?: File) => {
    // Form validation
    if (!material.title || !material.description) {
      toast.error('Please fill in the title and description.');
      return;
    }
    if (!material.id && !file) {
      toast.error('Please select a file to upload.');
      return;
    }

    try {
      if (material.id) {
        // Update existing material
        await updateMaterial(material.id, {
          title: material.title,
          description: material.description,
          level: material.level,
          language: material.language,
        }, file);
      } else {
        // Create new material
        await createMaterial(material, file);
      }
      setEditDialogOpen(false);
      setCurrentMaterial(null);
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  return (
    <>
      <MaterialHeader
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
          onPreviewMaterial={handlePreviewMaterial}
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

      <MaterialPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        material={previewMaterial}
      />
    </>
  );
}
