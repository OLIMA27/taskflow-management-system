
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(form.email, form.password);

      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "manager") {
        navigate("/manager-dashboard");
      } else {
        navigate("/member-dashboard");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-10">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-sky-100 bg-white/95 p-7 shadow-[0_25px_70px_rgba(14,165,233,0.13)] backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-2xl font-extrabold text-sky-600 shadow-sm">
            T
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Task Management System
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Sign in to access your workspace
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />

            <p className="text-sm font-semibold text-rose-600">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-200 active:translate-y-0"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-7 flex items-center justify-center gap-2 text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <p className="text-xs font-medium text-slate-400">
            Secure access for Admin, Manager and Member
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
