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

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EmployeeNewEditForm from '../employee-new-edit-form';

// ----------------------------------------------------------------------

export function EmployeeCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ایجاد کارمند جدید"
        links={[
          {
            name: 'داشبورد',
            href: paths.admin.dashboard.root,
          },
          {
            name: 'کارمندان',
            href: paths.admin.dashboard.employee.list,
          },
          { name: 'کارمند جدید' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EmployeeNewEditForm />
    </DashboardContent>
  );
}
