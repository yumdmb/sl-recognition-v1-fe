'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ForumService } from '@/lib/services/forumService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  commentId: string;
  initialCount: number;
  initialLiked: boolean;
  isAuthenticated: boolean;
  onLikeChange?: (count: number, liked: boolean) => void;
}

export function LikeButton({
  commentId,
  initialCount,
  initialLiked,
  isAuthenticated,
  onLikeChange
}: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like comments');
      return;
    }

    setIsLoading(true);
    
    // Optimistic update
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;
    setLiked(newLiked);
    setCount(newCount);

    try {
      const result = await ForumService.toggleCommentLike(commentId);
      setCount(result.count);
      setLiked(result.userLiked);
      onLikeChange?.(result.count, result.userLiked);
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLiked);
      setCount(newLiked ? newCount - 1 : newCount + 1);
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleLike}
      disabled={isLoading}
      className={cn(
        'gap-1.5 px-2',
        liked && 'text-red-500 hover:text-red-600'
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={cn('h-4 w-4', liked && 'fill-current')}
        />
      )}
      <span className="text-xs">{count}</span>
    </Button>
  );
}
