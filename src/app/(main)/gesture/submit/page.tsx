'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera } from 'lucide-react';
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
    handleClearMedia,
    handleSubmit
  } = useGestureContributionSubmission();

  return (
    <div className="container max-w-2xl py-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="rounded-2xl shadow-soft">
          <GestureSubmitHeader />
          <CardContent className="pt-2">
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
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2 py-2.5">
                      <Upload className="h-4 w-4" /> Upload File
                    </TabsTrigger>
                    <TabsTrigger value="capture" className="flex items-center gap-2 py-2.5">
                      <Camera className="h-4 w-4" /> Capture {mediaType === 'image' ? 'Image' : 'Video'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-4 space-y-4">
                    <GestureFileUpload
                      mediaType={mediaType}
                      onFileChange={handleFileChange}
                    />
                  </TabsContent>

                  <TabsContent value="capture" className="mt-4 space-y-4">
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
                  onClearMedia={handleClearMedia}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Gesture Contribution'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
