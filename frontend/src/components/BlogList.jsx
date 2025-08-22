import React from "react";
import BlogCard from "./BlogCard";

const BlogList = ({ blogs = [], currentUser, onDelete }) => {
  if (!blogs?.length) {
    return <p className="empty-text">No posts found.</p>;
  }

  return (
    <div className="ui-grid bloglist-grid">
      {blogs.map((post) => (
        <BlogCard
          key={post.id ?? post.pk ?? post.slug}
          post={post}
          currentUser={currentUser}
          onDelete={onDelete}   // expects a function that removes by id: (id) => setBlogs(prev => prev.filter(p => (p.id ?? p.pk) !== id))
        />
      ))}
    </div>
  );
};

export default BlogList;
