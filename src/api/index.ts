import axios from "axios";
import { z } from "zod";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3380/";

const urlSchema = z.url();
const parsed = urlSchema.safeParse(API_BASE_URL);
if (!parsed.success) {
  console.error(`Invalid API URL: ${API_BASE_URL}`);
  throw new Error("INVALID API URL!");
}

const NODE_ENV = import.meta.env.NODE_ENV as
  | "development"
  | "staging"
  | "production";
const BASE_URL = parsed.data;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 35000,
});

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    if (NODE_ENV !== "production") {
      console.log("Request config:", {
        url: config.url,
        withCredentials: config.withCredentials,
        headers: config.headers,
      });
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => {
    if (NODE_ENV !== "production") {
      console.log("← Response:", {
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  async (err) => {
    if (NODE_ENV !== "production") {
      console.error("API Error:", {
        url: err.config?.url,
        status: err.response.status,
        message: err.message,
      });
    }

    return Promise.reject(err);
  }
);

export default api;
