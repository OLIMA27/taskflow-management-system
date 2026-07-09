import API from "../api/axiosInstance";

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await API.patch(`/notifications/${id}/read`);
  return res.data;
};