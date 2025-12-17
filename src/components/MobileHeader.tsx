'use client'

import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title?: string;
  onMenuClick: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'SignBridge',
  onMenuClick,
  showBackButton = false,
  onBackClick,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side: Hamburger menu or Back button */}
        <div className="flex items-center">
          {showBackButton && onBackClick ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackClick}
              className="touch-target"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="touch-target"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center: Page title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-base font-semibold text-gray-900 truncate max-w-[60%]">
          {title}
        </h1>

        {/* Right side: Reserved for future actions */}
        <div className="w-10" />
      </div>
    </header>
  );
};

export default MobileHeader;
