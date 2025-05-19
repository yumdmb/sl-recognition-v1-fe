"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Eye, Plus, CheckCircle2, XCircle, User } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type Avatar = {
  id: string;
  name: string;
  date: string;
  thumbnail: string | null;
  video: string | null;
  userId: string;
  userName: string;
  language: "ASL" | "MSL";
  description?: string;
  status: "verified" | "unverified";
};

const AdminAvatarDatabasePage = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to access this page"
      });
      router.push("/auth/login");
      return;
    }
    
    if (currentUser?.role !== "admin") {
      toast.error("Access Denied", {
        description: "This page is only accessible to administrators"
      });
      router.push("/");
      return;
    }
    
    fetchAvatars();
  }, [isAuthenticated, currentUser, router]);

  const fetchAvatars = () => {
    try {
      // Get all avatars from localStorage
      const storedAvatars = localStorage.getItem('avatars');
      if (!storedAvatars) {
        setAvatars([]);
      } else {
        // For admin, show all avatars
        const allAvatars: Avatar[] = JSON.parse(storedAvatars);
        setAvatars(allAvatars);
      }
    } catch (error) {
      console.error("Error fetching avatars:", error);
      toast.error("Failed to load avatars", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAvatar = (id: string) => {
    try {
      // Get all avatars from localStorage
      const storedAvatars = localStorage.getItem('avatars');
      if (storedAvatars) {
        const allAvatars: Avatar[] = JSON.parse(storedAvatars);
        
        // Filter out the deleted avatar
        const updatedAvatars = allAvatars.filter(avatar => avatar.id !== id);
        
        // Save updated avatars back to localStorage
        localStorage.setItem('avatars', JSON.stringify(updatedAvatars));
        
        // Update state to reflect deletion
        setAvatars(avatars.filter(avatar => avatar.id !== id));
        
        toast.success("Avatar deleted", {
          description: "The avatar has been removed from the database"
        });
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error("Delete failed", {
        description: "Unable to delete the avatar. Please try again."
      });
    }
  };

  const toggleVerification = (id: string, currentStatus: "verified" | "unverified") => {
    try {
      // Get all avatars from localStorage
      const storedAvatars = localStorage.getItem('avatars');
      if (storedAvatars) {
        const allAvatars: Avatar[] = JSON.parse(storedAvatars);
        const newStatus = currentStatus === "verified" ? "unverified" : "verified";
        
        // Update the status of the specific avatar
        const updatedAvatars = allAvatars.map(avatar => 
          avatar.id === id ? { ...avatar, status: newStatus } : avatar
        );
        
        // Save updated avatars back to localStorage
        localStorage.setItem('avatars', JSON.stringify(updatedAvatars));
        
        // Update state to reflect status change
        setAvatars(avatars.map(avatar => 
          avatar.id === id ? { ...avatar, status: newStatus } : avatar
        ));
        
        toast.success("Status updated", {
          description: `Avatar is now ${newStatus}`
        });
      }
    } catch (error) {
      console.error("Error updating avatar status:", error);
      toast.error("Update failed", {
        description: "Unable to update avatar status. Please try again."
      });
    }
  };

  const exportAvatar = (avatar: Avatar) => {
    if (avatar.thumbnail) {
      const link = document.createElement('a');
      link.href = avatar.thumbnail;
      link.download = `sign_avatar_${avatar.id}_${avatar.userId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Avatar exported", {
        description: "The avatar has been downloaded to your device"
      });
    } else if (avatar.video) {
      const link = document.createElement('a');
      link.href = avatar.video;
      link.download = `sign_video_${avatar.id}_${avatar.userId}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Video exported", {
        description: "The video has been downloaded to your device"
      });
    }
  };

  if (!isAuthenticated || currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Avatar Database</h1>
            <p className="text-muted-foreground">View and manage all user-submitted avatars</p>
          </div>
          <Button 
            onClick={() => router.push('/avatar/generate')}
            className="gap-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Avatar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : avatars.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avatars.map(avatar => (
              <Card key={avatar.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{avatar.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVerification(avatar.id, avatar.status)}
                      className={avatar.status === "verified" ? "text-green-500" : "text-yellow-500"}
                    >
                      {avatar.status === "verified" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {avatar.userName} • {avatar.language} • {new Date(avatar.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {avatar.thumbnail ? (
                      <img 
                        src={avatar.thumbnail} 
                        alt={avatar.name}
                        className="w-full h-full object-cover" 
                      />
                    ) : avatar.video ? (
                      <video
                        src={avatar.video}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground text-sm">No Preview</div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteAvatar(avatar.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (avatar.thumbnail) {
                            window.open(avatar.thumbnail, '_blank');
                          } else if (avatar.video) {
                            window.open(avatar.video, '_blank');
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                        onClick={() => exportAvatar(avatar)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">No avatars in the database</p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => router.push('/avatar/generate')}
              >
                Create an Avatar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminAvatarDatabasePage; 