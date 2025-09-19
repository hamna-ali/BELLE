// src/components/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost, toggleLike } from "../api/blog";
import { getProfile } from "../api/auth";
import fallbackImg from "../assets/images/fallback.png";
import DOMPurify from "dompurify";
import CommentList from "./CommentList"; 
import "./BlogDetail.css";

const safeImageSrc = (raw) => {
  if (!raw) return fallbackImg;
  if (/^https?:\/\//i.test(raw)) return raw;
  return fallbackImg;
};

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await getPost(id);
        const postData = postRes?.data ?? postRes;
        setPost(postData);
        setLiked(!!postData?.is_liked);

        try {
          const profileRes = await getProfile();
          setCurrentUser(profileRes?.data || null);
        } catch (err) {
          console.warn("No logged-in user:", err);
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await toggleLike(id);
      const data = res?.data ?? res;
      setPost((prev) =>
        prev ? { ...prev, likes_count: data.likes_count ?? prev.likes_count } : prev
      );
      setLiked((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!post) return <p className="loading-text">Blog not found.</p>;

  const hero = safeImageSrc(post.image_url);
  const authorName = post.author?.username || post.author_username || "Unknown";
  const created = post.created_at ? new Date(post.created_at).toLocaleDateString() : "";
  const categoryName = post.category?.name || post.category_name || "Category";

  const safeContent = DOMPurify.sanitize(post.content || "");

  return (
    <article className="blog-detail-container">
      {/* Title */}
      <header className="bd-header">
        <h1 className="blog-title">{post.title}</h1>
        <p className="blog-meta">
          By <span className="author">{authorName}</span>
          {created ? ` • ${created}` : ""}
        </p>
      </header>

      {/* Image */}
      <section className="bd-media">
        <div className="bd-media-box">
          <img
            src={hero}
            alt={post.title || "Blog image"}
            className="bd-img"
            onError={(e) => {
              if (e.currentTarget.src !== fallbackImg) {
                e.currentTarget.src = fallbackImg;
              }
            }}
          />
        </div>

        <div className="bd-underbar">
          <div className="bd-left">
            <span className="bd-chip">{categoryName}</span>
          </div>
          <div className="bd-right">
            <button
              type="button"
              onClick={handleLike}
              aria-label={liked ? "Unlike" : "Like"}
              className={`bd-like-btn ${liked ? "is-liked" : ""}`}
            >
              {liked ? "❤️" : "🤍"}
            </button>
            <span className="bd-like-count">{post.likes_count || 0}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bd-content-box">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </section>

      {/* Comments */}
      <section className="bd-comments-box">
        <div className="comments-section">
          <h2>Comments</h2>
          <CommentList postId={id} currentUser={currentUser} />
        </div>
      </section>
    </article>
  );
};

export default BlogDetail;
