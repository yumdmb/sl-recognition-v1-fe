"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';
import { toast } from "sonner";

interface CameraCaptureProps {
  isActive: boolean;
  onPhotoCapture: (file: File, previewUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isActive,
  onPhotoCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      toast.error("Camera Error", {
        description: "Unable to access camera. Please check permissions."
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
          const previewUrl = URL.createObjectURL(blob);
          onPhotoCapture(file, previewUrl);
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <video 
          ref={videoRef} 
          autoPlay 
          className="w-full rounded-lg border border-gray-200" 
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <Button 
        onClick={takePhoto} 
        className="w-full"
      >
        <Camera className="mr-2 h-4 w-4" /> Take Photo
      </Button>
    </div>
  );
};
