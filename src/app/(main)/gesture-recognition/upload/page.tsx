"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera as CameraIcon } from 'lucide-react'; // Renamed to avoid conflict
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Real-Time Gesture Recognition</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CameraIcon className="mr-2 h-5 w-5" /> Live Camera Feed
          </CardTitle>
          <CardDescription>
            Recognize gestures in real-time using your camera. Position your hand clearly in the frame.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <LanguageSelector
              language={language}
              onLanguageChange={(newLanguage) => {
                setLanguage(newLanguage);
                // Potentially restart camera or clear prediction if language changes while active
                // For now, CameraCapture component handles its own lifecycle based on isActive
              }}
            />
            <Button onClick={toggleCamera} variant={isCameraActive ? "destructive" : "default"}>
              {isCameraActive ? "Stop Camera" : "Start Camera"}
            </Button>
          </div>
          
          {/*
            The CameraCapture component will be modified to accept 'language' prop
            if its internal prediction logic needs it.
            For now, we pass `isActive` to control the camera stream.
          */}
          <CameraCapture isActive={isCameraActive} language={language} />
          
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeGestureRecognition;
