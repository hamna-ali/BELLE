// // src/components/BlogDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getPost, toggleLike, getComments, createComment } from "../api/blog";
// import fallbackImg from "../assets/images/fallback.png";
// import "./BlogDetail.css";

// // KEEP EXACT SAME IMAGE LOGIC
// const safeImageSrc = (raw) => {
//   if (!raw) return fallbackImg;
//   if (/^https?:\/\//i.test(raw)) return raw; // full URL from Supabase (your case)
//   return fallbackImg; // legacy/invalid → fallback
// };

// const BlogDetail = () => {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [liked, setLiked] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Load post + comments
//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const postRes = await getPost(id);
//         const postData = postRes?.data ?? postRes;
//         setPost(postData);
//         setLiked(!!postData?.is_liked);

//         const commentsRes = await getComments(id);
//         const commentsData =
//           commentsRes?.data?.results ?? commentsRes?.data ?? commentsRes ?? [];
//         setComments(commentsData);
//       } catch (err) {
//         console.error("Error fetching blog:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBlog();
//   }, [id]);

//   const handleLike = async () => {
//     try {
//       const res = await toggleLike(id);
//       const data = res?.data ?? res;
//       setPost((prev) =>
//         prev ? { ...prev, likes_count: data.likes_count ?? prev.likes_count } : prev
//       );
//       setLiked((prev) => !prev);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     try {
//       const res = await createComment({ post: id, text: newComment });
//       const data = res?.data ?? res;
//       setComments((prev) => [...prev, data]);
//       setNewComment("");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   if (loading) return <p className="loading-text">Loading...</p>;
//   if (!post) return <p className="loading-text">Blog not found.</p>;

//   const hero = safeImageSrc(post.image_url); // unchanged
//   const authorName = post.author?.username || post.author_username || "Unknown";
//   const created = post.created_at ? new Date(post.created_at).toLocaleDateString() : "";
//   const categoryName = post.category?.name || post.category_name || "Category";

//   return (
//     <article className="blog-detail-container">
//       {/* 1) Title */}
//       <header className="bd-header">
//         <h1 className="blog-title">{post.title}</h1>
//         <p className="blog-meta">
//           By <span className="author">{authorName}</span>
//           {created ? ` • ${created}` : ""}
//         </p>
//       </header>

//       {/* 2) IMAGE CONTAINER (carousel-ready, box-shaped) */}
//       <section className="bd-media">
//         {/* If you add a carousel later, place it inside bd-media-box */}
//         <div className="bd-media-box">
//           <img
//             src={hero}
//             alt={post.title || "Blog image"}
//             className="bd-img"
//             onError={(e) => {
//               if (e.currentTarget.src !== fallbackImg) {
//                 e.currentTarget.src = fallbackImg;
//               }
//             }}
//           />
//         </div>

//         {/* Below-image row: category chip on left, like button + count on right */}
//         <div className="bd-underbar">
//           <div className="bd-left">
//             <span className="bd-chip">{categoryName}</span>
//           </div>

//           <div className="bd-right">
//             <button
//               type="button"
//               onClick={handleLike}
//               aria-label={liked ? "Unlike" : "Like"}
//               className={`bd-like-btn ${liked ? "is-liked" : ""}`}
//             >
//               {/* simple heart; keep logic same as provided */}
//               {liked ? "❤️" : "🤍"}
//             </button>
//             <span className="bd-like-count">{post.likes_count || 0}</span>
//           </div>
//         </div>
//       </section>

//       {/* 3) DETAIL CONTAINER (separate from media) */}
//       <section className="bd-content-box">
//         <div className="blog-content">{post.content}</div>
//       </section>

//       {/* 4) COMMENTS CONTAINER */}
//       <section className="bd-comments-box">
//         <div className="comments-section">
//           <h2>Comments</h2>
//           {comments.length === 0 && (
//             <p className="no-comments">No comments yet. Be the first!</p>
//           )}
//           {comments.map((c) => (
//             <div key={c.id} className="comment">
//               <p className="comment-author">
//                 {c.author?.username || c.author_username || "User"}
//               </p>
//               <p className="comment-text">{c.text}</p>
//             </div>
//           ))}

//           <form onSubmit={handleAddComment} className="comment-form">
//             <input
//               type="text"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               className="comment-input"
//               placeholder="Add a comment..."
//             />
//             <button type="submit" className="comment-submit">
//               Post
//             </button>
//           </form>
//         </div>
//       </section>
//     </article>
//   );
// };

// export default BlogDetail;



// src/components/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost, toggleLike, getComments, createComment } from "../api/blog";
import fallbackImg from "../assets/images/fallback.png";
import DOMPurify from "dompurify";
import "./BlogDetail.css";

// KEEP EXACT SAME IMAGE LOGIC
const safeImageSrc = (raw) => {
  if (!raw) return fallbackImg;
  if (/^https?:\/\//i.test(raw)) return raw; // full URL from Supabase (your case)
  return fallbackImg; // legacy/invalid → fallback
};

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load post + comments
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const postRes = await getPost(id);
        const postData = postRes?.data ?? postRes;
        setPost(postData);
        setLiked(!!postData?.is_liked);

        const commentsRes = await getComments(id);
        const commentsData =
          commentsRes?.data?.results ?? commentsRes?.data ?? commentsRes ?? [];
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await createComment({ post: id, text: newComment });
      const data = res?.data ?? res;
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!post) return <p className="loading-text">Blog not found.</p>;

  const hero = safeImageSrc(post.image_url); // unchanged
  const authorName = post.author?.username || post.author_username || "Unknown";
  const created = post.created_at ? new Date(post.created_at).toLocaleDateString() : "";
  const categoryName = post.category?.name || post.category_name || "Category";

  // Sanitize rich HTML content from the editor before rendering
  const safeContent = DOMPurify.sanitize(post.content || "");

  return (
    <article className="blog-detail-container">
      {/* 1) Title */}
      <header className="bd-header">
        <h1 className="blog-title">{post.title}</h1>
        <p className="blog-meta">
          By <span className="author">{authorName}</span>
          {created ? ` • ${created}` : ""}
        </p>
      </header>

      {/* 2) IMAGE CONTAINER (carousel-ready, box-shaped) */}
      <section className="bd-media">
        {/* If you add a carousel later, place it inside bd-media-box */}
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

        {/* Below-image row: category chip on left, like button + count on right */}
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
              {/* simple heart; keep logic same as provided */}
              {liked ? "❤️" : "🤍"}
            </button>
            <span className="bd-like-count">{post.likes_count || 0}</span>
          </div>
        </div>
      </section>

      {/* 3) DETAIL CONTAINER (separate from media) */}
      <section className="bd-content-box">
        {/* Render sanitized HTML so users see formatted content, not raw tags */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </section>

      {/* 4) COMMENTS CONTAINER */}
      <section className="bd-comments-box">
        <div className="comments-section">
          <h2>Comments</h2>
          {comments.length === 0 && (
            <p className="no-comments">No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="comment">
              <p className="comment-author">
                {c.author?.username || c.author_username || "User"}
              </p>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}

          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
              placeholder="Add a comment..."
            />
            <button type="submit" className="comment-submit">
              Post
            </button>
          </form>
        </div>
      </section>
    </article>
  );
};

export default BlogDetail;
