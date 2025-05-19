"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, User, Save, Video, Pause, Square } from 'lucide-react';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AvatarGenerationPage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [signName, setSignName] = useState('');
  const [signDescription, setSignDescription] = useState('');
  const [language, setLanguage] = useState<"ASL" | "MSL" | "">("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to use the avatar generation feature"
      });
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        
        try {
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9,opus'
          });
          mediaRecorderRef.current = mediaRecorder;
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
            }
          };
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);
            setRecordedVideo(videoUrl);
            chunksRef.current = [];
          };

          mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder error:", event);
            toast.error("Recording Error", {
              description: "An error occurred while recording. Please try again."
            });
          };
        } catch (error) {
          console.error("MediaRecorder initialization error:", error);
          toast.error("Recording Setup Failed", {
            description: "Your browser may not support video recording. Try using a different browser."
          });
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        toast.error("Camera Access Denied", {
          description: "Please allow camera access to use this feature"
        });
      } else {
        toast.error("Camera Error", {
          description: "Could not access your camera. Please check permissions and make sure no other app is using the camera."
        });
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
      setIsStreaming(false);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      try {
        chunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setIsPaused(false);
        toast.success("Recording Started", {
          description: "Video recording has begun"
        });
      } catch (error) {
        console.error("Error starting recording:", error);
        toast.error("Recording Error", {
          description: "Failed to start recording. Please try again."
        });
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        if (isPaused) {
          mediaRecorderRef.current.resume();
          setIsPaused(false);
          toast.success("Recording Resumed", {
            description: "Video recording has resumed"
          });
        } else {
          mediaRecorderRef.current.pause();
          setIsPaused(true);
          toast.success("Recording Paused", {
            description: "Video recording is paused"
          });
        }
      } catch (error) {
        console.error("Error pausing/resuming recording:", error);
        toast.error("Recording Error", {
          description: "Failed to pause/resume recording. Please try again."
        });
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsPaused(false);
        toast.success("Recording Stopped", {
          description: "Video has been recorded"
        });
      } catch (error) {
        console.error("Error stopping recording:", error);
        toast.error("Recording Error", {
          description: "Failed to stop recording. Please try again."
        });
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current) {
      toast.error("Camera Error", {
        description: "Camera is not available. Please start the camera first."
      });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        toast.success("Image Captured", {
          description: "Gesture image has been captured"
        });
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      toast.error("Capture Error", {
        description: "Failed to capture image. Please try again."
      });
    }
  };

  const handleSaveClick = () => {
    if (!capturedImage && !recordedVideo) {
      toast.error("No Content", {
        description: "Please capture an image or record a video first"
      });
      return;
    }
    setShowForm(true);
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

  const resetCapture = () => {
    setCapturedImage(null);
    setRecordedVideo(null);
    setSignName('');
    setSignDescription('');
    setLanguage("");
    setShowForm(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Avatar Generation</h1>
            <p className="text-muted-foreground">Generate 3D avatars from your sign language gestures</p>
          </div>
          <Button 
            onClick={() => router.push(currentUser?.role === 'admin' ? '/avatar/admin-database' : '/avatar/my-avatars')}
            variant="outline"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {currentUser?.role === 'admin' ? 'View Avatar Database' : 'View My Avatar'}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Camera Feed</CardTitle>
              <CardDescription>Your real-time camera input for gesture recognition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {!isStreaming ? (
                  <Button onClick={startCamera} className="gap-2">
                    <Camera className="h-4 w-4" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="destructive" className="gap-2">
                      <Square className="h-4 w-4" />
                      Stop Camera
                    </Button>
                    <Button onClick={captureImage} className="gap-2">
                      <Camera className="h-4 w-4" />
                      Capture Image
                    </Button>
                    {!isRecording ? (
                      <Button onClick={startRecording} className="gap-2">
                        <Video className="h-4 w-4" />
                        Start Recording
                      </Button>
                    ) : (
                      <>
                        <Button onClick={pauseRecording} className="gap-2">
                          <Pause className="h-4 w-4" />
                          {isPaused ? "Resume" : "Pause"}
                        </Button>
                        <Button onClick={stopRecording} variant="destructive" className="gap-2">
                          <Square className="h-4 w-4" />
                          Stop Recording
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your captured gesture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured gesture"
                    className="w-full h-full object-cover"
                  />
                ) : recordedVideo ? (
                  <video
                    src={recordedVideo}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No preview available
                  </div>
                )}
              </div>
              {capturedImage || recordedVideo ? (
                <div className="flex justify-between">
                  <Button onClick={resetCapture} variant="outline">
                    Reset
                  </Button>
                  <Button onClick={handleSaveClick} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save to Signbank"}
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Save Gesture</CardTitle>
              <CardDescription>Provide details about your sign language gesture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={signName}
                    onChange={(e) => setSignName(e.target.value)}
                    placeholder="Enter gesture name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={(value: "ASL" | "MSL") => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                      <SelectItem value="MSL">Malaysian Sign Language (MSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={signDescription}
                    onChange={(e) => setSignDescription(e.target.value)}
                    placeholder="Enter gesture description"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button onClick={resetCapture} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={saveToSignbank} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AvatarGenerationPage; 