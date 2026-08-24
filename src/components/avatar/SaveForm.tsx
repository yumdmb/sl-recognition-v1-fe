"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@/utils/supabase/client';
import { BookmarkPlus, Loader2 } from "lucide-react";

interface GestureCategory {
  id: number;
  name: string;
  icon: string | null;
}

interface SaveFormProps {
  signName: string;
  setSignName: (name: string) => void;
  signDescription: string;
  setSignDescription: (description: string) => void;
  language: "ASL" | "MSL" | "";
  setLanguage: (language: "ASL" | "MSL") => void;
  categoryId: number | null;
  setCategoryId: (categoryId: number | null) => void;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveForm({
  signName,
  setSignName,
  signDescription,
  setSignDescription,
  language,
  setLanguage,
  categoryId,
  setCategoryId,
  isLoading,
  onSave,
  onCancel
}: SaveFormProps) {
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('gesture_categories')
        .select('id, name, icon')
        .order('name');
      
      setCategories(data || []);
      setLoadingCategories(false);
    };

    void fetchCategories();
  }, []);

  return (
    <Card className="rounded-2xl shadow-soft">
      <CardHeader>
        <div className="flex items-center gap-3.5">
          <span className="grid size-10 place-items-center rounded-xl bg-sun/10 text-sun">
            <BookmarkPlus className="size-5" />
          </span>
          <div>
            <CardTitle className="font-display text-lg font-bold">Save Gesture</CardTitle>
            <CardDescription>Provide details about your sign language gesture</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid content-start gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder="Enter gesture title"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="grid content-start gap-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={(value: "ASL" | "MSL") => setLanguage(value)}>
              <SelectTrigger id="language" className="w-full rounded-xl">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                <SelectItem value="MSL">Malaysian Sign Language (MSL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid content-start gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryId?.toString() || "none"}
              onValueChange={(value) => setCategoryId(value === "none" ? null : parseInt(value))}
              disabled={loadingCategories}
            >
              <SelectTrigger id="category" className="w-full rounded-xl">
                <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="none">No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid content-start gap-2 md:col-span-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={signDescription}
              onChange={(e) => setSignDescription(e.target.value)}
              placeholder="Enter gesture description"
              className="min-h-24 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-3 md:col-span-2">
            <Button onClick={onCancel} variant="outline" className="rounded-full">
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isLoading} className="gap-2 rounded-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Submit for Review"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
