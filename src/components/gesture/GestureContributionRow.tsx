'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GestureContribution, GestureCategory } from '@/types/gestureContributions';
import { Check, X, Trash2, Eye, Copy, AlertTriangle, Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GestureContributionService } from '@/lib/supabase/gestureContributions';

interface GestureContributionRowProps {
  contribution: GestureContribution;
  userRole?: string;
  onApprove?: (id: string, categoryId?: number | null) => void;
  onReject?: (id: string, reason?: string) => void;
  onDelete: (id: string) => void;
  onUpdateCategory?: (id: string, categoryId: number | null) => void;
  isMySubmissionsView?: boolean;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
}

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};

export default function GestureContributionRow({
  contribution,
  userRole,
  onApprove,
  onReject,
  onDelete,
  onUpdateCategory,
  isMySubmissionsView = false,
  showCheckbox = false,
  isSelected = false,
  onSelect
}: GestureContributionRowProps) {
  const isAdmin = userRole === 'admin';
  const isPending = contribution.status === 'pending';
  const isOwner = contribution.submitter?.id === contribution.submitted_by;

  // Category state for approval dialog
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(contribution.category_id || null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);

  // Load categories when dialog opens
  useEffect(() => {
    if (isApproveDialogOpen || isCategoryEditOpen) {
      const loadCategories = async () => {
        const { data } = await GestureContributionService.getCategories();
        if (data) setCategories(data);
      };
      loadCategories();
    }
  }, [isApproveDialogOpen, isCategoryEditOpen]);

  // Users can delete their own pending or rejected submissions.
  // Admins can delete any submission.
  const canDelete = isAdmin || (isOwner && (contribution.status === 'pending' || contribution.status === 'rejected'));

  const handleRejectClick = () => {
    if (!onReject) return;
    if (isAdmin) {
      const reason = prompt("Enter reason for rejection (optional):");
      onReject(contribution.id, reason || undefined);
    } else {
      onReject(contribution.id);
    }
  };

  const handleApproveWithCategory = () => {
    if (!onApprove) return;
    onApprove(contribution.id, selectedCategoryId);
    setIsApproveDialogOpen(false);
  };

  const handleCategoryUpdate = () => {
    if (!onUpdateCategory) return;
    onUpdateCategory(contribution.id, selectedCategoryId);
    setIsCategoryEditOpen(false);
  };

  const cellClass = "p-4 align-middle border-b";
  
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      {showCheckbox && (
        <td className={`${cellClass} w-12`}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
        </td>
      )}
      <td className={`${cellClass} font-medium`}>
        <div>
          <div className="font-semibold">{contribution.title}</div>
          <div className="text-xs text-muted-foreground truncate max-w-xs">{contribution.description}</div>
        </div>
      </td>
      <td className={cellClass}>
        <Badge variant="outline">{contribution.language}</Badge>
      </td>
      <td className={cellClass}>
        <div className="flex items-center gap-1">
          {contribution.category ? (
            <Badge variant="secondary">
              {contribution.category.icon && <span className="mr-1">{contribution.category.icon}</span>}
              {contribution.category.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">No category</span>
          )}
          {isAdmin && onUpdateCategory && (
            <Dialog open={isCategoryEditOpen} onOpenChange={setIsCategoryEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" title="Edit category">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription>
                    Update the category for &quot;{contribution.title}&quot;
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={selectedCategoryId?.toString() || ''} 
                      onValueChange={(val) => setSelectedCategoryId(val ? parseInt(val, 10) : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCategoryEditOpen(false)}>Cancel</Button>
                  <Button onClick={handleCategoryUpdate}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </td>
      {!isMySubmissionsView && (
        <td className={cellClass}>
          <div>
            <div className="font-medium">{contribution.submitter?.name || 'Unknown'}</div>
            {contribution.submitter?.email && <div className="text-sm text-muted-foreground">{contribution.submitter.email}</div>}
          </div>
        </td>
      )}
      <td className={cellClass}>
        <div>
          {getStatusBadge(contribution.status)}
          {contribution.status === 'rejected' && contribution.rejection_reason && (
            <div className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]" title={contribution.rejection_reason}>
              Reason: {contribution.rejection_reason}
            </div>
          )}
        </div>
      </td>
      {!isMySubmissionsView && (
        <td className={cellClass}>
          {contribution.is_duplicate ? (
            <div className="flex items-center gap-1">
              <Badge variant="destructive" className="flex items-center gap-1">
                <Copy className="h-3 w-3" />
                Duplicate
              </Badge>
              {contribution.duplicate_of && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Duplicate Details</DialogTitle>
                      <DialogDescription>
                        This contribution appears to be a duplicate of existing content.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                      {contribution.duplicate_of}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Unique
            </Badge>
          )}
        </td>
      )}
      <td className={cellClass}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{contribution.title}</DialogTitle>
              <DialogDescription>{contribution.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {contribution.media_url ? (
                contribution.media_type === 'image' ? (
                  <div className="relative w-full max-h-[70vh] aspect-video">
                    <Image
                      src={contribution.media_url}
                      alt={contribution.title}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 95vw, 672px"
                    />
                  </div>
                ) : (
                  <video
                    src={contribution.media_url}
                    controls
                    className="w-full max-h-[70vh] rounded-lg"
                  />
                )
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                  <Eye className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </td>
      <td className={cellClass}>
        <div className="text-sm text-muted-foreground">
            {new Date(contribution.created_at).toLocaleDateString()}
        </div>
      </td>
      <td className={cellClass}>
        <div className="flex gap-1 items-center">
          {/* Admin actions for pending contributions */}
          {isAdmin && isPending && onApprove && onReject && (
            <>
              <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-green-600 hover:text-green-700"
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Gesture</DialogTitle>
                    <DialogDescription>
                      Review and confirm the category before approving &quot;{contribution.title}&quot;
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Category {!contribution.category_id && <span className="text-amber-500">(not set by user)</span>}</Label>
                      <Select 
                        value={selectedCategoryId?.toString() || ''} 
                        onValueChange={(val) => setSelectedCategoryId(val ? parseInt(val, 10) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.icon && <span className="mr-2">{cat.icon}</span>}
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleApproveWithCategory} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRejectClick}
                className="text-red-600 hover:text-red-700"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Delete action */}
          {canDelete && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(contribution.id)}
              className="text-red-600 hover:text-red-700"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
