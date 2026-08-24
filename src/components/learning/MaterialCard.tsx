'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, FileText, BookOpen, Video, Edit, Trash2, Eye, Image, FileSpreadsheet } from 'lucide-react';
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
  const getType = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    const filePath = material.file_path?.toLowerCase() || '';
    
    if (lowerType.includes('pdf') || filePath.endsWith('.pdf')) {
      return { icon: FileText, tone: 'bg-coral/10 text-coral' };
    }
    if (lowerType.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/.test(filePath)) {
      return { icon: Video, tone: 'bg-sky/10 text-sky' };
    }
    if (lowerType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(filePath)) {
      return { icon: Image, tone: 'bg-primary-soft text-primary' };
    }
    if (
      lowerType.includes('excel') || 
      lowerType.includes('spreadsheet') ||
      /\.(xls|xlsx)$/.test(filePath)
    ) {
      return { icon: FileSpreadsheet, tone: 'bg-sun/10 text-sun' };
    }
    if (lowerType === 'pdf') return { icon: FileText, tone: 'bg-coral/10 text-coral' };
    if (lowerType === 'video') return { icon: Video, tone: 'bg-sky/10 text-sky' };
    return { icon: BookOpen, tone: 'bg-primary-soft text-primary' };
  };

  const levelTone =
    material.level === 'beginner'
      ? 'bg-primary-soft text-primary'
      : material.level === 'intermediate'
        ? 'bg-sky/10 text-sky'
        : 'bg-coral/10 text-coral';

  const TypeIcon = getType(material.type).icon;
  const tone = getType(material.type).tone;
  const isPreviewable = canPreview(material);

  return (
    <Card className="card-lift gap-0 py-5">
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}>
            <TypeIcon className="size-5" />
          </span>
          <div className="flex items-center gap-2">
            {material.file_size && (
              <span className="text-xs text-muted-foreground">{formatBytes(material.file_size)}</span>
            )}
            <Badge className={`capitalize ${levelTone}`}>{material.level}</Badge>
          </div>
        </div>

        <h3 className="font-display mt-4 text-base font-bold leading-snug">{material.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {material.description || 'No description available'}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          {isPreviewable && onPreview && (
            <Button variant="outline" size="sm" onClick={() => onPreview(material)} className="flex-1">
              <Eye className="size-4" />
              Preview
            </Button>
          )}
          <a href={material.download_url} download target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full">
              <FileDown />
              Download
            </Button>
          </a>
          {isAdmin && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEdit(material)} aria-label="Edit material">
                <Edit />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(material.id)}
                aria-label="Delete material"
              >
                <Trash2 />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
