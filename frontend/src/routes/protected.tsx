import { lazy, Suspense } from 'react'

import { redirect, type RouteObject } from 'react-router-dom'

import { authLoader, adminLoader } from '@/lib/loaders'
import { Loader } from '@/components/ui/loader'

const AdminPanelPage = lazy(() => import('@/pages/Admin/AdminPanelPage'))

import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/Dashboard'
import { TaskListPage } from '../pages/Tasks/TaskList'

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    loader: authLoader, // <-- Loader principal con caché
    element: <AppLayout />,
    children: [
      { index: true, loader: () => redirect('/dashboard') },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'tasks', element: <TaskListPage /> },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminPanelPage />
          </Suspense>
        ),
        loader: adminLoader, // <-- Loader de admin que usa la caché
      },
    ],
  },
]
