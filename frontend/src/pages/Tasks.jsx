import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import TaskCard from "../components/TaskCard";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    getTasks().then(setTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Tasks</h1>

      <div className="grid grid-cols-3 gap-5">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} refresh={fetchTasks} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;