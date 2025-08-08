import { redirect, type RouteObject } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../pages/Dashboard";
import { TaskListPage } from "../pages/Tasks/TaskList";
import AdminPanelPage from "@/pages/Admin/AdminPanelPage";
import { authLoader, adminLoader } from "@/lib/loaders"; // <-- Nueva ubicación

export const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    loader: authLoader, // <-- Loader principal con caché
    element: <AppLayout />,
    children: [
      { index: true, loader: () => redirect("/dashboard") },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "tasks", element: <TaskListPage /> },
      {
        path: "admin",
        element: <AdminPanelPage />,
        loader: adminLoader, // <-- Loader de admin que usa la caché
      },
    ],
  },
];
