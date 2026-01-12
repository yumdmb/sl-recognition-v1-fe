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
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-8"
    >
      <GestureSubmitHeader />
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Media Capture & Preview */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="overflow-hidden border-border/50 shadow-lg bg-background/50 backdrop-blur-xl">
                <CardHeader className="pb-4 bg-muted/20">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <span className="bg-primary/10 p-2 rounded-lg text-primary">
                            {mediaType === 'image' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                            )}
                        </span>
                        Gesture Media
                    </CardTitle>
                    <CardDescription>Upload or record your gesture demonstration</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {!previewUrl ? (
                    <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-xl">
                        <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">Upload File</TabsTrigger>
                        <TabsTrigger value="capture" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                            Capture {mediaType === 'image' ? 'Image' : 'Video'}
                        </TabsTrigger>
                        </TabsList>
                        
                        <div className="bg-background/40 p-4 rounded-xl border border-border/40">
                            <TabsContent value="upload" className="mt-0">
                                <GestureFileUpload
                                    mediaType={mediaType}
                                    onFileChange={handleFileChange}
                                />
                            </TabsContent>
                            
                            <TabsContent value="capture" className="mt-0">
                                <GestureCameraCapture
                                    mediaType={mediaType}
                                    isRecording={isRecording}
                                    onMediaCaptured={handleMediaCaptured}
                                    onRecordingStateChange={handleRecordingStateChange}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                    ) : (
                    <GestureMediaPreview
                        previewUrl={previewUrl}
                        mediaType={mediaType}
                        onClearMedia={handleClearMedia}
                    />
                    )}
                </CardContent>
                </Card>
            </motion.div>
          </div>

          {/* Right Column - Gesture Details */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur-xl">
                <CardHeader className="bg-muted/20 pb-4">
                    <CardTitle className="text-2xl">Gesture Details</CardTitle>
                    <CardDescription>
                    Provide comprehensive information about this sign language gesture to help us categorize it correctly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
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

                    <div className="pt-6 border-t border-border/30">
                    <Button
                        type="submit"
                        className="w-full md:w-1/2 text-sm font-medium shadow-md hover:shadow-primary/20 transition-all duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span> Submitting...
                            </>
                        ) : 'Submit Contribution'}
                    </Button>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
