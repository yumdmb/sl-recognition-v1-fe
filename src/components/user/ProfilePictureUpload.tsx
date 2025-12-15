'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from '@/utils/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfilePictureUploadProps {
  userId: string;
  currentPictureUrl?: string | null;
  userName: string;
  onUpdate: (newUrl: string | null) => void;
}

export function ProfilePictureUpload({ 
  userId, 
  currentPictureUrl, 
  userName,
  onUpdate 
}: ProfilePictureUploadProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", { description: "Please select an image file" });
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum file size is 20MB" });
      return;
    }

    setIsUploading(true);

    try {
      // Delete old picture if exists
      if (currentPictureUrl) {
        const oldFileName = currentPictureUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`${userId}/${oldFileName}`]);
        }
      }

      // Upload new picture with timestamp to avoid caching
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `avatar-${timestamp}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL with cache-busting parameter
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Add cache-busting parameter
      const urlWithCacheBust = `${publicUrl}?t=${timestamp}`;

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_picture_url: urlWithCacheBust })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update local state and trigger re-render
      onUpdate(urlWithCacheBust);
      const message = currentPictureUrl ? "Profile picture changed successfully!" : "Profile picture uploaded successfully!";
      toast.success(message);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error("Failed to upload picture", { description: error.message });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!currentPictureUrl) return;

    setIsDeleting(true);

    try {
      // Delete from storage
      const fileName = currentPictureUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`${userId}/${fileName}`]);
      }

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_picture_url: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update local state and trigger re-render
      onUpdate(null);
      toast.success("Profile picture removed successfully!");
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error("Failed to delete picture", { description: error.message });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={currentPictureUrl || undefined} alt={userName} />
          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
        >
          <Camera className="h-4 w-4 mr-2" />
          {currentPictureUrl ? 'Change Photo' : 'Upload Photo'}
        </Button>

        {currentPictureUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isUploading || isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove profile picture?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your current profile picture. You can upload a new one anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
