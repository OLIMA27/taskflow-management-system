import { useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

import {
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "../services/taskService";

import { getProjects } from "../services/projectService";
import { getMyMembers } from "../services/managerService";
import { useAuth } from "../context/AuthContext";

const TaskCard = ({ task, refresh }) => {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate
      ? task.dueDate.split("T")[0]
      : "",
    project: task.project?._id || "",
    assignedTo: task.assignedTo?._id || "",
    status: task.status,
  });

  const priorityClass = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-600",
  };

  const statusClass = {
    todo: "bg-sky-100 text-sky-700",

    "in-progress":
      "bg-blue-100 text-blue-700",

    review:
      "bg-amber-100 text-amber-700",

    completed:
      "bg-emerald-100 text-emerald-700",
  };

  const handleStatusChange = async (event) => {
    try {
      setLoading(true);

      await updateTaskStatus(task._id, {
        status: event.target.value,
      });

      refresh();
    } finally {
      setLoading(false);
    }
  };

  const openEdit = async () => {
    try {
      setLoading(true);

      const projectData = await getProjects();
      const memberData = await getMyMembers();

      setProjects(projectData);
      setMembers(memberData);

      setEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await updateTask(task._id, form);

      setEditing(false);

      refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete task "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteTask(task._id);

      refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-800">
              {task.title}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
              {task.description}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              priorityClass[task.priority] ||
              priorityClass.medium
            }`}
          >
            {task.priority}
          </span>
        </div>

        <div className="border-t border-sky-100" />

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <FiBriefcase />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase text-slate-400">
                Project
              </p>

              <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                {task.project?.title || "No project"}
              </p>
            </div>
          </div>

          {user?.role === "member" ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <FiUser />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-400">
                  Assigned By
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                  {task.assignedBy?.name ||
                    "Manager"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <FiUser />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-400">
                  Assigned Member
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                  {task.assignedTo?.name ||
                    "Not assigned"}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {task.assignedTo?.designation ||
                    "Designation not added"}
                  {" · "}
                  Member{" "}
                  {task.assignedTo?.memberNumber ||
                    "-"}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-sky-50 to-emerald-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600">
                <FiCalendar />
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Due Date
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-700">
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "No due date"}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                statusClass[task.status] ||
                statusClass.todo
              }`}
            >
              {task.status.replace("-", " ")}
            </span>
          </div>
        </div>

        {(user?.role === "manager" ||
          user?.role === "member") && (
          <div className="mt-4 border-t border-sky-100 pt-4">
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Update Status
            </label>

            <select
              value={task.status}
              disabled={loading}
              onChange={handleStatusChange}
              className="w-full cursor-pointer rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
            >
              <option value="todo">Todo</option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="review">Review</option>

              <option value="completed">
                Completed
              </option>
            </select>
          </div>
        )}

        {user?.role === "manager" && (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={openEdit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
            >
              <FiEdit2 />
              Edit
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
            >
              <FiTrash2 />
              Delete
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleUpdate}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-sky-200 bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between border-b border-sky-100 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Edit Task
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update task details and assignment.
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => setEditing(false)}
                className="rounded-lg bg-sky-50 p-2 text-sky-600 hover:bg-sky-100"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Task Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="min-h-28 w-full resize-none rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 outline-none focus:border-emerald-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">
                    Medium
                  </option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Due Date
                </label>

                <input
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 outline-none focus:border-emerald-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project
                </label>

                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 outline-none focus:border-emerald-300"
                >
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
                  Assigned Member
                </label>

                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 outline-none focus:border-emerald-300"
                >
                  {members.map((member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name} -{" "}
                      {member.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 outline-none focus:border-emerald-300"
                >
                  <option value="todo">Todo</option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="review">
                    Review
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-sky-100 pt-5">
              <button
                type="button"
                disabled={loading}
                onClick={() => setEditing(false)}
                className="rounded-xl border border-sky-200 bg-sky-50 px-5 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TaskCard;