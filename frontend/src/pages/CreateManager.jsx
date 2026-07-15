import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createManager } from "../services/adminService";

const CreateManager = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createManager(form);

      alert("Manager created successfully");

      navigate("/managers");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to create manager";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-emerald-50 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Create Manager
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add a new manager to your task management
            system.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 border-b border-sky-100 pb-5">
            <h2 className="text-xl font-bold text-slate-800">
              Manager Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the manager details below.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Manager Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter manager name"
              required
              className={inputStyle}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter manager email"
              required
              className={inputStyle}
            />
          </div>

          <div className="mb-7">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/managers")}
              className="flex-1 rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Manager"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManager;