import React, { useState } from "react";
import { updateComment, deleteComment, createComment } from "../api/blog";
import fallbackImg from "../assets/images/fallback.png";
import "./CommentItem.css";
import { FaEdit, FaTrash, FaReply, FaChevronDown, FaChevronUp } from "react-icons/fa";

const CommentItem = ({
  comment,
  postId,
  onReplyAdded,
  onUpdated,
  onDeleted,
}) => {
  const { id, text, author, replies = [], can_edit, can_delete } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const avatar = author?.avatar_url || fallbackImg;
  const displayName = author?.public_name || author?.username || "User";

  // --- Edit handler ---
  const handleEdit = async () => {
    try {
      const updated = await updateComment(id, { text: editText });
      setIsEditing(false);
      onUpdated?.(updated);
    } catch (err) {
      console.error("Error editing comment", err);
    }
  };

  // --- Delete handler ---
  const handleDelete = async () => {
    try {
      await deleteComment(id);
      onDeleted?.(id);
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  // --- Reply handler ---
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const reply = await createComment({
        post: postId,
        text: replyText,
        parent: id,
      });
      setReplying(false);
      setReplyText("");
      onReplyAdded?.(reply, id);
    } catch (err) {
      console.error("Error replying", err);
    }
  };

  return (
    <div className="cmt-item">
      {/* Header */}
      <div className="cmt-header">
        <img
          src={avatar}
          alt={displayName}
          className="cmt-avatar"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackImg) {
              e.currentTarget.src = fallbackImg;
            }
          }}
        />
        <span className="cmt-author">{displayName}</span>

        <div className="cmt-actions-inline">
          {can_edit && (
            <button
              className="ui-icon-btn"
              onClick={() => setIsEditing(true)}
              aria-label="Edit comment"
            >
              <FaEdit />
            </button>
          )}
          {can_delete && (
            <button
              className="ui-icon-btn"
              onClick={handleDelete}
              aria-label="Delete comment"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="cmt-body">
        {isEditing ? (
          <div className="cmt-edit-box">
            <textarea
              className="cmt-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="cmt-edit-actions">
              <button className="cmt-btn save" onClick={handleEdit}>
                Save
              </button>
              <button
                className="cmt-btn cancel"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(text);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="cmt-text">{text}</p>
        )}
      </div>

      {/* Reply */}
      <div className="cmt-footer">
        <button
          className="cmt-reply-btn"
          onClick={() => setReplying(!replying)}
        >
          <FaReply className="reply-icon" /> Reply
        </button>
      </div>

      {replying && (
        <form onSubmit={handleReply} className="cmt-reply-form">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="cmt-reply-input"
            placeholder="Write a reply..."
          />
          <button type="submit" className="cmt-btn reply">
            Post
          </button>
          <button
            type="button"
            className="cmt-btn cancel"
            onClick={() => {
              setReplying(false);
              setReplyText("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Replies toggle */}
      {replies.length > 0 && (
        <div className="cmt-toggle">
          <button
            className="cmt-toggle-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? (
              <>
                <FaChevronUp /> Hide replies
              </>
            ) : (
              <>
                <FaChevronDown /> View replies ({replies.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* Nested Replies */}
      {showReplies && replies.length > 0 && (
        <div className="cmt-replies">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplyAdded={onReplyAdded}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
