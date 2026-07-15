import API from "../api/axiosInstance";

export const createMember = async (formData) => {
  const res = await API.post(
    "/manager/members",
    formData
  );

  return res.data;
};

export const getMyMembers = async () => {
  const res = await API.get(
    "/manager/members"
  );

  return res.data;
};

export const updateMyMember = async (
  memberId,
  formData
) => {
  const res = await API.put(
    `/manager/members/${memberId}`,
    formData
  );

  return res.data;
};

export const deleteMyMember = async (memberId) => {
  const res = await API.delete(
    `/manager/members/${memberId}`
  );

  return res.data;
};