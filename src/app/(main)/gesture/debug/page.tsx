'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@/utils/supabase/client';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

// Debug component to test media uploads to Supabase
export default function DebugMediaUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type.startsWith('image/') ? 'image' : 'video');
    }
  };

  const uploadToStorage = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const supabase = createClient();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `debug-test/${Date.now()}.${fileExt}`;
      const filePath = `gesture-contributions/${fileName}`;
      
      console.log(`Uploading ${fileType} file: ${selectedFile.name} (${selectedFile.type}, ${selectedFile.size} bytes)`);

      // Step 1: Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type // Explicitly set content type
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        setUploadResult({
          success: false,
          stage: 'storage upload',
          error: uploadError
        });
        toast.error(`Storage upload failed: ${uploadError.message}`);
        return;
      }
      
      // Step 2: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      // Success!
      setUploadResult({
        success: true,
        uploadData,
        publicUrl
      });
      
      toast.success(`${fileType} uploaded successfully!`);
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setUploadResult({
        success: false,
        stage: 'unexpected error',
        error
      });
      toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Debug Media Upload</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Media Upload to Supabase Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Select File</label>
            <Input 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleFileChange} 
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="mt-2 text-sm">
                Selected: {selectedFile.name} ({fileType}, {Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>
          
          <Button 
            onClick={uploadToStorage} 
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Test Upload to Supabase Storage'}
          </Button>
          
          {uploadResult && (
            <div className="mt-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
              <h3 className="font-medium mb-2">Upload Result:</h3>
              <pre className="text-xs overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
