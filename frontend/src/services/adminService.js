import API from "../api/axiosInstance";

export const createManager = async (formData) => {
  const res = await API.post(
    "/admin/managers",
    formData
  );

  return res.data;
};

export const getManagers = async () => {
  const res = await API.get("/admin/managers");

  return res.data;
};

export const getManagerById = async (managerId) => {
  const res = await API.get(
    `/admin/managers/${managerId}`
  );

  return res.data;
};

export const updateManager = async (
  managerId,
  formData
) => {
  const res = await API.put(
    `/admin/managers/${managerId}`,
    formData
  );

  return res.data;
};

export const deleteManager = async (managerId) => {
  const res = await API.delete(
    `/admin/managers/${managerId}`
  );

  return res.data;
};

export const getAllMembers = async () => {
  const res = await API.get("/admin/members");

  return res.data;
};

export const updateMember = async (
  memberId,
  formData
) => {
  const res = await API.put(
    `/admin/members/${memberId}`,
    formData
  );

  return res.data;
};

export const deleteMember = async (memberId) => {
  const res = await API.delete(
    `/admin/members/${memberId}`
  );

  return res.data;
};