import { FiBell, FiMenu, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-sky-100 bg-white/85 px-4 py-3 shadow-[0_8px_30px_rgba(14,165,233,0.04)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 transition hover:bg-sky-100 lg:hidden">
          <FiMenu className="text-xl" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-extrabold tracking-tight text-slate-800 sm:text-xl">
              Task Management System
            </h2>

            <span className="hidden rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 md:inline-flex">
              Workspace
            </span>
          </div>

          <p className="mt-1 hidden truncate text-xs font-medium text-slate-400 sm:block">
            {today}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-sm"
        >
          <FiBell className="text-lg" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emerald-400" />
        </button>

        <div className="hidden h-9 w-px bg-sky-100 sm:block" />

        <div className="flex items-center gap-3 rounded-2xl border border-transparent px-1.5 py-1.5 transition-all duration-300 hover:border-sky-100 hover:bg-sky-50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600 shadow-sm">
            <FiUser className="text-lg" />
          </div>

          <div className="hidden min-w-0 text-left sm:block">
            <p className="max-w-36 truncate text-sm font-bold text-slate-700">
              {user?.name || "User"}
            </p>

            <p className="mt-0.5 text-xs font-semibold capitalize text-emerald-600">
              {user?.role || "Role"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;