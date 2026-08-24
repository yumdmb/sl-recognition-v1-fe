'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Material } from '@/types/database';
import { Paperclip } from 'lucide-react';

interface MaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
  onMaterialChange: (material: Material | null) => void;
  onSave: (material: Material, file?: File) => void;
}

const MaterialDialog: React.FC<MaterialDialogProps> = ({
  open,
  onOpenChange,
  material,
  onMaterialChange,
  onSave
}) => {
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    // Reset file when dialog opens
    if (open) {
      setFile(undefined);
    }
  }, [open]);

  if (!material) return null;

  const handleFieldChange = (field: keyof Material, value: string) => {
    onMaterialChange({
      ...material,
      [field]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    onSave(material, file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-display">{material.id ? 'Edit' : 'New'} material</DialogTitle>
          <DialogDescription>
            Upload a PDF, video, or document learners can download.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={material.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. BIM alphabet cheat sheet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={material.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="What's inside this material?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <label
              htmlFor="file"
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                <Paperclip className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate">
                {file ? (
                  <span className="font-medium text-foreground">{file.name}</span>
                ) : (
                  'Click to choose a file'
                )}
              </span>
            </label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.webm,.ogg,.mov"
              onChange={handleFileChange}
              className="hidden"
            />
            {!file && material.download_url && (
              <a
                href={material.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-xs font-medium text-primary hover:underline"
              >
                Current file: {material.file_path || 'view file'}
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={material.level}
                onValueChange={(value) => handleFieldChange('level', value)}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={material.language}
                onValueChange={(value) => handleFieldChange('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASL">ASL</SelectItem>
                  <SelectItem value="MSL">MSL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDialog;
