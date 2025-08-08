import { redirect, type RouteObject } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../pages/Dashboard";
import { TaskListPage } from "../pages/Tasks/TaskList";
import { TaskFormPage } from "../pages/Tasks/TaskForm";
import apiClient from "@/services/api";

async function authLoader() {
  try {
    const res = await apiClient("/auth/me");

    return res.data;
  } catch (err) {
    console.log(err);
    return redirect("/auth");
  }
}

export const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    loader: authLoader,
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
