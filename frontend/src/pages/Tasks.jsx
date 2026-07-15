
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getTasks } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex min-h-full flex-col gap-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-r from-sky-100 via-cyan-50 to-emerald-50 p-6 shadow-[0_16px_45px_rgba(14,165,233,0.08)] sm:p-8">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-white/60" />

        <div className="absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-emerald-100/70" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-700 shadow-sm">
              Task Workspace
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Tasks
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              View assigned tasks, monitor progress and manage task status.
            </p>
          </div>

          {user?.role === "manager" && (
            <Link
              to="/create-task"
              className="flex w-fit items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-200 active:translate-y-0"
            >
              <span className="mr-2 text-lg leading-none">
                +
              </span>
              Create Task
            </Link>
          )}
        </div>
      </section>

      {/* Task Content */}
      {loading ? (
        <section className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-sky-100 bg-white shadow-[0_12px_40px_rgba(14,165,233,0.06)]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

          <div className="text-center">
            <p className="text-sm font-bold text-slate-700">
              Loading tasks
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              Please wait while task details are being loaded.
            </p>
          </div>
        </section>
      ) : tasks.length === 0 ? (
        <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-white via-sky-50/60 to-emerald-50/60 p-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-100 bg-white text-2xl font-extrabold text-sky-500 shadow-sm">
            ✓
          </div>

          <h2 className="text-xl font-extrabold text-slate-800">
            No tasks found
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            There are currently no tasks available for your account.
          </p>

          {user?.role === "manager" && (
            <Link
              to="/create-task"
              className="mt-6 flex items-center justify-center rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-bold text-sky-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-md"
            >
              <span className="mr-2 text-lg leading-none">
                +
              </span>
              Create First Task
            </Link>
          )}
        </section>
      ) : (
        <section className="flex flex-wrap gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="w-full sm:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
            >
              <TaskCard
                task={task}
                refresh={fetchTasks}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Tasks;

