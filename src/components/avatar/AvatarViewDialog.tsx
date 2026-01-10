"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar3DRecording } from "@/types/hand";
import Avatar3DPlayer from "./Avatar3DPlayer";
import { User, Calendar, Languages, FileText } from "lucide-react";
import { SignAvatar } from "@/lib/services/signAvatarService";

interface AvatarViewDialogProps {
  avatar: SignAvatar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AvatarViewDialog: React.FC<AvatarViewDialogProps> = ({
  avatar,
  open,
  onOpenChange,
}) => {
  if (!avatar) return null;

  const recording: Avatar3DRecording | null = avatar.recording_data || null;
  const isSingleFrame = recording && recording.frames.length <= 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {avatar.name}
            <Badge 
              variant={avatar.status === "approved" ? "default" : "secondary"}
              className={
                avatar.status === "approved" 
                  ? "bg-green-500 text-white" 
                  : avatar.status === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-500 text-white"
              }
            >
              {avatar.status === "approved" ? "Approved" : avatar.status === "rejected" ? "Rejected" : "Pending"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* 3D Avatar Preview */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {recording && recording.frames.length > 0 ? (
            <Avatar3DPlayer recording={recording} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No preview available
            </div>
          )}
        </div>

        {/* Avatar Details */}
        <div className="space-y-3">
          {/* Type Badge */}
          <div className="flex gap-2">
            <Badge variant="outline">
              {recording
                ? isSingleFrame
                  ? "3D Static Pose"
                  : `3D Animation (${recording.frames.length} frames)`
                : "No Recording"}
            </Badge>
            {recording && !isSingleFrame && (
              <Badge variant="outline">
                {(recording.duration / 1000).toFixed(1)}s
              </Badge>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created by:</span>
            </div>
            <div>{avatar.user_name || "Unknown"}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Date:</span>
            </div>
            <div>{new Date(avatar.created_at).toLocaleDateString()}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Languages className="h-4 w-4" />
              <span>Language:</span>
            </div>
            <div>{avatar.language}</div>
          </div>

          {/* Description */}
          {avatar.description && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <FileText className="h-4 w-4" />
                <span>Description:</span>
              </div>
              <p className="text-sm">{avatar.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarViewDialog;
