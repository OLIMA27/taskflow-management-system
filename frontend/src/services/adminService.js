import API from "../api/axiosInstance";

export const createManager = async (formData) => {
  const res = await API.post("/admin/managers", formData);
  return res.data;
};

export const getManagers = async () => {
  const res = await API.get("/admin/managers");
  return res.data;
};