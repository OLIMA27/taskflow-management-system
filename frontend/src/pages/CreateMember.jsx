import { useState } from "react";
import { createMember } from "../services/managerService";

const CreateMember = () => {
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
    try {
      await createMember(form);

      alert("Member created successfully");
      navigate("/members");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Failed to create member";

      alert(message);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-lg">
      <h1 className="text-2xl font-bold mb-5">Create Member</h1>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-3 w-full mb-4" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-3 w-full mb-4" />
      <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-3 w-full mb-4" />

      <button className="bg-blue-600 text-white px-5 py-2 rounded">Create</button>
    </form>
  );
};

export default CreateMember;