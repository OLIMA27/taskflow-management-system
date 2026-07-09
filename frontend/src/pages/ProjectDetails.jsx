import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectById,
  updateProjectStatus,
} from "../services/projectService";

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const statusOptions = [
    { value: "not-started", label: "Not Started" },
    { value: "started", label: "Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "testing", label: "Testing" },
    { value: "final-review", label: "Final Review" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
        setStatus(data.status);
      } catch (error) {
        console.log(error);
        setMessage("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const updatedProject = await updateProjectStatus(id, newStatus);
      setProject(updatedProject);
      setMessage("Project status updated successfully");
    } catch (error) {
      console.log(error);
      setMessage("Failed to update project status");
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading project details...</p>;
  }

  if (!project) {
    return <p className="text-red-600">{message}</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>

      {message && (
        <p className="mb-4 text-sm font-medium text-blue-600">{message}</p>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-sm text-gray-500">Project Title</h2>
          <p className="text-lg font-semibold">{project.title}</p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500">Description</h2>
          <p className="text-gray-700">{project.description}</p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500">Due Date</h2>
          <p className="text-gray-700">
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString()
              : "No due date"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500">Assigned Manager</h2>
          <p className="text-gray-700">
            {project.assignedManager?.name || "Not assigned"}
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Project Status
          </label>

          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full border rounded px-3 py-2"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;