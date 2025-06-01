'use client'

import React from 'react';

export default function WordViewLoadingState() {
  return (
    <div className="text-center py-10">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-signlang-primary border-r-transparent"></div>
      <p className="mt-4 text-gray-500">Loading submissions...</p>
    </div>
  );
}
