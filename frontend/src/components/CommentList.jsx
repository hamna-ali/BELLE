// src/components/CommentList.jsx
import { useEffect, useState } from "react";
import { getComments } from "../api/blog";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import Loader from "./Loader";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getComments(postId);
      // If you use DRF pagination, data may be { results, count, ... }
      setComments(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleTopLevelCreated = () => {
    load(); // simplest correct refresh
  };

  const handleUpdated = (updated) => {
    const replace = (nodes) =>
      nodes.map((n) =>
        n.id === updated.id
          ? { ...n, ...updated }
          : { ...n, replies: n.replies ? replace(n.replies) : [] }
      );
    setComments((prev) => replace(prev));
  };

  const handleDeleted = (id) => {
    const remove = (nodes) =>
      nodes
        .filter((n) => n.id !== id)
        .map((n) => ({ ...n, replies: n.replies ? remove(n.replies) : [] }));
    setComments((prev) => remove(prev));
  };

  if (loading) return <Loader />;

  return (
    <div>
      <CommentForm postId={postId} onSuccess={handleTopLevelCreated} />
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplyAdded={handleTopLevelCreated}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default CommentList;
