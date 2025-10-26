'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, ThumbsUp, Reply, Send, Edit, Trash2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Comment {
  id: number;
  comment: string;
  user_id: number;
  user_name: string;
  user_role: string;
  created_at: string;
  parent_id: number | null;
  content_author_id: number;
  likes: number;
  has_liked: boolean;
  replies: Comment[];
}

interface EditState {
  commentId: number;
  text: string;
}

export default function BlogComments({ contentId }: { contentId: number }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<EditState | null>(null);
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; commentId: number | null; commentText: string }>({ 
    show: false, 
    commentId: null,
    commentText: ''
  });

  // Refs for inputs
  const newCommentRef = useRef<HTMLTextAreaElement>(null);

  // Helpers
  const getUserId = useCallback(() =>
    (session?.user as any)?.id || (session?.user as any)?.sub || null, [session]);

  const getUserRole = useCallback(() => (session?.user as any)?.role || 'user', [session]);

  // ✅ Fetch comments with user like status
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const url = userId 
        ? `/api/blogs/comment/${contentId}?user_id=${userId}`
        : `/api/blogs/comment/${contentId}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [contentId, getUserId]);

  useEffect(() => {
    if (contentId) fetchComments();
  }, [contentId, fetchComments]);

  // ✅ Handle like/unlike
  const handleLike = useCallback(async (commentId: number) => {
    if (!session) {
      alert('Please login to like comments');
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    setLikeLoading(commentId);

    try {
      // Find the comment to check current like status
      const findComment = (comments: Comment[], targetId: number): Comment | null => {
        for (const comment of comments) {
          if (comment.id === targetId) return comment;
          const foundReply = comment.replies.find(reply => reply.id === targetId);
          if (foundReply) return foundReply;
        }
        return null;
      };

      const comment = findComment(comments, commentId);
      if (!comment) return;

      const currentlyLiked = comment.has_liked;

      if (currentlyLiked) {
        // Unlike - DELETE request
        const res = await fetch(`/api/blogs/comment/like?comment_id=${commentId}&user_id=${userId}`, {
          method: 'DELETE'
        });

        const data = await res.json();
        
        if (res.ok) {
          // Update UI optimistically
          setComments(prev => 
            prev.map(c => {
              if (c.id === commentId) {
                return { 
                  ...c, 
                  likes: data.likes_count, 
                  has_liked: false 
                };
              }
              return {
                ...c,
                replies: c.replies.map(r => 
                  r.id === commentId 
                    ? { ...r, likes: data.likes_count, has_liked: false }
                    : r
                )
              };
            })
          );
        } else {
          alert(data.error || 'Failed to unlike comment');
        }
      } else {
        // Like - POST request
        const res = await fetch('/api/blogs/comment/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comment_id: commentId,
            user_id: parseInt(userId)
          })
        });

        const data = await res.json();
        
        if (res.ok) {
          // Update UI optimistically
          setComments(prev => 
            prev.map(c => {
              if (c.id === commentId) {
                return { 
                  ...c, 
                  likes: data.likes_count, 
                  has_liked: true 
                };
              }
              return {
                ...c,
                replies: c.replies.map(r => 
                  r.id === commentId 
                    ? { ...r, likes: data.likes_count, has_liked: true }
                    : r
                )
              };
            })
          );
        } else {
          alert(data.error || 'Failed to like comment');
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
      alert('Error processing like');
    } finally {
      setLikeLoading(null);
    }
  }, [session, getUserId, comments]);

  // ✅ Add comment
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || !session) return;
    const userId = getUserId();
    if (!userId) return alert('Login required');
    try {
      const res = await fetch('/api/blogs/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newComment,
          content_id: contentId,
          user_id: parseInt(userId),
          parent_id: null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewComment('');
        fetchComments();
      } else alert(data.error);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  }, [newComment, session, contentId, getUserId, fetchComments]);

  // ✅ Add reply
  const handleAddReply = useCallback(async (parentId: number) => {
    if (!replyText.trim() || !session) return;
    const userId = getUserId();
    if (!userId) return alert('Login required');
    try {
      const res = await fetch('/api/blogs/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: replyText,
          content_id: contentId,
          user_id: parseInt(userId),
          parent_id: parentId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReplyText('');
        setReplyingTo(null);
        fetchComments();
      } else alert(data.error);
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  }, [replyText, session, contentId, getUserId, fetchComments]);

  // ✅ Update comment
  const handleUpdateComment = useCallback(async (commentId: number, text: string) => {
    if (!text.trim() || !session) return;
    const userId = getUserId();
    if (!userId) return alert('Login required');
    try {
      const res = await fetch(`/api/blogs/comment/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: text,
          user_id: parseInt(userId),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingComment(null);
        fetchComments();
      } else alert(data.error);
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  }, [session, getUserId, fetchComments]);

  // ✅ Show delete confirmation modal
  const showDeleteConfirm = useCallback((commentId: number, commentText: string) => {
    setDeleteConfirm({ 
      show: true, 
      commentId, 
      commentText: commentText.length > 100 ? commentText.substring(0, 100) + '...' : commentText 
    });
  }, []);

  // ✅ Close delete confirmation modal
  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ show: false, commentId: null, commentText: '' });
  }, []);

  // ✅ Delete comment (Soft Delete)
  const handleDeleteComment = useCallback(async () => {
    if (!session || !deleteConfirm.commentId) return;
    
    const userId = getUserId();
    if (!userId) {
      alert('Login required');
      closeDeleteConfirm();
      return;
    }

    try {
      const res = await fetch(
        `/api/blogs/comment/${deleteConfirm.commentId}?user_id=${userId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (res.ok) {
        fetchComments();
        closeDeleteConfirm();
      } else {
        alert(data.error);
        closeDeleteConfirm();
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Error deleting comment');
      closeDeleteConfirm();
    }
  }, [session, deleteConfirm.commentId, getUserId, closeDeleteConfirm, fetchComments]);

  const formatTimestamp = useCallback((ts: string) => {
    const d = new Date(ts);
    const diffHrs = (Date.now() - d.getTime()) / 3600000;
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${Math.floor(diffHrs)} hours ago`;
    if (diffHrs < 168) return `${Math.floor(diffHrs / 24)} days ago`;
    return d.toLocaleDateString();
  }, []);

  const getInitials = useCallback((n: string) =>
    n
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2), []);

  // Like Button Component
  const LikeButton = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isCurrentlyLoading = likeLoading === comment.id;

    return (
      <button
        onClick={() => handleLike(comment.id)}
        disabled={!session || isCurrentlyLoading}
        className={`flex items-center gap-1 text-xs transition-colors ${
          comment.has_liked 
            ? 'text-blue-600 font-semibold' 
            : 'text-gray-600 hover:text-blue-600'
        } ${isCurrentlyLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={session ? (comment.has_liked ? 'Unlike' : 'Like') : 'Login to like'}
      >
        <ThumbsUp className={`w-3 h-3 ${comment.has_liked ? 'fill-current' : ''}`} />
        <span>{comment.likes}</span>
        {isCurrentlyLoading && <span className="ml-1">...</span>}
      </button>
    );
  };

  // Individual Comment Item Component with proper edit state management
  const CommentItem = React.memo(({
    comment,
    isReply = false,
    onReply,
    onDelete,
    replyingTo,
    replyText,
    onReplyTextChange,
    session,
    getUserId,
    getUserRole
  }: {
    comment: Comment;
    isReply?: boolean;
    onReply: (commentId: number) => void;
    onDelete: (commentId: number, text: string) => void;
    replyingTo: number | null;
    replyText: string;
    onReplyTextChange: (text: string) => void;
    session: any;
    getUserId: () => string | null;
    getUserRole: () => string;
  }) => {
    const currentUserId = getUserId();
    const currentUserRole = getUserRole();
    
    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.comment);
    
    // Authorization logic
    const canEdit = session && parseInt(currentUserId || '0') === comment.user_id;
    const canDelete = session && (parseInt(currentUserId || '0') === comment.user_id || currentUserRole === 'admin');

    // Local refs for this specific comment
    const editTextareaRef = useRef<HTMLTextAreaElement>(null);
    const replyInputRef = useRef<HTMLInputElement>(null);

    // Handle edit text change
    const handleEditChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditText(e.target.value);
    }, []);

    // Handle reply text change
    const handleReplyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onReplyTextChange(e.target.value);
    }, [onReplyTextChange]);

    // Start editing this comment
    const handleStartEdit = useCallback(() => {
      setIsEditing(true);
      setEditText(comment.comment);
      // Focus the textarea after a small delay to ensure it's rendered
      setTimeout(() => {
        editTextareaRef.current?.focus();
      }, 0);
    }, [comment.comment]);

    // Cancel editing
    const handleCancelEdit = useCallback(() => {
      setIsEditing(false);
      setEditText(comment.comment);
    }, [comment.comment]);

    // Save edited comment
    const handleSaveEdit = useCallback(async () => {
      if (!editText.trim()) return;
      await handleUpdateComment(comment.id, editText);
      setIsEditing(false);
    }, [comment.id, editText, handleUpdateComment]);

    // Start replying to this comment
    const handleStartReply = useCallback(() => {
      onReply(comment.id);
    }, [comment.id, onReply]);

    // Delete this comment
    const handleDelete = useCallback(() => {
      onDelete(comment.id, comment.comment);
    }, [comment.id, comment.comment, onDelete]);

    // Focus reply input when replying to this comment
    useEffect(() => {
      if (replyingTo === comment.id && replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, [replyingTo, comment.id]);

    return (
      <div className={`flex gap-4 ${isReply ? 'ml-14 mt-4' : 'mb-6'}`}>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(comment.user_name)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-sm">
                {comment.user_name}
              </h4>
              {comment.user_role && comment.user_role !== 'user' && (
                <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                  {comment.user_role}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatTimestamp(comment.created_at)}
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-2 mb-3">
              <textarea
                ref={editTextareaRef}
                value={editText}
                onChange={handleEditChange}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={4}
                placeholder="Edit your comment..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 text-sm mb-2">{comment.comment}</p>
              
              <div className="flex items-center gap-4">
                <LikeButton comment={comment} isReply={isReply} />
                
                {!isReply && session && (
                  <button
                    onClick={handleStartReply}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                )}
                
                {(canEdit || canDelete) && (
                  <div className="flex gap-2">
                    {canEdit && (
                      <button
                        onClick={handleStartEdit}
                        className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {replyingTo === comment.id && session && (
            <div className="mt-3 flex gap-2 items-start">
              <input
                ref={replyInputRef}
                type="text"
                value={replyText}
                onChange={handleReplyChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddReply(comment.id);
                  }
                }}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => handleAddReply(comment.id)}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h2>
        </div>

        {session ? (
          <div className="mb-8">
            <textarea
              ref={newCommentRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Post Comment
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border border-gray-200 rounded-lg">
            <p className="text-gray-500 text-lg">Login to comment</p>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="border-b border-gray-100 last:border-b-0">
              <CommentItem 
                comment={c}
                onReply={(commentId) => {
                  setReplyingTo(replyingTo === commentId ? null : commentId);
                  setReplyText('');
                }}
                onDelete={showDeleteConfirm}
                replyingTo={replyingTo}
                replyText={replyText}
                onReplyTextChange={setReplyText}
                session={session}
                getUserId={getUserId}
                getUserRole={getUserRole}
              />
              {c.replies.length > 0 && (
                <div className="ml-14 border-l-2 border-gray-100 pl-4">
                  {c.replies.map((r) => (
                    <CommentItem 
                      key={r.id} 
                      comment={r} 
                      isReply 
                      onReply={(commentId) => {
                        setReplyingTo(replyingTo === commentId ? null : commentId);
                        setReplyText('');
                      }}
                      onDelete={showDeleteConfirm}
                      replyingTo={replyingTo}
                      replyText={replyText}
                      onReplyTextChange={setReplyText}
                      session={session}
                      getUserId={getUserId}
                      getUserRole={getUserRole}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 text-lg">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Comment
              </h3>
              <button
                onClick={closeDeleteConfirm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              {deleteConfirm.commentText && (
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700 italic">
                    "{deleteConfirm.commentText}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}