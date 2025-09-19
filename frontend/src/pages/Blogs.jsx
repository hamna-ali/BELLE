import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";   // 🔹 read URL query params
import { getAllPosts, getMyPosts, deletePost } from "../api/blog";
import { getProfile } from "../api/auth"; // fetch logged-in user profile
import BlogList from "../components/BlogList";
import Loader from "../components/Loader";
import "../components/blog-list.css";
import "../components/BlogCard.css";

const Blogs = ({ mine = false }) => {
  const location = useLocation(); // 🔹 access ?q= & ?category__slug=
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

  // 🔹 Reset to page 1 whenever filters in the URL change
  useEffect(() => {
    setPage(1);
  }, [location.search]);

  // Fetch blogs (respect q and category__slug from URL)
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const q = (searchParams.get("q") || "").trim();
        const categorySlug = (searchParams.get("category__slug") || "").trim();

        const apiCall = mine ? getMyPosts : getAllPosts;

        // Base params
        const params = { page, page_size: 6 };

        // 🔹 Add filters only if present
        if (q) params.q = q;
        if (categorySlug) params["category__slug"] = categorySlug;

        const res = await apiCall(params);
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
  }, [page, mine, location.search]); // 🔹 refetch when q/category/page changes

  // Handle blog delete
// Handle blog delete
const handleDelete = async (postId) => {
  try {
    const res = await deletePost(postId);
    if (res.status === 204) {
      setBlogs((prev) => prev.filter((b) => b.id !== postId));
    } else {
      console.warn("Unexpected delete response:", res);
      alert("Unexpected response while deleting post.");
    }
  } catch (err) {
    console.error("Delete failed:", err.response || err.message);
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
          <BlogList
            blogs={blogs}
            currentUser={currentUser}
            onDelete={handleDelete}
            showActions={mine}   // keep previous behavior
          />
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
