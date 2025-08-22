// src/components/CommentForm.jsx
import { useState } from "react";
import Loader from "./Loader";
import { createComment } from "../api/blog";

const CommentForm = ({ postId, parentId = null, onSuccess }) => {
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
    } catch (err) {
      console.error("Error creating comment:", err);
      alert(err?.response?.data ? JSON.stringify(err.response.data) : "Failed to create comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        rows={3}
      />
      <button type="submit" disabled={loading}>
        {loading ? <Loader /> : parentId ? "Reply" : "Comment"}
      </button>
    </form>
  );
};

export default CommentForm;
