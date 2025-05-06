import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);
