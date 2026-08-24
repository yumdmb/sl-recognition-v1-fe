'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ForumService, ForumPost } from '@/lib/services/forumService';
import type { ForumComment as ForumCommentType } from '@/lib/services/forumService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2, MessageSquare, Pencil, Trash2, Plus, Eye, EyeOff, Send, MessagesSquare, PlusCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ForumPostCard, CommentThread, ImageModal } from '@/components/forum';
import { cn } from '@/lib/utils';

// Recursive helper function to add a reply to a specific comment (or its children)
const addReplyToComment = (comments: ForumCommentType[], parentCommentId: string, newComment: ForumCommentType): ForumCommentType[] => {
  return comments.map(comment => {
    if (comment.id === parentCommentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newComment]
      };
    } else if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToComment(comment.replies, parentCommentId, newComment)
      };
    }
    return comment;
  });
};

// Recursive helper function to remove a comment from a nested structure
const removeCommentRecursive = (comments: ForumCommentType[], commentIdToDelete: string): ForumCommentType[] => {
  const updatedComments = [];
  for (const comment of comments) {
    if (comment.id === commentIdToDelete) {
      continue;
    }
    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = removeCommentRecursive(comment.replies, commentIdToDelete);
      updatedComments.push({ ...comment, replies: updatedReplies });
    } else {
      updatedComments.push(comment);
    }
  }
  return updatedComments;
};

// Recursive helper function to update a comment's text in a nested structure
const updateCommentRecursive = (comments: ForumCommentType[], commentIdToEdit: string, newText: string): ForumCommentType[] => {
  return comments.map(comment => {
    if (comment.id === commentIdToEdit) {
      return { ...comment, content: newText };
    } else if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentRecursive(comment.replies, commentIdToEdit, newText)
      };
    }
    return comment;
  });
};

// Helper to count all comments including nested replies
const countAllComments = (comments: ForumCommentType[]): number => {
  return comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
  }, 0);
};

// Helper to get all comment IDs including nested
const getAllCommentIds = (comments: ForumCommentType[]): string[] => {
  return comments.flatMap(c => [c.id, ...getAllCommentIds(c.replies || [])]);
};

const getInitials = (name: string) =>
  (name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedPostIdForComment, setSelectedPostIdForComment] = useState<string | null>(null);
  const [topLevelCommentText, setTopLevelCommentText] = useState('');
  const [postComments, setPostComments] = useState<Record<string, ForumCommentType[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; userLiked: boolean }>>({});
  const [pendingFiles, setPendingFiles] = useState<{ file: File; preview: string; isImage: boolean }[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  
  const { currentUser } = useAuth();
  const router = useRouter();

  // Load all posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await ForumService.getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading forum posts:', error);
        toast.error('Failed to load forum posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Set up form values when editing a post
  useEffect(() => {
    if (editingPost) {
      setNewTitle(editingPost.title);
      setNewContent(editingPost.content);
    } else {
      setNewTitle('');
      setNewContent('');
    }
  }, [editingPost]);

  // Load comments for a post when it's selected
  useEffect(() => {
    if (selectedPostIdForComment) {
      const loadComments = async () => {
        try {
          if (!postComments[selectedPostIdForComment]) {
            const fetchedComments = await ForumService.getCommentsByPostId(selectedPostIdForComment);
            setPostComments(prev => ({
              ...prev,
              [selectedPostIdForComment]: fetchedComments
            }));

            // Load likes for all comments (including nested)
            const commentIds = getAllCommentIds(fetchedComments);
            
            if (commentIds.length > 0) {
              try {
                const likesMap = await ForumService.getCommentLikesBatch(commentIds);
                const likesObj: Record<string, { count: number; userLiked: boolean }> = {};
                likesMap.forEach((value, key) => {
                  likesObj[key] = value;
                });
                setCommentLikes(prev => ({ ...prev, ...likesObj }));
              } catch (likeError) {
                console.error('Error loading comment likes:', likeError);
              }
            }
          }
        } catch (error) {
          console.error(`Error loading comments for post ${selectedPostIdForComment}:`, error);
          toast.error('Failed to load comments. Please try again later.');
        }
      };

      loadComments();
    }
  }, [selectedPostIdForComment, postComments]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isSubmittingPost) return;

    setIsSubmittingPost(true);
    try {
      if (editingPost) {
        const updatedPost = await ForumService.updatePost(editingPost.id, {
          title: newTitle,
          content: newContent
        });
        setPosts(prevPosts =>
          prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
        );
        toast.success('Post updated successfully!');
      } else {
        const newPost = await ForumService.createPost({
          title: newTitle,
          content: newContent
        });
        
        // Upload pending files now that we have the post ID
        if (pendingFiles.length > 0) {
          for (const { file } of pendingFiles) {
            try {
              await ForumService.uploadAttachment(file, newPost.id);
            } catch (uploadError) {
              console.error('Error uploading attachment:', uploadError);
              toast.error(`Failed to upload ${file.name}`);
            }
          }
        }
        
        setPosts(prevPosts => [newPost, ...prevPosts]);
        toast.success('Post created successfully!');
      }
      setNewTitle('');
      setNewContent('');
      setPendingFiles([]);
      setEditingPost(null);
      setShowCreateFormModal(false);
    } catch (error) {
      console.error(`Error ${editingPost ? 'updating' : 'creating'} post:`, error);
      toast.error(`Failed to ${editingPost ? 'update' : 'create'} post. Please try again.`);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleEditPostClick = (postToEdit: ForumPost) => {
    setEditingPost(postToEdit);
    setShowCreateFormModal(true);
  };

  const handleDeletePost = async (postIdToDelete: string) => {
    try {
      await ForumService.deletePost(postIdToDelete);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postIdToDelete));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const handleViewComments = (postId: string) => {
    setSelectedPostIdForComment(selectedPostIdForComment === postId ? null : postId);
    if (selectedPostIdForComment !== postId) {
      setTopLevelCommentText('');
    }
  };

  const handleAddComment = async (
    postId: string,
    commentText: string,
    parentCommentId: string | null = null
  ) => {
    if (!currentUser) {
      toast.error('You must be logged in to comment');
      router.push('/auth/signin');
      return;
    }
    if (!commentText.trim()) {
      toast.warning('Comment cannot be empty.');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const newCommentData = await ForumService.createComment({
        post_id: postId,
        content: commentText,
        parent_comment_id: parentCommentId
      });

      const commentWithProfile: ForumCommentType = {
        ...newCommentData,
        user_profile: {
          username: currentUser.name || currentUser.email || 'Anonymous',
        },
        replies: []
      };

      setPostComments(prevComments => {
        const currentPostComments = prevComments[postId] || [];
        if (parentCommentId) {
          return {
            ...prevComments,
            [postId]: addReplyToComment(currentPostComments, parentCommentId, commentWithProfile)
          };
        } else {
          return {
            ...prevComments,
            [postId]: [...currentPostComments, commentWithProfile]
          };
        }
      });

      if (!parentCommentId) {
        setTopLevelCommentText('');
      }
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (postId: string, commentIdToDelete: string) => {
    try {
      await ForumService.deleteComment(commentIdToDelete);
      setPostComments(prevComments => {
        if (!prevComments[postId]) return prevComments;
        return {
          ...prevComments,
          [postId]: removeCommentRecursive(prevComments[postId], commentIdToDelete)
        };
      });
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  const handleEditComment = async (postId: string, commentIdToEdit: string, newText: string) => {
    try {
      await ForumService.updateComment(commentIdToEdit, newText);
      setPostComments(prevComments => {
        if (!prevComments[postId]) return prevComments;
        return {
          ...prevComments,
          [postId]: updateCommentRecursive(prevComments[postId], commentIdToEdit, newText)
        };
      });
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment. Please try again.');
    }
  };

  const handleLikeToggle = async (commentId: string): Promise<{ count: number; userLiked: boolean }> => {
    const result = await ForumService.toggleCommentLike(commentId);
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: result
    }));
    return result;
  };

  const getLikeData = (commentId: string) => commentLikes[commentId];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-20 rounded-lg" />
            <Skeleton className="h-8 w-52 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Community</p>
          <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight">Forum</h2>
          <p className="mt-1.5 max-w-xl text-muted-foreground">
            Ask questions, share tips, and learn together with the SignBridge community.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            if (!currentUser) {
              toast.error('You must be logged in to create posts');
              router.push('/auth/signin');
              return;
            }
            setEditingPost(null);
            setNewTitle('');
            setNewContent('');
            setShowCreateFormModal(true);
          }}
        >
          <Plus />
          New post
        </Button>
      </div>

      {/* Display Forum Posts */}
      {posts.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {posts.map(post => {
            const comments = postComments[post.id] || [];
            // Use local count if comments have been loaded, otherwise use count from API
            const commentCount = postComments[post.id] !== undefined 
              ? countAllComments(comments) 
              : (post.comment_count || 0);
            const isExpanded = selectedPostIdForComment === post.id;

            return (
              <div key={post.id} className="space-y-4">
                <ForumPostCard
                  post={post}
                  currentUserId={currentUser?.id}
                  commentCount={commentCount}
                  onEdit={handleEditPostClick}
                  onDelete={handleDeletePost}
                  onViewComments={handleViewComments}
                  isCommentsExpanded={isExpanded}
                />

                {/* Comments Section */}
                {isExpanded && (
                  <Card className="ml-0 md:ml-4 border-l-4 border-l-primary/20">
                    <CardContent className="pt-4">
                      {/* New comment input */}
                      {currentUser ? (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddComment(post.id, topLevelCommentText);
                          }} 
                          className="flex flex-col sm:flex-row gap-2 items-start mb-6"
                        >
                          <Textarea
                            placeholder="Write a comment..."
                            value={topLevelCommentText}
                            onChange={e => setTopLevelCommentText(e.target.value)}
                            rows={2}
                            required
                            className="flex-grow"
                          />
                          <Button
                            type="submit"
                            disabled={!topLevelCommentText.trim() || isSubmittingComment}
                            className="w-full sm:w-auto"
                          >
                            {isSubmittingComment ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Send />
                            )}
                            Comment
                          </Button>
                        </form>
                      ) : (
                        <Alert variant="default" className="mb-6">
                          <AlertDescription>
                            Please <a href="/auth/signin" className={buttonVariants({ variant: "link", className: "p-0 h-auto"})}>sign in</a> to comment.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Comments list with threading */}
                      <div className="space-y-1">
                        {comments.length > 0 ? (
                          comments.map(comment => (
                            <CommentThread
                              key={comment.id}
                              comment={comment}
                              currentUserId={currentUser?.id}
                              likeData={getLikeData(comment.id)}
                              onReply={(parentId, text) => handleAddComment(post.id, text, parentId)}
                              onEdit={(commentId, newText) => handleEditComment(post.id, commentId, newText)}
                              onDelete={(commentId) => handleDeleteComment(post.id, commentId)}
                              onLikeToggle={handleLikeToggle}
                              getLikeData={getLikeData}
                            />
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No comments yet. Be the first to reply!
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <MessagesSquare className="size-6" />
          </span>
          <h3 className="font-display mt-5 text-lg font-bold">No discussions yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Start the first conversation — ask a question or share a learning tip.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setEditingPost(null);
              setNewTitle('');
              setNewContent('');
              setShowCreateFormModal(true);
            }}
          >
            <Plus />
            Create a post
          </Button>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      <Dialog open={showCreateFormModal} onOpenChange={(open) => {
        setShowCreateFormModal(open);
        if (!open) {
          setEditingPost(null);
          // Clean up preview URLs
          pendingFiles.forEach(f => URL.revokeObjectURL(f.preview));
          setPendingFiles([]);
        }
      }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingPost ? 'Edit discussion' : 'New discussion'}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? 'Update your topic title or content.'
                : 'Share something with the community.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePostSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="postTitle" className="block text-sm font-medium text-foreground">Title</label>
              <Input
                id="postTitle"
                placeholder="Enter topic title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                disabled={isSubmittingPost}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="postContent" className="block text-sm font-medium text-foreground">Content</label>
              <Textarea
                id="postContent"
                placeholder="What's on your mind? Share details here..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
                disabled={isSubmittingPost}
                rows={6}
              />
            </div>
            
            {/* Image Attachments Section */}
            {!editingPost && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Attach Images (Optional)
                </label>
                
                {/* Show pending files */}
                {pendingFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pendingFiles.map((item, index) => (
                      <div key={index} className="relative group">
                        {item.isImage ? (
                          <img
                            src={item.preview}
                            alt={item.file.name}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                            onClick={() => setSelectedImage({ src: item.preview, alt: item.file.name })}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-muted rounded-lg flex flex-col items-center justify-center p-1">
                            <span className="text-xs font-medium text-center truncate w-full">
                              {ForumService.getFileTypeLabel(item.file.type)}
                            </span>
                            <span className="text-[10px] text-muted-foreground text-center truncate w-full" title={item.file.name}>
                              {item.file.name.length > 10 ? item.file.name.slice(0, 8) + '...' : item.file.name}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (item.preview) URL.revokeObjectURL(item.preview);
                            setPendingFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Ã—
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* File input for selecting files */}
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const newFiles = Array.from(files).map(file => {
                          const validation = ForumService.validateFile(file);
                          if (!validation.valid) {
                            toast.error(`${file.name}: ${validation.error}`);
                            return null;
                          }
                          // Create preview for images, use placeholder for documents
                          const isImage = ForumService.isImageFile(file.type);
                          return {
                            file,
                            preview: isImage ? URL.createObjectURL(file) : '',
                            isImage
                          };
                        }).filter((f): f is { file: File; preview: string; isImage: boolean } => f !== null);
                        
                        setPendingFiles(prev => [...prev, ...newFiles]);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                    id="file-upload"
                    disabled={isSubmittingPost}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span className="block">Click to select files</span>
                    <span className="text-xs">Images, PDF, Word, Excel, Text (max 10MB each)</span>
                  </label>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateFormModal(false);
                  setEditingPost(null);
                  pendingFiles.forEach(f => URL.revokeObjectURL(f.preview));
                  setPendingFiles([]);
                }}
                disabled={isSubmittingPost}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newTitle.trim() || !newContent.trim() || isSubmittingPost}
              >
                {isSubmittingPost && <Loader2 className="animate-spin" />}
                {isSubmittingPost ? 'Submitting…' : (editingPost ? 'Save changes' : 'Submit post')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Modal for full-size view */}
      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
