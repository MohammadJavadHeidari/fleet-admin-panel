import { CONFIG } from 'src/config-global';

import { EmployeeCreateView } from 'src/sections/admin/employee/view/employee-create-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`ایجاد کارمند جدید - ${CONFIG.appName}`}</title>

      <EmployeeCreateView />
    </>
  );
}
