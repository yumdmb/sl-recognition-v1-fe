"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GesturePreview from "@/components/avatar/GesturePreview";
import AvatarPageHeader from "@/components/avatar/AvatarPageHeader";
import SaveForm from "@/components/avatar/SaveForm";
import HandGestureDetector from "@/components/avatar/HandGestureDetector";
import { useCamera } from "@/hooks/useCamera";
import { Avatar3DRecording } from "@/types/hand";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";
import { signAvatarService } from "@/lib/services/signAvatarService";

const AvatarGenerationPage = () => {
  const [signName, setSignName] = useState("");
  const [signDescription, setSignDescription] = useState("");
  const [language, setLanguage] = useState<"ASL" | "MSL" | "">("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recorded3DAvatar, setRecorded3DAvatar] =
    useState<Avatar3DRecording | null>(null);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  const { isStreaming, videoRef, startCamera, stopCamera, resetCapture } =
    useCamera();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to use the avatar generation feature"
      });
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleRecordingComplete = useCallback((recording: Avatar3DRecording) => {
    setRecorded3DAvatar(recording);
    toast.success("3D Recording Complete", {
      description: `Recorded ${recording.frames.length} frames (${(recording.duration / 1000).toFixed(1)}s)`,
    });
  }, []);

  const handleCapturePose = useCallback((pose: Avatar3DRecording) => {
    setRecorded3DAvatar(pose);
    toast.success("3D Pose Captured", {
      description: `Captured ${pose.frames[0]?.landmarks.hands.length || 0} hand(s)`,
    });
  }, []);

  const handleSaveClick = () => {
    if (!recorded3DAvatar || recorded3DAvatar.frames.length === 0) {
      toast.error("No Content", {
        description: "Please record a 3D gesture first",
      });
      return;
    }
    setShowForm(true);
  };

  const handleFormReset = () => {
    resetCapture();
    setRecorded3DAvatar(null);
    setSignName("");
    setSignDescription("");
    setLanguage("");
    setCategoryId(null);
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

    if (recorded3DAvatar && recorded3DAvatar.frames.length > 0) {
      setIsLoading(true);
      try {
        await signAvatarService.create(
          {
            name: signName.trim(),
            description: signDescription.trim() || undefined,
            language: language as "ASL" | "MSL",
            recording: recorded3DAvatar,
            categoryId: categoryId,
          },
          currentUser.id
        );

        toast.success("Saved to My Avatar", {
          description: "Your 3D gesture avatar has been saved to the database",
        });

        router.push("/avatar/my-avatars");
      } catch (error) {
        console.error("Error saving avatar:", error);
        toast.error("Save Failed", {
          description: "Unable to save your avatar. Please try again.",
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
    <div className="container mx-auto p-3 md:p-6">
      <div className="flex flex-col gap-4 md:gap-6">
        <AvatarPageHeader userRole={currentUser?.role} />

        {/* Hidden video element - always rendered for camera stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
        />

        {/* Camera Start/Stop Button */}
        {!isStreaming ? (
          <div className="flex justify-center py-8">
            <Button onClick={startCamera} size="lg" className="gap-2 w-full md:w-auto">
              <Camera className="h-5 w-5" />
              Start Camera
            </Button>
          </div>
        ) : (
          <div className="relative">
            {/* Primary: 3D Avatar Visualization */}
            <HandGestureDetector
              videoRef={videoRef}
              isStreaming={isStreaming}
              onRecordingComplete={handleRecordingComplete}
              onCapturePose={handleCapturePose}
            />

            {/* Floating Camera Preview (toggleable) - responsive positioning */}
            {showCameraPreview && videoRef.current && (
              <div className="absolute top-4 right-2 md:top-16 md:right-4 w-32 md:w-48 rounded-lg overflow-hidden shadow-lg border-2 border-primary/50 bg-black z-10">
                <video
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                  ref={(el) => {
                    if (el && videoRef.current?.srcObject) {
                      el.srcObject = videoRef.current.srcObject;
                    }
                  }}
                />
              </div>
            )}

            {/* Camera Controls Bar - responsive layout */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mt-4 p-3 bg-muted rounded-lg gap-3 md:gap-0">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Switch
                  id="camera-preview"
                  checked={showCameraPreview}
                  onCheckedChange={setShowCameraPreview}
                />
                <Label htmlFor="camera-preview" className="text-sm">
                  Show Camera Preview
                </Label>
              </div>
              <Button
                onClick={stopCamera}
                variant="destructive"
                size="sm"
                className="gap-2 w-full md:w-auto"
              >
                <CameraOff className="h-4 w-4" />
                Stop Camera
              </Button>
            </div>
          </div>
        )}

        {/* Preview Section */}
        <GesturePreview
          recorded3DAvatar={recorded3DAvatar}
          isLoading={isLoading}
          onReset={handleFormReset}
          onSave={handleSaveClick}
        />

        {showForm && (
          <SaveForm
            signName={signName}
            setSignName={setSignName}
            signDescription={signDescription}
            setSignDescription={setSignDescription}
            language={language}
            setLanguage={setLanguage}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
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
