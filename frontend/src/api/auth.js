import api from "./api";

// Signup
export const signup = (data) => api.post("/accounts/signup/", data);

// Login (returns { access, refresh })
export const login = (data) => api.post("/accounts/login/", data);

// Refresh token
export const refreshToken = (refresh) =>
  api.post("/accounts/token/refresh/", { refresh });

// Example: Fetch profile (protected endpoint)
export const getProfile = () => api.get("/accounts/profile/");
