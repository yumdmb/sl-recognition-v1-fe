'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Edit3, Trash2, ChevronDown, ChevronUp, Clock, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageThumbnail } from './ImageThumbnail';
import { ImageModal } from './ImageModal';
import { FileAttachment } from './FileAttachment';
import { ForumService, ForumPost, ForumAttachment } from '@/lib/services/forumService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ForumPostCardProps {
  post: ForumPost;
  currentUserId?: string;
  commentCount: number;
  onEdit?: (post: ForumPost) => void;
  onDelete?: (postId: string) => void;
  onViewComments?: (postId: string) => void;
  isCommentsExpanded?: boolean;
}

// Maximum characters to show in preview before truncating
const CONTENT_PREVIEW_LENGTH = 250;

export function ForumPostCard({
  post,
  currentUserId,
  commentCount,
  onEdit,
  onDelete,
  onViewComments,
  isCommentsExpanded = false
}: ForumPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachments, setAttachments] = useState<ForumAttachment[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Like state
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [userLiked, setUserLiked] = useState(post.user_liked || false);
  const [isLiking, setIsLiking] = useState(false);

  const isOwnPost = currentUserId === post.user_id;

  // Sync like state when post prop changes
  React.useEffect(() => {
    setLikeCount(post.like_count || 0);
    setUserLiked(post.user_liked || false);
  }, [post.like_count, post.user_liked]);
  const shouldTruncate = post.content.length > CONTENT_PREVIEW_LENGTH;
  const displayContent = isExpanded || !shouldTruncate 
    ? post.content 
    : post.content.slice(0, CONTENT_PREVIEW_LENGTH) + '...';

  // Load attachments for the post
  useEffect(() => {
    const loadAttachments = async () => {
      try {
        const postAttachments = await ForumService.getAttachmentsByPostId(post.id);
        setAttachments(postAttachments);
      } catch (error) {
        console.error('Error loading attachments:', error);
      }
    };

    loadAttachments();
  }, [post.id]);

  const handleLikeToggle = async () => {
    if (!currentUserId) {
      toast.error('Please sign in to like posts');
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    // Optimistic update
    const newLiked = !userLiked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setUserLiked(newLiked);
    setLikeCount(newCount);

    try {
      const result = await ForumService.togglePostLike(post.id);
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3 px-4 md:px-6">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold text-foreground leading-tight hover:text-primary transition-colors break-words">
            {post.title}
          </h2>
          
          {/* Author and timestamp */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-6 w-6">
                <AvatarImage 
                  src={post.user_profile?.avatar_url || undefined} 
                  alt={post.user_profile?.username || 'Anonymous'} 
                />
                <AvatarFallback className="text-xs">
                  {(post.user_profile?.username || 'A').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-[120px] md:max-w-none">{post.user_profile?.username || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{formatDate(post.created_at)}</span>
              {post.updated_at && post.updated_at !== post.created_at && (
                <Badge variant="outline" className="text-xs ml-1">edited</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-4 md:px-6">
          {/* Content preview */}
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed break-words text-sm md:text-base">
            {displayContent}
          </p>
          
          {/* Read more/less toggle */}
          {shouldTruncate && (
            <Button
              variant="link"
              size="sm"
              className="px-0 h-auto mt-1 text-primary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Read more
                </>
              )}
            </Button>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-3">
              {/* Image attachments */}
              {attachments.filter(a => ForumService.isImageFile(a.file_type)).length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {attachments
                    .filter(a => ForumService.isImageFile(a.file_type))
                    .map((attachment) => (
                      <ImageThumbnail
                        key={attachment.id}
                        src={attachment.file_url}
                        alt={attachment.file_name}
                        onClick={() => setSelectedImage(attachment.file_url)}
                      />
                    ))}
                </div>
              )}
              
              {/* Document attachments */}
              {attachments.filter(a => !ForumService.isImageFile(a.file_type)).length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {attachments
                    .filter(a => !ForumService.isImageFile(a.file_type))
                    .map((attachment) => (
                      <FileAttachment
                        key={attachment.id}
                        fileName={attachment.file_name}
                        fileUrl={attachment.file_url}
                        fileType={attachment.file_type}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 md:px-6">
          {/* Like and Comment buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {/* Like button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={cn(
                'gap-1.5',
                userLiked && 'text-red-500 hover:text-red-600'
              )}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={cn('h-4 w-4', userLiked && 'fill-current')} />
              )}
              <span>{likeCount > 0 ? likeCount : ''}</span>
            </Button>

            {/* Comment count and view button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => onViewComments?.(post.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
              {isCommentsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Edit/Delete buttons for post owner */}
          {isOwnPost && (
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit?.(post)}
                className="gap-1.5"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete?.(post.id)}
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Image modal for full-size view */}
      <ImageModal
        src={selectedImage || ''}
        alt="Full size image"
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
