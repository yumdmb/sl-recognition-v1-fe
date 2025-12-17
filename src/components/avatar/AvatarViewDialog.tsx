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

interface AvatarData {
  id: string;
  name: string;
  date: string;
  thumbnail: string | null;
  video: string | null;
  recording3D?: Avatar3DRecording | null;
  userId: string;
  userName: string;
  language: "ASL" | "MSL";
  description?: string;
  status: "verified" | "unverified";
}

interface AvatarViewDialogProps {
  avatar: AvatarData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AvatarViewDialog: React.FC<AvatarViewDialogProps> = ({
  avatar,
  open,
  onOpenChange,
}) => {
  if (!avatar) return null;

  const isSingleFrame = avatar.recording3D && avatar.recording3D.frames.length <= 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {avatar.name}
            <Badge variant={avatar.status === "verified" ? "default" : "secondary"}>
              {avatar.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* 3D Avatar Preview */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {avatar.recording3D && avatar.recording3D.frames.length > 0 ? (
            <Avatar3DPlayer recording={avatar.recording3D} />
          ) : avatar.video ? (
            <video
              src={avatar.video}
              controls
              className="w-full h-full object-contain"
            />
          ) : avatar.thumbnail ? (
            <img
              src={avatar.thumbnail}
              alt={avatar.name}
              className="w-full h-full object-contain"
            />
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
              {avatar.recording3D
                ? isSingleFrame
                  ? "3D Static Pose"
                  : `3D Animation (${avatar.recording3D.frames.length} frames)`
                : avatar.video
                  ? "Video"
                  : "Image"}
            </Badge>
            {avatar.recording3D && !isSingleFrame && (
              <Badge variant="outline">
                {(avatar.recording3D.duration / 1000).toFixed(1)}s
              </Badge>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created by:</span>
            </div>
            <div>{avatar.userName}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Date:</span>
            </div>
            <div>{new Date(avatar.date).toLocaleDateString()}</div>

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
