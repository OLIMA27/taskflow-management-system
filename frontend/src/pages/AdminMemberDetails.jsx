import { useEffect, useState } from "react";
import { getAllMembers } from "../services/adminService";

const AdminMemberDetails = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getAllMembers();
        setMembers(data);
      } catch (error) {
        console.error("Failed to load members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const value = search.toLowerCase();

    return (
      member.name.toLowerCase().includes(value) ||
      member.email.toLowerCase().includes(value) ||
      member.createdBy?.name?.toLowerCase().includes(value)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-emerald-500"></div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading members...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8 border-b border-sky-100 pb-5">
        <h1 className="text-3xl font-bold text-slate-800">
          Member Details
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View all members and their assigned managers.
        </p>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search member or manager"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-sky-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 sm:max-w-md"
        />

        <p className="text-sm font-medium text-slate-600">
          Total Members:{" "}
          <span className="font-bold text-emerald-600">
            {filteredMembers.length}
          </span>
        </p>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-10 text-center text-slate-500">
          No members found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-2 bg-gradient-to-r from-sky-200 to-emerald-200"></div>

              <div className="p-6">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600">
                    {member.name?.charAt(0).toUpperCase()}
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

                <div className="space-y-3 rounded-xl bg-sky-50 p-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">
                      Manager
                    </span>

                    <span className="text-right font-semibold text-slate-700">
                      {member.createdBy?.name ||
                        "Not available"}
                    </span>
                  </div>

                  <div className="border-t border-sky-100"></div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">
                      Role
                    </span>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                      {member.role}
                    </span>
                  </div>

                  <div className="border-t border-sky-100"></div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">
                      Created
                    </span>

                    <span className="font-medium text-slate-700">
                      {member.createdAt
                        ? new Date(
                            member.createdAt
                          ).toLocaleDateString("en-IN")
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMemberDetails;