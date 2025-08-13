import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { NotFoundPage } from '@/pages/shared/NotFoundPage'

import { protectedRoutes } from './protected'
import { publicRoutes } from './public'

export const AppRouter = () => {
  const commonRoutes = [
    {
      path: '/404',
      element: <NotFoundPage />,
    },
  ]

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
    ...commonRoutes,
  ])

  return <RouterProvider router={router} />
}
