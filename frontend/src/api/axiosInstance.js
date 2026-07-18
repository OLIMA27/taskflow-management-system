import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://taskflow-management-system-backend.onrender.com/api",
});

axiosInstance.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});
export default axiosInstance;
