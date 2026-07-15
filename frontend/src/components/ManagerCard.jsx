import { Link } from "react-router-dom";
import {
  FiFolder,
  FiMail,
  FiTrash2,
  FiUsers,
  FiEdit2,
} from "react-icons/fi";

const ManagerCard = ({ manager, onDelete }) => {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold uppercase text-emerald-600">
          {manager.name?.charAt(0) || "M"}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Manager
          </p>

          <h3 className="mt-1 truncate text-xl font-bold text-slate-800">
            {manager.name}
          </h3>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-xl bg-sky-50 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600">
          <FiMail />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">
            Email
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-700">
            {manager.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sky-600">
            <FiFolder />

            <p className="text-xs font-semibold uppercase">
              Projects
            </p>
          </div>

          <p className="text-2xl font-bold text-slate-800">
            {manager.assignedProjects || 0}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Assigned projects
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-600">
            <FiUsers />

            <p className="text-xs font-semibold uppercase">
              Members
            </p>
          </div>

          <p className="text-2xl font-bold text-slate-800">
            {manager.teamMembers || 0}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Team members
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-3 border-t border-sky-100 pt-5">
        <Link
          to={`/edit-manager/${manager._id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          <FiEdit2 />
          Edit
        </Link>

        <button
          type="button"
          onClick={() =>
            onDelete(manager._id, manager.name)
          }
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ManagerCard;