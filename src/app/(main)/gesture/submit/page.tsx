'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GestureSubmitHeader from '@/components/gesture/GestureSubmitHeader';
import GestureFormFields from '@/components/gesture/GestureFormFields';
import GestureFileUpload from '@/components/gesture/GestureFileUpload';
import GestureCameraCapture from '@/components/gesture/GestureCameraCapture';
import GestureMediaPreview from '@/components/gesture/GestureMediaPreview';
import { useGestureContributionSubmission } from '@/hooks/useGestureContributionSubmission';

export default function GestureSubmit() {
  const {
    // Form state
    title,
    setTitle,
    description,
    setDescription,
    language,
    setLanguage,
    mediaType,
    setMediaType,
    
    // Media state
    previewUrl,
    isRecording,
    
    // Submission state
    isSubmitting,
    
    // Handlers
    handleFileChange,
    handleMediaCaptured,
    handleRecordingStateChange,
    handleSubmit
  } = useGestureContributionSubmission();

  return (
    <div className="container max-w-2xl py-6">
      <Toaster />
      <GestureSubmitHeader />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <GestureFormFields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              language={language}
              setLanguage={setLanguage}
              mediaType={mediaType}
              setMediaType={setMediaType}
            />

            <div className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="capture">Capture {mediaType === 'image' ? 'Image' : 'Video'}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <GestureFileUpload
                    mediaType={mediaType}
                    onFileChange={handleFileChange}
                  />
                </TabsContent>
                
                <TabsContent value="capture" className="space-y-4">
                  <GestureCameraCapture
                    mediaType={mediaType}
                    isRecording={isRecording}
                    onMediaCaptured={handleMediaCaptured}
                    onRecordingStateChange={handleRecordingStateChange}
                  />
                </TabsContent>
              </Tabs>

              <GestureMediaPreview
                previewUrl={previewUrl}
                mediaType={mediaType}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Gesture Contribution'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
