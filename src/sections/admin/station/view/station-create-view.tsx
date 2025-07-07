import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import StationNewEditForm from '../station-new-edit-form';

// ----------------------------------------------------------------------

export function StationCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ایجاد ایستگاه جدید"
        links={[
          {
            name: 'داشبورد',
            href: paths.admin.dashboard.root,
          },
          {
            name: 'ایستگاه ها',
            href: paths.admin.dashboard.station.list,
          },
          { name: 'ایسنگاه جدید' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StationNewEditForm />
    </DashboardContent>
  );
}
