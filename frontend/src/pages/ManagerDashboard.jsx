import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const ManagerDashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-3 gap-5">
        <Card title="My Members" value={data.members} />
        <Card title="Assigned Projects" value={data.projects} />
        <Card title="Created Tasks" value={data.tasks} />
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

export default ManagerDashboard;