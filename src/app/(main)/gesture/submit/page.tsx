'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    categoryId,
    setCategoryId,
    categories,
    
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
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <GestureSubmitHeader />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Gesture Details</CardTitle>
          <CardDescription>
            Fill in the details about the gesture you want to contribute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <GestureFormFields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              language={language}
              setLanguage={setLanguage}
              mediaType={mediaType}
              setMediaType={setMediaType}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              categories={categories}
            />

            <div className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="upload" className="py-2.5">Upload File</TabsTrigger>
                  <TabsTrigger value="capture" className="py-2.5">
                    Capture {mediaType === 'image' ? 'Image' : 'Video'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-4">
                  <GestureFileUpload
                    mediaType={mediaType}
                    onFileChange={handleFileChange}
                  />
                </TabsContent>
                
                <TabsContent value="capture" className="mt-4">
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
              className="w-full md:w-auto md:min-w-[200px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
