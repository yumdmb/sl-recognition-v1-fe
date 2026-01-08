'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { GestureContributionFormData, GestureCategory } from '@/types/gestureContributions';
import { GestureContributionService } from '@/lib/supabase/gestureContributions';

export function useGestureContributionSubmission() {
  const router = useRouter();
  const { currentUser } = useAuth();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<'ASL' | 'MSL'>('ASL');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  
  // Media state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await GestureContributionService.getCategories();
      if (!error && data) {
        setCategories(data);
      }
    };
    loadCategories();
  }, []);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleMediaCaptured = (file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("Authentication required", {
        description: "Please log in to submit a gesture contribution."
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields."
      });
      return;
    }

    if (!selectedFile) {
      toast.error("Media required", {
        description: "Please upload or capture a media file."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData: GestureContributionFormData = {
        title: title.trim(),
        description: description.trim(),
        language,
        media_type: mediaType,
        category_id: categoryId,
        file: selectedFile
      };

      const { error } = await GestureContributionService.submitContribution(formData);

      if (error) {
        console.error("Detailed submission error from hook:", error); // Added for more client-side logging
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : "Please try again.";
        toast.error("Submission failed", {
          description: errorMessage
        });
        return;
      }

      // Success
      toast.success("Gesture Submitted Successfully!", {
        description: "Your gesture contribution is now pending review."
      });

      // Reset form
      setTitle('');
      setDescription('');
      setLanguage('ASL');
      setMediaType('image');
      setCategoryId(null);
      setSelectedFile(null);
      setPreviewUrl(null);

      // Redirect to view page
      router.push('/gesture/view');
      
    } catch (err: unknown) { // Catch unexpected errors in the hook itself
      console.error("Unexpected error in handleSubmit:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      toast.error("An unexpected error occurred", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Form state
    title,
    setTitle,
    description,
    setDescription,
    language,
    setLanguage,
    mediaType,
    setMediaType,
    categoryId,
    setCategoryId,
    categories,
    
    // Media state
    selectedFile,
    previewUrl,
    isRecording,
    
    // Submission state
    isSubmitting,
    
    // Handlers
    handleFileChange,
    handleMediaCaptured,
    handleRecordingStateChange,
    handleSubmit
  };
}
