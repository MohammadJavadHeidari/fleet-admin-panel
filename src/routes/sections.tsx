import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { AuthGuard, GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
// Station
export const StationListPage = lazy(() => import('src/pages/station/list'));
export const StationCreatePage = lazy(() => import('src/pages/station/new'));
// Route
export const RouteListPage = lazy(() => import('src/pages/route/list'));
export const RouteCreatePage = lazy(() => import('src/pages/route/new'));
// 
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
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
      <GuestGuard>
        <AuthLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      </GuestGuard>
    ),
    children: [{ path: 'sign-in', element: <SignInPage /> }],
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
