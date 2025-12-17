"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera } from 'lucide-react';
import { FileUploadArea } from './FileUploadArea';
import GestureCameraCapture from '@/components/gesture/GestureCameraCapture';

interface UploadTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onPhotoCapture: (file: File, previewUrl: string) => void;
}

export const UploadTabs: React.FC<UploadTabsProps> = ({
  activeTab,
  onTabChange,
  previewUrl,
  onFileChange,
  onRemoveFile,
  onPhotoCapture
}) => {
  const [isRecording, setIsRecording] = useState(false);
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full mb-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload" className="flex items-center">
          <Upload className="mr-2 h-4 w-4" /> Upload
        </TabsTrigger>
        <TabsTrigger value="camera" className="flex items-center">
          <Camera className="mr-2 h-4 w-4" /> Camera
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="space-y-4">
        <FileUploadArea
          previewUrl={previewUrl}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
        />
      </TabsContent>
      
      <TabsContent value="camera">
        <GestureCameraCapture
          mediaType="image"
          isRecording={isRecording}
          onMediaCaptured={onPhotoCapture}
          onRecordingStateChange={setIsRecording}
        />
      </TabsContent>
    </Tabs>
  );
};
