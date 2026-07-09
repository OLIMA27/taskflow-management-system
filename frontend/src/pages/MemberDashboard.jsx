import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const MemberDashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Member Dashboard</h1>

      <div className="grid grid-cols-2 gap-5">
        <Card title="My Tasks" value={data.myTasks} />
        <Card title="Completed Tasks" value={data.completedTasks} />
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

export default MemberDashboard;