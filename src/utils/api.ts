import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export default api;

