import { type RouteObject } from 'react-router-dom'

import { LoginPage } from '@/pages/auth/Login'

export const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <LoginPage />,
  },
]
