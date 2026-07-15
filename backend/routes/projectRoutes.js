// const express = require("express");
// const {
//   createProject,
//   getProjects,
//   getProjectById,
//   updateProjectStatus,
// } = require("../controllers/projectController");

// const { protect } = require("../middleware/authMiddleware");
// const { allowRoles } = require("../middleware/roleMiddleware");

// const router = express.Router();

// router.use(protect);

// router.post("/", allowRoles("admin"), createProject);
// router.get("/", allowRoles("admin", "manager"), getProjects);
// router.get("/:id", allowRoles("admin", "manager"), getProjectById);
// router.patch("/:id/status", allowRoles("admin", "manager"), updateProjectStatus);

// module.exports = router;


const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
} = require("../controllers/projectController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  allowRoles("admin"),
  createProject
);

router.get(
  "/",
  allowRoles("admin", "manager"),
  getProjects
);

router.patch(
  "/:id/status",
  allowRoles("admin", "manager"),
  updateProjectStatus
);

router.put(
  "/:id",
  allowRoles("admin"),
  updateProject
);

router.delete(
  "/:id",
  allowRoles("admin"),
  deleteProject
);

router.get(
  "/:id",
  allowRoles("admin", "manager"),
  getProjectById
);

module.exports = router;