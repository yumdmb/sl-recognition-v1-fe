'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Video, Square, Pause, VideoOff } from "lucide-react";

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
    <Card className="col-span-4 gap-0 pb-6">
      <CardHeader>
        <div className="flex items-center gap-3.5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Camera className="size-5" />
          </span>
          <div>
            <CardTitle className="font-display text-lg font-bold">Camera Feed</CardTitle>
            <CardDescription>Your real-time camera input for gesture recognition</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Camera frame */}
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink shadow-lift">
          <div className="bg-dots absolute inset-0 opacity-20" aria-hidden />

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="relative h-full w-full object-cover"
          />

          {!isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-mint-soft">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
                <VideoOff className="size-6" />
              </span>
              <p className="text-sm font-medium">Camera is off</p>
              <p className="text-xs text-mint-soft/60">
                Start the camera to capture or record your gesture
              </p>
            </div>
          )}

          {isRecording && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-coral backdrop-blur-sm">
              <span className="size-2 animate-pulse rounded-full bg-coral" />
              {isPaused ? "Paused" : "Recording"}
            </span>
          )}

          {/* Overlay controls */}
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-center gap-2 rounded-full border border-mint-soft/15 bg-ink/70 px-3 py-2 backdrop-blur-md">
            {!isStreaming ? (
              <Button onClick={onStartCamera} className="gap-2 rounded-full">
                <Camera className="h-4 w-4" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button onClick={onStopCamera} variant="destructive" className="gap-2 rounded-full">
                  <Square className="h-4 w-4" />
                  Stop Camera
                </Button>
                <Button onClick={onCaptureImage} className="gap-2 rounded-full">
                  <Camera className="h-4 w-4" />
                  Capture Image
                </Button>
                {!isRecording ? (
                  <Button onClick={onStartRecording} className="gap-2 rounded-full">
                    <Video className="h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <>
                    <Button onClick={onPauseRecording} className="gap-2 rounded-full">
                      <Pause className="h-4 w-4" />
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button onClick={onStopRecording} variant="destructive" className="gap-2 rounded-full">
                      <Square className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraControls;
