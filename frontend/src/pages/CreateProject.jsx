import { useEffect, useState } from "react";
import { getManagers } from "../services/adminService";
import { createProject } from "../services/projectService";

const CreateProject = () => {
  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedManager: "",
  });

  useEffect(() => {
    getManagers().then(setManagers);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    await createProject(form);
    alert("Project created and assigned successfully");
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-5">Create Project</h1>

      <input name="title" onChange={handleChange} placeholder="Project Title" className="border p-3 w-full mb-4" />
      <textarea name="description" onChange={handleChange} placeholder="Description" className="border p-3 w-full mb-4" />
      <input name="deadline" type="date" onChange={handleChange} className="border p-3 w-full mb-4" />

      <select name="assignedManager" onChange={handleChange} className="border p-3 w-full mb-4">
        <option value="">Select Manager</option>
        {managers.map((manager) => (
          <option key={manager._id} value={manager._id}>
            {manager.name}
          </option>
        ))}
      </select>

      <button className="bg-blue-600 text-white px-5 py-2 rounded">Create Project</button>
    </form>
  );
};

export default CreateProject;