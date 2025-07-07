import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
export const DashboardPage = lazy(() => import('src/pages/admin/dashboard'));

// Employee
export const EmployeeListPage = lazy(() => import('src/pages/admin/employee/list'));
export const EmployeeCreatePage = lazy(() => import('src/pages/admin/employee/new'));

// Driver
export const DriverListPage = lazy(() => import('src/pages/admin/driver/list'));
export const DriverCreatePage = lazy(() => import('src/pages/admin/driver/new'));

// Station
export const StationListPage = lazy(() => import('src/pages/admin/station/list'));
export const StationCreatePage = lazy(() => import('src/pages/admin/station/new'));
// Route
export const RouteListPage = lazy(() => import('src/pages/admin/route/list'));
export const RouteCreatePage = lazy(() => import('src/pages/admin/route/new'));

// Auth
export const SignInPage = lazy(() => import('src/pages/admin/auth/sign-in'));

// ----------------------------------------------------------------------

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    children: [
      {
        element: <Navigate to="/admin/dashboard" replace />,
        index: true,
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <DashboardLayout>
              <Suspense fallback={<LoadingScreen />}>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          </AuthGuard>
        ),
        children: [
          { element: <DashboardPage />, index: true },
          {
            path: 'employee',
            children: [
              { element: <EmployeeListPage />, index: true },
              { path: 'list', element: <EmployeeListPage /> },
              { path: 'new', element: <EmployeeCreatePage /> },
            ],
          },
          {
            path: 'driver',
            children: [
              { element: <DriverListPage />, index: true },
              { path: 'list', element: <DriverListPage /> },
              { path: 'new', element: <DriverCreatePage /> },
            ],
          },
          {
            path: 'station',
            children: [
              { element: <StationListPage />, index: true },
              { path: 'list', element: <StationListPage /> },
              { path: 'new', element: <StationCreatePage /> },
            ],
          },
          {
            path: 'route',
            children: [
              { element: <RouteListPage />, index: true },
              { path: 'list', element: <RouteListPage /> },
              { path: 'new', element: <RouteCreatePage /> },
            ],
          },
        ],
      },
      {
        path: 'auth',
        element: (
          <AuthLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          { element: <Navigate to="/admin/auth/sign-in" replace />, index: true },
          {
            path: 'sign-in',
            element: (
              <GuestGuard>
                <SignInPage />
              </GuestGuard>
            ),
          },
        ],
      },
    ],
    // children: [
    //   // { element: <DashboardPage />, index: true },
    //   {
    //     path: 'employee',
    //     children: [
    //       { element: <EmployeeListPage />, index: true },
    //       { path: 'list', element: <EmployeeListPage /> },
    //       { path: 'new', element: <EmployeeCreatePage /> },
    //       { path: 'edit/:id', element: <EmployeeCreatePage /> },
    //     ],
    //   },
    //   {
    //     path: 'driver',
    //     children: [
    //       { element: <DriverListPage />, index: true },
    //       { path: 'list', element: <DriverListPage /> },
    //       { path: 'new', element: <DriverCreatePage /> },
    //       { path: 'edit/:id', element: <DriverCreatePage /> },
    //     ],
    //   },
    //   {
    //     path: 'station',
    //     children: [
    //       { element: <StationListPage />, index: true },
    //       { path: 'list', element: <StationListPage /> },
    //       { path: 'new', element: <StationCreatePage /> },
    //       { path: 'edit/:id', element: <StationCreatePage /> },
    //     ],
    //   },
    //   {
    //     path: 'route',
    //     children: [
    //       { element: <RouteListPage />, index: true },
    //       { path: 'list', element: <RouteListPage /> },
    //       { path: 'new', element: <RouteCreatePage /> },
    //       { path: 'edit/:id', element: <RouteCreatePage /> },
    //     ],
    //   },
    // ],
  },

  // {
  //   path: 'admin',
  //   element: <Navigate to="/admin/dashboard" replace />,
  //   children: [
  //     { element: <Navigate to="/admin/dashboard" replace />, index: true },
  //     {
  //       path: 'dashboard',
  //       element: (
  //
  //       ),
  //       children: [
  //         { element: <DashboardPage />, index: true },
  //
  //
  //       ],
  //     },
  //     {
  //       path: 'auth',
  //       element: (
  //         <GuestGuard>
  //           <AuthLayout>
  //             <Suspense fallback={<LoadingScreen />}>
  //               <Outlet />
  //             </Suspense>
  //           </AuthLayout>
  //         </GuestGuard>
  //       ),
  //       children: [{ path: 'sign-in', element: <SignInPage /> }],
  //     },
  //   ],
  // },
];
