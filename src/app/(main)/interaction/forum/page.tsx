'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ForumService, ForumPost } from '@/lib/services/forumService';
import type { ForumComment as ForumCommentType } from '@/lib/services/forumService'; // Renamed to avoid conflict
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2, MessageSquare, Edit3, Trash2, PlusCircle, Eye, EyeOff, Send } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      continue; // This is the comment to delete, so skip it
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
      return { ...comment, content: newText }; // Found the comment, update its text
    } else if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentRecursive(comment.replies, commentIdToEdit, newText)
      };
    }
    return comment;
  });
};

// --- Comment Component for Recursive Rendering ---
interface ForumCommentDisplayProps { // Renamed to avoid conflict with the component itself
  comment: ForumCommentType;
  onReply: (parentCommentId: string, replyText: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newText: string) => void;
  currentUserId: string | undefined;
}

const ForumCommentDisplay: React.FC<ForumCommentDisplayProps> = ({ comment, onReply, onDelete, onEdit, currentUserId }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() && !isSubmitting) {
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
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedText.trim() && editedText !== comment.content && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onEdit(comment.id, editedText);
      } catch (error) {
        console.error('Error updating comment:', error);
        toast.error('Failed to update comment. Please try again.');
      } finally {
        setIsSubmitting(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false); // If no changes or empty, just close edit mode
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
        // No need to setIsDeleting(false) here as the component might unmount
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment. Please try again.');
        setIsDeleting(false); // Only set back if error occurs
      }
    }
  };

  const isOwnComment = currentUserId === comment.user_id;
  const authorName = comment.user_profile?.username || 'Anonymous';

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              required
              autoFocus
              rows={3}
              placeholder="Edit your comment..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={!editedText.trim() || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-semibold text-card-foreground">{authorName}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {new Date(comment.created_at).toLocaleString()}
                {comment.updated_at && comment.updated_at !== comment.created_at &&
                  ' (edited)'}
              </span>
            </div>
            <p className="text-sm text-card-foreground/90">{comment.content}</p>
          </>
        )}

        <div className="mt-2 flex justify-end gap-2">
          {!isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <MessageSquare className="mr-1 h-3.5 w-3.5" />
                {showReplyInput ? 'Cancel' : 'Reply'}
              </Button>
              {isOwnComment && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    {isDeleting ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1 h-3.5 w-3.5" />}
                    Delete
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {showReplyInput && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex flex-col gap-2">
            <Textarea
              placeholder={`Reply to ${authorName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              required
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={!replyText.trim() || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Reply
              </Button>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-6 mt-3 border-l-2 border-border pl-4">
            {comment.replies.map(reply => (
              <ForumCommentDisplay // Recursive call
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                onEdit={onEdit}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Main ForumPage Component ---
export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedPostIdForComment, setSelectedPostIdForComment] = useState<string | null>(null);
  const [topLevelCommentText, setTopLevelCommentText] = useState('');
  const [postComments, setPostComments] = useState<Record<string, ForumCommentType[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false); // For posts
  const [isSubmittingComment, setIsSubmittingComment] = useState(false); // For comments

  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
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
          }
        } catch (error) {
          console.error(`Error loading comments for post ${selectedPostIdForComment}:`, error);
          toast.error('Failed to load comments. Please try again later.');
        }
      };

      loadComments();
    }
  }, [selectedPostIdForComment, postComments]);
  /**
   * Handles the creation of a new forum post.
   * @param e The form submission event.
   */
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isSubmittingPost) return;

    setIsSubmittingPost(true);
    try {
      if (editingPost) { // Update existing post
        const updatedPost = await ForumService.updatePost(editingPost.id, {
          title: newTitle,
          content: newContent
        });
        setPosts(prevPosts =>
          prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
        );
        toast.success('Post updated successfully!');
      } else { // Create new post
        const newPost = await ForumService.createPost({
          title: newTitle,
          content: newContent
        });
        setPosts(prevPosts => [newPost, ...prevPosts]);
        toast.success('Post created successfully!');
      }
      setNewTitle('');
      setNewContent('');
      setEditingPost(null);
      setShowCreateFormModal(false);
    } catch (error) {
      console.error(`Error ${editingPost ? 'updating' : 'creating'} post:`, error);
      toast.error(`Failed to ${editingPost ? 'update' : 'create'} post. Please try again.`);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  /**
   * Handles initiating the edit process for a post.
   * @param postToEdit The post object to be edited.
   */
  const handleEditPostClick = (postToEdit: ForumPost) => {
    setEditingPost(postToEdit);
    setShowCreateFormModal(true);
  };
  /**
   * Handles deleting a forum post.
   * @param postIdToDelete The ID of the post to delete.
   */
  const handleDeletePost = async (postIdToDelete: string) => {
    // Consider adding a confirmation dialog here using <AlertDialog>
    // For now, direct delete:
    // setIsDeletingPost(true); // if you add a specific loading state for delete
    try {
      await ForumService.deletePost(postIdToDelete);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postIdToDelete));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      // setIsDeletingPost(false);
    }
  };

  /**
   * Handles adding a new comment (either top-level or a reply).
   * This function is passed down to ForumComment for nested replies.
   * @param postId The ID of the post the comment belongs to.
   * @param commentText The text of the comment.
   * @param parentCommentId Optional: The ID of the parent comment if it's a reply.
   */
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
        user_profile: { // Assuming createComment returns the full comment with user_id
          username: currentUser.name || currentUser.email || 'Anonymous',
          // avatar_url: undefined, // Removed as avatars are not used
        },
        replies: [] // New comments don't have replies initially
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
        setTopLevelCommentText(''); // Reset only for top-level comments
      }
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  /**
   * Handles deleting a comment (top-level or nested reply).
   * @param postId The ID of the post the comment belongs to.
   * @param commentIdToDelete The ID of the comment to delete.
   */
  const handleDeleteComment = async (postId: string, commentIdToDelete: string) => {
    // Consider adding a confirmation dialog
    // setIsDeletingComment(true);
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
    } finally {
      // setIsDeletingComment(false);
    }
  };

  /**
   * Handles editing a comment (top-level or nested reply).
   * @param postId The ID of the post the comment belongs to.
   * @param commentIdToEdit The ID of the comment to edit.
   * @param newText The new text for the comment.
   */
  const handleEditComment = async (postId: string, commentIdToEdit: string, newText: string) => {
    // setIsEditingComment(true);
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
    } finally {
      // setIsEditingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading forum posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center sm:text-left">
          Community Forum
        </h1>
        <Button
          size="lg"
          onClick={() => {
            if (!currentUser) {
              toast.error('You must be logged in to create posts');
              router.push('/auth/signin');
              return;
            }
            setEditingPost(null); // Clear any editing state
            setNewTitle('');      // Clear form fields
            setNewContent('');
            setShowCreateFormModal(true);
          }}
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Post
        </Button>
      </div>

      {/* Display Forum Posts */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  {currentUser && post.user_id === currentUser.id && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleEditPostClick(post)}>
                        <Edit3 className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription className="text-xs pt-1">
                  Posted by: {post.user_profile?.username || 'Anonymous'} on {new Date(post.created_at).toLocaleDateString()}
                  {post.updated_at && post.updated_at !== post.created_at && ` (edited ${new Date(post.updated_at).toLocaleDateString()})`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPostIdForComment(selectedPostIdForComment === post.id ? null : post.id);
                    if (selectedPostIdForComment !== post.id) setTopLevelCommentText(''); // Clear comment text when opening new section
                  }}
                >
                  {selectedPostIdForComment === post.id ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {selectedPostIdForComment === post.id ? 'Hide Comments' : `View Comments (${postComments[post.id]?.length || 0})`}
                </Button>

                {selectedPostIdForComment === post.id && (
                  <div className="w-full mt-4 border-t pt-4">
                    {currentUser ? (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(post.id, topLevelCommentText);
                      }} className="flex flex-col sm:flex-row gap-2 items-start">
                        <Textarea
                          placeholder="Write a comment..."
                          value={topLevelCommentText}
                          onChange={e => setTopLevelCommentText(e.target.value)}
                          rows={2}
                          required
                          className="flex-grow"
                        />
                        <Button type="submit" disabled={!topLevelCommentText.trim() || isSubmittingComment} className="w-full sm:w-auto">
                          {isSubmittingComment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                          Comment
                        </Button>
                      </form>
                    ) : (
                      <Alert variant="default" className="mt-2">
                        <AlertDescription>
                          Please <a href="/auth/signin" className={buttonVariants({ variant: "link", className: "p-0 h-auto"})}>sign in</a> to comment.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="mt-6 space-y-4">
                      {postComments[post.id]?.length > 0 ? (
                        postComments[post.id].map(c => (
                          <ForumCommentDisplay
                            key={c.id}
                            comment={c}
                            onReply={(parentId, text) => handleAddComment(post.id, text, parentId)}
                            onDelete={(commentId) => handleDeleteComment(post.id, commentId)}
                            onEdit={(commentId, newText) => handleEditComment(post.id, commentId, newText)}
                            currentUserId={currentUser?.id}
                          />
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to reply!</p>
                      )}
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
          <CardContent>
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No forum topics posted yet.</p>
            <p className="text-sm text-muted-foreground">Click "Add New Post" to start a discussion!</p>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Post Modal */}
      <Dialog open={showCreateFormModal} onOpenChange={(open) => {
        setShowCreateFormModal(open);
        if (!open) setEditingPost(null); // Reset editing post when dialog closes
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingPost ? 'Edit Discussion Topic' : 'Create New Discussion Topic'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePostSubmit} className="space-y-4 py-4">
            <div>
              <label htmlFor="postTitle" className="block text-sm font-medium text-foreground mb-1">Title</label>
              <Input
                id="postTitle"
                placeholder="Enter topic title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                disabled={isSubmittingPost}
              />
            </div>
            <div>
              <label htmlFor="postContent" className="block text-sm font-medium text-foreground mb-1">Content</label>
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateFormModal(false);
                  setEditingPost(null);
                }}
                disabled={isSubmittingPost}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newTitle.trim() || !newContent.trim() || isSubmittingPost}
              >
                {isSubmittingPost && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmittingPost ? 'Submitting...' : (editingPost ? 'Save Changes' : 'Submit Post')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
