// import {
//   NavLink,
//   useNavigate,
// } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// import {
//   FiActivity,
//   FiBell,
//   FiFolder,
//   FiHome,
//   FiList,
//   FiLogOut,
//   FiUsers,
// } from "react-icons/fi";

// const Sidebar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const linkClass = ({ isActive }) =>
//     `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
//       isActive
//         ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
//         : "text-slate-400 hover:bg-slate-800 hover:text-white"
//     }`;

//   const LinkItem = ({
//     to,
//     icon: Icon,
//     children,
//   }) => (
//     <NavLink to={to} className={linkClass}>
//       <Icon className="text-lg" />
//       <span>{children}</span>
//     </NavLink>
//   );

//   return (
//     <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 p-5">
//       <div className="mb-8 flex items-center gap-3 px-2">
//         <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-extrabold text-white shadow-lg shadow-blue-900/40">
//           T
//         </div>

//         <div>
//           <h1 className="text-xl font-bold text-white">
//             TMS
//           </h1>

//           <p className="text-xs text-slate-500">
//             Team Management
//           </p>
//         </div>
//       </div>

//       <nav className="flex flex-1 flex-col gap-1.5">
//         {user?.role === "admin" && (
//           <>
//             <LinkItem
//               to="/admin-dashboard"
//               icon={FiHome}
//             >
//               Dashboard
//             </LinkItem>

//             <LinkItem
//               to="/managers"
//               icon={FiUsers}
//             >
//               Manager Details
//             </LinkItem>

//             <LinkItem
//               to="/admin-members"
//               icon={FiUsers}
//             >
//               Member Details
//             </LinkItem>

//             <div className="my-3 border-t border-slate-800" />

//             <LinkItem
//               to="/projects"
//               icon={FiFolder}
//             >
//               Projects
//             </LinkItem>

//             <LinkItem
//               to="/tasks"
//               icon={FiList}
//             >
//               Tasks
//             </LinkItem>

//             <LinkItem
//               to="/activities"
//               icon={FiActivity}
//             >
//               Activities
//             </LinkItem>

//             <LinkItem
//               to="/notifications"
//               icon={FiBell}
//             >
//               Notifications
//             </LinkItem>
//           </>
//         )}

//         {user?.role === "manager" && (
//           <>
//             <LinkItem
//               to="/manager-dashboard"
//               icon={FiHome}
//             >
//               Dashboard
//             </LinkItem>

//             <LinkItem
//               to="/members"
//               icon={FiUsers}
//             >
//               Members Details
//             </LinkItem>

//             <div className="my-3 border-t border-slate-800" />

//             <LinkItem
//               to="/projects"
//               icon={FiFolder}
//             >
//               Projects
//             </LinkItem>

//             <LinkItem
//               to="/tasks"
//               icon={FiList}
//             >
//               Tasks
//             </LinkItem>

//             <LinkItem
//               to="/activities"
//               icon={FiActivity}
//             >
//               Activities
//             </LinkItem>

//             <LinkItem
//               to="/notifications"
//               icon={FiBell}
//             >
//               Notifications
//             </LinkItem>
//           </>
//         )}

//         {user?.role === "member" && (
//           <>
//             <LinkItem
//               to="/member-dashboard"
//               icon={FiHome}
//             >
//               Dashboard
//             </LinkItem>

//             <div className="my-3 border-t border-slate-800" />

//             <LinkItem
//               to="/tasks"
//               icon={FiList}
//             >
//               Tasks
//             </LinkItem>

//             <LinkItem
//               to="/activities"
//               icon={FiActivity}
//             >
//               Activities
//             </LinkItem>

//             <LinkItem
//               to="/notifications"
//               icon={FiBell}
//             >
//               Notifications
//             </LinkItem>
//           </>
//         )}
//       </nav>

//       <div className="mt-6 border-t border-slate-800 pt-5">
//         <div className="mb-4 rounded-xl bg-slate-900 p-3">
//           <p className="truncate text-sm font-bold text-white">
//             {user?.name || "User"}
//           </p>

//           <p className="mt-1 text-xs capitalize text-slate-500">
//             {user?.role || "Role"}
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleLogout}
//           className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
//         >
//           <FiLogOut className="text-lg" />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FiActivity,
  FiBell,
  FiFolder,
  FiHome,
  FiList,
  FiLogOut,
  FiUsers,
} from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-sky-100 text-sky-700 shadow-sm ring-1 ring-sky-200"
        : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
    }`;

  const LinkItem = ({ to, icon: Icon, children }) => (
    <NavLink to={to} className={linkClass}>
      {({ isActive }) => (
        <>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-white text-sky-600 shadow-sm"
                : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-sky-600"
            }`}
          >
            <Icon className="text-lg" />
          </span>

          <span>{children}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sky-100 bg-white/95 px-5 py-6 shadow-[8px_0_30px_rgba(14,165,233,0.04)] backdrop-blur-xl lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-300 text-xl font-extrabold text-white shadow-lg shadow-sky-200/70">
          T
        </div>

        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            TMS
          </h1>

          <p className="mt-0.5 text-xs font-medium text-slate-400">
            Team Management
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Main Menu
        </p>

        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {user?.role === "admin" && (
          <>
            <LinkItem to="/admin-dashboard" icon={FiHome}>
              Dashboard
            </LinkItem>

            <LinkItem to="/managers" icon={FiUsers}>
              Manager Details
            </LinkItem>

            <LinkItem to="/admin-members" icon={FiUsers}>
              Member Details
            </LinkItem>

            <div className="my-3 border-t border-sky-100" />

            <LinkItem to="/projects" icon={FiFolder}>
              Projects
            </LinkItem>

            <LinkItem to="/tasks" icon={FiList}>
              Tasks
            </LinkItem>

            <LinkItem to="/activities" icon={FiActivity}>
              Activities
            </LinkItem>

            <LinkItem to="/notifications" icon={FiBell}>
              Notifications
            </LinkItem>
          </>
        )}

        {user?.role === "manager" && (
          <>
            <LinkItem to="/manager-dashboard" icon={FiHome}>
              Dashboard
            </LinkItem>

            <LinkItem to="/members" icon={FiUsers}>
              Member Details
            </LinkItem>

            <div className="my-3 border-t border-sky-100" />

            <LinkItem to="/projects" icon={FiFolder}>
              Projects
            </LinkItem>

            <LinkItem to="/tasks" icon={FiList}>
              Tasks
            </LinkItem>

            <LinkItem to="/activities" icon={FiActivity}>
              Activities
            </LinkItem>

            <LinkItem to="/notifications" icon={FiBell}>
              Notifications
            </LinkItem>
          </>
        )}

        {user?.role === "member" && (
          <>
            <LinkItem to="/member-dashboard" icon={FiHome}>
              Dashboard
            </LinkItem>

            <div className="my-3 border-t border-sky-100" />

            <LinkItem to="/tasks" icon={FiList}>
              Tasks
            </LinkItem>

            <LinkItem to="/activities" icon={FiActivity}>
              Activities
            </LinkItem>

            <LinkItem to="/notifications" icon={FiBell}>
              Notifications
            </LinkItem>
          </>
        )}
      </nav>

      <div className="mt-6 border-t border-sky-100 pt-5">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-extrabold uppercase text-sky-600 shadow-sm">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-700">
              {user?.name || "User"}
            </p>

            <p className="mt-0.5 text-xs font-semibold capitalize text-emerald-600">
              {user?.role || "Role"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
            <FiLogOut className="text-lg" />
          </span>

          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;