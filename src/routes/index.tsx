// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "@/pages/dashboard/Dashboard";
import Login from "@/pages/login/Login";
import ProtectedRoute from "./protectedRoutes";
import Root from "@/pages/Root";
import NotFound from "@/pages/error/NotFound";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Monitoring from "@/pages/monitoring/Monitoring";
import Agents from "@/pages/agents/Agents";
import CreateEditWorkflow from "@/pages/workflow/createEditWorkflow/CreateEditWorkflow";
import RAGIngestion from "@/pages/knowledge-bases/rag-ingestion/RAGIngestion";
import Operations from "@/pages/operations/Operations";
import Profile from "@/pages/profile/Profile";
import Settings from "@/pages/settings/Settings";
import About from "@/pages/about/About";
import Catalog from "@/components/catalog/Catalog";
import DeveloperHome from "@/pages/developer-studio/DeveloperHome";
import AppHome from "@/pages/developer-studio/AppHome";
import ChatApp from "@/pages/chatbot/ChatApp";
import Admin from "@/pages/admin/Admin";
import AppDetail from "@/pages/app-details/AppDetail";
import NewWorkspace from "@/pages/developer-studio/NewWorkspace";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        // Auth guard for everything under DashboardLayout
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              // ✅ Any authenticated user can access these:
              {
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "chatbot",
                element: <ChatApp />,
              },
              {
                path: "catalog",
                element: <Catalog />,
              },
              {
                path: "agents",
                element: <Agents />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "settings",
                element: <Settings />,
              },
              {
                path: "about",
                element: <About />,
              },

              // ✅ Developer + Admin only
              {
                element: (
                  <ProtectedRoute allowedPersonas={["developer", "admin"]} />
                ),
                children: [
                  {
                    path: "developer-studio",
                    element: <DeveloperHome />,
                  },
                  {
                    // you can keep this absolute or make it relative
                    path: "/developer-studio/:appTitle",
                    element: <AppHome />,
                  },
                  {
                    path: "developer-studio/:appTitle/workflow/create",
                    element: <CreateEditWorkflow />,
                  },
                  {
                    path: "developer-studio/:appTitle/workflow/:workflowId",
                    element: <CreateEditWorkflow />,
                  },
                  {
                    path: "developer-studio/:appTitle/rag-ingestion",
                    element: <RAGIngestion />,
                  },
                  {
                    path: "monitoring",
                    element: <Monitoring />,
                  },
                  {
                    path: "operations",
                    element: <Operations />,
                  },
                ],
              },

              // ✅ Admin only
              {
                element: <ProtectedRoute allowedPersonas={["admin"]} />,
                children: [
                  {
                    path: "admin",
                    element: <Admin />,
                  },
                ],
              },
              {
                path: "chatbot",
                element: <ChatApp />,
              },
              {
                path: "catalog",
                element: <Catalog />,
              },

              {
                path: "/catalog/:id",
                element: <AppDetail />,
              },
              {
                path: "admin",
                element: <Admin />,
              },
              {
                path: "/developer-studio/new-workspace",
                element: <NewWorkspace />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
