import { useMemo, useState } from "react";
import CommentForm from "./CommentForm";
import { updateComment, deleteComment } from "../api/blog";
import "./CommentItem.css";

const CommentItem = ({ comment, onReplyAdded, onUpdated, onDeleted, currentUser }) => {
  // currentUser is optional; if not provided, we detect from localStorage token payload or omit controls
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replies, setReplies] = useState(comment.replies || []);

  const author = comment.author || {};
  const displayName = author.public_name || author.username || "Unknown";

  // Determine if the logged-in user owns this comment
  // Preferred: pass currentUser.id from parent. If not available, fall back to author object comparison or 0.
  const isOwner = useMemo(() => {
    if (currentUser?.id && author?.id) return currentUser.id === author.id;
    // If you store user id in localStorage (e.g., "userId"), use it as a fallback
    const storedId = Number(localStorage.getItem("userId") || 0);
    return storedId && author?.id ? storedId === author.id : false;
  }, [currentUser, author]);

  const handleReplySuccess = (newReply) => {
    setReplies((prev) => [...prev, newReply]);
    setShowReplyForm(false);
    onReplyAdded?.(newReply);
  };

  const handleUpdate = async () => {
    const text = editText.trim();
    if (!text) return;
    try {
      const updated = await updateComment(comment.id, { text });
      setEditing(false);
      onUpdated?.(updated);
    } catch (e) {
      console.error(e);
      alert("Failed to update comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(comment.id);
      onDeleted?.(comment.id);
    } catch (e) {
      console.error(e);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="cmt-item" style={{ marginLeft: comment.parent ? 20 : 0 }}>
      <div className="cmt-header">
        <div className="cmt-author-block">
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={displayName}
              className="cmt-avatar"
              width={28}
              height={28}
            />
          ) : (
            <div className="cmt-avatar cmt-avatar-fallback" aria-hidden />
          )}
          <div className="cmt-author-meta">
            <strong className="cmt-author-name">{displayName}</strong>
            <span className="cmt-dot">•</span>
            <span className="cmt-date">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="cmt-actions">
            {!editing ? (
              <>
                <button
                  className="cmt-icon-btn"
                  title="Edit"
                  aria-label="Edit comment"
                  onClick={() => setEditing(true)}
                >
                  {/* pencil icon (SVG) */}
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92l8.06-8.06.92.92L5.92 19.58zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
                <button
                  className="cmt-icon-btn cmt-danger"
                  title="Delete"
                  aria-label="Delete comment"
                  onClick={handleDelete}
                >
                  {/* trash icon (SVG) */}
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M9 3h6a1 1 0 011 1v1h4v2h-1v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7H4V5h4V4a1 1 0 011-1zm8 4H7v12h10V7zM9 9h2v8H9V9zm4 0h2v8h-2V9z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                className="cmt-icon-btn"
                title="Cancel edit"
                aria-label="Cancel edit"
                onClick={() => {
                  setEditing(false);
                  setEditText(comment.text);
                }}
              >
                {/* X icon */}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                  <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12l-4.9 4.89a1 1 0 101.41 1.41L12 13.41l4.89 4.9a1 1 0 001.41-1.41L13.41 12l4.9-4.89a1 1 0 000-1.4z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {!editing ? (
        <div className="cmt-text">{comment.text}</div>
      ) : (
        <div className="cmt-edit-area">
          <textarea
            className="cmt-textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
          />
          <div className="cmt-edit-actions">
            <button className="cmt-btn cmt-primary" onClick={handleUpdate}>
              Save
            </button>
            <button
              className="cmt-btn"
              onClick={() => {
                setEditing(false);
                setEditText(comment.text);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="cmt-footer">
        <button className="cmt-link" onClick={() => setShowReplyForm((s) => !s)}>
          Reply
        </button>
      </div>

      {showReplyForm && (
        <div className="cmt-reply-form">
          <CommentForm postId={comment.post} parentId={comment.id} onSuccess={handleReplySuccess} />
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className="cmt-replies">
          {replies.map((rep) => (
            <CommentItem
              key={rep.id}
              comment={rep}
              onReplyAdded={onReplyAdded}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
