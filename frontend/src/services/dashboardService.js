import API from "../api/axiosInstance";

export const getDashboard = async () => {
  const res = await API.get("/dashboard");
  return res.data;
};