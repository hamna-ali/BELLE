// // src/components/LikeButton.jsx
// import { useState } from "react";
// import api from "../api/blog";

// const LikeButton = ({ postId, commentId, initialLiked = false, initialCount = 0 }) => {
//   const [liked, setLiked] = useState(initialLiked);
//   const [count, setCount] = useState(initialCount);
//   const [loading, setLoading] = useState(false);

//   const handleToggle = async () => {
//     setLoading(true);
//     try {
//       let res;
//       if (commentId) {
//         res = await api.post(`/comments/${commentId}/toggle_like/`);
//       } else {
//         res = await api.post(`/blogs/${postId}/toggle_like/`);
//       }

//       setLiked(res.data.liked);
//       setCount(res.data.likes_count);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button onClick={handleToggle} disabled={loading}>
//       {liked ? "Unlike" : "Like"} ({count})
//     </button>
//   );
// };

// export default LikeButton;
// src/components/LikeButton.jsx
// src/components/LikeButton.jsx
import { useState } from "react";
import { toggleLike } from "../api/blog"; // ✅ correct import

const LikeButton = ({ postId, initialLiked, initialLikes }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleToggle = async () => {
    try {
      const data = await toggleLike(postId);
      setLiked(data.liked);
      setLikes(data.likes_count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleToggle}>
      {liked ? "💖" : "🤍"} {likes}
    </button>
  );
};

export default LikeButton;
