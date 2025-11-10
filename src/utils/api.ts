import axios from "axios";

const api = axios.create({
  baseURL: "https://jaihind-sporty-spark-backend.onrender.com/api",
  withCredentials: true,   // ✅ REQUIRED
});

export default api;
