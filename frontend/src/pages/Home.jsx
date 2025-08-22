import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/profile";
import { getPosts } from "../api/blog";
import HeroCarousel from "../components/HeroCarousel";
import BlogList from "../components/BlogList";
import "../components/BlogCard.css";
import "./Home.css";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await getProfile();
        setProfile(profileRes.data);

        const postsRes = await getPosts({
          ordering: "-created_at",
          page_size: 6, // 2 rows on homepage (3 cols × 2)
          page,
        });

        const payload = postsRes?.data || {};
        const list = payload.results ?? payload;

        setPosts(Array.isArray(list) ? list : []);
        setHasNext(Boolean(payload.next));
        setHasPrev(Boolean(payload.previous));
      } catch (err) {
        console.error("Error fetching data:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, page]);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!profile) return <p style={{ padding: 24 }}>Profile not found. Please log in again.</p>;

  const showCarousel = page === 1;

  return (
    <div className="home">
      {/* ✅ Carousel full-width like before, only on page 1 */}
      {showCarousel ? (
        <HeroCarousel />
      ) : (
        // ✅ Spacer so blogs don't overlap navbar when no carousel
        <div className="home-top-spacer" />
      )}

      <div className="home-wrap">
        <h2 className="home-subtitle">Latest Posts</h2>

        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <>
            <BlogList blogs={posts} />

            <nav
              className="pager"
              aria-label="Pagination"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 18,
              }}
            >
              <button
                className={`pager-btn ${!hasPrev ? "disabled" : ""}`}
                disabled={!hasPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  minWidth: 44,
                  height: 42,
                  padding: "0 14px",
                  borderRadius: 10,
                  border: "1px solid #6B0010",
                  background: "#000",
                  color: "#fff",
                  fontWeight: 800,
                  opacity: hasPrev ? 1 : 0.45,
                  cursor: hasPrev ? "pointer" : "not-allowed",
                }}
              >
                Previous
              </button>

              <span style={{ color: "#B76E79", fontWeight: 800 }}>
                Page {page}
              </span>

              <button
                className={`pager-btn ${!hasNext ? "disabled" : ""}`}
                disabled={!hasNext}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  minWidth: 44,
                  height: 42,
                  padding: "0 14px",
                  borderRadius: 10,
                  border: "1px solid #6B0010",
                  background: "#000",
                  color: "#fff",
                  fontWeight: 800,
                  opacity: hasNext ? 1 : 0.45,
                  cursor: hasNext ? "pointer" : "not-allowed",
                }}
              >
                Next
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
