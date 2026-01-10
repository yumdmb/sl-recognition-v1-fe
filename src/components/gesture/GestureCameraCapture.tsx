'use client'

import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';
import { toast } from "sonner";

interface GestureCameraCaptureProps {
  mediaType: 'image' | 'video';
  isRecording: boolean;
  onMediaCaptured: (file: File, previewUrl: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
}

export default function GestureCameraCapture({ 
  mediaType, 
  isRecording, 
  onMediaCaptured, 
  onRecordingStateChange 
}: GestureCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isCameraActive, setIsCameraActive] = React.useState(false);

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
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Camera Error", {
        description: "Failed to access camera. Please check permissions."
      });
      setIsCameraActive(false);
    }
  };
  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      chunksRef.current = [];
      
      // Try different MIME types in order of preference
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      
      let options = {};
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          options = { mimeType };
          console.log(`Using supported MIME type: ${mimeType}`);
          break;
        }
      }
      
      try {
        const mediaRecorder = new MediaRecorder(videoRef.current.srcObject as MediaStream, options);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data);
            console.log(`Received data chunk: ${e.data.size} bytes`);
          }
        };

        mediaRecorder.onstop = () => {
          console.log(`Recording stopped. Total chunks: ${chunksRef.current.length}`);
          if (chunksRef.current.length === 0) {
            toast.error("Recording Error", {
              description: "No video data was captured. Please try again."
            });
            return;
          }
          
          // Determine output format based on browser support
          const mimeType = mediaRecorder.mimeType || 'video/webm';
          const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          
          const blob = new Blob(chunksRef.current, { type: mimeType });
          console.log(`Created blob: ${blob.size} bytes, type: ${mimeType}`);
          
          const file = new File([blob], `gesture-recording.${fileExtension}`, { 
            type: mimeType,
            lastModified: Date.now()
          });
          
          const previewUrl = URL.createObjectURL(blob);
          onMediaCaptured(file, previewUrl);
        };
        
        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          toast.error("Recording Error", { 
            description: "An error occurred during recording. Please try again." 
          });
        };

        // Request data every second to ensure we get data even if stop fails
        mediaRecorder.start(1000);
        console.log("MediaRecorder started");
        onRecordingStateChange(true);
      } catch (error) {
        console.error("Failed to create MediaRecorder:", error);
        toast.error("Recording Error", {
          description: "Your browser may not support video recording. Try using Chrome or Firefox."
        });
      }
    } else {
      toast.error("Camera Error", {
        description: "Camera is not available. Please start the camera first."
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      onRecordingStateChange(false);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraActive(false);
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
          const file = new File([blob], 'gesture-capture.jpg', { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(blob);
          onMediaCaptured(file, previewUrl);
        }
      }, 'image/jpeg');
      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraActive(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-muted/50 rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20 shadow-inner group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
          autoPlay
          playsInline
        />
        {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/10 backdrop-blur-sm">
                <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Camera is off</p>
                </div>
            </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={startCamera}
              className="flex items-center hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            {mediaType === 'image' ? (
              <Button
                type="button"
                onClick={captureImage}
                disabled={!isCameraActive}
                className="flex items-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <div className="w-4 h-4 rounded-full border-2 border-current mr-2 bg-transparent" />
                Capture Image
              </Button>
            ) : (
              <Button
                type="button"
                onClick={startRecording}
                disabled={!isCameraActive}
                className="flex items-center bg-destructive hover:bg-destructive/90 text-white"
              >
                <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white mr-2 animate-pulse" />
                Start Recording
              </Button>
            )}
          </>
        ) : (
          <Button
            type="button"
            variant="destructive"
            onClick={stopRecording}
            className="flex items-center shadow-lg shadow-destructive/20 animate-pulse"
          >
            <div className="w-4 h-4 rounded-sm bg-white mr-2" />
            Stop Recording
          </Button>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground text-center italic bg-primary/5 p-2 rounded-lg">
        {mediaType === 'image' 
          ? 'Position yourself clearly in the frame and capture the gesture at the right moment.'
          : 'Record a clear demonstration of the gesture. Keep the video under 30 seconds for best results.'
        }
      </div>
    </div>
  );
}
