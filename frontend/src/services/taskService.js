import API from "../api/axiosInstance";

export const createTask = async (formData) => {
  const res = await API.post(
    "/tasks",
    formData
  );

  return res.data;
};

export const getTasks = async () => {
  const res = await API.get("/tasks");

  return res.data;
};

export const updateTask = async (
  taskId,
  formData
) => {
  const res = await API.put(
    `/tasks/${taskId}`,
    formData
  );

  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await API.delete(
    `/tasks/${taskId}`
  );

  return res.data;
};

export const updateTaskStatus = async (
  taskId,
  formData
) => {
  const res = await API.patch(
    `/tasks/${taskId}/status`,
    formData
  );

  return res.data;
};