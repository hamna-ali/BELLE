// src/pages/CreateBlog.jsx
import { useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import ProtectedRoute from "../components/ProtectedRoute";

const CreateBlog = () => {
  const navigate = useNavigate();

  const handleCreateSuccess = (blog) => {
    navigate(`/blogs/${blog.id}`); // redirect to the newly created blog
  };

  return (
    <ProtectedRoute>
      <div>
        <h1>Create Blog</h1>
        <BlogForm onSuccess={handleCreateSuccess} />
      </div>
    </ProtectedRoute>
  );
};

export default CreateBlog;
