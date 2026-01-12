'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Book, Video, Edit, Trash, Eye, Image, FileSpreadsheet } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Material } from '@/types/database';
import { formatBytes } from '@/lib/utils';

interface MaterialCardProps {
  material: Material;
  isAdmin: boolean;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  onPreview?: (material: Material) => void;
}

// Helper function to check if a material type can be previewed
const canPreview = (material: Material): boolean => {
  const type = material.type?.toLowerCase() || '';
  const filePath = material.file_path?.toLowerCase() || '';
  
  // PDF
  if (type.includes('pdf') || filePath.endsWith('.pdf')) return true;
  
  // Images
  if (type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(filePath)) return true;
  
  // Videos
  if (type.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/.test(filePath)) return true;
  
  // Office documents
  if (
    type.includes('powerpoint') ||
    type.includes('presentation') ||
    type.includes('msword') ||
    type.includes('document') ||
    type.includes('excel') ||
    type.includes('spreadsheet') ||
    /\.(ppt|pptx|doc|docx|xls|xlsx)$/.test(filePath)
  ) return true;
  
  return false;
};

const MaterialCard: React.FC<MaterialCardProps> = ({ material, isAdmin, onEdit, onDelete, onPreview }) => {
  const getTypeIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    const filePath = material.file_path?.toLowerCase() || '';
    
    if (lowerType.includes('pdf') || filePath.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
    if (lowerType.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/.test(filePath)) {
      return <Video className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
    if (lowerType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(filePath)) {
      return <Image className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
    if (
      lowerType.includes('excel') || 
      lowerType.includes('spreadsheet') ||
      /\.(xls|xlsx)$/.test(filePath)
    ) {
      return <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
    return <Book className="h-5 w-5 sm:h-6 sm:w-6" />;
  };
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return '';
    }
  };

  const isPreviewable = canPreview(material);

  return (
    <Card className="flex flex-col h-full">
      {/* Header with icon, title and badge */}
      <CardHeader className="pb-2 px-4 md:px-5 flex-shrink-0">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="p-2 bg-muted rounded-md text-primary flex-shrink-0">
            {getTypeIcon(material.type)}
          </div>
          
          {/* Title and Badge container */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2 leading-tight">
                {material.title}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={`capitalize flex-shrink-0 text-xs ${getLevelColor(material.level)}`}
              >
                {material.level}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <CardDescription className="mt-3 text-sm line-clamp-2 min-h-[2.5rem]">
          {material.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      
      {/* Content with file size and action buttons */}
      <CardContent className="px-4 md:px-5 pt-2 pb-4 flex-grow flex flex-col justify-end">
        {/* File size */}
        <div className="mb-3">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {material.file_size ? `Size: ${formatBytes(material.file_size)}` : 'Size: Unknown'}
          </span>
        </div>
        
        {/* Action buttons - always full width on mobile, side by side on larger screens */}
        <div className="flex flex-col xs:flex-row gap-2">
          {isPreviewable && onPreview && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 h-9"
              onClick={() => onPreview(material)}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview</span>
            </Button>
          )}
          <a 
            href={material.download_url} 
            download 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1"
          >
            <Button size="sm" className="w-full h-9">
              <FileDown className="mr-2 h-4 w-4" />
              <span>Download</span>
            </Button>
          </a>
        </div>
      </CardContent>
      
      {/* Admin footer */}
      {isAdmin && (
        <CardFooter className="flex gap-2 pt-0 pb-4 px-4 md:px-5 border-t mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(material)} 
            className="flex-1 h-8"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(material.id)} 
            className="flex-1 h-8"
          >
            <Trash className="h-3.5 w-3.5 mr-1.5" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MaterialCard;


