// src/utils/images.js
import fallbackImg from "../assets/images/fallback.png";

// Normalizes public Supabase URLs and handles bad/empty values.
// It also fixes the common duplicated segment: blog_images/blog_images/
export const resolveImage = (raw) => {
  if (!raw || typeof raw !== "string") return fallbackImg;

  // Full URL from Supabase (your model stores URLField)
  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/blog_images\/blog_images\//, "blog_images/");
  }

  // Anything else → treat as invalid and fallback (your backend returns full URLs)
  return fallbackImg;
};
