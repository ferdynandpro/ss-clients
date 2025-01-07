import axios from "axios";

const api = axios.create({
  baseURL: "https://herrywijaya.xyz/sumbersari-be/api", // URL backend Anda
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
