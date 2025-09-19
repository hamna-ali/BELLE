// src/components/CommentList.jsx
import React, { useEffect, useState } from "react";
import { getComments } from "../api/blog";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleNewComment = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleReplyAdded = (reply, parentId) => {
    const updateTree = (list) =>
      list.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : { ...c, replies: updateTree(c.replies || []) }
      );
    setComments(updateTree);
  };

  const handleUpdated = (updatedComment) => {
    const updateTree = (list) =>
      list.map((c) =>
        c.id === updatedComment.id
          ? { ...c, text: updatedComment.text }
          : { ...c, replies: updateTree(c.replies || []) }
      );
    setComments(updateTree);
  };

  const handleDeleted = (deletedId) => {
    const updateTree = (list) =>
      list
        .filter((c) => c.id !== deletedId)
        .map((c) => ({ ...c, replies: updateTree(c.replies || []) }));
    setComments(updateTree);
  };

  return (
    <div>
      {/* Show comments */}
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onReplyAdded={handleReplyAdded}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ))}

      {/* One global comment form at the bottom */}
      {currentUser && (
        <CommentForm postId={postId} onSuccess={handleNewComment} />
      )}
    </div>
  );
};

export default CommentList;
