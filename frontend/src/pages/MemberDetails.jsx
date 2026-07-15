import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

import {
  getMyMembers,
  updateMyMember,
  deleteMyMember,
} from "../services/managerService";

import {
  deleteMember,
  getAllMembers,
  updateMember,
} from "../services/adminService";

import { useAuth } from "../context/AuthContext";

const MemberDetails = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingMember, setEditingMember] =
    useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    designation: "",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);

      let data = [];

      if (isAdmin) {
        data = await getAllMembers();
      }

      if (isManager) {
        data = await getMyMembers();
      }

      setMembers(data);
    } catch (error) {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  const handleEdit = (member) => {
    setEditingMember(member);

    setEditForm({
      name: member.name,
      email: member.email,
      designation: member.designation || "",
    });
  };

  const handleChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      let updatedMember;

      if (isAdmin) {
        updatedMember = await updateMember(
          editingMember._id,
          editForm
        );
      }

      if (isManager) {
        updatedMember = await updateMyMember(
          editingMember._id,
          editForm
        );
      }

      setMembers(
        members.map((member) =>
          member._id === updatedMember._id
            ? updatedMember
            : member
        )
      );

      setEditingMember(null);

      setSuccess("Member updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update member"
      );
    }
  };

  const handleDelete = async (member) => {
    const confirmDelete = window.confirm(
      `Delete ${member.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      if (isAdmin) {
        await deleteMember(member._id);
      }

      if (isManager) {
        await deleteMyMember(member._id);
      }

      setMembers(
        members.filter(
          (item) => item._id !== member._id
        )
      );

      setSuccess("Member deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete member"
      );
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      member.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-sky-100 border-t-emerald-500" />

        <p className="text-sm font-semibold text-slate-500">
          Loading members...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="mb-7 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-100 to-emerald-50 p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700">
              <FiUsers />
              Member Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              {isAdmin
                ? "Member Details"
                : "My Members"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View, search, update and manage registered
              members.
            </p>
          </div>

          {isManager && (
            <Link
              to="/create-member"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <FiPlus className="text-lg" />
              Add Member
            </Link>
          )}
        </div>
      </section>

      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-sky-200 bg-sky-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
          <FiUsers className="text-emerald-600" />

          <p className="text-sm font-semibold text-slate-600">
            Total Members:
            <span className="ml-2 text-lg font-bold text-emerald-600">
              {filteredMembers.length}
            </span>
          </p>
        </div>
      </section>

      {filteredMembers.length === 0 ? (
        <section className="flex flex-col items-center rounded-2xl border border-dashed border-sky-200 bg-sky-50 px-5 py-14 text-center">
          <div className="mb-4 rounded-full bg-emerald-100 p-4 text-3xl text-emerald-600">
            <FiUsers />
          </div>

          <h2 className="text-lg font-bold text-slate-700">
            No members found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try searching with another name or email.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold uppercase text-emerald-600">
                  {member.name?.charAt(0) || "M"}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-slate-800">
                    {member.name}
                  </h2>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-sky-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Designation
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-700">
                    {member.designation ||
                      "Not Added"}
                  </span>
                </div>

                <div className="border-t border-sky-100" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Role
                  </span>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Member{" "}
                    {member.memberNumber || "-"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3 border-t border-sky-100 pt-5">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(member)}
                  className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-6 shadow-xl">
            <div className="mb-6 border-b border-sky-100 pb-5">
              <h2 className="text-2xl font-bold text-slate-800">
                Edit Member
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the member information below.
              </p>
            </div>

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Name
                </label>

                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  placeholder="Enter member name"
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Designation
                </label>

                <input
                  name="designation"
                  value={editForm.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex gap-3 border-t border-sky-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setEditingMember(null)
                  }
                  className="flex-1 rounded-xl border border-sky-200 bg-sky-50 px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default MemberDetails;