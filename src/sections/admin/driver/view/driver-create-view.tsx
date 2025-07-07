import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DriverNewEditForm from '../driver-new-edit-form';

// ----------------------------------------------------------------------

export function DriverCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ایجاد راننده جدید"
        links={[
          {
            name: 'داشبورد',
            href: paths.admin.dashboard.root,
          },
          {
            name: 'رانندگان',
            href: paths.admin.dashboard.driver.list,
          },
          { name: 'راننده جدید' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DriverNewEditForm />
    </DashboardContent>
  );
}
