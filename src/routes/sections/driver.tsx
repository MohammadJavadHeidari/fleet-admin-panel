import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { MobileLayout } from 'src/layouts/mobile';
import { AuthMobileLayout } from 'src/layouts/auth-mobile';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/admin/dashboard'));
// Auth
const OtpRequestPage = lazy(() => import('src/pages/driver/auth/otp-request'));
const OtpVerifyPage = lazy(() => import('src/pages/driver/auth/otp-verify'));

// ----------------------------------------------------------------------

export const driverRoutes = [
  {
    path: 'driver',
    children: [
      {
        element: <Navigate to="/driver/dashboard" replace />,
        index: true,
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <MobileLayout>
              <Suspense fallback={<LoadingScreen />}>
                <Outlet />
              </Suspense>
            </MobileLayout>
          </AuthGuard>
        ),
        children: [{ element: <IndexPage />, index: true }],
      },
      {
        path: 'auth/otp',
        element: (
          <AuthMobileLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </AuthMobileLayout>
        ),
        children: [
          { element: <Navigate to="/driver/auth/otp/request" replace />, index: true },
          {
            path: 'request',
            element: (
              <GuestGuard>
                <OtpRequestPage />
              </GuestGuard>
            ),
          },
          {
            path: 'verify',
            element: (
              <GuestGuard>
                <OtpVerifyPage />
              </GuestGuard>
            ),
          },
        ],
      },
    ],
  },
];
