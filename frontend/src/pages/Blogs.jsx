// Blogs.jsx
// import { useEffect, useState } from "react";
// import { getAllPosts, getMyPosts, deletePost } from "../api/blog";
// import { getProfile } from "../api/auth";   // <-- fetch logged-in user profile
// import BlogList from "../components/BlogList";
// import Loader from "../components/Loader";
// import "../components/blog-list.css";     
// import "../components/BlogCard.css";  

// const Blogs = ({ mine = false }) => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [hasNext, setHasNext] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   // Fetch logged-in user profile
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await getProfile();
//         setCurrentUser(res?.data || null);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Fetch blogs
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       setLoading(true);
//       try {
//         const apiCall = mine ? getMyPosts : getAllPosts;
//         const res = await apiCall({ page, page_size: 6 });
//         const data = res?.data ?? {};
//         setBlogs(Array.isArray(data) ? data : (data.results || []));
//         setHasNext(Boolean(data.next));
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load blogs.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBlogs();
//   }, [page, mine]);

//   // Handle blog delete
//   const handleDelete = async (postId) => {
//     try {
//       await deletePost(postId);
//       setBlogs(prev => prev.filter(b => b.id !== postId));
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Failed to delete post.");
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <div className="page-wrap"><p className="error-text">{error}</p></div>;

//   return (
//     <div className="page-wrap">
//       <header className="page-header">
//         <h1 className="page-title">
//           {mine ? "My " : "All "}Blogs <span className="title-accent">Journal</span>
//         </h1>
//         <p className="page-sub">Fresh looks, stories, and edits in fashion.</p>
//       </header>

//       <main>
//         <BlogList blogs={blogs} currentUser={currentUser} onDelete={handleDelete} />
//       </main>

//       <nav className="pager" aria-label="Pagination">
//         <button
//           className={`pager-btn ${page === 1 ? "disabled" : ""}`}
//           disabled={page === 1}
//           onClick={() => setPage(p => Math.max(1, p - 1))}
//         >
//           Previous
//         </button>

//         <span className="pager-info">Page {page}</span>

//         <button
//           className={`pager-btn ${!hasNext ? "disabled" : ""}`}
//           disabled={!hasNext}
//           onClick={() => setPage(p => p + 1)}
//         >
//           Next
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default Blogs;


// Blogs.jsx
import { useEffect, useState } from "react";
import { getAllPosts, getMyPosts, deletePost } from "../api/blog";
import { getProfile } from "../api/auth"; // fetch logged-in user profile
import BlogList from "../components/BlogList";
import Loader from "../components/Loader";
import "../components/blog-list.css";
import "../components/BlogCard.css";

const Blogs = ({ mine = false }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setCurrentUser(res?.data || null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const apiCall = mine ? getMyPosts : getAllPosts;
        const res = await apiCall({ page, page_size: 6 });
        const data = res?.data ?? {};
        const results = Array.isArray(data) ? data : (data.results || []);
        setBlogs(results);
        setHasNext(Boolean(data.next));
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, mine]);

  // Handle blog delete
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setBlogs((prev) => prev.filter((b) => b.id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post.");
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="page-wrap">
        <p className="error-text">{error}</p>
      </div>
    );

  return (
    <div className="page-wrap">
      <header className="page-header">
        <h1 className="page-title">
          {mine ? "My " : "All "}Blogs <span className="title-accent">Journal</span>
        </h1>
        <p className="page-sub">Fresh looks, stories, and edits in fashion.</p>
      </header>

      <main>
        {blogs.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
            }}
          >
            <p style={{ color: "#777", fontSize: "1.1rem" }}>No Posts yet</p>
          </div>
        ) : (
          <BlogList blogs={blogs} currentUser={currentUser} onDelete={handleDelete} />
        )}
      </main>

      <nav className="pager" aria-label="Pagination">
        <button
          className={`pager-btn ${page === 1 ? "disabled" : ""}`}
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>

        <span className="pager-info">Page {page}</span>

        <button
          className={`pager-btn ${!hasNext ? "disabled" : ""}`}
          disabled={!hasNext}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Blogs;
