"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@/utils/supabase/client';

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
    <Card>
      <CardHeader className="px-3 md:px-6">
        <CardTitle className="text-lg md:text-xl">Save Gesture</CardTitle>
        <CardDescription className="text-xs md:text-sm">Provide details about your sign language gesture</CardDescription>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm">Name</Label>
            <Input
              id="name"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder="Enter gesture name"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language" className="text-sm">Language</Label>
            <Select value={language} onValueChange={(value: "ASL" | "MSL") => setLanguage(value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                <SelectItem value="MSL">Malaysian Sign Language (MSL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-sm">Category</Label>
            <Select 
              value={categoryId?.toString() || ""} 
              onValueChange={(value) => setCategoryId(value ? parseInt(value) : null)}
              disabled={loadingCategories}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm">Description (Optional)</Label>
            <Textarea
              id="description"
              value={signDescription}
              onChange={(e) => setSignDescription(e.target.value)}
              placeholder="Enter gesture description"
              className="min-h-20 md:min-h-24"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 pt-2">
            <Button onClick={onCancel} variant="outline" className="w-full md:w-auto order-2 md:order-1">
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isLoading} className="w-full md:w-auto order-1 md:order-2">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}