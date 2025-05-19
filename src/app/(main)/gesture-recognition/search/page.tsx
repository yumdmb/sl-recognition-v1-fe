"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Image, Book } from 'lucide-react';
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define category types
interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const GestureRecognitionSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gestureImage, setGestureImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<"ASL" | "MSL">("ASL");
  const [activeTab, setActiveTab] = useState("text");

  // Mock categories data
  const categories: Category[] = [
    { id: "common", name: "Common Phrases", icon: "👋", count: 42 },
    { id: "greetings", name: "Greetings", icon: "👋", count: 15 },
    { id: "questions", name: "Questions", icon: "👋", count: 28 },
    { id: "emotions", name: "Emotions", icon: "👋", count: 36 },
    { id: "numbers", name: "Numbers", icon: "👋", count: 20 },
    { id: "alphabet", name: "Alphabet", icon: "📚", count: 26 },
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Search term required", {
        description: "Please enter a word to search for"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/gesture-recognition/search?word=${encodeURIComponent(searchTerm)}&language=${language}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setGestureImage(data.imageUrl);
      toast.success("Search complete", {
        description: `Found gesture image for "${searchTerm}" in ${language}.`
      });
    } catch (error) {
      toast.error("Search failed", {
        description: "Unable to find the gesture. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sign Language Gestures</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text" className="py-3">Search by Text</TabsTrigger>
          <TabsTrigger value="category" className="py-3">Browse Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Search by Text</CardTitle>
              <CardDescription>
                Enter a word or phrase to find corresponding sign language gestures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="searchTerm">Search Term</Label>
                  <Input 
                    id="searchTerm"
                    placeholder="e.g., Hello, Thank you, Please"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Sign Language</Label>
                  <Select 
                    value={language} 
                    onValueChange={(val: "ASL" | "MSL") => setLanguage(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASL">American (ASL)</SelectItem>
                      <SelectItem value="MSL">Malaysian (MSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <SearchIcon className="h-5 w-5 mr-2" />
                      Search
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {gestureImage && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Gesture Result</CardTitle>
                <CardDescription>
                  The gesture corresponding to "{searchTerm}" in {language}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <img 
                  src={gestureImage} 
                  alt={`${searchTerm} in ${language} sign language`} 
                  className="max-h-60 max-w-full mb-4" 
                />
                <p className="text-xl font-bold text-primary mt-2">
                  {searchTerm}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Browse by Category</CardTitle>
              <CardDescription>
                Explore sign language gestures organized by categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language-cat">Sign Language</Label>
                  <Select 
                    value={language} 
                    onValueChange={(val: "ASL" | "MSL") => setLanguage(val)}
                  >
                    <SelectTrigger id="language-cat">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASL">American (ASL)</SelectItem>
                      <SelectItem value="MSL">Malaysian (MSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {categories.map(category => (
                    <Card key={category.id} className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl mb-2">{category.icon === "📚" ? "📚" : "👋"}</div>
                        <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-400">{category.count} gestures</p>
                        <Button variant="outline" className="mt-4 hover:bg-primary/10">
                          Explore
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestureRecognitionSearch; 