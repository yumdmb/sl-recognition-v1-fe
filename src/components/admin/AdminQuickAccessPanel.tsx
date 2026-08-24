"use client";

import React from 'react';
import Link from 'next/link';
import { Upload, Database, Search, BookOpen, ArrowRight } from 'lucide-react';

interface QuickAccessPanelProps {
  userRole: string;
}


const actions = [
  {
    href: '/gesture/view',
    icon: Upload,
    tone: 'bg-primary-soft text-primary',
    title: 'Manage submissions',
    description: 'Review and approve gesture contributions.',
  },
  {
    href: '/avatar/admin-database',
    icon: Database,
    tone: 'bg-sky/10 text-sky',
    title: 'Avatar database',
    description: 'Manage avatar assets and animations.',
  },
  {
    href: '/gesture-recognition/search',
    icon: Search,
    tone: 'bg-sun/10 text-sun',
    title: 'Add a new gesture',
    description: 'Search a word to attach a gesture image.',
  },
  {
    href: '/learning/tutorials',
    icon: BookOpen,
    tone: 'bg-coral/10 text-coral',
    title: 'Manage learning',
    description: 'Create and edit tutorials, quizzes and materials.',
  },
];

export const AdminQuickAccessPanel: React.FC<QuickAccessPanelProps> = () => (
  <div>
    <h3 className="font-display text-base font-bold">Admin tools</h3>
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="card-lift group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
        >
          <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${a.tone}`}>
            <a.icon className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <p className="font-semibold">{a.title}</p>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
          </span>
        </Link>
      ))}
    </div>
  </div>
);
