import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getManagerById,
  updateManager,
} from "../services/adminService";

const EditManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const manager = await getManagerById(id);

        setForm({
          name: manager.name || "",
          email: manager.email || "",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load manager");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [id]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateManager(id, form);

      alert("Manager updated successfully");

      navigate("/managers");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update manager";

      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading manager...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Edit Manager
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update the manager name and email address.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-800">
            Manager Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Edit the details below and save your changes.
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Manager Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter manager name"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/managers")}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 active:scale-[0.98]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0"
            >
              Update Manager
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditManager;