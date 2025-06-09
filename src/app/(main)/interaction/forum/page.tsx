'use client';

import React, { useState, useEffect } from 'react';

// Type definitions for Forum Topic and Comment
type Topic = {
  id: number;
  title: string;
  content: string;
  fileUrl?: string;     // Optional URL for attached file
  fileType?: string;    // MIME type of the attached file
  fileName?: string;    // Original file name (added for display after post creation)
  comments: Comment[];  // Array of top-level comments associated with the topic
  author: string;       // Author of the topic
  timestamp: number;    // Timestamp for when the topic was created (added)
};

type Comment = {
  id: number;
  user: string;     // User who posted the comment
  text: string;     // Content of the comment
  timestamp: number; // Timestamp for when the comment was created (added)
  replies?: Comment[]; // Optional array for nested replies
};

// Recursive helper function to add a reply to a specific comment (or its children)
const addReplyToComment = (comments: Comment[], parentCommentId: number, newComment: Comment): Comment[] => {
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
const removeCommentRecursive = (comments: Comment[], commentIdToDelete: number): Comment[] => {
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
const updateCommentRecursive = (comments: Comment[], commentIdToEdit: number, newText: string): Comment[] => {
  return comments.map(comment => {
    if (comment.id === commentIdToEdit) {
      return { ...comment, text: newText }; // Found the comment, update its text
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
  comment: Comment;
  onReply: (parentCommentId: number, replyText: string) => void;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newText: string) => void;
}

const ForumComment: React.FC<ForumCommentProps> = ({ comment, onReply, onDelete, onEdit }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedText.trim() && editedText !== comment.text) {
      onEdit(comment.id, editedText);
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200 shadow-sm mb-3">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex gap-2 items-center">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            required
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            disabled={!editedText.trim()}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-4 py-2 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-semibold text-gray-800">{comment.user}: </span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(comment.timestamp).toLocaleString()} {/* Display timestamp */}
            </span>
          </div>
          <p className="text-gray-700">{comment.text}</p>
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
            {comment.user === 'me' && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-yellow-500 hover:text-yellow-700 text-sm font-medium focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium focus:outline-none"
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
      </div>

      {showReplyInput && (
        <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2 items-center">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder={`Reply to ${comment.user}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            disabled={!replyText.trim()}
          >
            Submit
          </button>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main ForumPage Component ---
export default function ForumPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [selectedTopicIdForComment, setSelectedTopicIdForComment] = useState<number | null>(null);
  const [topLevelCommentText, setTopLevelCommentText] = useState('');

  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (editingTopic) {
      setNewTitle(editingTopic.title);
      setNewContent(editingTopic.content);
      setNewFile(null);
    } else {
      setNewTitle('');
      setNewContent('');
      setNewFile(null);
    }
  }, [editingTopic]);


  /**
   * Handles the creation of a new forum topic.
   * @param e The form submission event.
   */
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      return;
    }

    setTopics(prevTopics => [
      {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        fileUrl: newFile ? URL.createObjectURL(newFile) : undefined,
        fileType: newFile ? newFile.type : undefined,
        fileName: newFile ? newFile.name : undefined,
        comments: [],
        author: 'me',
        timestamp: Date.now(), // Set timestamp on creation
      },
      ...prevTopics
    ]);

    setNewTitle('');
    setNewContent('');
    setNewFile(null);
    setShowCreateFormModal(false);
  };

  /**
   * Handles updating an existing forum topic.
   * @param e The form submission event.
   */
  const handleUpdateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic || !newTitle.trim() || !newContent.trim()) {
      return;
    }

    setTopics(prevTopics => prevTopics.map(topic => {
      if (topic.id === editingTopic.id) {
        return {
          ...topic,
          title: newTitle,
          content: newContent,
          fileUrl: newFile ? URL.createObjectURL(newFile) : topic.fileUrl,
          fileType: newFile ? newFile.type : topic.fileType,
          fileName: newFile ? newFile.name : topic.fileName,
          // No timestamp update on edit for simplicity, but could add 'lastEdited'
        };
      }
      return topic;
    }));

    setNewTitle('');
    setNewContent('');
    setNewFile(null);
    setEditingTopic(null);
    setShowCreateFormModal(false);
  };

  /**
   * Handles initiating the edit process for a topic.
   * @param topicToEdit The topic object to be edited.
   */
  const handleEditTopicClick = (topicToEdit: Topic) => {
    setEditingTopic(topicToEdit);
    setShowCreateFormModal(true);
  };


  /**
   * Handles deleting a forum topic.
   * @param topicIdToDelete The ID of the topic to delete.
   */
  const handleDeleteTopic = (topicIdToDelete: number) => {
    setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicIdToDelete));
  };

  /**
   * Handles adding a new comment (either top-level or a reply).
   * This function is passed down to ForumComment for nested replies.
   * @param topicId The ID of the topic the comment belongs to.
   * @param commentText The text of the comment.
   * @param parentCommentId Optional: The ID of the parent comment if it's a reply.
   */
  const handleAddComment = (
    topicId: number,
    commentText: string,
    parentCommentId: number | null = null
  ) => {
    const newComment: Comment = {
      id: Date.now(),
      user: 'me',
      text: commentText,
      timestamp: Date.now(), // Set timestamp on creation
      replies: []
    };

    setTopics(prevTopics => prevTopics.map(topic => {
      if (topic.id === topicId) {
        if (parentCommentId) {
          return {
            ...topic,
            comments: addReplyToComment(topic.comments, parentCommentId, newComment)
          };
        } else {
          return {
            ...topic,
            comments: [...topic.comments, newComment]
          };
        }
      }
      return topic;
    }));

    if (!parentCommentId) {
      setTopLevelCommentText('');
      setSelectedTopicIdForComment(null);
    }
  };

  /**
   * Handles deleting a comment (top-level or nested reply).
   * @param topicId The ID of the topic the comment belongs to.
   * @param commentIdToDelete The ID of the comment to delete.
   */
  const handleDeleteComment = (topicId: number, commentIdToDelete: number) => {
    setTopics(prevTopics => prevTopics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          comments: removeCommentRecursive(topic.comments, commentIdToDelete)
        };
      }
      return topic;
    }));
  };

  /**
   * Handles editing a comment (top-level or nested reply).
   * @param topicId The ID of the topic the comment belongs to.
   * @param commentIdToEdit The ID of the comment to edit.
   * @param newText The new text for the comment.
   */
  const handleEditComment = (topicId: number, commentIdToEdit: number, newText: string) => {
    setTopics(prevTopics => prevTopics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          comments: updateCommentRecursive(topic.comments, commentIdToEdit, newText)
        };
      }
      return topic;
    }));
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg font-sans relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 flex-grow text-center pr-[116px]">
          Community Forum
        </h1>
        <button
          onClick={() => {
            setEditingTopic(null);
            setShowCreateFormModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 whitespace-nowrap"
        >
          Add New Post
        </button>
      </div>

      {/* Display Forum Topics */}
      <div className="space-y-6 mb-10">
        {topics.length > 0 ? (
          topics.map(topic => (
            <div key={topic.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              {/* Topic header with title and delete/edit button */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-3xl font-bold text-gray-900">{topic.title}</h2>
                {/* Edit and Delete buttons for topics, only visible to the author */}
                {topic.author === 'me' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTopicClick(topic)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium focus:outline-none py-1 px-3 border border-yellow-300 rounded-lg"
                    >
                      Edit Post
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium focus:outline-none py-1 px-3 border border-red-300 rounded-lg"
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-2">{topic.content}</p>
              <p className="text-xs text-gray-500 mb-4">
                Posted on: {new Date(topic.timestamp).toLocaleString()} {/* Display topic timestamp */}
              </p>

              {/* Attachment Display */}
              {topic.fileUrl && (
                <div className="my-4 pt-4 text-center">
                  {topic.fileType && topic.fileType.startsWith('image/') ? (
                    <div className="mb-2">
                        <img
                            src={topic.fileUrl}
                            alt="Attached file"
                            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                            style={{ maxHeight: '300px' }}
                        />
                    </div>
                  ) : (
                    <div className="mb-2 text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M.07 2A1 1 0 011 1h7a1 1 0 011 1v1h3a1 1 0 011 1v7a1 1 0 01-1 1h-1v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3H2a1 1 0 01-1-1V2zm7 0H2v7h7V2h-2z" clipRule="evenodd" />
                        </svg>
                        Attached File: {topic.fileName || 'Document'}
                    </div>
                  )}
                  <a
                    href={topic.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline transition duration-200"
                  >
                    Click to Open Attachment
                  </a>
                </div>
              )}

              {/* Top-level Comment Section Toggle Button */}
              <div className="flex justify-start mt-4">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg border border-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => {
                    setSelectedTopicIdForComment(selectedTopicIdForComment === topic.id ? null : topic.id);
                    setTopLevelCommentText('');
                  }}
                >
                  {selectedTopicIdForComment === topic.id ? 'Hide Comment' : 'Add Your Comment'}
                </button>
              </div>

              {/* Top-Level Comment Input Form (conditionally rendered) */}
              {selectedTopicIdForComment === topic.id && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment(topic.id, topLevelCommentText);
                }} className="mt-5 flex gap-3">
                  <input
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Type your comment..."
                    value={topLevelCommentText}
                    onChange={e => setTopLevelCommentText(e.target.value)}
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
              )}

              {/* Display Comments (using recursive ForumComment component) */}
              <div className="mt-6 space-y-3 pb-4 border-b border-gray-200">
                {topic.comments.length > 0 ? (
                  topic.comments.map(c => (
                    <ForumComment
                      key={c.id}
                      comment={c}
                      onReply={(parentId, text) => handleAddComment(topic.id, text, parentId)}
                      onDelete={(commentId) => handleDeleteComment(topic.id, commentId)}
                      onEdit={(commentId, newText) => handleEditComment(topic.id, commentId, newText)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to reply!</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-xl py-10 rounded-xl border-dashed border-2 border-gray-300 bg-white shadow-inner">
            No forum topics posted yet. Click "Add New Post" to start a discussion!
          </div>
        )}
      </div>

      {/* Create/Edit Topic Modal (conditionally rendered) */}
      {showCreateFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-lg relative">
            {/* Close button for the modal */}
            <button
              onClick={() => {
                setShowCreateFormModal(false);
                setEditingTopic(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {editingTopic ? 'Edit Discussion Topic' : 'Create a New Discussion Topic'}
            </h2>
            <form onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic} className="space-y-5">
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Topic Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="What's on your mind? Share details here..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
              />
              <label className="block text-gray-700 font-medium mb-2">
                Attach Document (Optional):
                <input
                  type="file"
                  onChange={e => setNewFile(e.target.files?.[0] || null)}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {newFile && <span className="text-sm text-gray-600 mt-1 block">Selected: {newFile.name}</span>}
                {editingTopic && !newFile && editingTopic.fileUrl && (
                    <span className="text-sm text-gray-500 mt-1 block">
                        Current attachment: <a href={editingTopic.fileUrl} target="_blank" rel="noopener noreferrer" className="underline">{editingTopic.fileName || 'File'}</a>
                    </span>
                )}
              </label>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newTitle.trim() || !newContent.trim()}
              >
                {editingTopic ? 'Save Changes' : 'Submit New Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
