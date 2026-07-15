
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  getProjects,
  updateProject,
  deleteProject,
} from "../services/projectService";

import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjects();

      setProjects(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = async (project) => {
    const title = window.prompt(
      "Enter project title",
      project.title
    );

    if (title === null) {
      return;
    }

    const description = window.prompt(
      "Enter project description",
      project.description
    );

    if (description === null) {
      return;
    }

    const deadline = window.prompt(
      "Enter deadline in YYYY-MM-DD format",
      project.deadline
        ? new Date(project.deadline)
            .toISOString()
            .split("T")[0]
        : ""
    );

    if (deadline === null) {
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      const updatedProject = await updateProject(
        project._id,
        {
          title,
          description,
          deadline,
        }
      );

      setProjects((previousProjects) =>
        previousProjects.map((item) =>
          item._id === project._id
            ? updatedProject
            : item
        )
      );

      alert("Project updated successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update project";

      alert(message);
    }
  };

  const handleDelete = async (project) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteProject(project._id);

      setProjects((previousProjects) =>
        previousProjects.filter(
          (item) => item._id !== project._id
        )
      );

      alert("Project deleted successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete project";

      alert(message);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const searchValue = search.toLowerCase();

    return (
      project.title
        ?.toLowerCase()
        .includes(searchValue) ||
      project.description
        ?.toLowerCase()
        .includes(searchValue) ||
      project.assignedManager?.name
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">
            Loading projects
          </p>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Please wait while project details are being loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-r from-sky-100 via-cyan-50 to-emerald-50 p-6 shadow-[0_16px_45px_rgba(14,165,233,0.08)] sm:p-8">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-white/60" />

        <div className="absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-emerald-100/70" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-700 shadow-sm">
              Project Workspace
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Projects
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              View, search and manage all projects from one organized workspace.
            </p>
          </div>

          {user?.role === "admin" && (
            <Link
              to="/create-project"
              className="flex w-fit items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-200 active:translate-y-0"
            >
              <span className="mr-2 text-lg leading-none">
                +
              </span>

              Create Project
            </Link>
          )}
        </div>
      </section>

      {/* Search and Count */}
      <section className="flex flex-col gap-4 rounded-[2rem] border border-sky-100 bg-white p-5 shadow-[0_12px_40px_rgba(14,165,233,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:max-w-lg">
          <label
            htmlFor="project-search"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Search Projects
          </label>

          <input
            id="project-search"
            type="text"
            placeholder="Search project or manager"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="flex min-w-fit items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-extrabold text-emerald-600 shadow-sm">
            {filteredProjects.length}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Total Projects
            </p>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Matching current search
            </p>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />

          <p className="text-sm font-semibold text-rose-600">
            {error}
          </p>
        </section>
      )}

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-white via-sky-50/60 to-emerald-50/60 p-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-100 bg-white text-2xl font-extrabold text-sky-500 shadow-sm">
            P
          </div>

          <h2 className="text-xl font-extrabold text-slate-800">
            No projects found
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Create a new project or try searching with a different project or
            manager name.
          </p>

          {user?.role === "admin" && (
            <Link
              to="/create-project"
              className="mt-6 flex items-center justify-center rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-bold text-sky-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-md"
            >
              <span className="mr-2 text-lg leading-none">
                +
              </span>

              Create First Project
            </Link>
          )}
        </section>
      ) : (
        <section className="flex flex-wrap gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="w-full sm:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
            >
              <ProjectCard
                project={project}
                isAdmin={user?.role === "admin"}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Projects;
