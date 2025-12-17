"use client";

import { useState, useRef, useCallback } from "react";
import {
  MultiHandLandmarks,
  RecordedFrame,
  Avatar3DRecording,
} from "@/types/hand";

export type RecordingDuration = 3 | 5 | 10 | "manual";

export const useAvatar3DRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAvatar, setRecordedAvatar] =
    useState<Avatar3DRecording | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const framesRef = useRef<RecordedFrame[]>([]);
  const startTimeRef = useRef<number>(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentLandmarksRef = useRef<MultiHandLandmarks | null>(null);

  // Update current landmarks (called from parent component)
  const updateLandmarks = useCallback((landmarks: MultiHandLandmarks | null) => {
    currentLandmarksRef.current = landmarks;
  }, []);

  // Record a single frame
  const recordFrame = useCallback(() => {
    if (currentLandmarksRef.current && currentLandmarksRef.current.hands.length > 0) {
      const frame: RecordedFrame = {
        timestamp: Date.now() - startTimeRef.current,
        landmarks: {
          hands: currentLandmarksRef.current.hands.map((hand) => ({
            landmarks: hand.landmarks.map((l) => ({ x: l.x, y: l.y, z: l.z })),
            handedness: hand.handedness,
          })),
        },
      };
      framesRef.current.push(frame);
      setElapsedTime(frame.timestamp);
    }
  }, []);


  // Stop recording
  const stopRecording = useCallback(() => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    const endTime = Date.now();
    const recording: Avatar3DRecording = {
      frames: [...framesRef.current],
      duration: endTime - startTimeRef.current,
      startTime: startTimeRef.current,
    };

    setRecordedAvatar(recording);
    setIsRecording(false);
    setCountdown(null);
  }, []);

  // Start recording
  const startRecording = useCallback(
    (duration: RecordingDuration) => {
      framesRef.current = [];
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordedAvatar(null);
      setElapsedTime(0);

      // Record frames at ~30fps
      recordingIntervalRef.current = setInterval(() => {
        recordFrame();
      }, 33);

      // If timed recording, set up auto-stop
      if (duration !== "manual") {
        const durationMs = duration * 1000;
        setCountdown(duration);

        countdownIntervalRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev === null || prev <= 1) {
              return null;
            }
            return prev - 1;
          });
        }, 1000);

        setTimeout(() => {
          stopRecording();
        }, durationMs);
      }
    },
    [recordFrame, stopRecording]
  );

  // Reset recording
  const resetRecording = useCallback(() => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    framesRef.current = [];
    setRecordedAvatar(null);
    setIsRecording(false);
    setCountdown(null);
    setElapsedTime(0);
  }, []);

  return {
    isRecording,
    recordedAvatar,
    countdown,
    elapsedTime,
    startRecording,
    stopRecording,
    resetRecording,
    updateLandmarks,
  };
};
