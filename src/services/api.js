import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api",
  // baseURL: "https://herrywijaya.xyz/sumbersari-be/api",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
