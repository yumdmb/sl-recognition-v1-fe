"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCamera } from "@/hooks/useCamera";
import AvatarPageHeader from '@/components/avatar/AvatarPageHeader';
import CameraControls from '@/components/avatar/CameraControls';
import GesturePreview from '@/components/avatar/GesturePreview';
import SaveForm from '@/components/avatar/SaveForm';

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

  const handleSave = async () => {
    if (!signName.trim()) {
      toast.error("Sign name is required");
      return;
    }

    if (!language) {
      toast.error("Please select a language");
      return;
    }

    if (!capturedImage && !recordedVideo) {
      toast.error("Please capture an image or record a video");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate save process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Gesture Saved!", {
        description: `Your ${language} gesture for "${signName}" has been saved successfully.`
      });

      // Reset form
      setSignName('');
      setSignDescription('');
      setLanguage('');
      setShowForm(false);      resetCapture();
      stopCamera();

    } catch (error) {
      console.error("Error saving gesture:", error);
      toast.error("Save Failed", {
        description: "There was an error saving your gesture. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowForm = () => {
    if (!capturedImage && !recordedVideo) {
      toast.error("No Content", {
        description: "Please capture an image or record a video before saving"
      });
      return;
    }
    setShowForm(true);
  };
  const handleDiscard = () => {
    resetCapture();
    setShowForm(false);
    setSignName('');
    setSignDescription('');
    setLanguage('');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AvatarPageHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CameraControls
          videoRef={videoRef}
          isStreaming={isStreaming}
          isRecording={isRecording}
          isPaused={isPaused}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          onStartRecording={startRecording}
          onPauseRecording={pauseRecording}
          onStopRecording={stopRecording}
          onCaptureImage={captureImage}
        />        <GesturePreview
          capturedImage={capturedImage}
          recordedVideo={recordedVideo}
          isLoading={isLoading}
          onReset={handleDiscard}
          onSave={handleShowForm}
        />
      </div>

      {showForm && (        <SaveForm
          signName={signName}
          setSignName={setSignName}
          signDescription={signDescription}
          setSignDescription={setSignDescription}
          language={language}
          setLanguage={setLanguage}
          isLoading={isLoading}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default AvatarGenerationPage;