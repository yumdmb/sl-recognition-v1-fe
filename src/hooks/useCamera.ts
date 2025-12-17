"use client";

import { useState, useRef, useCallback } from 'react';
import { toast } from "sonner";

export const useCamera = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = useCallback(async () => {
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
          // Try different codecs in order of preference
          const mimeTypes = [
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp8,opus",
            "video/webm;codecs=vp9",
            "video/webm;codecs=vp8",
            "video/webm",
            "video/mp4",
          ];

          let selectedMimeType = "";
          for (const mimeType of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
              selectedMimeType = mimeType;
              break;
            }
          }

          const recorderOptions: MediaRecorderOptions = selectedMimeType
            ? { mimeType: selectedMimeType }
            : {};

          const mediaRecorder = new MediaRecorder(stream, recorderOptions);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, {
              type: selectedMimeType || "video/webm",
            });
            const videoUrl = URL.createObjectURL(blob);
            setRecordedVideo(videoUrl);
            chunksRef.current = [];
          };

          mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder error:", event);
            toast.error("Recording Error", {
              description:
                "An error occurred while recording. Please try again.",
            });
          };
        } catch (error) {
          console.error("MediaRecorder initialization error:", error);
          toast.error("Recording Setup Failed", {
            description:
              "Your browser may not support video recording. Try using a different browser.",
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
  }, []);

  const stopCamera = useCallback(() => {
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
  }, []);

  const startRecording = useCallback(() => {
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
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
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
  }, [isRecording, isPaused]);

  const stopRecording = useCallback(() => {
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
  }, [isRecording]);

  const captureImage = useCallback(() => {
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
  }, []);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setRecordedVideo(null);
  }, []);

  return {
    // States
    isStreaming,
    isRecording,
    isPaused,
    capturedImage,
    recordedVideo,
    
    // Refs
    videoRef,
    
    // Actions
    startCamera,
    stopCamera,
    startRecording,
    pauseRecording,
    stopRecording,
    captureImage,
    resetCapture
  };
};
