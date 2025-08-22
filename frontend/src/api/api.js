// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   withCredentials: true,
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Attach token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired access token (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const res = await axios.post("http://127.0.0.1:8000/accounts/token/refresh/", {
            refresh,
          });
          const newAccess = res.data.access;
          localStorage.setItem("access", newAccess);

          // Retry with new token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("Token refresh failed", err);
        // logout user if refresh fails
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
