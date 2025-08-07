import { type RouteObject } from "react-router-dom";
import { LoginPage } from "../pages/Auth/Login";

export const publicRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <LoginPage />,
  },
];
