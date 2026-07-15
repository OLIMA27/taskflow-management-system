import { Link } from "react-router-dom";

const ProjectCard = ({
  project,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const deadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString(
        "en-IN"
      )
    : "No deadline";

  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-500">
            Project
          </p>

          <h3 className="text-xl font-bold text-slate-800">
            {project.title}
          </h3>
        </div>

        <div className="h-3 w-3 shrink-0 rounded-full bg-emerald-400" />
      </div>

      <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
        {project.description}
      </p>

      <div className="mt-5 space-y-3 rounded-xl bg-sky-50 p-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">
            Status
          </span>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
            {project.status?.replaceAll("-", " ")}
          </span>
        </div>

        <div className="border-t border-sky-100" />

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">
            Manager
          </span>

          <span className="truncate font-semibold text-slate-700">
            {project.assignedManager?.name ||
              "Not assigned"}
          </span>
        </div>

        <div className="border-t border-sky-100" />

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">
            Deadline
          </span>

          <span className="font-semibold text-slate-700">
            {deadline}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-sky-100 pt-5">
        <Link
          to={`/projects/${project._id}`}
          className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
        >
          View Details
        </Link>

        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(project)}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;