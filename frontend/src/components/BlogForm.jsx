import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createPost, getCategories } from "../api/blog";
import "./BlogForm.css";

const BlogForm = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // category PK (ID)
  const [content, setContent] = useState("");   // HTML from Quill
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCats(true);
        const list = await getCategories(); // returns res.data.results
        setCategories(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCategories();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    // Quill empty HTML is often "<p><br></p>"
    const trimmed = (content || "").replace(/\s/g, "");
    if (!trimmed || trimmed === "<p><br></p>") return "Content is required.";
    if (!category) return "Category is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      console.warn(errMsg);
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);       // keep HTML (render sanitized later)
      formData.append("category", String(category)); // PK expected by backend
      if (image) formData.append("image", image);

      const res = await createPost(formData);
      const created = res?.data ?? res;
      if (onSuccess) onSuccess(created);
    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="blog-form-page">
      <form className="blog-form-container" onSubmit={handleSubmit}>
        {/* Upload Image */}
        <label className="file-upload-box">
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          {image ? image.name : "+ Upload Blog Image"}
        </label>

        {/* Category (IDs from backend) */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="blog-input blog-select"
          required
          disabled={loadingCats}
        >
          <option value="">
            {loadingCats ? "Loading categories..." : "Select Category"}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name ?? c.title ?? `Category #${c.id}`}
            </option>
          ))}
        </select>

        {/* Title */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="blog-input"
          required
        />

        {/* Content (Quill HTML) */}
        <div className="editor-container">
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Write your blog here..."
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            theme="snow"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="blog-btn" disabled={submitting}>
          {submitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
