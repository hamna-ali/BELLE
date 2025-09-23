// src/api/blog.js
import api from "./api";

// ----------------- POSTS -----------------

// Get list of posts with optional filters (?q=, ?category__slug=, ?mine=true, etc.)
export const getPosts = (params = {}) =>
  api.get("/blog/blogs/", { params });

// Get single post by id
export const getPost = (id) =>
  api.get(`/blog/blogs/${id}/`);

// Create new blog post (with image upload)
export const createPost = (data) =>
  api.post("/blog/blogs/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Update existing post
export const updatePost = (id, data) =>
  api.patch(`/blog/blogs/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete a post
export const deletePost = (id) =>
  api.delete(`/blog/blogs/${id}/`);

// Toggle like/unlike
export const toggleLike = (id) =>
  api.post(`/blog/blogs/${id}/toggle_like/`);

// Categories
export const getCategories = async () => {
  try {
    const res = await api.get("/blog/categories/");
    return res.data?.results ?? [];
  } catch (err) {
    console.error("Error fetching categories", err);
    throw err;
  }
};

// Convenience wrappers
export const getAllPosts = (params) =>
  api.get("/blog/blogs/", { params });

export const getMyPosts = (params) =>
  api.get("/blog/blogs/", { params: { ...params, mine: true } });

// ----------------- COMMENTS -----------------

// Get comments for a post
export const getComments = async (postId) => {
  const res = await api.get("/blog/comments/", { 
    params: { post: postId, top_level: true }   // ✅ only fetch top-level comments
  });
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.results)) return d.results;
  return [];
};

// Create new comment
export const createComment = async (data) => {
  const res = await api.post("/blog/comments/", data);
  return res.data;
};

// Update a comment
export const updateComment = async (id, data) => {
  const res = await api.patch(`/blog/comments/${id}/`, data);
  return res.data;
};

// Delete a comment
export const deleteComment = async (id) => {
  const res = await api.delete(`/blog/comments/${id}/`);
  return res.data;
};

// ================= AI FUNCTIONS =================

// Keyboard suggestions for blog writing
// ================= WRITING SUGGESTIONS FOR BLOG FORM =================

// Get writing suggestions for the existing BlogForm (with manual button)
export const getWritingSuggestion = async (prompt, context = "content") => {
  try {
    const response = await api.post("/blog/ai/autocomplete/", {
      prompt: prompt,
      context: context // "title", "content", or "general"
    });
    return response.data;
  } catch (error) {
    console.error("Blog suggestion error:", error);
    throw error;
  }
};

// Main chatbot interaction
export const sendChatMessage = async (message, history = []) => {
  try {
    const response = await api.post("/blog/ai/chatbot/", {
      message: message,
      history: history
    });
    return response.data;
  } catch (error) {
    console.error("Chatbot error:", error);
    throw error;
  }
};

// Generate content ideas
export const getContentIdeas = async (category = "beauty", tone = "casual") => {
  try {
    const response = await api.post("/blog/ai/content-ideas/", {
      category: category,
      tone: tone
    });
    return response.data;
  } catch (error) {
    console.error("Content ideas error:", error);
    throw error;
  }
};

// Get writing tips for specific blog types
export const getWritingTips = async (blogType = "general") => {
  try {
    const response = await api.post("/blog/ai/writing-tips/", {
      type: blogType
    });
    return response.data;
  } catch (error) {
    console.error("Writing tips error:", error);
    throw error;
  }
};

// Get SEO suggestions for blog posts
export const getSEOSuggestions = async (title, content = "", category = "beauty") => {
  try {
    const response = await api.post("/blog/ai/seo-suggestions/", {
      title: title,
      content: content,
      category: category
    });
    return response.data;
  } catch (error) {
    console.error("SEO suggestions error:", error);
    throw error;
  }
};

// Quick content generation for specific topics
export const getTopicSuggestions = async (topic) => {
  try {
    const response = await sendChatMessage(`Give me content ideas for ${topic} blog posts`);
    return response;
  } catch (error) {
    console.error("Topic suggestions error:", error);
    throw error;
  }
};
