import api from "./api";

// Fetch profile (Bearer added by interceptor)
export const getProfile = () => api.get("/accounts/profile/");

export const updateProfile = (formData) =>
  api.put("/accounts/profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Change password
export const changePassword = (payload) =>
  api.post("/accounts/profile/change-password/", payload);

// Delete account (irreversible)
export const deleteAccount = () =>
  api.delete("/accounts/profile/");
