'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ForumService, ForumPost } from '@/lib/services/forumService';
import type { ForumComment } from '@/lib/services/forumService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Recursive helper function to add a reply to a specific comment (or its children)
const addReplyToComment = (comments: ForumComment[], parentCommentId: string, newComment: ForumComment): ForumComment[] => {
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
const removeCommentRecursive = (comments: ForumComment[], commentIdToDelete: string): ForumComment[] => {
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
const updateCommentRecursive = (comments: ForumComment[], commentIdToEdit: string, newText: string): ForumComment[] => {
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
interface ForumCommentProps {
  comment: ForumComment;
  onReply: (parentCommentId: string, replyText: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newText: string) => void;
  currentUserId: string | undefined;
}

const ForumComment: React.FC<ForumCommentProps> = ({ comment, onReply, onDelete, onEdit, currentUserId }) => {
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
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  const isOwnComment = currentUserId === comment.user_id;
  const authorName = comment.user_profile?.username || 'Anonymous';

  return (
    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200 shadow-sm mb-3">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            required
            autoFocus
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
              disabled={!editedText.trim() || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-4 py-2 rounded-lg transition duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-semibold text-gray-800">{authorName}: </span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(comment.created_at).toLocaleString()}
              {comment.updated_at && comment.updated_at !== comment.created_at && 
                ' (edited)'}
            </span>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </>
      )}

      <div className="mt-2 flex justify-end gap-2">
        {!isEditing && (
          <>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium focus:outline-none"
            >
              {showReplyInput ? 'Cancel Reply' : 'Reply'}
            </button>
            {isOwnComment && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-yellow-500 hover:text-yellow-700 text-sm font-medium focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 text-sm font-medium focus:outline-none flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Delete
                </button>
              </>
            )}
          </>
        )}
      </div>

      {showReplyInput && (
        <form onSubmit={handleReplySubmit} className="mt-3 flex flex-col gap-2">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder={`Reply to ${authorName}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
              disabled={!replyText.trim() || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-3 border-l-2 border-gray-300 pl-4">
          {comment.replies.map(reply => (
            <ForumComment
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
    </div>
  );
};

// --- Main ForumPage Component ---
export default function ForumPage() {  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');  
  const [selectedPostIdForComment, setSelectedPostIdForComment] = useState<string | null>(null);
  const [topLevelCommentText, setTopLevelCommentText] = useState('');
  const [postComments, setPostComments] = useState<Record<string, ForumComment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newPost = await ForumService.createPost({
        title: newTitle,
        content: newContent
      });

      // Add to local state
      setPosts(prevPosts => [newPost, ...prevPosts]);
        // Reset form
      setNewTitle('');
      setNewContent('');
      setShowCreateFormModal(false);
      
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  /**
   * Handles updating an existing forum post.
   * @param e The form submission event.
   */
  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !newTitle.trim() || !newContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Update the post in the database
      const updatedPost = await ForumService.updatePost(editingPost.id, {
        title: newTitle,
        content: newContent
      });

      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
      );
        // Reset form
      setNewTitle('');
      setNewContent('');
      setEditingPost(null);
      setShowCreateFormModal(false);
      
      toast.success('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    try {
      // Delete from database
      await ForumService.deletePost(postIdToDelete);
      
      // Remove from local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postIdToDelete));
      
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
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
  ) => {    if (!currentUser) {
      toast.error('You must be logged in to comment');
      router.push('/auth/signin');
      return;
    }

    try {
      const newComment = await ForumService.createComment({
        post_id: postId,
        content: commentText,
        parent_comment_id: parentCommentId
      });

      // Add user profile info for display
      const commentWithProfile = {
        ...newComment,        user_profile: {
          username: currentUser.name || currentUser.email || 'Anonymous',
          avatar_url: undefined // Use undefined to match the type definition
        },
        replies: []
      };

      // Update local state
      setPostComments(prevComments => {
        const currentPostComments = prevComments[postId] || [];
        
        if (parentCommentId) {
          // It's a reply to another comment
          return {
            ...prevComments,
            [postId]: addReplyToComment(currentPostComments, parentCommentId, commentWithProfile)
          };
        } else {
          // It's a top-level comment
          return {
            ...prevComments,
            [postId]: [...currentPostComments, commentWithProfile]
          };
        }
      });

      // Reset the comment form if it's a top-level comment
      if (!parentCommentId) {
        setTopLevelCommentText('');
      }
      
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  /**
   * Handles deleting a comment (top-level or nested reply).
   * @param postId The ID of the post the comment belongs to.
   * @param commentIdToDelete The ID of the comment to delete.
   */
  const handleDeleteComment = async (postId: string, commentIdToDelete: string) => {
    try {
      await ForumService.deleteComment(commentIdToDelete);
      
      // Update local state
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

  /**
   * Handles editing a comment (top-level or nested reply).
   * @param postId The ID of the post the comment belongs to.
   * @param commentIdToEdit The ID of the comment to edit.
   * @param newText The new text for the comment.
   */
  const handleEditComment = async (postId: string, commentIdToEdit: string, newText: string) => {
    try {
      await ForumService.updateComment(commentIdToEdit, newText);
      
      // Update local state
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <span className="ml-4 text-xl">Loading forum posts...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg font-sans relative">      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 flex-grow text-center pr-[116px]">
          Community Forum
        </h1>
        <button
          onClick={() => {
            if (!currentUser) {
              toast.error('You must be logged in to create posts');
              router.push('/auth/signin');
              return;
            }
            setEditingPost(null);
            setShowCreateFormModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 whitespace-nowrap"
        >
          Add New Post
        </button>
      </div>

      {/* Display Forum Posts */}
      <div className="space-y-6 mb-10">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              {/* Post header with title and delete/edit button */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-3xl font-bold text-gray-900">{post.title}</h2>
                {/* Edit and Delete buttons for posts, only visible to the author */}
                {currentUser && post.user_id === currentUser.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPostClick(post)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-2">{post.content}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>
                  Posted by: {post.user_profile?.username || 'Anonymous'}
                </span>
                <span>
                  {new Date(post.created_at).toLocaleString()}
                  {post.updated_at && post.updated_at !== post.created_at && ' (edited)'}
                </span>
              </div>              {/* No attachment display since the database doesn't support it */}

              {/* Top-level Comment Section Toggle Button */}
              <div className="flex justify-start mt-4">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg border border-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => {
                    setSelectedPostIdForComment(selectedPostIdForComment === post.id ? null : post.id);
                    setTopLevelCommentText('');
                  }}
                >
                  {selectedPostIdForComment === post.id ? 'Hide Comments' : 'View/Add Comments'}
                </button>
              </div>

              {/* Comments Section (conditionally rendered) */}
              {selectedPostIdForComment === post.id && (
                <div className="mt-4">
                  {/* Top-Level Comment Input Form */}
                  {currentUser ? (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleAddComment(post.id, topLevelCommentText);
                    }} className="mt-5 flex gap-3">
                      <textarea
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Type your comment..."
                        value={topLevelCommentText}
                        onChange={e => setTopLevelCommentText(e.target.value)}
                        rows={2}
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!topLevelCommentText.trim()}
                      >
                        Submit
                      </button>
                    </form>
                  ) : (
                    <div className="mt-5 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-700">
                      <p>Please <a href="/auth/signin" className="text-blue-600 hover:text-blue-800 underline">sign in</a> to comment.</p>
                    </div>
                  )}

                  {/* Display Comments */}
                  <div className="mt-6 space-y-3 pb-4 border-b border-gray-200">
                    {postComments[post.id]?.length > 0 ? (
                      postComments[post.id].map(c => (
                        <ForumComment
                          key={c.id}
                          comment={c}
                          onReply={(parentId, text) => handleAddComment(post.id, text, parentId)}
                          onDelete={(commentId) => handleDeleteComment(post.id, commentId)}
                          onEdit={(commentId, newText) => handleEditComment(post.id, commentId, newText)}
                          currentUserId={currentUser?.id}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No comments yet. Be the first to reply!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-xl py-10 rounded-xl border-dashed border-2 border-gray-300 bg-white shadow-inner">
            No forum topics posted yet. Click "Add New Post" to start a discussion!
          </div>
        )}
      </div>

      {/* Create/Edit Post Modal (conditionally rendered) */}
      {showCreateFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-lg relative">
            {/* Close button for the modal */}
            <button
              onClick={() => {
                setShowCreateFormModal(false);
                setEditingPost(null);
              }}              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              disabled={isSubmitting}
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {editingPost ? 'Edit Discussion Topic' : 'Create a New Discussion Topic'}
            </h2>
            <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost} className="space-y-5">
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"                placeholder="Topic Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"                placeholder="What's on your mind? Share details here..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
                disabled={isSubmitting}
                rows={5}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"                disabled={!newTitle.trim() || !newContent.trim() || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isSubmitting ? 'Submitting...' : (editingPost ? 'Save Changes' : 'Submit New Post')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
