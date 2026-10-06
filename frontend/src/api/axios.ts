import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  // baseURL: "http://35.154.60.139:5000/api"
   baseURL: "https://ai-knowledge-assistant-e4du.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;