'use client'

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Video } from 'lucide-react';

interface MediaUploadTabsProps {
  mediaType: 'image' | 'video';
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartCamera: () => void;
  onCaptureImage: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const MediaUploadTabs: React.FC<MediaUploadTabsProps> = ({
  mediaType,
  videoRef,
  isRecording,
  onFileChange,
  onStartCamera,
  onCaptureImage,
  onStartRecording,
  onStopRecording
}) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="capture">Capture {mediaType === 'image' ? 'Image' : 'Video'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="media">Upload {mediaType === 'image' ? 'Image' : 'Video'}</Label>
            <Input
              id="media"
              type="file"
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={onFileChange}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="capture" className="space-y-4">
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
                    onClick={onStartCamera}
                    className="flex items-center"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                  {mediaType === 'image' ? (
                    <Button
                      type="button"
                      onClick={onCaptureImage}
                      className="flex items-center"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Image
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={onStartRecording}
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
                  onClick={onStopRecording}
                  className="flex items-center"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaUploadTabs;
