'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Book, Video, Edit, Trash } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Material } from '@/types/database';

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
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-xl flex items-center">
            <div className="mr-3 p-2 bg-muted rounded-md text-primary">
              {getTypeIcon(material.type)}
            </div>
            <div>
              {material.title}
            </div>
          </CardTitle>
        </div>
        <div className="flex justify-between mt-2">
          <CardDescription>{material.description}</CardDescription>
          <Badge 
            variant="outline" 
            className={`capitalize ${getLevelColor(material.level)}`}
          >
            {material.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {material.file_size ? `File size: ${material.file_size}` : ''}
          </span>
          <Button>
            <FileDown className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
      </CardContent>
      {isAdmin && (
        <CardFooter className="flex justify-end space-x-2 pt-0">
          <Button variant="outline" size="sm" onClick={() => onEdit(material)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(material.id)}>
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MaterialCard;
