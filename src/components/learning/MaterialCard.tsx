'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Book, Video, Edit, Trash } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Material } from '@/types/database';
import { formatBytes } from '@/lib/utils';

interface MaterialCardProps {
  material: Material;
  isAdmin: boolean;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, isAdmin, onEdit, onDelete }) => {
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      default:
        return <Book className="h-6 w-6" />;
    }
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

  return (
    <Card key={material.id}>
      <CardHeader className="pb-2 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <CardTitle className="text-lg md:text-xl flex items-center">
            <div className="mr-3 p-2 bg-muted rounded-md text-primary flex-shrink-0">
              {getTypeIcon(material.type)}
            </div>
            <div className="break-words">
              {material.title}
            </div>
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`capitalize self-start sm:self-center flex-shrink-0 ${getLevelColor(material.level)}`}
          >
            {material.level}
          </Badge>
        </div>
        <CardDescription className="mt-2">{material.description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-sm text-gray-500">
            {material.file_size ? `File size: ${formatBytes(material.file_size)}` : ''}
          </span>
          <a href={material.download_url} download target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <FileDown className="mr-2 h-4 w-4" /> Download
            </Button>
          </a>
        </div>
      </CardContent>
      {isAdmin && (
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-0 px-4 md:px-6">
          <Button variant="outline" size="sm" onClick={() => onEdit(material)} className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(material.id)} className="w-full sm:w-auto">
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MaterialCard;
