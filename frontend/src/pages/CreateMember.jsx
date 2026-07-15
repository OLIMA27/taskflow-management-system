import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiMail,
  FiUser,
  FiLock,
  FiUserPlus,
  FiBriefcase,
} from "react-icons/fi";

import { createMember } from "../services/managerService";

const CreateMember = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });

    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.designation
    ) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createMember(form);

      navigate("/members");
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Failed to create member"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-sky-200 bg-sky-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-emerald-50 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-7">
          <Link
            to="/members"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-emerald-600"
          >
            <FiArrowLeft />
            Back to Members
          </Link>

          <h1 className="text-3xl font-bold text-slate-800">
            Add New Member
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new member and add them to your team.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-4 border-b border-sky-100 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-600">
              <FiUserPlus />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Member Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the new member details.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={submit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Member Name
              </label>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter member name"
                  className={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Designation
              </label>

              <div className="relative">
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />

                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Example: Frontend Developer"
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/members"
                className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-6 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating..."
                  : "Create Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMember;