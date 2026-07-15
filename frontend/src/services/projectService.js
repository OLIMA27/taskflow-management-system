


import API from "../api/axiosInstance";

export const createProject = async (formData) => {
  const res = await API.post(
    "/projects",
    formData
  );

  return res.data;
};

export const getProjects = async () => {
  const res = await API.get("/projects");
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await API.get(`/projects/${id}`);
  return res.data;
};

export const updateProjectStatus = async (
  id,
  status
) => {
  const res = await API.patch(
    `/projects/${id}/status`,
    { status }
  );

  return res.data;
};

export const updateProject = async (
  id,
  formData
) => {
  const res = await API.put(
    `/projects/${id}`,
    formData
  );

  return res.data;
};

export const deleteProject = async (id) => {
  const res = await API.delete(
    `/projects/${id}`
  );

  return res.data;
};