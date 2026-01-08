"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Hand3D } from "./Hand3D";
import { Avatar3DRecording, MultiHandLandmarks } from "@/types/hand";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Avatar3DPlayerProps {
  recording: Avatar3DRecording;
}

export const Avatar3DPlayer: React.FC<Avatar3DPlayerProps> = ({ recording }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [currentLandmarks, setCurrentLandmarks] =
    useState<MultiHandLandmarks | null>(null);

  const totalFrames = recording.frames.length;

  // Reset to first frame
  const reset = useCallback(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    if (recording.frames.length > 0) {
      setCurrentLandmarks(recording.frames[0].landmarks);
    }
  }, [recording.frames]);

  // Initialize with first frame
  useEffect(() => {
    if (recording.frames.length > 0) {
      setCurrentLandmarks(recording.frames[0].landmarks);
    }
  }, [recording]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying || totalFrames === 0) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        const next = prev + 1;
        if (next >= totalFrames) {
          setIsPlaying(false);
          return 0; // Loop back to start
        }
        return next;
      });
    }, 33); // ~30fps

    return () => clearInterval(interval);
  }, [isPlaying, totalFrames]);


  // Update landmarks when frame changes
  useEffect(() => {
    if (recording.frames[currentFrameIndex]) {
      setCurrentLandmarks(recording.frames[currentFrameIndex].landmarks);
    }
  }, [currentFrameIndex, recording.frames]);

  const togglePlay = () => {
    if (currentFrameIndex >= totalFrames - 1) {
      setCurrentFrameIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const progress = totalFrames > 0 ? (currentFrameIndex / totalFrames) * 100 : 0;
  const currentTime = recording.frames[currentFrameIndex]?.timestamp || 0;
  const totalTime = recording.duration;

  // Check if this is a single frame capture (pose) vs multi-frame recording (video)
  const isSingleFrame = totalFrames <= 1;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 rounded-lg overflow-hidden">
        <Hand3D multiHandLandmarks={currentLandmarks} enableControls={false} />
      </div>

      {/* Playback controls - only show for multi-frame recordings */}
      {!isSingleFrame && (
        <div className="mt-2 space-y-2">
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">
              {(currentTime / 1000).toFixed(1)}s / {(totalTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar3DPlayer;
