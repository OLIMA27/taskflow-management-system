import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications().catch(console.log);
  }, []);

  const handleRead = async (id) => {
    await markNotificationAsRead(id);
    fetchNotifications();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-7 border-b border-slate-100 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Notifications
        </h1>
      </div>

      {notifications.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
          <p className="text-sm font-medium text-slate-500">
            No notifications found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                notification.isRead
                  ? "border-slate-200 bg-white"
                  : "border-blue-200 bg-blue-50/60"
              }`}
            >
              <div
                className={`absolute bottom-0 left-0 top-0 w-1 ${
                  notification.isRead ? "bg-slate-300" : "bg-blue-600"
                }`}
              ></div>

              <h2 className="font-bold text-slate-800">
                {notification.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {notification.message}
              </p>

              <p className="mt-3 text-xs font-medium text-slate-400">
                {new Date(notification.createdAt).toLocaleString()}
              </p>

              {!notification.isRead && (
                <button
                  onClick={() => handleRead(notification._id)}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;