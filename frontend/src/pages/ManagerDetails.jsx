import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

import {
  getManagers,
  deleteManager,
} from "../services/adminService";

import ManagerCard from "../components/ManagerCard";

const ManagerDetails = () => {
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchManagers = async () => {
    try {
      setLoading(true);

      const data = await getManagers();

      setManagers(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleDelete = async (
    managerId,
    managerName
  ) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${managerName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteManager(managerId);

      setManagers((previousManagers) =>
        previousManagers.filter(
          (manager) =>
            manager._id !== managerId
        )
      );

      alert("Manager deleted successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete manager";

      alert(message);
    }
  };

  const filteredManagers = managers.filter(
    (manager) => {
      const searchValue = search.toLowerCase();

      return (
        manager.name
          .toLowerCase()
          .includes(searchValue) ||
        manager.email
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-sky-100 border-t-emerald-500" />

        <p className="text-sm font-semibold text-slate-500">
          Loading managers...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="mb-7 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-100 to-emerald-50 p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
              <FiUsers />
              Manager Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Manager Details
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View, search and manage all managers.
            </p>
          </div>

          <Link
            to="/create-manager"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <FiPlus className="text-lg" />
            Add Manager
          </Link>
        </div>
      </section>

      <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />

          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-xl border border-sky-200 bg-sky-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
          <FiUsers className="text-emerald-600" />

          <p className="text-sm font-semibold text-slate-600">
            Total Managers:
            <span className="ml-2 text-lg font-bold text-emerald-600">
              {filteredManagers.length}
            </span>
          </p>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {filteredManagers.length === 0 ? (
        <section className="flex flex-col items-center rounded-2xl border border-dashed border-sky-200 bg-sky-50 px-5 py-14 text-center">
          <div className="mb-4 rounded-full bg-emerald-100 p-4 text-3xl text-emerald-600">
            <FiUsers />
          </div>

          <h2 className="text-lg font-bold text-slate-700">
            No managers found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create a manager or try another search.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredManagers.map((manager) => (
            <ManagerCard
              key={manager._id}
              manager={manager}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default ManagerDetails;