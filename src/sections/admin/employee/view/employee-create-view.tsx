import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

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
