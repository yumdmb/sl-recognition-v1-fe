'use client'

import React from 'react';

const TutorialLoadingState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
      <p className="mt-4 text-gray-500">Loading tutorials...</p>
    </div>
  );
};

export default TutorialLoadingState;
