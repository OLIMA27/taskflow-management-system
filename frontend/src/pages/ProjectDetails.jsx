import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiCalendar,
  FiCheckCircle,
  FiFileText,
  FiFolder,
  FiUser,
} from "react-icons/fi";
import {
  getProjectById,
  updateProjectStatus,
} from "../services/projectService";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const statusOptions = [
    { value: "not-started", label: "Not Started" },
    { value: "started", label: "Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "testing", label: "Testing" },
    { value: "final-review", label: "Final Review" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
        setStatus(data.status);
      } catch (error) {
        console.log(error);
        setMessage("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const updatedProject = await updateProjectStatus(id, newStatus);
      setProject(updatedProject);
      setMessage("Project status updated successfully");
    } catch (error) {
      console.log(error);
      setMessage("Failed to update project status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 font-medium text-red-600">
        {message}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-2 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-7 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <FiFolder className="text-2xl text-blue-300" />
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-300">
                Project workspace
              </p>
              <h1 className="text-3xl font-bold">{project.title}</h1>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <FiFileText />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  Project Description
                </h2>
              </div>

              <p className="leading-8 text-slate-600">
                {project.description || "No description available"}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoCard
                icon={FiCalendar}
                title="Deadline"
                value={
                  project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "No due date"
                }
              />

              <InfoCard
                icon={FiUser}
                title="Assigned Manager"
                value={project.assignedManager?.name || "Not assigned"}
              />
            </div>
          </section>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <FiCheckCircle />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">Project Status</h2>
                <p className="text-xs text-slate-500">
                  Update current progress
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current status
              </p>

              <span className="mt-3 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold capitalize text-blue-700">
                {status?.replaceAll("-", " ")}
              </span>
            </div>

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Change Status
            </label>

            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </aside>
        </div>
      </div>
    </main>
  );
};

const InfoCard = ({ icon: Icon, title, value }) => (
  <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
      <Icon className="text-xl" />
    </div>

    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
      {title}
    </p>

    <p className="mt-2 text-lg font-bold text-slate-800">{value}</p>
  </div>
);

export default ProjectDetails;