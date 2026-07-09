import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { getMyMembers } from "../services/managerService";
import { createTask } from "../services/taskService";

const CreateTask = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    project: "",
    assignedTo: "",
  });

  useEffect(() => {
    getProjects().then(setProjects);
    getMyMembers().then(setMembers);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    await createTask(form);
    alert("Task created successfully");
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-5">Create Task</h1>

      <input name="title" onChange={handleChange} placeholder="Task Title" className="border p-3 w-full mb-4" />
      <textarea name="description" onChange={handleChange} placeholder="Task Description" className="border p-3 w-full mb-4" />

      <select name="priority" onChange={handleChange} className="border p-3 w-full mb-4">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input name="dueDate" type="date" onChange={handleChange} className="border p-3 w-full mb-4" />

      <select name="project" onChange={handleChange} className="border p-3 w-full mb-4">
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.title}
          </option>
        ))}
      </select>

      <select name="assignedTo" onChange={handleChange} className="border p-3 w-full mb-4">
        <option value="">Select Member</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>

      <button className="bg-blue-600 text-white px-5 py-2 rounded">Create Task</button>
    </form>
  );
};

export default CreateTask;