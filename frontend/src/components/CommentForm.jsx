// src/components/CommentForm.jsx
import { useState } from "react";
import Loader from "./Loader";
import { createComment } from "../api/blog";

const CommentForm = ({ postId, parentId = null, onSuccess, onCancel }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const payload = { post: postId, text };
      if (parentId) payload.parent = parentId;

      const created = await createComment(payload);

      setText("");
      onSuccess?.(created);
      onCancel?.(); // ✅ auto close after success
    } catch (err) {
      console.error("Error creating comment:", err);
      alert(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to create comment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        className="comment-textarea"
      />
      <div className="comment-actions">
        <button type="submit" disabled={loading} className="comment-btn">
          {loading ? <Loader /> : parentId ? "Post" : "Comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="comment-btn cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
