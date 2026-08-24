'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  action?: React.ReactNode;
}

/**
 * Standard botanical-ink page header: eyebrow + display title + description,
 * optional icon tile and trailing action, per the design system patterns.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  iconClassName,
  action,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {Icon && (
          <span
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary',
              iconClassName
            )}
          >
            <Icon className="size-6" />
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
          )}
          <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight">{title}</h1>
          {description && <p className="mt-1 max-w-xl text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
