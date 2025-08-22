import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/blog";  // ✅ fixed
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import LikeButton from "../components/LikeButton";
import Loader from "../components/Loader";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getPost(id); // ✅ use getPost
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <Loader />;
  if (!blog) return <p>Blog not found</p>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <LikeButton
        postId={blog.id}
        initialLiked={blog.liked}
        initialLikes={blog.likes_count}
      />

      <h3>Comments</h3>
      <CommentForm postId={blog.id} onSuccess={() => window.location.reload()} />
      <CommentList postId={blog.id} />
    </div>
  );
};

export default BlogPage;
