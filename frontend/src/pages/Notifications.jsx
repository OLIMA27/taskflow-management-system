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
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-5">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border p-4 rounded ${
                notification.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <h2 className="font-bold">{notification.title}</h2>
              <p className="text-gray-700 mt-1">{notification.message}</p>

              <p className="text-sm text-gray-500 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>

              {!notification.isRead && (
                <button
                  onClick={() => handleRead(notification._id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
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