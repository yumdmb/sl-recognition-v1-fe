"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, Clapperboard, BookmarkPlus, Loader2 } from "lucide-react";
import { signAvatarService } from "@/lib/services/signAvatarService";

const steps = [
  { icon: Camera, title: "Start the camera", blurb: "Allow browser access and frame your gesture." },
  { icon: Clapperboard, title: "Capture or record", blurb: "Snap a pose or record a short 3D clip." },
  { icon: BookmarkPlus, title: "Save to Signbank", blurb: "Name it, pick a language, done." },
];

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
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6">
      <div className="flex flex-col gap-4 md:gap-6">
        <AvatarPageHeader userRole={currentUser?.role} />

        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <step.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    <span className="text-primary">{i + 1}.</span> {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.blurb}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Hidden video element - always rendered for camera stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        >
          {/* Camera Controls - botanical card */}
          <Card className="col-span-4 gap-0 pb-6 rounded-2xl shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-3.5">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Camera className="size-5" />
                </span>
                <div>
                  <CardTitle className="font-display text-lg font-bold">Camera Feed</CardTitle>
                  <CardDescription>Your real-time input for 3D gesture capture</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isStreaming ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-ink py-10 text-mint-soft shadow-lift">
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <Camera className="size-6" />
                  </span>
                  <p className="text-sm font-medium">Camera is off</p>
                  <p className="text-xs text-mint-soft/60">Start the camera to capture your 3D gesture</p>
                  <Button onClick={startCamera} size="lg" className="mt-2 gap-2 rounded-full">
                    <Camera className="h-5 w-5" />
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {/* Primary: 3D Avatar Visualization */}
                  <div className="overflow-hidden rounded-2xl">
                    <HandGestureDetector
                      videoRef={videoRef}
                      isStreaming={isStreaming}
                      onRecordingComplete={handleRecordingComplete}
                      onCapturePose={handleCapturePose}
                    />
                  </div>

                  {/* Floating Camera Preview (toggleable) - responsive positioning */}
                  {showCameraPreview && videoRef.current && (
                    <div className="absolute top-4 right-2 md:top-4 md:right-4 w-32 md:w-48 rounded-xl overflow-hidden shadow-lg border-2 border-primary/50 bg-black z-10">
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

                  {/* Camera Controls Bar - botanical */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mt-4 p-3 bg-muted rounded-2xl gap-3 md:gap-0 border border-border">
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
                      className="gap-2 rounded-full"
                    >
                      <CameraOff className="h-4 w-4" />
                      Stop Camera
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section - botanical */}
          <GesturePreview
            recorded3DAvatar={recorded3DAvatar}
            isLoading={isLoading}
            onReset={handleFormReset}
            onSave={handleSaveClick}
          />
        </motion.div>

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
