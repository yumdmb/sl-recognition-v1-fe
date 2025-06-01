'use client'

import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Video } from 'lucide-react';
import { toast } from "sonner";

interface CameraCaptureProps {
  mediaType: 'image' | 'video';
  isRecording: boolean;
  onMediaCaptured: (file: File, previewUrl: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
}

export default function CameraCapture({ 
  mediaType, 
  isRecording, 
  onMediaCaptured, 
  onRecordingStateChange 
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: mediaType === 'video'
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Camera Error", {
        description: "Failed to access camera. Please check permissions."
      });
    }
  };

  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(videoRef.current.srcObject as MediaStream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], 'recording.webm', { type: 'video/webm' });
        const previewUrl = URL.createObjectURL(blob);
        onMediaCaptured(file, previewUrl);
      };

      mediaRecorder.start();
      onRecordingStateChange(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      onRecordingStateChange(false);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(blob);
          onMediaCaptured(file, previewUrl);
        }
      }, 'image/jpeg');
      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
      </div>
      
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={startCamera}
              className="flex items-center"
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            {mediaType === 'image' ? (
              <Button
                type="button"
                onClick={captureImage}
                className="flex items-center"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture Image
              </Button>
            ) : (
              <Button
                type="button"
                onClick={startRecording}
                className="flex items-center"
              >
                <Video className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}
          </>
        ) : (
          <Button
            type="button"
            variant="destructive"
            onClick={stopRecording}
            className="flex items-center"
          >
            <Video className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
}
