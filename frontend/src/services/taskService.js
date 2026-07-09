import API from "../api/axiosInstance";

export const createTask = async (formData) => {
  const res = await API.post("/tasks", formData);
  return res.data;
};

export const getTasks = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

export const updateTaskStatus = async (id, formData) => {
  const res = await API.patch(`/tasks/${id}/status`, formData);
  return res.data;
};