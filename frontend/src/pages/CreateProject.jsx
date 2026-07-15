import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getManagers } from "../services/adminService";
import { createProject } from "../services/projectService";

const CreateProject = () => {
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedManager: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingManagers, setLoadingManagers] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoadingManagers(true);

        const data = await getManagers();

        setManagers(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to load managers:",
          error
        );

        setError("Failed to load managers");
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchManagers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    if (managers.length === 0) {
      setError(
        "Create a manager before assigning a project."
      );
      return;
    }

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.deadline ||
      !form.assignedManager
    ) {
      setError("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createProject({
        title: form.title.trim(),
        description: form.description.trim(),
        deadline: form.deadline,
        assignedManager: form.assignedManager,
      });

      alert(
        "Project created and assigned successfully"
      );

      navigate("/projects");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to create project";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const noManagers =
    !loadingManagers && managers.length === 0;

  const inputStyle =
    "w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Create Project
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a project and assign it to a manager.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm md:p-8"
        >
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="project-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Project Title
            </label>

            <input
              id="project-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter project title"
              required
              className={inputStyle}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="project-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="project-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter project description"
              required
              className={`${inputStyle} min-h-32 resize-none`}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="project-deadline"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Deadline
            </label>

            <input
              id="project-deadline"
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              min={today}
              required
              className={inputStyle}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="assigned-manager"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Assign Manager
            </label>

            <select
              id="assigned-manager"
              name="assignedManager"
              value={form.assignedManager}
              onChange={handleChange}
              required
              disabled={
                loadingManagers || managers.length === 0
              }
              className={`${inputStyle} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <option value="">
                {loadingManagers
                  ? "Loading managers..."
                  : managers.length === 0
                    ? "No managers available"
                    : "Select Manager"}
              </option>

              {managers.map((manager) => (
                <option
                  key={manager._id}
                  value={manager._id}
                >
                  {manager.name}
                </option>
              ))}
            </select>

            {noManagers && (
              <p className="mt-2 text-sm font-medium text-red-500">
                Create a manager before assigning a
                project.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-sky-100 pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={
                loading ||
                loadingManagers ||
                managers.length === 0
              }
              className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Project"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/projects")}
              className="flex-1 rounded-lg border border-sky-200 bg-sky-50 px-6 py-3 font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;