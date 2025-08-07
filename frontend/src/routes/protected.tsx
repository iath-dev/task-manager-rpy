import { redirect, type RouteObject } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../pages/Dashboard";
import { TaskListPage } from "../pages/Tasks/TaskList";
import { TaskFormPage } from "../pages/Tasks/TaskForm";

export const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, loader: () => redirect("/dashboard") },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "tasks", element: <TaskListPage /> },
      { path: "tasks/new", element: <TaskFormPage /> },
      { path: "tasks/edit/:id", element: <TaskFormPage /> },
    ],
  },
];
