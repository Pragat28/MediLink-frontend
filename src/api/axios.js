import axios from "axios";

const api = axios.create({
  baseURL: "https://medilink-j44r.onrender.com/api", // ✅ FIXED
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
  }

  return config;
});

export default api;
