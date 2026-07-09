import API from "../api/axiosInstance";

export const getActivities = async () => {
  const res = await API.get("/activities");
  return res.data;
};