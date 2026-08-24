'use client'

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Tags } from 'lucide-react';

interface GestureTagInputProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export default function GestureTagInput({
  tags,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag
}: GestureTagInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags" className="flex items-center gap-1.5">
        <Tags className="size-3.5 text-primary" />
        Tags (Optional)
      </Label>
      <div className="flex gap-2">
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add tags to help categorize your gesture..."
          disabled={tags.length >= 10}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onAddTag}
          disabled={!tagInput.trim() || tags.includes(tagInput.trim()) || tags.length >= 10}
          className="shrink-0 text-primary"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} className="gap-1 py-1 pl-2.5 pr-1 text-[13px]">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0.5 text-primary hover:bg-transparent hover:text-primary"
                onClick={() => onRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {tags.length}/10 tags added
      </div>
    </div>
  );
}
