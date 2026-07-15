import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiList,
  FiUsers,
} from "react-icons/fi";

import { getDashboard } from "../services/dashboardService";

const ManagerDashboard = () => {
  const [data, setData] = useState({
    members: 0,
    projects: 0,
    tasks: 0,

    taskStatus: {
      todo: 0,
      inProgress: 0,
      review: 0,
      completed: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const dashboardData = await getDashboard();

        setData({
          members: dashboardData?.members || 0,
          projects: dashboardData?.projects || 0,
          tasks: dashboardData?.tasks || 0,

          taskStatus: {
            todo:
              dashboardData?.taskStatus?.todo || 0,

            inProgress:
              dashboardData?.taskStatus
                ?.inProgress || 0,

            review:
              dashboardData?.taskStatus?.review || 0,

            completed:
              dashboardData?.taskStatus
                ?.completed || 0,
          },
        });
      } catch (err) {
        console.error(
          "MANAGER DASHBOARD ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load manager dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const chartData = [
    {
      name: "Todo",
      value: data.taskStatus.todo,
    },
    {
      name: "In Progress",
      value: data.taskStatus.inProgress,
    },
    {
      name: "Review",
      value: data.taskStatus.review,
    },
    {
      name: "Completed",
      value: data.taskStatus.completed,
    },
  ];

  const chartColors = [
    "#bae6fd",
    "#38bdf8",
    "#fcd34d",
    "#6ee7b7",
  ];

  const totalChartTasks = chartData.reduce(
    (total, item) => total + item.value,
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-sky-100 border-t-emerald-500" />

        <p className="text-sm font-semibold text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="mb-7 overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-100 via-sky-50 to-emerald-50 p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
              <FiActivity />
              Manager Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Manager Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your team, projects and task
              progress from one place.
            </p>
          </div>

          <Link
            to="/create-task"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <FiList />
            Create Task
          </Link>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="My Members"
          value={data.members}
          description="Members in your team"
          link="/members"
          linkText="View Members"
          icon={FiUsers}
          iconStyle="bg-sky-100 text-sky-600"
          cardStyle="border-sky-200"
        />

        <DashboardCard
          title="Assigned Projects"
          value={data.projects}
          description="Projects assigned to you"
          link="/projects"
          linkText="View Projects"
          icon={FiFolder}
          iconStyle="bg-emerald-100 text-emerald-600"
          cardStyle="border-emerald-200"
        />

        <DashboardCard
          title="Created Tasks"
          value={data.tasks}
          description="Tasks created by you"
          link="/tasks"
          linkText="View Tasks"
          icon={FiList}
          iconStyle="bg-cyan-100 text-cyan-600"
          cardStyle="border-cyan-200"
        />
      </section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Task Status Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track the progress of tasks created and
              assigned by you.
            </p>
          </div>

          <Link
            to="/tasks"
            className="text-sm font-semibold text-sky-700 transition hover:text-emerald-600"
          >
            View All Tasks →
          </Link>
        </div>

        {totalChartTasks === 0 ? (
          <div className="flex min-h-80 items-center justify-center p-6">
            <div className="w-full rounded-2xl border border-dashed border-sky-200 bg-sky-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                <FiList />
              </div>

              <h3 className="mt-4 font-bold text-slate-700">
                No task data available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create tasks to view task progress here.
              </p>

              <Link
                to="/create-task"
                className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Create Task
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="relative min-h-80 rounded-2xl bg-sky-50/70 p-3">
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={72}
                    outerRadius={112}
                    paddingAngle={4}
                  >
                    {chartData.map(
                      (item, index) => (
                        <Cell
                          key={item.name}
                          fill={
                            chartColors[
                              index %
                                chartColors.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border:
                        "1px solid #bae6fd",
                      boxShadow:
                        "0 8px 24px rgba(14, 165, 233, 0.12)",
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-slate-800">
                  {totalChartTasks}
                </p>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Tasks
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <StatusItem
                title="Todo"
                value={data.taskStatus.todo}
                icon={FiClock}
                className="border-sky-200 bg-sky-50 text-sky-700"
              />

              <StatusItem
                title="In Progress"
                value={data.taskStatus.inProgress}
                icon={FiActivity}
                className="border-cyan-200 bg-cyan-50 text-cyan-700"
              />

              <StatusItem
                title="Review"
                value={data.taskStatus.review}
                icon={FiList}
                className="border-amber-200 bg-amber-50 text-amber-700"
              />

              <StatusItem
                title="Completed"
                value={data.taskStatus.completed}
                icon={FiCheckCircle}
                className="border-emerald-200 bg-emerald-50 text-emerald-700"
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

const DashboardCard = ({
  title,
  value,
  description,
  icon: Icon,
  link,
  linkText,
  iconStyle,
  cardStyle,
}) => {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${cardStyle}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${iconStyle}`}
        >
          <Icon />
        </div>

        <Link
          to={link}
          className="text-xs font-semibold text-sky-600 transition hover:text-emerald-600"
        >
          {linkText} →
        </Link>
      </div>

      <div className="mt-5">
        <p className="text-3xl font-bold text-slate-800">
          {value}
        </p>

        <h3 className="mt-2 text-sm font-bold text-slate-700">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-5 h-1.5 rounded-full bg-gradient-to-r from-sky-200 to-emerald-200" />
    </article>
  );
};

const StatusItem = ({
  title,
  value,
  icon: Icon,
  className,
}) => {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80">
          <Icon />
        </div>

        <p className="text-sm font-semibold">
          {title}
        </p>
      </div>

      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
};

export default ManagerDashboard;