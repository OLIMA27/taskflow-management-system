import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiList,
  FiPlayCircle,
} from "react-icons/fi";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboard } from "../services/dashboardService";

const MemberDashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  const chartData = [
    {
      name: "Todo",
      tasks: data.taskStatus?.todo || 0,
    },
    {
      name: "In Progress",
      tasks: data.taskStatus?.inProgress || 0,
    },
    {
      name: "Review",
      tasks: data.taskStatus?.review || 0,
    },
    {
      name: "Completed",
      tasks: data.taskStatus?.completed || 0,
    },
  ];

  const barColors = [
    "#bae6fd",
    "#38bdf8",
    "#fcd34d",
    "#6ee7b7",
  ];

  const totalTasks = chartData.reduce(
    (total, item) => total + item.tasks,
    0
  );

  return (
    <main className="min-h-screen">
      <section className="mb-7 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-100 via-sky-50 to-emerald-50 p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
              <FiActivity />
              Member Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Member Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View assigned tasks and track your work
              progress.
            </p>
          </div>

          <Link
            to="/tasks"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <FiList />
            View My Tasks
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="My Tasks"
          value={data.myTasks}
          description="Total assigned tasks"
          icon={FiList}
          iconStyle="bg-sky-100 text-sky-600"
          borderStyle="border-sky-200"
        />

        <DashboardCard
          title="Todo Tasks"
          value={data.todoTasks}
          description="Tasks waiting to start"
          icon={FiClock}
          iconStyle="bg-cyan-100 text-cyan-600"
          borderStyle="border-cyan-200"
        />

        <DashboardCard
          title="In Progress"
          value={data.inProgressTasks}
          description="Tasks currently active"
          icon={FiPlayCircle}
          iconStyle="bg-amber-100 text-amber-600"
          borderStyle="border-amber-200"
        />

        <DashboardCard
          title="Completed"
          value={data.completedTasks}
          description="Finished tasks"
          icon={FiCheckCircle}
          iconStyle="bg-emerald-100 text-emerald-600"
          borderStyle="border-emerald-200"
        />
      </section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              My Task Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your assigned tasks by status.
            </p>
          </div>

          <Link
            to="/tasks"
            className="text-sm font-semibold text-sky-700 transition hover:text-emerald-600"
          >
            View My Tasks →
          </Link>
        </div>

        {totalTasks === 0 ? (
          <div className="p-6">
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-sky-50 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                <FiList />
              </div>

              <h3 className="mt-4 font-bold text-slate-700">
                No task data available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your assigned task status will appear
                here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl bg-sky-50/70 p-4">
              <div className="h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 10,
                      left: -20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      stroke="#e0f2fe"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b" }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b" }}
                    />

                    <Tooltip
                      cursor={{
                        fill: "rgba(224,242,254,0.45)",
                      }}
                      contentStyle={{
                        borderRadius: "12px",
                        border:
                          "1px solid #bae6fd",
                        boxShadow:
                          "0 8px 24px rgba(14,165,233,0.12)",
                      }}
                    />

                    <Bar
                      dataKey="tasks"
                      radius={[8, 8, 0, 0]}
                      barSize={52}
                    >
                      {chartData.map(
                        (item, index) => (
                          <Cell
                            key={item.name}
                            fill={
                              barColors[
                                index %
                                  barColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <StatusItem
                title="Todo"
                value={data.taskStatus?.todo || 0}
                icon={FiClock}
                className="border-sky-200 bg-sky-50 text-sky-700"
              />

              <StatusItem
                title="In Progress"
                value={
                  data.taskStatus?.inProgress || 0
                }
                icon={FiPlayCircle}
                className="border-cyan-200 bg-cyan-50 text-cyan-700"
              />

              <StatusItem
                title="Review"
                value={data.taskStatus?.review || 0}
                icon={FiList}
                className="border-amber-200 bg-amber-50 text-amber-700"
              />

              <StatusItem
                title="Completed"
                value={
                  data.taskStatus?.completed || 0
                }
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
  iconStyle,
  borderStyle,
}) => {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${borderStyle}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${iconStyle}`}
        >
          <Icon />
        </div>

        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>

      <p className="mt-5 text-3xl font-bold text-slate-800">
        {value || 0}
      </p>

      <h3 className="mt-2 text-sm font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

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

export default MemberDashboard;