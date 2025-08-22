import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deletePost } from "../api/blog";
import { FaEdit, FaTrash } from "react-icons/fa";
import fallbackImg from "../assets/images/fallback.png";
import "./BlogCard.css";

const BlogCard = ({ post = {}, currentUser, onDelete }) => {
  const navigate = useNavigate();
  const postId = post.id ?? post.pk ?? null;        // keep pk-based delete
  const to = postId ? `/blogs/${postId}` : "#";

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const title = post.title || "Untitled Post";
  const authorName =
    post.author?.username ||
    post.author_username ||
    post.author_name ||
    "Unknown";

  const created = post.created_at
    ? new Date(post.created_at).toLocaleDateString()
    : "";

  const chip =
    post.category?.name || post.category_name || post.category || "Blog";

  const src = post.image_url?.startsWith("http") ? post.image_url : fallbackImg;

  const isAuthor =
    currentUser &&
    (post.author?.id === currentUser.id ||
      post.author?.username === currentUser.username);

  const handleDelete = async () => {
    if (!postId) return;
    try {
      setDeleting(true);
      await deletePost(postId);          // pk-based API call
      setDeleting(false);
      setShowConfirm(false);
      if (onDelete) onDelete(postId);    // parent should remove by id
    } catch (err) {
      console.error("Error deleting post", err);
      setDeleting(false);
      // Optionally: show a themed toast/snackbar instead of alert
    }
  };

  return (
    <article className="ui-card">
      <div className="ui-card__media">
        <img
          src={src}
          alt={title}
          className="ui-card__img"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackImg) {
              e.currentTarget.src = fallbackImg;
            }
          }}
        />
        {!!chip && <span className="ui-card__badge">{chip}</span>}
      </div>

      <div className="ui-card__body">
        <h3 className="ui-card__title">
          {postId ? <Link to={to}>{title}</Link> : title}
        </h3>

        <p className="ui-card__meta">
          <span className="ui-card__author">{authorName}</span>
          {created ? <span className="ui-card__dot">•</span> : null}
          {created ? <span>{created}</span> : null}
        </p>

        {!!post.content && (
          <p className="ui-card__excerpt">{post.content}</p>
        )}

        <div className="ui-card__footer">
          {postId ? (
            <Link to={to} className="ui-card__cta" aria-label={`Read ${title}`}>
              Read
            </Link>
          ) : (
            <span className="ui-card__cta ui-card__cta--disabled">Read</span>
          )}

          {typeof post.likes_count === "number" && (
            <span className="ui-card__likes">♥ {post.likes_count}</span>
          )}

          {isAuthor && (
            <div className="ui-card__actions-inline">
              <button
                className="ui-icon-btn"
                onClick={() => navigate(`/blogs/${postId}/edit`)}
                aria-label="Update Post"
              >
                <FaEdit />
              </button>

              <button
                className="ui-icon-btn"
                onClick={() => setShowConfirm(true)}
                aria-label="Delete Post"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="ui-modal-overlay" role="dialog" aria-modal="true">
          <div className="ui-modal">
            <h4 className="ui-modal__title">Confirm deletion</h4>
            <p className="ui-modal__text">
              Are you sure you want to delete “{title}”?
            </p>
            <div className="ui-modal__actions">
              <button
                className="ui-btn ui-btn--ghost"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="ui-btn ui-btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogCard;
