import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const AdminDashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Managers" value={data.managers} />
        <Card title="Members" value={data.members} />
        <Card title="Projects" value={data.projects} />
        <Card title="Tasks" value={data.tasks} />
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded shadow">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-3xl font-bold">{value || 0}</p>
  </div>
);

export default AdminDashboard;