import API from "../api/axiosInstance";

export const createMember = async (formData) => {
  const res = await API.post("/manager/members", formData);
  return res.data;
};

export const getMyMembers = async () => {
  const res = await API.get("/manager/members");
  return res.data;
};