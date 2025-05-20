'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <Select 
      value={language}
      onValueChange={(value) => setLanguage(value as 'ASL' | 'MSL')}
    >
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
        <SelectItem value="MSL">Malaysian Sign Language (MSL)</SelectItem>
      </SelectContent>
    </Select>
  );
} 