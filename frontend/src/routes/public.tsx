import { LoginPage } from "@/pages/Auth/Login";
import { type RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <LoginPage />,
  },
];
