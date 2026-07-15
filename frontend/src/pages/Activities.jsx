import { useEffect, useState } from "react";
import { getActivities } from "../services/activityService";

const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivities().then(setActivities).catch(console.log);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-8 border-b border-sky-100 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Activities
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View recent activities in the task management
          system.
        </p>
      </div>

      <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm md:p-8">
        {activities.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-sky-200 bg-sky-50">
            <p className="text-sm font-medium text-slate-500">
              No activities found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="rounded-xl border border-sky-100 bg-sky-50 p-5 transition duration-300 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-400"></div>

                  <div>
                    <p className="font-semibold leading-6 text-slate-700">
                      {activity.description}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      By{" "}
                      <span className="font-semibold text-sky-600">
                        {activity.user?.name}
                      </span>{" "}
                      -{" "}
                      {new Date(
                        activity.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;