import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

//
import { adminRoutes } from './admin';
import { driverRoutes } from './driver';
import { employeeRoutes } from './employee';

// ----------------------------------------------------------------------

// 404 Page
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export const renderFallback = () => (
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
  // Admin
  ...adminRoutes,

  // Driver
  ...driverRoutes,

  // Employee
  ...employeeRoutes,

  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
