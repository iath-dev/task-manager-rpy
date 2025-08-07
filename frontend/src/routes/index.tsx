import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { NotFoundPage } from "@/pages/Shared/NotFoundPage";

export const AppRouter = () => {
  const commonRoutes = [
    {
      path: "/404",
      element: <NotFoundPage />,
    },
  ];

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
    ...commonRoutes,
  ]);

  return <RouterProvider router={router} />;
};
