"use client";

import React from 'react';
import Link from 'next/link';
import { Video, BookOpen, PlusSquare, ArrowRight, Camera, Zap } from 'lucide-react';

interface UserQuickAccessPanelProps {
  userRole?: 'non-deaf' | 'deaf' | string;
  // allow no args for backward compat
}

const actions = [
  {
    href: '/gesture-recognition/upload',
    icon: Video,
    fallbackIcon: Camera,
    tone: 'bg-primary-soft text-primary',
    title: 'Recognise a gesture',
    description: 'Translate a sign from your camera or a photo.',
  },
  {
    href: '/learning/tutorials',
    icon: BookOpen,
    tone: 'bg-sky/10 text-sky',
    title: 'Tutorials',
    description: 'Learn new signs with step-by-step lessons.',
  },
  {
    href: '/gesture/submit',
    icon: PlusSquare,
    tone: 'bg-coral/10 text-coral',
    title: 'Contribute a gesture',
    description: 'Help the community dictionary grow.',
  },
];

export const UserQuickAccessPanel: React.FC<UserQuickAccessPanelProps> = ({ userRole }) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      <Zap size={14} className="text-amber-500 fill-amber-500" />
      <h3 className="font-display text-base font-bold">Jump back in</h3>
    </div>
    <p className="text-xs text-muted-foreground mb-4">Quick actions to keep your momentum</p>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="card-lift group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft"
        >
          <span className={`grid size-11 place-items-center rounded-xl ${a.tone}`}>
            <a.icon className="size-5" />
          </span>
          <p className="mt-4 font-semibold">{a.title}</p>
          <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Open
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  </div>
);
