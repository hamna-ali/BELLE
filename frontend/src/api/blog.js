// src/api/blog.js
import api from "./api";

// Get list of posts with optional filters (?q=, ?category__slug=, ?mine=true, etc.)
export const getPosts = (params = {}) => api.get("/blog/blogs/", { params });

// Get single post by id
export const getPost = (id) => api.get(`/blog/blogs/${id}/`);

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

export const getCategories = async () => {
  try {
    const res = await api.get("/blog/categories/");
    return res.data.results;  // <-- only return the results array
  } catch (err) {
    console.error("Error fetching categories", err);
    throw err;
  }
};

// Delete a post
export const deletePost = (id) => api.delete(`/blog/blogs/${id}/`);
// Toggle like/unlike
export const toggleLike = (id) => api.post(`/blog/blogs/${id}/toggle_like/`);

export const getComments = (postId) =>
  api
    .get(`/blog/comments/`, { params: { post: postId } })
    .then((r) => {
      const d = r.data;
      return Array.isArray(d) ? d : Array.isArray(d?.results) ? d.results : [];
    });

export const createComment = (data) =>
  api.post("blog/comments/", data).then((r) => r.data);

export const updateComment = (id, data) =>
  api.put(`blog/comments/${id}/`, data).then((r) => r.data);

export const deleteComment = (id) =>
  api.delete(`blog/comments/${id}/`).then((r) => r.data);

export const getAllPosts = (params) => api.get("/blog/blogs/", { params });         // { page, page_size, ordering, q, ... }

export const getMyPosts  = (params) => api.get("/blog/blogs/", { params: { ...params, mine: true }});
