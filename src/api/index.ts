import axios from "axios";
import { z } from "zod";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3380/";

const urlSchema = z.url();
const parsed = urlSchema.safeParse(API_BASE_URL);
if (!parsed.success) {
  console.error(`Invalid API URL: ${API_BASE_URL}`);
  throw new Error("INVALID API URL!");
}

const BASE_URL = parsed.data;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("session_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired, redirecting to refresh...");
      try {
        await api.post("/session/start");
        return api.request(error.config);
      } catch (refreshErr) {
        console.warn("Could not refresh session");
        throw refreshErr;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
