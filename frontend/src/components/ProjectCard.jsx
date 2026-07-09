import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h3 className="font-bold text-lg">{project.title}</h3>
      <p className="text-gray-600 mt-2">{project.description}</p>

      <p className="mt-3">
        Status: <span className="font-semibold">{project.status}</span>
      </p>

      <p>
        Manager:{" "}
        <span className="font-semibold">
          {project.assignedManager?.name || "Not assigned"}
        </span>
      </p>

      <Link
        to={`/projects/${project._id}`}
        className="inline-block mt-4 text-blue-600"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProjectCard;