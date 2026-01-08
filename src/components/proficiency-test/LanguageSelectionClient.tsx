'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageCard, LANGUAGE_DATA, SignLanguage } from './LanguageCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe } from 'lucide-react';
import type { Database } from '@/types/database';

type ProficiencyTest = Database['public']['Tables']['proficiency_tests']['Row'];

interface LanguageSelectionClientProps {
  tests: ProficiencyTest[];
}

export default function LanguageSelectionClient({ tests }: LanguageSelectionClientProps) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<SignLanguage | null>(null);

  const handleContinue = () => {
    if (!selectedLanguage) return;
    
    // Find a test for the selected language
    const testForLanguage = tests.find(test => test.language === selectedLanguage);
    
    if (testForLanguage) {
      // Navigate to the test with language in query params to persist choice
      router.push(`/proficiency-test/${testForLanguage.id}?language=${selectedLanguage}`);
    } else {
      // If no test found for this language, show info (shouldn't happen in normal flow)
      console.error(`No test found for language: ${selectedLanguage}`);
    }
  };

  const availableLanguages = Array.from(
    new Set(tests.map(test => test.language))
  ) as SignLanguage[];

  if (availableLanguages.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Tests Available</h2>
          <p className="text-gray-500">Please check back later for available proficiency tests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero section with gradient background */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Sign Language
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select the sign language you&apos;d like to learn. This will personalize your learning experience and proficiency test.
          </p>
        </div>

        {/* Language cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl w-full mb-12">
          {availableLanguages.map((language) => (
            <LanguageCard
              key={language}
              language={language}
              isSelected={selectedLanguage === language}
              onSelect={setSelectedLanguage}
              {...LANGUAGE_DATA[language]}
            />
          ))}
        </div>

        {/* Continue button */}
        <div className="w-full max-w-md">
          <Button
            size="lg"
            className={`w-full h-14 text-lg font-semibold transition-all duration-300 ${
              selectedLanguage
                ? 'opacity-100 translate-y-0'
                : 'opacity-50 translate-y-2 pointer-events-none'
            }`}
            onClick={handleContinue}
            disabled={!selectedLanguage}
          >
            Continue to Proficiency Test
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          {selectedLanguage && (
            <p className="text-center text-sm text-gray-500 mt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              You can change your language preference later in settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
