'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GestureContributionFilters } from '@/types/gestureContributions';
import { Search, SlidersHorizontal } from 'lucide-react';

interface GestureFiltersProps {
  filters: GestureContributionFilters;
  onFiltersChange: (filters: Partial<GestureContributionFilters>) => void;
  userRole?: string;
  hiddenFilters?: Array<keyof GestureContributionFilters>;
  showStatusFilter?: boolean; // New prop to control visibility of status filter
}

export default function GestureFilters({
  filters,
  onFiltersChange,
  userRole,
  hiddenFilters = [],
  showStatusFilter = false // Default to false
}: GestureFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleSelectChange = (name: keyof GestureContributionFilters, value: string) => {
    onFiltersChange({ [name]: value === 'all' ? undefined : value });
  };

  const isAdmin = userRole === 'admin';

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <SlidersHorizontal className="size-5" />
          </span>
          <h3 className="font-display text-base font-bold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search Filter */}
          {!hiddenFilters.includes('search') && (
            <div className="space-y-2">
              <Label htmlFor="search" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Search by title or description..."
                  value={filters.search || ''}
                  onChange={handleInputChange}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {/* Language Filter */}
          {!hiddenFilters.includes('language') && (
            <div className="space-y-2">
              <Label htmlFor="language" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</Label>
              <Select
                value={filters.language || 'all'}
                onValueChange={(value) => handleSelectChange('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="ASL">ASL</SelectItem>
                  <SelectItem value="MSL">MSL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status Filter (conditionally shown) */}
          {showStatusFilter && !hiddenFilters.includes('status') && isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
