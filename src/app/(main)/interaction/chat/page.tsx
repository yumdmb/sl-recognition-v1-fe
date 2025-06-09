'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions for User and Message
type User = {
  id: number;
  username: string;
  isOnline: boolean; // Added for user presence
};

type Message = {
  id: number;
  sender: 'me' | User['username'];
  content: string;
  type: 'text' | 'file';
  fileUrl?: string;
  timestamp: number;     // Added for timestamps
  status?: 'sent' | 'read'; // Added for message status (for 'me' messages)
  isEdited?: boolean;    // Added for edit status
};

// Mock users with online status
const mockUsers: User[] = [
  { id: 2, username: 'alice', isOnline: true },
  { id: 3, username: 'bob', isOnline: false }
];

export default function ChatPage() {
  const [users] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null); // State for editing
  const [editedInput, setEditedInput] = useState(''); // State for edited message text
  // const [otherUserTyping, setOtherUserTyping] = useState(false); // Simulated typing indicator

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for typing indicator timeout

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simulate reading messages after sending (typing indicator removed)
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.sender === 'me' && msg.status === 'sent' ? { ...msg, status: 'read' } : msg
        )
      );
    }
  }, [selectedUser, messages.length > 0 ? messages[messages.length - 1].content : null]);

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  // Handles sending new messages
  const handleSend = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        sender: 'me',
        content: input,
        type: 'text',
        timestamp: Date.now(),
        status: 'sent' // Initial status
      }]);
      setInput('');
    }
    if (file) {
      // In a real app, upload file and get URL. For now, use temporary URL.
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        sender: 'me',
        content: file.name,
        type: 'file',
        fileUrl: URL.createObjectURL(file),
        timestamp: Date.now(),
        status: 'sent'
      }]);
      setFile(null); // Clear the file input after sending
    }
  }, [input, file]);

  // Handles editing an existing message
  const handleEditMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!editedInput.trim() || editingMessageId === null) return;

    setMessages(prevMessages => prevMessages.map(msg =>
      msg.id === editingMessageId
        ? { ...msg, content: editedInput, isEdited: true }
        : msg
    ));
    setEditingMessageId(null);
    setEditedInput('');
  }, [editedInput, editingMessageId]);

  // Handles deleting a message
  const handleDeleteMessage = useCallback((id: number) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  }, []);

  // Helper to format timestamps for display
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to format date for dividers
  const formatDateForDivider = (timestamp: number) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return messageDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex h-[80vh] border border-gray-200 rounded-lg shadow-lg bg-white">
      {/* User List */}
      <div className="w-1/3 border-r border-gray-200 pr-4 flex flex-col">
        <input
          className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(u => (
              <div
                key={u.id}
                className={`p-3 rounded-lg cursor-pointer mb-2 last:mb-0
                  ${selectedUser?.id === u.id ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 transition duration-200'}
                  flex items-center justify-between
                `}
                onClick={() => {
                  setSelectedUser(u);
                  setMessages([]); // Clear messages when switching users for a fresh chat view
                  // In a real app, you'd fetch chat history here
                }}
              >
                <span className="font-semibold">{u.username}</span>
                <span className={`text-xs ${u.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                  {u.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No users found.</div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col pl-6">
        {selectedUser ? (
          <>
            <div className="font-bold text-xl mb-4 pb-3 border-b border-gray-200 text-gray-800 flex items-center justify-between">
              <span>{selectedUser.username}</span>
              {/* Typing indicator removed */}
            </div>
            <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-3 custom-scrollbar">
              {messages.length > 0 ? (
                messages.map((msg, index) => {
                  const prevMsg = messages[index - 1];
                  const showDateDivider = prevMsg && new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                  const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender || showDateDivider || (msg.timestamp - prevMsg.timestamp > 60 * 1000); // New message or different sender or significant time gap
                  const isLastInGroup = !messages[index + 1] || messages[index + 1].sender !== msg.sender || new Date(messages[index + 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString() || (messages[index + 1].timestamp - msg.timestamp > 60 * 1000);

                  const borderRadiusClasses = msg.sender === 'me'
                    ? `${isFirstInGroup ? 'rounded-tr-xl rounded-tl-xl' : 'rounded-tl-xl'} ${isLastInGroup ? 'rounded-bl-xl rounded-br-none' : 'rounded-bl-xl'}`
                    : `${isFirstInGroup ? 'rounded-tl-xl rounded-tr-xl' : 'rounded-tr-xl'} ${isLastInGroup ? 'rounded-br-xl rounded-bl-none' : 'rounded-br-xl'}`;

                  return (
                    <React.Fragment key={msg.id}>
                      {showDateDivider && (
                        <div className="text-center text-gray-500 text-sm my-4">
                          {formatDateForDivider(msg.timestamp)}
                        </div>
                      )}
                      <div
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} ${!isFirstInGroup ? 'mt-1' : ''}`}
                      >
                        {editingMessageId === msg.id ? (
                          <form onSubmit={handleEditMessage} className="flex flex-1 gap-2 items-center max-w-[70%]">
                            <input
                              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                              value={editedInput}
                              onChange={(e) => setEditedInput(e.target.value)}
                              required
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!editedInput.trim()}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingMessageId(null); setEditedInput(''); }}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <div className={`group relative p-3 max-w-[70%] shadow-sm flex flex-col
                            ${msg.sender === 'me'
                              ? `bg-blue-600 text-white ${borderRadiusClasses}`
                              : `bg-gray-200 text-gray-800 ${borderRadiusClasses}`}
                          `}>
                            {msg.type === 'text' ? (
                              <p>{msg.content}</p>
                            ) : (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 ${msg.sender === 'me' ? 'text-blue-200 hover:text-blue-100' : 'text-blue-700 hover:text-blue-800'} underline`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M.07 2A1 1 0 011 1h7a1 1 0 011 1v1h3a1 1 0 011 1v7a1 1 0 01-1 1h-1v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3H2a1 1 0 01-1-1V2zm7 0H2v7h7V2h-2z" clipRule="evenodd" />
                                </svg>
                                <span>{msg.content}</span>
                              </a>
                            )}
                            <div className="flex justify-end items-center text-xs mt-1">
                              {msg.isEdited && <span className="mr-1 opacity-75">Edited</span>}
                              <span className="opacity-75">{formatTimestamp(msg.timestamp)}</span>
                              {msg.sender === 'me' && (
                                <span className="ml-1 text-right">
                                  {msg.status === 'read' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </span>
                              )}
                            </div>
                            {/* Edit/Delete Overlay - shown on hover for 'me' messages */}
                            {msg.sender === 'me' && (
                              <div className="absolute top-0 right-full flex gap-1 p-1 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-black">
                                <button
                                  onClick={() => { setEditingMessageId(msg.id); setEditedInput(msg.content); }}
                                  className="text-gray-700 hover:text-blue-500 p-1 rounded"
                                  title="Edit"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="text-gray-700 hover:text-red-500 p-1 rounded"
                                  title="Delete"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                  Start a conversation with {selectedUser.username}!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={editingMessageId ? handleEditMessage : handleSend} className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <input
                className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
                value={editingMessageId ? editedInput : input}
                onChange={e => {
                  if (editingMessageId) {
                    setEditedInput(e.target.value);
                  } else {
                    setInput(e.target.value);
                  }
                }}
              />
              {!editingMessageId && ( // Hide file input when editing
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-200">
                  Choose File {file ? `(${file.name})` : ''}
                  <input
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={editingMessageId ? !editedInput.trim() : (!input.trim() && !file)}
              >
                {editingMessageId ? 'Save' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}