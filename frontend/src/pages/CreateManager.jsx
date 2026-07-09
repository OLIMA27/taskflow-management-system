import { useState } from "react";
import { createManager } from "../services/adminService";

const CreateManager = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    await createManager(form);
    alert("Manager created successfully");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-lg">
      <h1 className="text-2xl font-bold mb-5">Create Manager</h1>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-3 w-full mb-4" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-3 w-full mb-4" />
      <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-3 w-full mb-4" />

      <button className="bg-blue-600 text-white px-5 py-2 rounded">Create</button>
    </form>
  );
};

export default CreateManager;