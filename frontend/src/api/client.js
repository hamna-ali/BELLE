// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // or however you store it
  if (token) {
    // use "Token" or "Bearer" according to your backend auth
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
