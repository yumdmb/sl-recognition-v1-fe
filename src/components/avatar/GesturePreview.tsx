"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar3DRecording } from "@/types/hand";
import Avatar3DPlayer from "./Avatar3DPlayer";
import { Eye, RotateCcw, Save, Loader2, ImageIcon } from "lucide-react";

interface GesturePreviewProps {
  recorded3DAvatar: Avatar3DRecording | null;
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

const GesturePreview: React.FC<GesturePreviewProps> = ({
  recorded3DAvatar,
  isLoading,
  onReset,
  onSave,
}) => {
  const hasContent = recorded3DAvatar && recorded3DAvatar.frames.length > 0;

  return (
    <Card className="col-span-3 gap-0 pb-6 rounded-2xl shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 place-items-center rounded-xl bg-sky/10 text-sky">
              <Eye className="size-5" />
            </span>
            <div>
              <CardTitle className="font-display text-lg font-bold">Preview</CardTitle>
              <CardDescription>Your captured 3D gesture</CardDescription>
            </div>
          </div>
          {hasContent && (
            <Badge variant="secondary" className="rounded-full bg-primary-soft text-primary">
              {recorded3DAvatar.frames.length <= 1
                ? "Static Pose"
                : `${recorded3DAvatar.frames.length} frames • ${(recorded3DAvatar.duration / 1000).toFixed(1)}s`}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
          {hasContent ? (
            <Avatar3DPlayer recording={recorded3DAvatar} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <span className="grid size-12 place-items-center rounded-2xl bg-background text-muted-foreground/70">
                <ImageIcon className="size-6" />
              </span>
              <p className="text-sm">No preview available</p>
              <p className="max-w-[220px] text-center text-xs">
                Record a 3D gesture to see preview here
              </p>
            </div>
          )}
        </div>
        {hasContent && (
          <div className="mt-4 flex justify-between gap-3">
            <Button onClick={onReset} variant="outline" className="gap-2 rounded-full">
              <RotateCcw className="h-4 w-4" />
              Discard & Reset
            </Button>
            <Button onClick={onSave} disabled={isLoading} className="gap-2 rounded-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save to Signbank
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GesturePreview;
