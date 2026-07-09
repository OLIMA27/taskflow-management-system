export const getDashboardPath = (role) => {
  if (role === "admin") return "/admin";
  if (role === "manager") return "/manager";
  if (role === "member") return "/member";
  return "/login";
};