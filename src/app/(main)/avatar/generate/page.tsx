"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CameraControls from '@/components/avatar/CameraControls';
import GesturePreview from '@/components/avatar/GesturePreview';
import AvatarPageHeader from '@/components/avatar/AvatarPageHeader';
import SaveForm from '@/components/avatar/SaveForm';
import { useCamera } from '@/hooks/useCamera';

const AvatarGenerationPage = () => {
  const [signName, setSignName] = useState('');
  const [signDescription, setSignDescription] = useState('');
  const [language, setLanguage] = useState<"ASL" | "MSL" | "">("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  
  const {
    isStreaming,
    isRecording,
    isPaused,
    capturedImage,
    recordedVideo,
    videoRef,
    startCamera,
    stopCamera,
    startRecording,
    pauseRecording,
    stopRecording,
    captureImage,
    resetCapture
  } = useCamera();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to use the avatar generation feature"
      });
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleSaveClick = () => {
    if (!capturedImage && !recordedVideo) {
      toast.error("No Content", {
        description: "Please capture an image or record a video first"
      });
      return;
    }
    setShowForm(true);
  };

  const handleFormReset = () => {
    resetCapture();
    setSignName('');
    setSignDescription('');
    setLanguage("");
    setShowForm(false);
  };

  const saveToSignbank = async () => {
    if (!signName.trim()) {
      toast.error("Name Required", {
        description: "Please provide a name for your sign"
      });
      return;
    }

    if (!language) {
      toast.error("Language Required", {
        description: "Please select a sign language (ASL or MSL)"
      });
      return;
    }

    if (!currentUser) {
      toast.error("Login Required", {
        description: "Please log in to save your avatar"
      });
      return;
    }

    if (capturedImage || recordedVideo) {
      setIsLoading(true);
      try {
        // Get existing avatars from localStorage or initialize empty array
        const storedAvatars = localStorage.getItem('avatars');
        const avatars = storedAvatars ? JSON.parse(storedAvatars) : [];
        
        // Create new avatar object
        const newAvatar = {
          id: `avatar-${Date.now()}`,
          name: signName.trim(),
          description: signDescription.trim(),
          language,
          thumbnail: capturedImage,
          video: recordedVideo,
          userId: currentUser.id,
          userName: currentUser.name,
          status: "unverified",
          date: new Date().toISOString(),
        };
        
        // Save updated avatars to localStorage
        localStorage.setItem('avatars', JSON.stringify([newAvatar, ...avatars]));
        
        toast.success("Saved to My Avatar", {
          description: "Your gesture has been saved"
        });
        
        router.push('/avatar/my-avatars');
      } catch (error) {
        console.error("Error saving avatar:", error);
        toast.error("Save Failed", {
          description: "Unable to save your avatar. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <AvatarPageHeader userRole={currentUser?.role} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <CameraControls
            isStreaming={isStreaming}
            isRecording={isRecording}
            isPaused={isPaused}
            videoRef={videoRef}
            onStartCamera={startCamera}
            onStopCamera={stopCamera}
            onCaptureImage={captureImage}
            onStartRecording={startRecording}
            onPauseRecording={pauseRecording}
            onStopRecording={stopRecording}
          />

          <GesturePreview
            capturedImage={capturedImage}
            recordedVideo={recordedVideo}
            isLoading={isLoading}
            onReset={handleFormReset}
            onSave={handleSaveClick}
          />
        </div>

        {showForm && (
          <SaveForm
            signName={signName}
            setSignName={setSignName}
            signDescription={signDescription}
            setSignDescription={setSignDescription}
            language={language}
            setLanguage={setLanguage}
            isLoading={isLoading}
            onSave={saveToSignbank}
            onCancel={handleFormReset}
          />
        )}
      </div>
    </div>
  );
};

export default AvatarGenerationPage;
