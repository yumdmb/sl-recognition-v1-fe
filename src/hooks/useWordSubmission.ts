'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

export interface WordSubmission {
  id: string;
  word: string;
  description: string;
  language: 'ASL' | 'MSL';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  submittedBy: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

// Function to create a local word submission storage
const getWordSubmissions = (): WordSubmission[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wordSubmissions');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveWordSubmission = (submission: WordSubmission) => {
  if (typeof window !== 'undefined') {
    const existing = getWordSubmissions();
    localStorage.setItem('wordSubmissions', JSON.stringify([...existing, submission]));
  }
};

export function useWordSubmission() {
  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<'ASL' | 'MSL'>('MSL');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMediaCaptured = (file: File, url: string) => {
    setMediaFile(file);
    setPreviewUrl(url);
  };

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  const resetForm = () => {
    setWord('');
    setDescription('');
    setMediaFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!mediaFile) {
      toast.error("Media required", {
        description: `Please upload or capture ${mediaType === 'image' ? 'an image' : 'a video'} of the sign language gesture`
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const newSubmission: WordSubmission = {
        id: crypto.randomUUID(),
        word,
        description,
        language,
        mediaType,
        mediaUrl: previewUrl,
        submittedBy: {
          id: currentUser?.id || '',
          name: currentUser?.name || '',
        },
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      saveWordSubmission(newSubmission);

      toast.success("Word submitted", {
        description: "Your sign language gesture has been submitted for verification."
      });

      resetForm();
      router.push('/word/view');
    } catch {
      toast.error("Error", {
        description: "Failed to submit the word. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Form state
    word,
    setWord,
    description,
    setDescription,
    language,
    setLanguage,
    mediaType,
    setMediaType,
    mediaFile,
    previewUrl,
    isSubmitting,
    isRecording,
    
    // Handlers
    handleFileChange,
    handleMediaCaptured,
    handleRecordingStateChange,
    handleSubmit,
    resetForm
  };
}
