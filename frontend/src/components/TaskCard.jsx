import { updateTaskStatus } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

const TaskCard = ({ task, refresh }) => {
  const { user } = useAuth();

  const handleStatusChange = async (e) => {
    await updateTaskStatus(task._id, { status: e.target.value });
    refresh();
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h3 className="font-bold text-lg">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>

      <p className="mt-2">Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      <p>Project: {task.project?.title}</p>

      {(user.role === "manager" || user.role === "member") && (
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="mt-3 border p-2 rounded w-full"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
      )}
    </div>
  );
};

export default TaskCard;