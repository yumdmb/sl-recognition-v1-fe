'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Heart,
  Loader2,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ForumComment } from '@/lib/services/forumService';

interface CommentThreadProps {
  comment: ForumComment;
  currentUserId?: string;
  depth?: number;
  maxDepth?: number;
  likeData?: { count: number; userLiked: boolean };
  onReply: (parentCommentId: string, replyText: string) => Promise<void>;
  onEdit: (commentId: string, newText: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onLikeToggle?: (commentId: string) => Promise<{ count: number; userLiked: boolean }>;
  getLikeData?: (commentId: string) => { count: number; userLiked: boolean } | undefined;
}

// Maximum nesting depth for visual indentation
const MAX_VISUAL_DEPTH = 5;
// Indentation per level in pixels
const INDENT_PER_LEVEL = 24;

export function CommentThread({
  comment,
  currentUserId,
  depth = 0,
  maxDepth = MAX_VISUAL_DEPTH,
  likeData,
  onReply,
  onEdit,
  onDelete,
  onLikeToggle,
  getLikeData
}: CommentThreadProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Like state
  const [likeCount, setLikeCount] = useState(likeData?.count || 0);
  const [userLiked, setUserLiked] = useState(likeData?.userLiked || false);
  const [isLiking, setIsLiking] = useState(false);

  // Sync like state when likeData prop changes (e.g., after batch load)
  React.useEffect(() => {
    if (likeData) {
      setLikeCount(likeData.count);
      setUserLiked(likeData.userLiked);
    }
  }, [likeData]);

  const isOwnComment = currentUserId === comment.user_id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const authorName = comment.user_profile?.username || 'Anonymous';
  
  // Calculate visual depth (cap at maxDepth for indentation)
  const visualDepth = Math.min(depth, maxDepth);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? 'just now' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedText.trim() || editedText === comment.content || isSubmitting) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(comment.id, editedText);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!currentUserId) {
      toast.error('Please sign in to like comments');
      return;
    }
    if (!onLikeToggle || isLiking) return;

    setIsLiking(true);
    // Optimistic update
    const newLiked = !userLiked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setUserLiked(newLiked);
    setLikeCount(newCount);

    try {
      const result = await onLikeToggle(comment.id);
      setLikeCount(result.count);
      setUserLiked(result.userLiked);
    } catch (error) {
      // Revert optimistic update
      setUserLiked(!newLiked);
      setLikeCount(newLiked ? newCount - 1 : newCount + 1);
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div 
      className={cn(
        'relative',
        depth > 0 && 'border-l-2 border-border'
      )}
      style={{ 
        marginLeft: depth > 0 ? INDENT_PER_LEVEL : 0 
      }}
    >
      <div className={cn(
        'py-3',
        depth > 0 && 'pl-4'
      )}>
        {/* Comment header with collapse toggle */}
        <div className="flex items-start gap-2">
          {hasReplies && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 -ml-1"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            {/* Author and timestamp */}
            <div className="flex items-center gap-2 text-sm">
              <Avatar className="h-5 w-5">
                <AvatarImage 
                  src={comment.user_profile?.avatar_url || undefined} 
                  alt={authorName} 
                />
                <AvatarFallback className="text-[10px]">
                  {authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{authorName}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-xs">
                {formatDate(comment.created_at)}
                {comment.updated_at && comment.updated_at !== comment.created_at && (
                  <span className="ml-1 italic">(edited)</span>
                )}
              </span>
            </div>

            {/* Comment content or edit form */}
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="mt-2">
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  required
                  autoFocus
                  rows={3}
                  className="text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!editedText.trim() || isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedText(comment.content);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {/* Action buttons */}
            {!isEditing && (
              <div className="flex items-center gap-1 mt-2">
                {/* Like button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeToggle}
                  disabled={isLiking}
                  className={cn(
                    'h-7 px-2 gap-1',
                    userLiked && 'text-red-500 hover:text-red-600'
                  )}
                >
                  {isLiking ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Heart className={cn('h-3.5 w-3.5', userLiked && 'fill-current')} />
                  )}
                  <span className="text-xs">{likeCount > 0 ? likeCount : ''}</span>
                </Button>

                {/* Reply button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 gap-1"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="text-xs">Reply</span>
                </Button>

                {/* Edit/Delete for own comments */}
                {isOwnComment && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 gap-1"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span className="text-xs">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span className="text-xs">Delete</span>
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Reply input */}
            {showReplyInput && (
              <form onSubmit={handleReplySubmit} className="mt-3">
                <Textarea
                  placeholder={`Reply to ${authorName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  required
                  className="text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyText.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="mr-1 h-3 w-3" />
                    )}
                    Reply
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowReplyInput(false);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {hasReplies && !isCollapsed && (
          <div className="mt-2">
            {comment.replies!.map((reply) => (
              <CommentThread
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                depth={depth + 1}
                maxDepth={maxDepth}
                likeData={getLikeData?.(reply.id)}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLikeToggle={onLikeToggle}
                getLikeData={getLikeData}
              />
            ))}
          </div>
        )}

        {/* Collapsed indicator */}
        {hasReplies && isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-muted-foreground"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4 mr-1" />
            {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'} hidden
          </Button>
        )}
      </div>
    </div>
  );
}
