import React from "react";
import BlogCard from "./BlogCard";

const BlogList = ({ blogs = [], currentUser, onDelete, showActions = false }) => {
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
          onDelete={onDelete}
          showActions={showActions}   // 🔹 pass flag down
        />
      ))}
    </div>
  );
};

export default BlogList;
