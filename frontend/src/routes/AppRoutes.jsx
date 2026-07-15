import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import MemberDashboard from "../pages/MemberDashboard";
import ManagerDetails from "../pages/ManagerDetails";
import CreateManager from "../pages/CreateManager";
import MemberDetails from "../pages/MemberDetails";
import CreateMember from "../pages/CreateMember";
import Projects from "../pages/Projects";
import CreateProject from "../pages/CreateProject";
import ProjectDetails from "../pages/ProjectDetails";
import Tasks from "../pages/Tasks";
import CreateTask from "../pages/CreateTask";
import Activities from "../pages/Activities";
import Notifications from "../pages/Notifications";
import EditManager from "../pages/EditManager";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import DashboardLayout from "../layouts/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin-dashboard"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <RoleRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/member-dashboard"
          element={
            <RoleRoute allowedRoles={["member"]}>
              <MemberDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/managers"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <ManagerDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/create-manager"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <CreateManager />
            </RoleRoute>
          }
        />

        <Route
          path="/edit-manager/:id"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <EditManager />
            </RoleRoute>
          }
        />

        <Route
          path="/members"
          element={
            <RoleRoute allowedRoles={["manager"]}>
              <MemberDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/admin-members"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <MemberDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/create-member"
          element={
            <RoleRoute allowedRoles={["manager"]}>
              <CreateMember />
            </RoleRoute>
          }
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/create-project"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <CreateProject />
            </RoleRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/create-task"
          element={
            <RoleRoute allowedRoles={["manager"]}>
              <CreateTask />
            </RoleRoute>
          }
        />

        <Route
          path="/activities"
          element={<Activities />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;