"use client";

import React from 'react';
import Link from 'next/link';
import { Camera, BookOpen, PlusCircle, ChevronRight, Zap } from 'lucide-react';

export const UserQuickAccessPanel: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
      <Zap size={18} className="text-amber-500 fill-amber-500" />
      <h3 className="font-bold text-slate-800 dark:text-white">Quick Actions</h3>
    </div>
    
    <div className="p-2 space-y-1">
      {/* Primary Action - Recognize Gesture (Highlighted) */}
      <Link href="/gesture-recognition/upload">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-signlang-accent/50 dark:bg-signlang-primary/10 hover:bg-signlang-accent hover:shadow-sm transition-all group">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-signlang-primary shadow-sm group-hover:scale-110 transition-transform">
            <Camera size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Recognize Gesture</h4>
            <p className="text-xs text-signlang-dark/70 dark:text-signlang-primary/70">Start camera or upload</p>
          </div>
          <ChevronRight size={16} className="text-signlang-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Secondary Action - Tutorials */}
      <Link href="/learning/tutorials">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <BookOpen size={20} />
          </div>
          <div className="flex-1">
             <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Browse Tutorials</h4>
             <p className="text-xs text-slate-400">Learn new signs</p>
          </div>
          <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
        </div>
      </Link>

      {/* Secondary Action - Contribute */}
      <Link href="/gesture/submit">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
            <PlusCircle size={20} />
          </div>
          <div className="flex-1">
             <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Contribute Gesture</h4>
             <p className="text-xs text-slate-400">Add to library</p>
          </div>
          <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors" />
        </div>
      </Link>
    </div>
  </div>
);


