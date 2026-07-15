import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { getProjects } from "../services/projectService";
import { getMyMembers } from "../services/managerService";
import { createTask } from "../services/taskService";

const CreateTask = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    project: "",
    assignedTo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData =
          await getProjects();

        const memberData =
          await getMyMembers();

        setProjects(projectData);
        setMembers(memberData);
      } catch (error) {
        setError("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.project ||
      !form.assignedTo ||
      !form.dueDate
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await createTask(form);

      navigate("/tasks");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-sky-300 focus:border-emerald-300 focus:bg-emerald-50/50 focus:ring-4 focus:ring-emerald-100";

  return (
    <div className="min-h-screen rounded-3xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-emerald-600"
          >
            <span className="text-lg">←</span>
            Back to Tasks
          </Link>

          <div className="mt-5">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Create Task
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add task details and assign the task to a
              member of your team.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-xl shadow-sky-100/80"
        >
          <div className="border-b border-sky-100 bg-gradient-to-r from-sky-100 via-sky-50 to-emerald-100 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 text-2xl font-bold text-white shadow-lg shadow-sky-200">
                +
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Task Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Fill in the required task details below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">
                    Select Project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project._id}
                      value={project._id}
                    >
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assign Member
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">
                    Select Member
                  </option>

                  {members.map((member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name} -{" "}
                      {member.designation ||
                        `Member ${
                          member.memberNumber || ""
                        }`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Task Title
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter task description"
                className={`${inputStyle} min-h-36 resize-none leading-6`}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="low">
                    Low Priority
                  </option>

                  <option value="medium">
                    Medium Priority
                  </option>

                  <option value="high">
                    High Priority
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Due Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/tasks"
                className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-6 py-3 text-sm font-semibold text-sky-700 transition-all duration-300 hover:border-sky-300 hover:bg-sky-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-40 items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:from-sky-500 hover:to-emerald-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading
                  ? "Creating..."
                  : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;