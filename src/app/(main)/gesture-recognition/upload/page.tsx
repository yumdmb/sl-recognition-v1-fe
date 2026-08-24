"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Camera as CameraIcon, ScanFace, CircleStop } from 'lucide-react';
import { LanguageSelector } from '@/components/gesture-recognition/LanguageSelector';
import { CameraCapture } from '@/components/gesture-recognition/CameraCapture';
import { Button } from '@/components/ui/button';

const RealTimeGestureRecognition: React.FC = () => {
  const [language, setLanguage] = useState<"ASL" | "MSL">("ASL");
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Automatically activate camera on component mount for a smoother UX
  useEffect(() => {
    setIsCameraActive(true);
  }, []);

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Gesture Recognition
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
            Real-Time Gesture Recognition
          </h1>
          <p className="mt-1.5 max-w-xl text-muted-foreground">
            Recognize gestures in real-time using your camera. Position your hand clearly in the frame.
          </p>
        </div>
        <Button
          onClick={toggleCamera}
          variant={isCameraActive ? "outline" : "default"}
          className="rounded-full"
        >
          {isCameraActive ? (
            <>
              <CircleStop className="mr-2 h-4 w-4 text-destructive" />
              Stop Camera
            </>
          ) : (
            <>
              <CameraIcon className="mr-2 h-4 w-4" />
              Start Camera
            </>
          )}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="mt-8 rounded-2xl shadow-soft">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <ScanFace className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">Live Camera Feed</h2>
                <p className="text-xs text-muted-foreground">
                  Frames are analysed automatically while the camera is running.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/40 p-5">
              <LanguageSelector
                language={language}
                onLanguageChange={(newLanguage) => {
                  setLanguage(newLanguage);
                }}
              />

              <div className="mt-4">
                <CameraCapture isActive={isCameraActive} language={language} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RealTimeGestureRecognition;
