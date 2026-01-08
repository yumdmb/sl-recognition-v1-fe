'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type SignLanguage = 'ASL' | 'MSL';

interface LanguageCardProps {
  language: SignLanguage;
  flag: string;
  name: string;
  abbreviation: string;
  description: string;
  isSelected: boolean;
  onSelect: (language: SignLanguage) => void;
}

export function LanguageCard({
  language,
  flag,
  name,
  abbreviation,
  description,
  isSelected,
  onSelect,
}: LanguageCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(language)}
      className={cn(
        'group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300 ease-in-out',
        'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
        'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1',
        'focus:outline-none focus:ring-4 focus:ring-primary/20',
        isSelected
          ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white animate-in zoom-in-50 duration-200">
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* Flag emoji */}
      <div className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
        {flag}
      </div>

      {/* Language name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        {name}
      </h3>
      
      {/* Abbreviation */}
      <span className="text-sm font-medium text-primary mb-3">
        ({abbreviation})
      </span>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-[200px] leading-relaxed">
        {description}
      </p>

      {/* Selection text */}
      <div
        className={cn(
          'mt-6 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200',
          isSelected
            ? 'bg-primary text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
        )}
      >
        {isSelected ? '✓ Selected' : 'Select'}
      </div>
    </button>
  );
}

export const LANGUAGE_DATA: Record<SignLanguage, Omit<LanguageCardProps, 'isSelected' | 'onSelect' | 'language'>> = {
  ASL: {
    flag: '🇺🇸',
    name: 'American Sign Language',
    abbreviation: 'ASL',
    description: 'Most widely used sign language in North America, with a rich vocabulary and grammar system.',
  },
  MSL: {
    flag: '🇲🇾',
    name: 'Malaysian Sign Language',
    abbreviation: 'BIM',
    description: 'Bahasa Isyarat Malaysia - the primary sign language used by the deaf community in Malaysia.',
  },
};
