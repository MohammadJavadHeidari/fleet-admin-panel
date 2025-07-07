import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import RouteNewEditForm from '../route-new-edit-form';

// ----------------------------------------------------------------------

export function RouteCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ایجاد مسیر جدید"
        links={[
          {
            name: 'داشبورد',
            href: paths.admin.dashboard.root,
          },
          {
            name: 'مسیر ها',
            href: paths.admin.dashboard.route.list,
          },
          { name: 'مسیر جدید' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RouteNewEditForm />
    </DashboardContent>
  );
}
