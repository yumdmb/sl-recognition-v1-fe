'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Video, Square, Pause } from "lucide-react";

interface CameraControlsProps {
  isStreaming: boolean;
  isRecording: boolean;
  isPaused: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCaptureImage: () => void;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isStreaming,
  isRecording,
  isPaused,
  videoRef,
  onStartCamera,
  onStopCamera,
  onCaptureImage,
  onStartRecording,
  onPauseRecording,
  onStopRecording
}) => {
  return (
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
            <Button onClick={onStartCamera} className="gap-2">
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <>
              <Button onClick={onStopCamera} variant="destructive" className="gap-2">
                <Square className="h-4 w-4" />
                Stop Camera
              </Button>
              <Button onClick={onCaptureImage} className="gap-2">
                <Camera className="h-4 w-4" />
                Capture Image
              </Button>
              {!isRecording ? (
                <Button onClick={onStartRecording} className="gap-2">
                  <Video className="h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button onClick={onPauseRecording} className="gap-2">
                    <Pause className="h-4 w-4" />
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button onClick={onStopRecording} variant="destructive" className="gap-2">
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
  );
};

export default CameraControls;
