import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50/50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 md:py-7 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;