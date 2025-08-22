// import api from "./api";

// // GET is simple (Bearer added by interceptor)
// export const getProfile = () => api.get("/accounts/profile/");

// // PUT must be multipart/form-data when sending avatar or text
// export const updateProfile = (formData) =>
//   api.put("/accounts/profile/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// api/profile.js
import api from "./api";

// Fetch profile (Bearer added by interceptor)
export const getProfile = () => api.get("/accounts/profile/");

// Update profile (supports avatar + text via multipart/form-data)
// Use PUT for full updates (your current behavior). Switch to PATCH if backend supports partial.
export const updateProfile = (formData) =>
  api.put("/accounts/profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Change password
// payload: { current_password: string, new_password: string }
export const changePassword = (payload) =>
  api.post("/accounts/profile/change-password/", payload);

// Delete account (irreversible)
export const deleteAccount = () =>
  api.delete("/accounts/profile/");
