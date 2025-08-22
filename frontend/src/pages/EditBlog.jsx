// src/pages/EditBlog.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../api/blog";
import Loader from "../components/Loader";
import fallbackImg from "../assets/images/fallback.png";
import { FaEdit } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import "./EditBlog.css";

// same image safety logic as BlogDetail
const safeImageSrc = (raw) => {
  if (!raw) return fallbackImg;
  if (/^https?:\/\//i.test(raw)) return raw;
  return fallbackImg;
};

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch blog just like BlogDetail
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const postRes = await getPost(id);
        const postData = postRes?.data ?? postRes;
        setTitle(postData.title || "");
        setContent(postData.content || "");
        setImageUrl(safeImageSrc(postData.image_url));
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file)); // preview updated file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await updatePost(id, formData, true);
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update blog");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="edit-page">
      <div className="edit-card">
        {/* HEADER */}
        <div className="edit-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <IoArrowBack />
          </button>
          <h1>Edit Blog</h1>
        </div>

        {/* IMAGE PREVIEW */}
        <div className="image-block">
          <img src={imageUrl} alt="Blog Preview" className="preview-img" />
          <button
            type="button"
            className="image-edit-btn"
            onClick={handleImageClick}
            aria-label="Change blog image"
          >
            <FaEdit />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="edit-form">
          <label className="form-label">Blog Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title..."
            required
          />

          <label className="form-label">Blog Content</label>
          <textarea
            className="form-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            rows={8}
            required
          />

          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
