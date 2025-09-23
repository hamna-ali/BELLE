import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createPost, getCategories, getWritingSuggestion } from "../api/blog";
import "./BlogForm.css";


const BlogForm = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); 
  const [content, setContent] = useState("");   
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCats(true);
        const list = await getCategories();
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
    const trimmed = (content || "").replace(/\s/g, "");
    if (!trimmed || trimmed === "<p><br></p>") return "Content is required.";
    // Enhanced category validation
    if (!category || category === "" || category === "0") return "Category is required.";
    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug logging
    console.log("Form state before submit:", {
      title: title,
      category: category,
      categoryType: typeof category,
      categoryIsValid: category && category !== "" && category !== "0",
      content: content?.substring(0, 100)
    });
    
    const errMsg = validate();
    if (errMsg) {
      console.warn("Validation error:", errMsg);
      alert(errMsg); // Make error visible to user
      return;
    }


    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);
      
      // Ensure category is properly set and valid
      if (category && category !== "" && category !== "0") {
        formData.append("category_id", String(category));
        console.log("Appending category:", category, typeof category);
      } else {
        console.error("Invalid category value:", category);
        alert("Please select a valid category");
        setSubmitting(false);
        return;
      }
      
      if (image) formData.append("image", image);

      // Debug FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await createPost(formData);
      const created = res?.data ?? res;
      console.log("Post created successfully:", created);
      if (onSuccess) onSuccess(created);
    } catch (err) {
      console.error("Create failed:", err);
      console.error("Error response:", err.response?.data);
      alert("Failed to create post. Please check all fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };


  // ✅ Updated AI suggestion function using proper API
  const handleAISuggestion = async () => {
    try {
      setLoadingSuggestion(true);
      
      // Determine what to use as prompt
      let prompt = "";
      let context = "general";
      
      if (content && content.trim()) {
        // Strip HTML tags for cleaner prompt
        prompt = content.replace(/<[^>]*>/g, '').trim();
        context = "content";
      } else if (title && title.trim()) {
        prompt = title.trim();
        context = "title";
      } else {
        prompt = "Write a beauty and lifestyle blog post";
        context = "general";
      }


      const response = await getWritingSuggestion(prompt, context);
      
      if (response.success && response.suggestion) {
        // Add suggestion to content
        setContent((prev) => {
          const cleanPrev = prev || "";
          // If content is empty or just has default Quill content
          if (!cleanPrev || cleanPrev === "<p><br></p>") {
            return `<p>${response.suggestion}</p>`;
          }
          // Otherwise append to existing content
          return cleanPrev + `<p>${response.suggestion}</p>`;
        });
      } else {
        console.warn("No suggestion received:", response);
      }
    } catch (err) {
      console.error("AI Suggestion error:", err);
    } finally {
      setLoadingSuggestion(false);
    }
  };


  // ✅ New function for title suggestions
  const handleTitleSuggestion = async () => {
    try {
      setLoadingSuggestion(true);
      const prompt = content ? content.replace(/<[^>]*>/g, '').substring(0, 200) : "beauty and lifestyle blog";
      const response = await getWritingSuggestion(prompt, "title");
      
      if (response.success && response.suggestion) {
        setTitle(response.suggestion);
      }
    } catch (err) {
      console.error("Title suggestion error:", err);
    } finally {
      setLoadingSuggestion(false);
    }
  };


  // ✅ New function for content expansion
  const handleContentExpansion = async () => {
    try {
      setLoadingSuggestion(true);
      const lastParagraph = content.split('</p>').slice(-2)[0] || content;
      const cleanText = lastParagraph.replace(/<[^>]*>/g, '').trim();
      
      if (cleanText && cleanText.length > 10) {
        const response = await getWritingSuggestion(cleanText, "content");
        
        if (response.success && response.suggestion) {
          setContent(prev => prev + `<p>${response.suggestion}</p>`);
        }
      } else {
        // If no content, provide general beauty blog content
        const response = await getWritingSuggestion("beauty and skincare tips", "content");
        if (response.success && response.suggestion) {
          setContent(prev => (prev || "") + `<p>${response.suggestion}</p>`);
        }
      }
    } catch (err) {
      console.error("Content expansion error:", err);
    } finally {
      setLoadingSuggestion(false);
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


        {/* Category - Fixed with enhanced validation */}
        <select
          value={category}
          onChange={(e) => {
            const selectedValue = e.target.value;
            console.log("Category selected:", selectedValue, "Type:", typeof selectedValue); // Debug
            setCategory(selectedValue);
          }}
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


        {/* Title with AI suggestion button */}
        <div className="input-with-ai">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="blog-input"
            required
          />
          <button
            type="button"
            className="ai-mini-btn"
            onClick={handleTitleSuggestion}
            disabled={loadingSuggestion}
            title="Generate AI title"
          >
            AI
          </button>
        </div>


        {/* Content */}
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


        {/* AI Suggestion Buttons */}
        <div className="ai-buttons-container">
          <button
            type="button"
            className="blog-btn secondary ai-btn"
            onClick={handleAISuggestion}
            disabled={loadingSuggestion}
          >
            {loadingSuggestion ? "Loading..." : "AI Suggestion"}
          </button>
          
          <button
            type="button"
            className="blog-btn secondary ai-btn"
            onClick={handleContentExpansion}
            disabled={loadingSuggestion}
          >
            {loadingSuggestion ? "Loading..." : "Expand Content"}
          </button>
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
