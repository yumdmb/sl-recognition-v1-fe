"use client";

import React, { useRef } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface FileUploadAreaProps {
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  previewUrl,
  onFileChange,
  onRemoveFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center ${
        previewUrl ? 'border-gray-300' : 'border-primary'
      }`}
    >
      {previewUrl ? (
        <div className="flex flex-col items-center">
          <img 
            src={previewUrl} 
            alt="Selected gesture" 
            className="max-h-48 md:max-h-40 max-w-full mb-4 rounded" 
          />
          <button 
            onClick={onRemoveFile}
            className="text-sm text-red-500 hover:underline min-h-[44px] flex items-center"
          >
            <X className="h-4 w-4 inline mr-1" /> Remove image
          </button>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center cursor-pointer py-4 md:py-2" 
          onClick={handleClickFileInput}
        >
          <ImageIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">Tap to upload or drag and drop</p>
          <p className="text-xs text-gray-400">PNG, JPG or GIF (max. 5MB)</p>
        </div>
      )}
      <input 
        ref={fileInputRef}
        type="file" 
        onChange={onFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
