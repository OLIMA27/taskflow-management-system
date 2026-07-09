import { useEffect, useState } from "react";
import { getActivities } from "../services/activityService";

const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivities().then(setActivities).catch(console.log);
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-5">Activities</h1>

      {activities.length === 0 ? (
        <p className="text-gray-600">No activities found.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity._id} className="border p-4 rounded">
              <p className="font-medium">{activity.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                By {activity.user?.name} -{" "}
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;