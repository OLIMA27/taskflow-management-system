import { useEffect, useState } from "react";
import { getManagers } from "../services/adminService";
import ManagerCard from "../components/ManagerCard";

const ManagerDetails = () => {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    getManagers().then(setManagers);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Manager Details</h1>

      <div className="grid grid-cols-3 gap-5">
        {managers.map((manager) => (
          <ManagerCard key={manager._id} manager={manager} />
        ))}
      </div>
    </div>
  );
};

export default ManagerDetails;