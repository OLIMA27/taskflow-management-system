import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Bar,
  BarChart,CartesianGrid,Cell,Legend,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis,
} from "recharts";

import {FiActivity,FiAlertTriangle,FiBriefcase,FiFolder,FiList,FiUsers,
} from "react-icons/fi";

import { getDashboard } from "../services/dashboardService";

const AdminDashboard = () => {
  const [data, setData] = useState({
    managers: 0,
    members: 0,
    projects: 0,
    tasks: 0,
    overdueTasks: 0,

    projectStatus: {
      notStarted: 0,
      started: 0,
      inProgress: 0,
      testing: 0,
      finalReview: 0,
      completed: 0,
      onHold: 0,
    },

    taskStatus: {
      todo: 0,
      inProgress: 0,
      review: 0,
      completed: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const dashboardData = await getDashboard();

        setData({
          managers: dashboardData?.managers || 0,
          members: dashboardData?.members || 0,
          projects: dashboardData?.projects || 0,
          tasks: dashboardData?.tasks || 0,
          overdueTasks: dashboardData?.overdueTasks || 0,

          projectStatus: {
            notStarted:
              dashboardData?.projectStatus?.notStarted || 0,

            started:
              dashboardData?.projectStatus?.started || 0,

            inProgress:
              dashboardData?.projectStatus?.inProgress || 0,

            testing:
              dashboardData?.projectStatus?.testing || 0,

            finalReview:
              dashboardData?.projectStatus?.finalReview || 0,

            completed:
              dashboardData?.projectStatus?.completed || 0,

            onHold:
              dashboardData?.projectStatus?.onHold || 0,
          },

          taskStatus: {
            todo:
              dashboardData?.taskStatus?.todo || 0,

            inProgress:
              dashboardData?.taskStatus?.inProgress || 0,

            review:
              dashboardData?.taskStatus?.review || 0,

            completed:
              dashboardData?.taskStatus?.completed || 0,
          },
        });
      } catch (error) {
        console.error("ADMIN DASHBOARD ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Managers",
      value: data.managers,
      subtitle: "Total managers",
      icon: FiBriefcase,
      style:
        "border-sky-100 bg-sky-50 text-sky-600",
      dotStyle: "bg-sky-400",
    },
    {
      title: "Members",
      value: data.members,
      subtitle: "Total members",
      icon: FiUsers,
      style:
        "border-cyan-100 bg-cyan-50 text-cyan-600",
      dotStyle: "bg-cyan-400",
    },
    {
      title: "Projects",
      value: data.projects,
      subtitle: "All projects",
      icon: FiFolder,
      style:
        "border-teal-100 bg-teal-50 text-teal-600",
      dotStyle: "bg-teal-400",
    },
    {
      title: "Tasks",
      value: data.tasks,
      subtitle: "All tasks",
      icon: FiList,
      style:
        "border-emerald-100 bg-emerald-50 text-emerald-600",
      dotStyle: "bg-emerald-400",
    },
    {
      title: "Overdue",
      value: data.overdueTasks,
      subtitle: "Overdue tasks",
      icon: FiAlertTriangle,
      style:
        "border-rose-100 bg-rose-50 text-rose-500",
      dotStyle: "bg-rose-400",
      danger: true,
    },
  ];

  const projectChartData = [
    {
      status: "Not Started",
      count: data.projectStatus.notStarted,
    },
    {
      status: "Started",
      count: data.projectStatus.started,
    },
    {
      status: "In Progress",
      count: data.projectStatus.inProgress,
    },
    {
      status: "Testing",
      count: data.projectStatus.testing,
    },
    {
      status: "Final Review",
      count: data.projectStatus.finalReview,
    },
    {
      status: "Completed",
      count: data.projectStatus.completed,
    },
    {
      status: "On Hold",
      count: data.projectStatus.onHold,
    },
  ];

  const taskChartData = [
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

  const taskChartColors = [
    "#bae6fd",
    "#38bdf8",
    "#5eead4",
    "#6ee7b7",
  ];

  const totalTaskChartValue = taskChartData.reduce(
    (total, item) => total + item.value,
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

        <p className="text-sm font-semibold text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-full flex-col gap-7">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "16px",
            background: "#ffffff",
            color: "#334155",
            border: "1px solid #e0f2fe",
            boxShadow:
              "0 15px 40px rgba(14,165,233,0.12)",
          },
        }}
      />

      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-r from-sky-100 via-cyan-50 to-emerald-50 p-6 shadow-[0_16px_45px_rgba(14,165,233,0.08)] sm:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/60 blur-sm" />

        <div className="absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-emerald-100/70 blur-sm" />

        <div className="relative flex flex-col gap-4">
          <div className="flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-700 shadow-sm">
            <FiActivity className="text-sm" />
            Administration overview
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Monitor managers, members, projects and tasks
              from one organized workspace.
            </p>
          </div>
        </div>
      </section>

      {/* Count Cards */}
      <section className="flex flex-wrap gap-5">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            {...card}
          />
        ))}
      </section>

      {/* Charts */}
      <section className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <ChartCard
            title="Project Status"
            description="Current projects grouped by status."
            icon={FiFolder}
          >
            <div className="h-96">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={projectChartData}
                  margin={{
                    top: 20,
                    right: 10,
                    left: -20,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid
                    stroke="#e0f2fe"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="status"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={75}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tick={{ fill: "#64748b" }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b" }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e0f2fe",
                      boxShadow:
                        "0 10px 30px rgba(14,165,233,0.12)",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#38bdf8"
                    radius={[10, 10, 0, 0]}
                    barSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="min-w-0 flex-1">
          <ChartCard
            title="Task Status"
            description="Overall distribution of task progress."
            icon={FiList}
          >
            {totalTaskChartValue === 0 ? (
              <div className="flex h-96 items-center justify-center rounded-3xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50 to-emerald-50">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-500 shadow-sm">
                    <FiList className="text-2xl" />
                  </div>

                  <p className="font-bold text-slate-700">
                    No task data available
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Task status details will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={taskChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      innerRadius={75}
                      outerRadius={120}
                      paddingAngle={4}
                    >
                      {taskChartData.map(
                        (item, index) => (
                          <Cell
                            key={item.name}
                            fill={
                              taskChartColors[
                                index %
                                  taskChartColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border:
                          "1px solid #e0f2fe",
                        boxShadow:
                          "0 10px 30px rgba(14,165,233,0.12)",
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>
      </section>
    </main>
  );
};

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  style,
  dotStyle,
  danger,
}) => {
  return (
    <article className="group flex min-w-[210px] flex-1 flex-col rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_10px_35px_rgba(14,165,233,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_45px_rgba(14,165,233,0.12)]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl shadow-sm ${style}`}
        >
          <Icon />
        </div>

        <span
          className={`h-2.5 w-2.5 rounded-full ${dotStyle}`}
        />
      </div>

      <p
        className={`mt-5 text-3xl font-extrabold ${
          danger
            ? "text-rose-500"
            : "text-slate-800"
        }`}
      >
        {value ?? 0}
      </p>

      <h3 className="mt-1 text-sm font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-xs font-medium text-slate-400">
        {subtitle}
      </p>
    </article>
  );
};

const ChartCard = ({
  title,
  description,
  icon: Icon,
  children,
}) => {
  return (
    <section className="flex h-full flex-col rounded-[2rem] border border-sky-100 bg-white p-5 shadow-[0_12px_40px_rgba(14,165,233,0.06)] sm:p-6">
      <div className="mb-5 flex items-center gap-3 border-b border-sky-100 pb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600 shadow-sm">
          <Icon className="text-lg" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-800 sm:text-xl">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

export default AdminDashboard;