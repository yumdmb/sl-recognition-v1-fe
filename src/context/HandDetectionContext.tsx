"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface HandDetectionContextType {
  handLandmarker: HandLandmarker | null;
  isLoading: boolean;
  error: string | null;
}

const HandDetectionContext = createContext<HandDetectionContextType | undefined>(undefined);

export const HandDetectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeHandDetector = async () => {
      try {
        console.log(" Preloading MediaPipe Hand Landmarker...");
        
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        // Try GPU first, fallback to CPU if GPU fails
        // Chrome/Edge may have stricter WebGL policies than Firefox
        let landmarker: HandLandmarker | null = null;
        
        try {
          console.log("🎮 Attempting GPU delegate...");
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
              delegate: "GPU",
            },
            numHands: 2,
            runningMode: "VIDEO",
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          console.log(" GPU delegate initialized successfully!");
        } catch (gpuError) {
          console.warn(" GPU delegate failed, falling back to CPU:", gpuError);
          
          // Fallback to CPU delegate
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
              delegate: "CPU",
            },
            numHands: 2,
            runningMode: "VIDEO",
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          console.log(" CPU delegate initialized as fallback!");
        }

        setHandLandmarker(landmarker);
        setIsLoading(false);
        console.log(" MediaPipe Hand Landmarker ready!");
      } catch (err) {
        console.error(" Error initializing hand detector:", err);
        setError(err instanceof Error ? err.message : "Failed to load hand detection model");
        setIsLoading(false);
      }
    };

    void initializeHandDetector();

    return () => {
      // Cleanup is handled by the model itself
      // HandLandmarker doesn't have a close() method in this version
    };
  }, []);

  return (
    <HandDetectionContext.Provider value={{ handLandmarker, isLoading, error }}>
      {children}
    </HandDetectionContext.Provider>
  );
};

export const useHandDetectionContext = () => {
  const context = useContext(HandDetectionContext);
  if (context === undefined) {
    throw new Error("useHandDetectionContext must be used within HandDetectionProvider");
  }
  return context;
};
